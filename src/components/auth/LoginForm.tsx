import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password123",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error,
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
        });
        
        // Use a short timeout to ensure the toast is shown before redirect
        setTimeout(() => {
          // Use direct navigation to ensure page reload and state reset
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  }

  async function handleDemoLogin(role: string) {
    let email = "";
    const password = "password123";

    switch (role) {
      case "admin":
        email = "admin@example.com";
        break;
      case "builder":
        email = "builder@example.com";
        break;
      case "homeowner":
        email = "homeowner@example.com";
        break;
      default:
        return;
    }

    form.setValue("email", email);
    form.setValue("password", password);
    
    // Auto-submit the form with the demo credentials
    setDemoLoading(role);
    
    try {
      const result = await login(email, password);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error,
        });
        setDemoLoading(null);
      } else {
        toast({
          title: "Login Successful",
          description: `Logged in as ${role}. Redirecting to dashboard...`,
        });
        
        // Use a short timeout to ensure the toast is shown before redirect
        setTimeout(() => {
          // Use direct navigation to ensure page reload and state reset
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      setDemoLoading(null);
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#D1522E] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-[#D1522E] hover:bg-[#B8401F]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Demo Accounts
          </span>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleDemoLogin("admin")}
          disabled={isLoading || demoLoading !== null}
        >
          {demoLoading === "admin" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Admin
            </>
          ) : (
            "Admin"
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleDemoLogin("builder")}
          disabled={isLoading || demoLoading !== null}
        >
          {demoLoading === "builder" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Builder
            </>
          ) : (
            "Builder"
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleDemoLogin("homeowner")}
          disabled={isLoading || demoLoading !== null}
        >
          {demoLoading === "homeowner" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Homeowner
            </>
          ) : (
            "Homeowner"
          )}
        </Button>
      </div>
    </div>
  );
}

export default LoginForm;