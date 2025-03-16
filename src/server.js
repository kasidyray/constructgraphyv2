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
  key: process.env.VITE_MAILGUN_API_KEY,
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
    
    if (!apiKey || !domain || domain === 'sandbox-domain.mailgun.org') {
      console.warn('Mailgun not properly configured. Using mock response.');
      // Return a mock success response for development
      return res.status(200).json({ 
        message: 'Test email simulated (Mailgun not configured)',
        note: 'This is a simulated response. To send actual emails, configure valid Mailgun credentials.'
      });
    }
    
    console.log(`Sending test email to ${email}`);
    
    const data = {
      from: process.env.VITE_FROM_EMAIL || 'test@example.com',
      to: email,
      subject: 'Test Email from Constography',
      text: 'This is a test email from Constography.',
      html: '<h1>Test Email</h1><p>This is a test email from Constography.</p>',
    };
    
    const result = await mg.messages.create(domain, data);
    console.log('Email sent:', result);
    
    return res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 