package core

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

type Account struct {
	ID            string
	AccountNumber string
	Balance       int64
}

type Transaction struct {
	ID          string
	Type        string
	Amount      int64
	Description string
	Status      string
	Reference   string
	FromAccount string
	ToAccount   string
	CreatedAt   time.Time
}

type KafkaService struct{}

func (k *KafkaService) PublishMessage(topic string, payload map[string]interface{}) error {
	return nil
}

func Transfer(ctx context.Context, db *sql.DB, kafka *KafkaService, km KeyManager, fromAccountId, toAccountId string, amount int64, description string) (*Transaction, error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var fromAcc, toAcc Account
	err = tx.QueryRowContext(ctx, "SELECT id, account_number, balance FROM accounts WHERE id=$1 FOR UPDATE", fromAccountId).Scan(&fromAcc.ID, &fromAcc.AccountNumber, &fromAcc.Balance)
	if err != nil {
		return nil, errors.New("from account not found")
	}
	err = tx.QueryRowContext(ctx, "SELECT id, account_number, balance FROM accounts WHERE id=$1 FOR UPDATE", toAccountId).Scan(&toAcc.ID, &toAcc.AccountNumber, &toAcc.Balance)
	if err != nil {
		return nil, errors.New("to account not found")
	}
	if fromAcc.Balance < amount {
		return nil, errors.New("insufficient balance")
	}

	newFromBal := fromAcc.Balance - amount
	newToBal := toAcc.Balance + amount

	errCh := make(chan error, 2)

	go func() {
		_, e := tx.ExecContext(ctx, "UPDATE accounts SET balance=$1 WHERE id=$2", newFromBal, fromAccountId)
		errCh <- e
	}()
	go func() {
		_, e := tx.ExecContext(ctx, "UPDATE accounts SET balance=$1 WHERE id=$2", newToBal, toAccountId)
		errCh <- e
	}()

	for i := 0; i < 2; i++ {
		if e := <-errCh; e != nil {
			return nil, e
		}
	}

	ref, err := GenerateReference(km)
	if err != nil {
		return nil, err
	}
	if description == "" {
		description = "Account transfer"
	}

	var transactionID string
	err = tx.QueryRowContext(ctx, `
		INSERT INTO transactions (type, amount, description, status, reference, from_account, to_account, created_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
		"TRANSFER", amount, description, "COMPLETED", ref, fromAcc.AccountNumber, toAcc.AccountNumber, time.Now(),
	).Scan(&transactionID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	t := &Transaction{
		ID:          transactionID,
		Type:        "TRANSFER",
		Amount:      amount,
		Description: description,
		Status:      "COMPLETED",
		Reference:   ref,
		FromAccount: fromAcc.AccountNumber,
		ToAccount:   toAcc.AccountNumber,
		CreatedAt:   time.Now(),
	}

	kafkaPayload := map[string]interface{}{
		"transactionId": transactionID,
		"fromAccountId": fromAccountId,
		"toAccountId":   toAccountId,
		"amount":        amount,
		"reference":     ref,
		"timestamp":     time.Now().UTC().Format(time.RFC3339Nano),
	}

	payloadBytes := []byte(fmt.Sprintf("%s|%s|%s|%d|%s", transactionID, fromAccountId, toAccountId, amount, ref))
	sig, err := SignPayload(payloadBytes, km)
	if err == nil {
		kafkaPayload["sig"] = sig
	}

	go kafka.PublishMessage("transfer.completed", kafkaPayload)

	return t, nil
}
