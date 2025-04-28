import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// CORS configuration - more permissive for development
const corsOptions = {
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Initialize Resend
const resend = new Resend(process.env.VITE_RESEND_API_KEY);

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if Resend credentials are properly configured
    const apiKey = process.env.VITE_RESEND_API_KEY;
    const fromEmail = process.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';
    
    console.log('Using Resend credentials:', { 
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'not set',
      fromEmail
    });
    
    if (!apiKey) {
      console.warn('Resend not properly configured. Using mock response.');
      // Return a mock success response for development
      return res.status(200).json({ 
        message: 'Test email simulated (Resend not configured)',
        note: 'This is a simulated response. To send actual emails, configure valid Resend API key.'
      });
    }
    
    console.log(`Sending test email to ${email}`);
    
    try {
      const result = await resend.emails.send({
        from: `Constructography <${fromEmail}>`,
        to: [email],
        subject: 'Test Email from Constography',
        html: '<h1>Test Email</h1><p>This is a test email from Constography.</p>',
      });
      
      console.log('Email sent:', result);
      
      // Check if there's an error in the result
      if (result.error) {
        // Specific handling for testing mode limitation
        if (result.error.statusCode === 403 && result.error.message.includes('You can only send testing emails to your own email address')) {
          const yourEmail = result.error.message.match(/\(([^)]+)\)/)[1];
          return res.status(403).json({ 
            error: 'Resend testing mode limitation',
            details: `In testing mode, you can only send emails to ${yourEmail}. To send to other recipients, please verify a domain at resend.com/domains.`,
            originalError: result.error.message
          });
        }
        
        return res.status(result.error.statusCode || 500).json({
          error: 'Resend API error',
          details: result.error.message,
          statusCode: result.error.statusCode
        });
      }
      
      return res.status(200).json({ message: 'Test email sent successfully' });
    } catch (resendError) {
      console.error('Resend error details:', resendError);
      
      // Handle specific Resend errors
      if (resendError.statusCode === 403) {
        return res.status(403).json({ 
          error: 'Authentication error',
          details: 'Please check your Resend API key.',
          originalError: resendError.message
        });
      } else if (resendError.statusCode === 400) {
        return res.status(400).json({ 
          error: 'Invalid request',
          details: 'The request was invalid. Please check the email addresses and other parameters.',
          originalError: resendError.message
        });
      } else if (resendError.statusCode === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          details: 'You have exceeded the rate limit for sending emails. Please try again later.',
          originalError: resendError.message
        });
      }
      
      // Generic error handler
      return res.status(resendError.statusCode || 500).json({
        error: 'Failed to send email',
        details: resendError.message || 'An unknown error occurred',
        statusCode: resendError.statusCode
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Logging endpoint
app.post('/api/logs', (req, res) => {
  const { level, message, ...meta } = req.body;
  
  if (!level || !message) {
    return res.status(400).json({ error: 'Level and message are required' });
  }
  
  console.log(`[${level.toUpperCase()}] ${message}`, meta);
  return res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 