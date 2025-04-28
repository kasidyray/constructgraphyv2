import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import LazyImage from "@/components/ui/LazyImage";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Check for password recovery event on initial load
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        // Handle password recovery logic here
        // Typically, you might automatically log the user in or prompt them
        // For now, we just check the event
        console.log("Password recovery event detected");
    }
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Supabase handles the token verification implicitly when updating the user
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: values.password 
      });
      
      if (updateError) {
        setError(updateError.message);
        toast({
          variant: 'destructive',
          title: 'Error Updating Password',
          description: updateError.message,
        });
      } else {
        setSuccess(true);
        toast({
          title: 'Password Updated Successfully',
          description: 'You can now log in with your new password.',
      });
        // Optionally redirect after a delay
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Image and caption */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-black/40">
          <LazyImage 
            src="https://images.unsplash.com/photo-1460574283810-2aab119d8511" 
            alt="Construction site" 
            className="h-full w-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#D1522E]/60 via-black/40 to-black/60" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-16 pl-24 text-white">
          <h1 className="mb-4 text-5xl font-bold leading-tight text-left">
            Reset your password
          </h1>
          <p className="max-w-2xl text-lg text-white/80 text-left">
            Create a new secure password for your account.
          </p>
        </div>
      </div>
      
      {/* Right side - Reset password form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2">
        <div className="mb-6 flex justify-center">
          <LazyImage 
            src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" 
            alt="BuildTracker" 
            className="h-8" 
          />
        </div>
        
        <div className="mx-auto w-full max-w-md px-4 my-[40px]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>
          
          {success ? (
            <div className="text-center text-green-600">
              <p>Your password has been updated successfully!</p>
              <p className="mt-4">
                <Link to="/login" className="text-[#D1522E] hover:underline">
                  Proceed to Login
                </Link>
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <p className="text-sm font-medium text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full bg-[#D1522E] hover:bg-[#B8401F]" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                  ) : (
                    'Reset Password'
                  )}
              </Button>
          </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 