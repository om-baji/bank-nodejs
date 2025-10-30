package core

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"io"
	"time"
)

type KeyManager interface {
	GetEncryptionKey() ([]byte, error)
	GetSigningKey() ([]byte, error)
}

type InMemoryKeyManager struct {
	encKey  []byte
	signKey []byte
}

func NewInMemoryKeyManager(encKey, signKey []byte) *InMemoryKeyManager {
	return &InMemoryKeyManager{encKey: cloneBytes(encKey), signKey: cloneBytes(signKey)}
}

func (m *InMemoryKeyManager) GetEncryptionKey() ([]byte, error) {
	if len(m.encKey) != 32 {
		return nil, errors.New("invalid encryption key")
	}
	return cloneBytes(m.encKey), nil
}

func (m *InMemoryKeyManager) GetSigningKey() ([]byte, error) {
	if len(m.signKey) == 0 {
		return nil, errors.New("invalid signing key")
	}
	return cloneBytes(m.signKey), nil
}

func GenerateRandomKey(n int) ([]byte, error) {
	if n <= 0 {
		return nil, errors.New("invalid key size")
	}
	b := make([]byte, n)
	_, err := io.ReadFull(rand.Reader, b)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func Encrypt(plaintext []byte, km KeyManager) (string, error) {
	key, err := km.GetEncryptionKey()
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	_, err = io.ReadFull(rand.Reader, nonce)
	if err != nil {
		return "", err
	}
	ciphertext := gcm.Seal(nil, nonce, plaintext, nil)
	out := append(nonce, ciphertext...)
	return base64.StdEncoding.EncodeToString(out), nil
}

func Decrypt(enc string, km KeyManager) ([]byte, error) {
	key, err := km.GetEncryptionKey()
	if err != nil {
		return nil, err
	}
	raw, err := base64.StdEncoding.DecodeString(enc)
	if err != nil {
		return nil, err
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	ns := gcm.NonceSize()
	if len(raw) < ns {
		return nil, errors.New("malformed ciphertext")
	}
	nonce := raw[:ns]
	ct := raw[ns:]
	plain, err := gcm.Open(nil, nonce, ct, nil)
	if err != nil {
		return nil, err
	}
	return plain, nil
}

func SignPayload(payload []byte, km KeyManager) (string, error) {
	key, err := km.GetSigningKey()
	if err != nil {
		return "", err
	}
	mac := hmac.New(sha256.New, key)
	_, err = mac.Write(payload)
	if err != nil {
		return "", err
	}
	sum := mac.Sum(nil)
	return hex.EncodeToString(sum), nil
}

func VerifySignature(payload []byte, sigHex string, km KeyManager) (bool, error) {
	key, err := km.GetSigningKey()
	if err != nil {
		return false, err
	}
	expected := hmac.New(sha256.New, key)
	_, err = expected.Write(payload)
	if err != nil {
		return false, err
	}
	expectedSum := expected.Sum(nil)
	got, err := hex.DecodeString(sigHex)
	if err != nil {
		return false, err
	}
	if len(got) != len(expectedSum) {
		return false, nil
	}
	result := hmac.Equal(got, expectedSum)
	return result, nil
}

func GenerateReference(km KeyManager) (string, error) {
	u := make([]byte, 16)
	_, err := io.ReadFull(rand.Reader, u)
	if err != nil {
		return "", err
	}
	u[6] = (u[6] & 0x0f) | 0x40
	u[8] = (u[8] & 0x3f) | 0x80
	timeBytes := []byte(time.Now().UTC().Format(time.RFC3339Nano))
	data := append(u, timeBytes...)
	key, err := km.GetSigningKey()
	if err != nil {
		return "", err
	}
	mac := hmac.New(sha256.New, key)
	_, err = mac.Write(data)
	if err != nil {
		return "", err
	}
	sum := mac.Sum(nil)
	ref := hex.EncodeToString(append(u, sum[:12]...))
	return ref, nil
}

func cloneBytes(b []byte) []byte {
	if b == nil {
		return nil
	}
	c := make([]byte, len(b))
	copy(c, b)
	return c
}
