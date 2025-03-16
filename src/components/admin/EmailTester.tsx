import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    
    try {
      // Use our API endpoint with the correct port
      const response = await axios.post('http://localhost:3001/api/test-email', { email });
      
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
      toast.error('An error occurred while sending the test email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Notification Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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