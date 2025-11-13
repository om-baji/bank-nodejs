# Event-Driven Email Notification System

This notification service provides an event-driven email system with support for multiple HTML templates. Each template corresponds to different banking events and uses a switch-case architecture for easy management.

## Features

- **Event-driven architecture** with enum-based event types
- **Template-based emails** with dynamic data replacement
- **Type-safe interfaces** for template data
- **Switch-case routing** for different email templates
- **HTML template support** with placeholder replacement
- **Modular helper functions** for each email type

## Available Email Templates

### 1. Account Created (`ACCOUNT_CREATED`)
- **Template**: `account.created.html`
- **Subject**: "🎉 Welcome to Your New Bank Account!"
- **Use Case**: Welcome new customers when they open an account

### 2. Account Statement (`ACCOUNT_STATEMENT`)
- **Template**: `account.statement.html`
- **Subject**: "📊 Your Monthly Account Statement"
- **Use Case**: Monthly or periodic account statements with transaction history

### 3. Card Blocked (`CARD_BLOCKED`)
- **Template**: `card.blocked.html`
- **Subject**: "🔒 Important: Your Card Has Been Blocked - Security Alert"
- **Use Case**: Security alerts when a card is blocked

### 4. Transaction Alert (`TRANSACTION_ALERT`)
- **Template**: `transaction.alert.html`
- **Subject**: "💳 Transaction Alert - Account Activity"
- **Use Case**: High-value transaction notifications

## Core Functions

### Main Email Function
```typescript
send_email(
  event_type: EmailEventType, 
  recipient_email: string, 
  templateData: EmailTemplateData = {}
): Promise<void>
```

### Helper Functions
```typescript
sendAccountCreatedEmail(recipientEmail: string, accountData: EmailTemplateData)
sendAccountStatementEmail(recipientEmail: string, statementData: EmailTemplateData)
sendCardBlockedEmail(recipientEmail: string, cardData: EmailTemplateData)
sendTransactionAlertEmail(recipientEmail: string, transactionData: EmailTemplateData)
```

## Usage Examples

### 1. Account Creation Email
```typescript
import { sendAccountCreatedEmail, EmailTemplateData } from './action/notification.action';

const accountData: EmailTemplateData = {
  recipientName: "John Doe",
  accountNumber: "1234567890",
  initialDeposit: "$1,000.00"
};

await sendAccountCreatedEmail("john.doe@example.com", accountData);
```

### 2. Monthly Statement Email
```typescript
import { sendAccountStatementEmail, EmailTemplateData } from './action/notification.action';

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
    // ... more transactions
  ]
};

await sendAccountStatementEmail("jane.smith@example.com", statementData);
```

### 3. Card Blocked Alert
```typescript
import { sendCardBlockedEmail, EmailTemplateData } from './action/notification.action';

const cardData: EmailTemplateData = {
  recipientName: "Mike Johnson",
  cardNumber: "**** **** **** 1234",
  blockReason: "Suspicious transaction detected",
  blockTime: new Date().toLocaleString()
};

await sendCardBlockedEmail("mike.johnson@example.com", cardData);
```

### 4. Transaction Alert
```typescript
import { sendTransactionAlertEmail, EmailTemplateData } from './action/notification.action';

const transactionData: EmailTemplateData = {
  recipientName: "Sarah Wilson",
  transactionAmount: "$450.00",
  transactionType: "debit",
  merchantName: "Best Buy Electronics",
  transactionDate: new Date().toLocaleDateString(),
  transactionTime: new Date().toLocaleTimeString(),
  availableBalance: "$2,750.00"
};

await sendTransactionAlertEmail("sarah.wilson@example.com", transactionData);
```

## Event-Driven Usage

You can also use the system in an event-driven manner:

```typescript
import { send_email, EmailEventType, EmailTemplateData } from './action/notification.action';

// Handle different banking events
const handleBankingEvent = async (eventType: string, eventData: any) => {
  switch (eventType) {
    case 'ACCOUNT_OPENED':
      await send_email(EmailEventType.ACCOUNT_CREATED, eventData.email, {
        recipientName: eventData.customerName,
        accountNumber: eventData.accountNumber,
        initialDeposit: eventData.initialDeposit
      });
      break;

    case 'MONTHLY_STATEMENT':
      await send_email(EmailEventType.ACCOUNT_STATEMENT, eventData.email, {
        recipientName: eventData.customerName,
        // ... statement data
      });
      break;

    case 'CARD_SECURITY_BLOCK':
      await send_email(EmailEventType.CARD_BLOCKED, eventData.email, {
        recipientName: eventData.customerName,
        // ... card data
      });
      break;

    case 'HIGH_VALUE_TRANSACTION':
      await send_email(EmailEventType.TRANSACTION_ALERT, eventData.email, {
        recipientName: eventData.customerName,
        // ... transaction data
      });
      break;

    default:
      console.warn(\`Unknown banking event type: \${eventType}\`);
  }
};
```

## Template Data Interface

```typescript
interface EmailTemplateData {
  // Common fields
  recipientName?: string;
  recipientEmail?: string;
  
  // Account creation specific
  accountNumber?: string;
  initialDeposit?: string;
  
  // Account statement specific
  statementPeriod?: string;
  openingBalance?: string;
  closingBalance?: string;
  totalCredits?: string;
  totalDebits?: string;
  transactions?: Array<{
    date: string;
    description: string;
    debit?: string;
    credit?: string;
    balance: string;
  }>;
  
  // Card blocked specific
  cardNumber?: string;
  blockReason?: string;
  blockTime?: string;
  
  // Transaction alert specific
  transactionAmount?: string;
  transactionType?: 'credit' | 'debit';
  merchantName?: string;
  transactionDate?: string;
  transactionTime?: string;
  availableBalance?: string;
}
```

## Switch Case Architecture

The system uses a clean switch-case architecture in the `send_email` function:

```typescript
switch (event_type) {
  case EmailEventType.ACCOUNT_CREATED:
    subject = "🎉 Welcome to Your New Bank Account!";
    templateFile = "account.created.html";
    htmlContent = await loadTemplate(templateFile, templateData);
    break;

  case EmailEventType.ACCOUNT_STATEMENT:
    subject = "📊 Your Monthly Account Statement";
    templateFile = "account.statement.html";
    htmlContent = await loadTemplate(templateFile, templateData);
    break;

  case EmailEventType.CARD_BLOCKED:
    subject = "🔒 Important: Your Card Has Been Blocked - Security Alert";
    templateFile = "card.blocked.html";
    htmlContent = await loadTemplate(templateFile, templateData);
    break;

  case EmailEventType.TRANSACTION_ALERT:
    subject = "💳 Transaction Alert - Account Activity";
    templateFile = "transaction.alert.html";
    htmlContent = await loadTemplate(templateFile, templateData);
    break;

  default:
    throw new Error(`Unsupported event type: ${event_type}`);
}
```

## Template Placeholder System

Templates support dynamic placeholders that are replaced with actual data:

- `{{recipientName}}` - Customer name
- `{{accountNumber}}` - Account number
- `{{initialDeposit}}` - Initial deposit amount
- `{{statementPeriod}}` - Statement period
- `{{transactionAmount}}` - Transaction amount
- `{{merchantName}}` - Merchant name
- `{{transactionRows}}` - Dynamic transaction table rows
- And many more...

## Error Handling

All functions include comprehensive error handling with detailed logging:

```typescript
try {
  // Send email logic
  console.log(\`Email sent successfully for \${event_type}:\`, info.messageId);
  console.log(\`Preview URL: \${nodemailer.getTestMessageUrl(info)}\`);
} catch (error) {
  console.error(\`Failed to send email for \${event_type}:\`, error);
  throw error;
}
```

## Configuration

Update the transporter configuration in `notification.action.ts` with your email service credentials:

```typescript
const transporter = nodemailer.createTransport({
  host: "your-smtp-host.com",
  port: 587,
  secure: false,
  auth: {
    user: "your-email@example.com",
    pass: "your-app-password",
  },
});
```

## File Structure

```
notification-service/
├── action/
│   └── notification.action.ts    # Main email system
├── templates/
│   ├── account.created.html      # Welcome email template
│   ├── account.statement.html    # Statement email template
│   ├── card.blocked.html         # Card blocked alert template
│   └── transaction.alert.html    # Transaction alert template
├── examples.ts                   # Usage examples
└── README.md                     # This documentation
```