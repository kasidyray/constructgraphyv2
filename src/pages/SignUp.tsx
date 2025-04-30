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
import { supabase } from '@/lib/supabase';
import { Loader2, Home, HardHat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Label } from "@/components/ui/label";

// Base schema with common fields and role
const baseSchema = z.object({
  role: z.enum(['homeowner', 'builder'], { required_error: 'Please select a role.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(), // Phone is optional
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string(),
  // Role-specific fields - optional initially, required via refinement
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(), // For builder
});

// Refined schema to check password confirmation and role-specific fields
const refinedSchema = baseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).superRefine((data, ctx) => {
  if (data.role === 'homeowner') {
    if (!data.firstName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'First name is required', path: ['firstName'] });
    }
    if (!data.lastName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Last name is required', path: ['lastName'] });
    }
  } else if (data.role === 'builder') {
    if (!data.name?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Name is required', path: ['name'] });
    }
  }
});

type SignUpFormValues = z.infer<typeof refinedSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedRoleVisual, setSelectedRoleVisual] = useState<'homeowner' | 'builder' | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(refinedSchema),
    defaultValues: {
      role: undefined,
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      name: '',
    },
  });

  const handleRoleSelect = (role: 'homeowner' | 'builder') => {
    setSelectedRoleVisual(role);
    form.setValue('role', role, { shouldValidate: true, shouldDirty: true });
  };

  const selectedRoleForm = form.watch('role');

  async function onSubmit(values: SignUpFormValues) {
    setIsLoading(true);
    
    let profileData: any = {
      role: values.role,
      phone: values.phone || null, // Pass null if phone is empty/undefined
    };

    // Add role-specific name data
    if (values.role === 'homeowner') {
      profileData = { 
        ...profileData, 
        first_name: values.firstName, 
        last_name: values.lastName,
        name: `${values.firstName} ${values.lastName}` // Construct name for profile table
      };
    } else if (values.role === 'builder') {
      profileData = { ...profileData, name: values.name };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: profileData, // Pass profile data to Supabase trigger
        },
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign Up Error',
          description: error.message,
        });
      } else if (data.user && data.user.identities?.length === 0) {
         toast({
          variant: 'destructive',
          title: 'User Exists',
          description: 'This email is already registered but not confirmed. Please check your email or try logging in.',
         });
      } else if (data.user) {
        navigate('/check-email'); 
      } else {
         toast({
          variant: 'destructive',
          title: 'Sign Up Error',
          description: 'An unexpected error occurred during sign up.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Select your role and enter your details to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                 <Label className={clsx(form.formState.errors.role && 'text-destructive')}>I am a...</Label>
                 <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => handleRoleSelect('homeowner')}
                      className={clsx(
                        "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center space-y-2 transition-colors",
                        selectedRoleVisual === 'homeowner' 
                          ? "border-primary ring-2 ring-primary bg-primary/10"
                          : "border-input hover:bg-accent hover:text-accent-foreground",
                        form.formState.errors.role && !selectedRoleVisual && "border-destructive"
                      )}
                    >
                      <Home className={clsx("h-8 w-8", selectedRoleVisual === 'homeowner' ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium">Homeowner</span>
                    </div>
                     <div
                      onClick={() => handleRoleSelect('builder')}
                      className={clsx(
                        "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center space-y-2 transition-colors",
                        selectedRoleVisual === 'builder' 
                          ? "border-primary ring-2 ring-primary bg-primary/10"
                          : "border-input hover:bg-accent hover:text-accent-foreground",
                        form.formState.errors.role && !selectedRoleVisual && "border-destructive"
                      )}
                    >
                      <HardHat className={clsx("h-8 w-8", selectedRoleVisual === 'builder' ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium">Builder</span>
                    </div>
                 </div>
                 {form.formState.errors.role && (
                   <p className="text-sm font-medium text-destructive">{form.formState.errors.role.message}</p>
                 )}
              </div>

              {selectedRoleForm === 'homeowner' && (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {selectedRoleForm === 'builder' && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Company/Builder)</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Construction" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedRoleForm && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} value={field.value ?? ''} />
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
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-[#D1522E] hover:bg-[#B8401F]" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Up...</>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </>
              )}
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#D1522E] hover:underline">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp; 