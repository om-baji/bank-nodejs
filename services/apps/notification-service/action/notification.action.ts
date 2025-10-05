const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");

// Create a transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "devrajlokhande1610@gmail.com",
    pass: "ifhyhqyoyvrwkybv",
  },
});

// Event types enum for better type safety
enum EmailEventType {
  ACCOUNT_CREATED = "ACCOUNT_CREATED",
  ACCOUNT_STATEMENT = "ACCOUNT_STATEMENT", 
  CARD_BLOCKED = "CARD_BLOCKED",
  TRANSACTION_ALERT = "TRANSACTION_ALERT"
}

// Interface for email template data
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
  transactionType?: "credit" | "debit";
  merchantName?: string;
  transactionDate?: string;
  transactionTime?: string;
  availableBalance?: string;
}

// Function to read and replace template placeholders
const loadTemplate = async (templateName: string, data: EmailTemplateData): Promise<string> => {
  try {
    const templatePath = path.join(__dirname, "../templates", templateName);
    let template = await fs.readFile(templatePath, "utf-8");
    
    // Replace placeholders with actual data
    template = template.replace(/\{\{recipientName\}\}/g, data.recipientName || "Valued Customer");
    template = template.replace(/\{\{accountNumber\}\}/g, data.accountNumber || "****");
    template = template.replace(/\{\{initialDeposit\}\}/g, data.initialDeposit || "0.00");
    template = template.replace(/\{\{statementPeriod\}\}/g, data.statementPeriod || "");
    template = template.replace(/\{\{openingBalance\}\}/g, data.openingBalance || "0.00");
    template = template.replace(/\{\{closingBalance\}\}/g, data.closingBalance || "0.00");
    template = template.replace(/\{\{totalCredits\}\}/g, data.totalCredits || "0.00");
    template = template.replace(/\{\{totalDebits\}\}/g, data.totalDebits || "0.00");
    template = template.replace(/\{\{cardNumber\}\}/g, data.cardNumber || "****");
    template = template.replace(/\{\{blockReason\}\}/g, data.blockReason || "Security reasons");
    template = template.replace(/\{\{blockTime\}\}/g, data.blockTime || new Date().toLocaleString());
    template = template.replace(/\{\{transactionAmount\}\}/g, data.transactionAmount || "0.00");
    template = template.replace(/\{\{merchantName\}\}/g, data.merchantName || "Unknown Merchant");
    template = template.replace(/\{\{transactionDate\}\}/g, data.transactionDate || new Date().toLocaleDateString());
    template = template.replace(/\{\{transactionTime\}\}/g, data.transactionTime || new Date().toLocaleTimeString());
    template = template.replace(/\{\{availableBalance\}\}/g, data.availableBalance || "0.00");
    
    // Handle transaction table for account statement
    if (data.transactions && data.transactions.length > 0) {
      let transactionRows = "";
      data.transactions.forEach(transaction => {
        transactionRows += `
          <tr>
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td style="color: #dc3545;">${transaction.debit || "-"}</td>
            <td style="color: #28a745;">${transaction.credit || "-"}</td>
            <td>${transaction.balance}</td>
          </tr>
        `;
      });
      template = template.replace(/\{\{transactionRows\}\}/g, transactionRows);
    }
    
    return template;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
};

// Event-driven send_email function with switch cases for each template
const send_email = async (
  event_type: EmailEventType, 
  recipient_email: string, 
  templateData: EmailTemplateData = {}
): Promise<void> => {
  try {
    let subject: string = "";
    let templateFile: string = "";
    let htmlContent: string = "";

    // Switch case for each event type and corresponding HTML template
    switch (event_type) {
      case EmailEventType.ACCOUNT_CREATED:
        subject = " Welcome to Your New Bank Account!";
        templateFile = "account.created.html";
        htmlContent = await loadTemplate(templateFile, templateData);
        break;

      case EmailEventType.ACCOUNT_STATEMENT:
        subject = " Your Monthly Account Statement";
        templateFile = "account.statement.html";
        htmlContent = await loadTemplate(templateFile, templateData);
        break;

      case EmailEventType.CARD_BLOCKED:
        subject = " Important: Your Card Has Been Blocked - Security Alert";
        templateFile = "card.blocked.html";
        htmlContent = await loadTemplate(templateFile, templateData);
        break;

      case EmailEventType.TRANSACTION_ALERT:
        subject = " Transaction Alert - Account Activity";
        templateFile = "transaction.alert.html";
        htmlContent = await loadTemplate(templateFile, templateData);
        break;

      default:
        throw new Error(`Unsupported event type: ${event_type}`);
    }

    // Send the email with the appropriate template using your Gmail
    const info = await transporter.sendMail({
      from: "devrajlokhande1610@gmail.com",
      to: recipient_email,
      subject: subject,
      html: htmlContent,
    });

    console.log(`✅ Email sent successfully for ${event_type}:`, info.messageId);
    console.log(`📧 Recipient: ${recipient_email}`);
    
  } catch (error) {
    console.error(`Failed to send email for ${event_type}:`, error);
    throw error;
  }
};

// Example usage functions for each event type
const sendAccountCreatedEmail = async (recipientEmail: string, accountData: EmailTemplateData) => {
  await send_email(EmailEventType.ACCOUNT_CREATED, recipientEmail, accountData);
};

const sendAccountStatementEmail = async (recipientEmail: string, statementData: EmailTemplateData) => {
  await send_email(EmailEventType.ACCOUNT_STATEMENT, recipientEmail, statementData);
};

const sendCardBlockedEmail = async (recipientEmail: string, cardData: EmailTemplateData) => {
  await send_email(EmailEventType.CARD_BLOCKED, recipientEmail, cardData);
};

const sendTransactionAlertEmail = async (recipientEmail: string, transactionData: EmailTemplateData) => {
  await send_email(EmailEventType.TRANSACTION_ALERT, recipientEmail, transactionData);
};

// Export the functions and types
export {
  send_email,
  sendAccountCreatedEmail,
  sendAccountStatementEmail,
  sendCardBlockedEmail,
  sendTransactionAlertEmail,
  EmailEventType,
  type EmailTemplateData
};
