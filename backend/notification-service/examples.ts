import {
  sendAccountCreatedEmail,
  sendAccountStatementEmail,
  sendCardBlockedEmail,
  sendTransactionAlertEmail,
  EmailEventType,
  type EmailTemplateData
} from './action/notification.action';

// Example usage for each email template

// 1. Account Created Email Example
export const sendWelcomeEmail = async () => {
  const accountData: EmailTemplateData = {
    recipientName: "John Doe",
    accountNumber: "1234567890",
    initialDeposit: "$1,000.00"
  };

  try {
    await sendAccountCreatedEmail("pranavvibhute3@gmail.com", accountData);
    console.log("Welcome email sent successfully!");
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};

// 2. Account Statement Email Example
export const sendMonthlyStatement = async () => {
  const statementData: EmailTemplateData = {
    recipientName: "Jane Smith",
    accountNumber: "0987654321",
    statementPeriod: "October 2024",
    openingBalance: "$2,500.00",
    closingBalance: "$3,200.00",
    totalCredits: "$1,500.00",
    totalDebits: "$800.00",
    transactions: [
      {
        date: "2024-10-01",
        description: "Direct Deposit - Salary",
        credit: "$3,000.00",
        balance: "$5,500.00"
      },
      {
        date: "2024-10-03",
        description: "ATM Withdrawal",
        debit: "$100.00",
        balance: "$5,400.00"
      },
      {
        date: "2024-10-05",
        description: "Online Purchase - Amazon",
        debit: "$250.00",
        balance: "$5,150.00"
      },
      {
        date: "2024-10-10",
        description: "Transfer from Savings",
        credit: "$500.00",
        balance: "$5,650.00"
      },
      {
        date: "2024-10-15",
        description: "Rent Payment",
        debit: "$1,200.00",
        balance: "$4,450.00"
      }
    ]
  };

  try {
    await sendAccountStatementEmail("pranavvibhute3@gmail.com", statementData);
    console.log("Monthly statement email sent successfully!");
  } catch (error) {
    console.error("Failed to send statement email:", error);
  }
};

// 3. Card Blocked Email Example
export const sendCardBlockAlert = async () => {
  const cardData: EmailTemplateData = {
    recipientName: "Mike Johnson",
    cardNumber: "**** **** **** 1234",
    blockReason: "Suspicious transaction detected",
    blockTime: new Date().toLocaleString()
  };

  try {
    await sendCardBlockedEmail("pranavvibhute3@gmail.com", cardData);
    console.log("Card blocked alert sent successfully!");
  } catch (error) {
    console.error("Failed to send card blocked alert:", error);
  }
};

// 4. Transaction Alert Email Example
export const sendTransactionNotification = async () => {
  const transactionData: EmailTemplateData = {
    recipientName: "Sarah Wilson",
    transactionAmount: "$450.00",
    transactionType: "debit",
    merchantName: "Best Buy Electronics",
    transactionDate: new Date().toLocaleDateString(),
    transactionTime: new Date().toLocaleTimeString(),
    availableBalance: "$2,750.00"
  };

  try {
    await sendTransactionAlertEmail("pranavvibhute3@gmail.com", transactionData);
    console.log("Transaction alert sent successfully!");
  } catch (error) {
    console.error("Failed to send transaction alert:", error);
  }
};

// Event-driven email system that can be triggered by various banking events
export const handleBankingEvent = async (eventType: string, eventData: any) => {
  console.log(`Processing banking event: ${eventType}`);

  switch (eventType) {
    case 'ACCOUNT_OPENED':
      await sendAccountCreatedEmail(eventData.email, {
        recipientName: eventData.customerName,
        accountNumber: eventData.accountNumber,
        initialDeposit: eventData.initialDeposit
      });
      break;

    case 'MONTHLY_STATEMENT':
      await sendAccountStatementEmail(eventData.email, {
        recipientName: eventData.customerName,
        accountNumber: eventData.accountNumber,
        statementPeriod: eventData.period,
        openingBalance: eventData.openingBalance,
        closingBalance: eventData.closingBalance,
        totalCredits: eventData.totalCredits,
        totalDebits: eventData.totalDebits,
        transactions: eventData.transactions
      });
      break;

    case 'CARD_SECURITY_BLOCK':
      await sendCardBlockedEmail(eventData.email, {
        recipientName: eventData.customerName,
        cardNumber: eventData.maskedCardNumber,
        blockReason: eventData.reason,
        blockTime: eventData.timestamp
      });
      break;

    case 'HIGH_VALUE_TRANSACTION':
      await sendTransactionAlertEmail(eventData.email, {
        recipientName: eventData.customerName,
        transactionAmount: eventData.amount,
        transactionType: eventData.type,
        merchantName: eventData.merchant,
        transactionDate: eventData.date,
        transactionTime: eventData.time,
        availableBalance: eventData.balance
      });
      break;

    default:
      console.warn(`Unknown banking event type: ${eventType}`);
  }
};

// Example of how to run all demonstrations
export const runEmailDemonstrations = async () => {
  console.log("🚀 Starting Email System Demonstrations...\n");

  try {
    console.log("1. Sending Account Created Email...");
    await sendWelcomeEmail();
    
    console.log("\n2. Sending Monthly Statement Email...");
    await sendMonthlyStatement();
    
    console.log("\n3. Sending Card Blocked Alert...");
    await sendCardBlockAlert();
    
    console.log("\n4. Sending Transaction Alert...");
    await sendTransactionNotification();

    console.log("\n✅ All email demonstrations completed successfully!");
  } catch (error) {
    console.error("❌ Error during email demonstrations:", error);
  }
};

// Main execution - run the demonstrations
if (import.meta.main) {
  runEmailDemonstrations();
}