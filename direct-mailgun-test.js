import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_RESEND_API_KEY;
const fromEmail = process.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
const toEmail = 'ikedinekpere.eze@gmail.com';

console.log('Using Resend credentials:', {
  apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'not set',
  fromEmail
});

// Initialize Resend
const resend = new Resend(apiKey);

const sendTestEmail = async () => {
  try {
    console.log(`Sending test email to ${toEmail}`);
    
    const data = {
      from: `Constructography <${fromEmail}>`,
      to: [toEmail],
      subject: 'Test Email from Constography',
      html: '<h1>Test Email</h1><p>This is a test email from Constography.</p>',
    };
    
    console.log('Email data:', data);
    
    const result = await resend.emails.send(data);
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.message) {
      console.error('Error details:', error.message);
    }
  }
};

sendTestEmail(); 