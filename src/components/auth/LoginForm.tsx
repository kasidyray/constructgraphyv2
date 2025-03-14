import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the AuthContext
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo account information
  const demoAccounts = [{
    role: "Admin",
    email: "admin@example.com",
    password: "password"
  }, {
    role: "Builder",
    email: "builder@example.com",
    password: "password"
  }, {
    role: "Homeowner",
    email: "homeowner1@example.com",
    password: "password"
  }];
  const loginAsDemoUser = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };
  return <div className="mx-auto w-full max-w-md px-4 my-[40px]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign into your constructography account to continue.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} required className="h-12" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="sr-only">Password</Label>
          <Input id="password" type="password" placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={isSubmitting} required className="h-12" />
        </div>
        
        <Button type="submit" className="h-12 w-full bg-[#D1522E] hover:bg-[#D1522E]/90" disabled={isSubmitting}>
          {isSubmitting ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </> : "Log in"}
        </Button>
        
        <div className="text-center">
          <Button variant="link" className="text-sm text-[#D1522E] hover:text-[#D1522E]/80" type="button">
            Forgot Password?
          </Button>
        </div>
        
        <div className="pt-2">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-2 flex-shrink text-xs text-gray-500">
              Demo accounts
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-2">
            {demoAccounts.map(account => <Button key={account.role} type="button" variant="outline" size="sm" className="text-xs border-[#D1522E]/20 text-[#D1522E] hover:bg-[#D1522E]/10" onClick={() => loginAsDemoUser(account.email, account.password)} disabled={isSubmitting}>
                {account.role}
              </Button>)}
          </div>
        </div>
      </form>
    </div>;
};
export default LoginForm;