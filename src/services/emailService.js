require('dotenv').config();
const nodemailer = require('nodemailer');

const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ledger" <${process.env.SMTP_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log("Email sent successfully");
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

//send email for transaction notifications
async function sendTransactionEmail(to, subject, text, html) {
    await sendEmail(to, subject, text, html);
}

//send email for transaction failure notifications
async function sendTransactionFailureEmail(to, subject, text, html) {
    await sendEmail(to, subject, text, html);
}

async function sendRegistrationEmail(userEmail,name) {
    const subject = 'Welcome to Ledger!';
    const text = `Hi ${name},\n\nThank you for registering with Ledger! We're excited to have you on board.\n\nBest regards,\nThe Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Thank you for registering with Ledger! We're excited to have you on board.</p><p>Best regards,<br>The Ledger Team</p>`;
    
    await sendEmail(userEmail, subject, text, html);
    
}

module.exports = { sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail };