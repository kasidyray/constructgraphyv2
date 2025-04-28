import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// Get the API base URL based on environment
const getApiBaseUrl = () => {
  // If running on a deployed site, use a relative URL
  // Otherwise use localhost with port 3001
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:3001/api';
};

const EmailTester: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSendTestEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setSending(true);
    setResponseMessage(null);
    
    const apiUrl = `${getApiBaseUrl()}/test-email`;
    console.log('Sending request to:', apiUrl);
    
    try {
      // Use our API endpoint with the correct URL for the environment
      const response = await axios.post(apiUrl, { email });
      
      if (response.status === 200) {
        toast.success(`Test email sent to ${email}`);
        
        // Display the response message if it's a simulated response
        if (response.data.note) {
          setResponseMessage(response.data.note);
        }
        
        setEmail('');
      } else {
        toast.error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      
      // Handle detailed error responses
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.details) {
          setResponseMessage(errorData.details);
        }
        
        toast.error(errorData.error || 'An error occurred while sending the test email');
      } else {
      toast.error('An error occurred while sending the test email');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Notification Tester</CardTitle>
        <CardDescription>
          Test the email notification functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Testing Mode Limitation</AlertTitle>
            <AlertDescription>
              In testing mode, Resend only allows sending to the account owner's email address.
              To send to other recipients, please verify a domain at resend.com/domains.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="test-email">Email Address</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
            />
          </div>
          
          {responseMessage && (
            <Alert className="mt-4">
              <AlertDescription>{responseMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSendTestEmail}
          disabled={!email || sending}
          className="w-full"
        >
          {sending ? 'Sending...' : 'Send Test Email'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailTester; 