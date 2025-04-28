import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase'; // Assuming supabase client is here
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`, // URL where user resets password
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        });
      } else {
        setMessageSent(true);
        toast({
          title: 'Check your email',
          description: 'If an account exists for this email, a password reset link has been sent.',
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messageSent ? (
            <div className="text-center text-green-600">
              <p>Password reset instructions have been sent to your email address.</p>
              <p className="mt-4">
                <Link to="/login" className="text-[#D1522E] hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-[#D1522E] hover:bg-[#B8401F]" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </Form>
          )}
          {!messageSent && (
             <div className="mt-4 text-center text-sm">
               Remembered your password?{' '}
               <Link to="/login" className="font-medium text-[#D1522E] hover:underline">
                 Login here
               </Link>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword; 