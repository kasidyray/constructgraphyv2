import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_RESEND_API_KEY;
const fromEmail = process.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
// In testing mode, you can only send to the account owner's email
const toEmail = 'kasidyray@gmail.com'; // Change this to your Resend account email

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
    
    // Check if there's an error in the result
    if (result.error) {
      console.error('Resend API error:', result.error);
      
      // Handle testing mode limitation
      if (result.error.statusCode === 403 && result.error.message.includes('You can only send testing emails to your own email address')) {
        const yourEmail = result.error.message.match(/\(([^)]+)\)/)[1];
        console.error(`\nTESTING MODE LIMITATION: In testing mode, you can only send emails to ${yourEmail}.`);
        console.error('To send to other recipients, please verify a domain at resend.com/domains.');
        console.error('Then update your VITE_FROM_EMAIL in .env.local to use your verified domain.');
      }
      
      return;
    }
    
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.message) {
      console.error('Error details:', error.message);
    }
  }
};

sendTestEmail(); 