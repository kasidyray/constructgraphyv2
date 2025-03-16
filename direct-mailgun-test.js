import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_MAILGUN_API_KEY;
const domain = process.env.VITE_MAILGUN_DOMAIN;
const fromEmail = process.env.VITE_FROM_EMAIL || `mailgun@${domain}`;
const toEmail = 'ikedinekpere.eze@gmail.com';

console.log('Using Mailgun credentials:', {
  apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'not set',
  domain,
  fromEmail
});

// Initialize Mailgun
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: apiKey
});

const sendTestEmail = async () => {
  try {
    console.log(`Sending test email to ${toEmail}`);
    
    const data = {
      from: fromEmail,
      to: toEmail,
      subject: 'Test Email from Constography',
      text: 'This is a test email from Constography.',
      html: '<h1>Test Email</h1><p>This is a test email from Constography.</p>',
    };
    
    console.log('Email data:', data);
    
    const result = await mg.messages.create(domain, data);
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.details) {
      console.error('Error details:', error.details);
    }
  }
};

sendTestEmail(); 