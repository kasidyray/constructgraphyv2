import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';

const CheckEmail = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
             <MailCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <CardTitle className="mt-4">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a confirmation link to your email address. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or try signing up again.
          </p>
          <p className="mt-6">
            <Link 
              to="/login" 
              className="text-sm font-medium text-[#D1522E] hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckEmail; 