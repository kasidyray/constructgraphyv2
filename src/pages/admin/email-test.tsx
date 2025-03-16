import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import EmailTester from '@/components/admin/EmailTester';

const EmailTestPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Redirect if not admin
  if (!loading && (!user || user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Email Notification Testing</h1>
        <p className="mb-6 text-muted-foreground">
          Use this page to test email notifications. This will help verify that Mailgun is configured correctly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Email</h2>
            <p className="mb-4 text-muted-foreground">
              Send a test email to verify the basic email functionality.
            </p>
            <EmailTester />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
            <p className="mb-4 text-muted-foreground">
              The system uses the following email templates:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>welcome_email</strong> - Sent when a new user is created</li>
              <li><strong>new_photos_email</strong> - Sent when photos are added to a project</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              These templates need to be configured in the Mailgun dashboard.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailTestPage; 