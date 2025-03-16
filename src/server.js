import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Initialize Mailgun
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.VITE_MAILGUN_API_KEY
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if Mailgun credentials are properly configured
    const apiKey = process.env.VITE_MAILGUN_API_KEY;
    const domain = process.env.VITE_MAILGUN_DOMAIN;
    const fromEmail = process.env.VITE_FROM_EMAIL || `mailgun@${domain}`;
    
    console.log('Using Mailgun credentials:', { 
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'not set',
      domain,
      fromEmail
    });
    
    if (!apiKey || !domain) {
      console.warn('Mailgun not properly configured. Using mock response.');
      // Return a mock success response for development
      return res.status(200).json({ 
        message: 'Test email simulated (Mailgun not configured)',
        note: 'This is a simulated response. To send actual emails, configure valid Mailgun credentials.'
      });
    }
    
    console.log(`Sending test email to ${email}`);
    
    const data = {
      from: fromEmail,
      to: email,
      subject: 'Test Email from Constography',
      text: 'This is a test email from Constography.',
      html: '<h1>Test Email</h1><p>This is a test email from Constography.</p>',
    };
    
    console.log('Email data:', data);
    
    try {
      const result = await mg.messages.create(domain, data);
      console.log('Email sent:', result);
      return res.status(200).json({ message: 'Test email sent successfully' });
    } catch (mailgunError) {
      console.error('Mailgun error details:', mailgunError);
      
      // Check for specific Mailgun errors
      if (mailgunError.status === 403 && mailgunError.details && mailgunError.details.includes('activate your Mailgun account')) {
        return res.status(403).json({ 
          error: 'Mailgun account not activated',
          details: 'Please check your email inbox for an activation link from Mailgun or log in to your Mailgun account to resend the activation email.',
          originalError: mailgunError.details
        });
      } else if (mailgunError.status === 400 && mailgunError.details && mailgunError.details.includes('not a valid address')) {
        return res.status(400).json({ 
          error: 'Invalid email address format',
          details: 'The from email address is not valid. Please check your VITE_FROM_EMAIL environment variable.',
          originalError: mailgunError.details
        });
      } else if (mailgunError.status === 403 && mailgunError.details && mailgunError.details.includes('not authorized')) {
        return res.status(403).json({ 
          error: 'Recipient not authorized',
          details: 'When using a Mailgun sandbox domain, you must first authorize the recipient email address. Please log in to your Mailgun account, go to the Sending > Domains section, click on your sandbox domain, and add the recipient email to the Authorized Recipients list.',
          originalError: mailgunError.details
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to send test email', 
        details: mailgunError.details || mailgunError.message,
        statusCode: mailgunError.status
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 