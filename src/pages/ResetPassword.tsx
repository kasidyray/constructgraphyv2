import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the hash from the URL
    const hashFromUrl = window.location.hash.substring(1);
    if (hashFromUrl) {
      setHash(hashFromUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please enter both password fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. You can now log in with your new password.",
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Image and caption */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-black/40">
          <img src="https://images.unsplash.com/photo-1460574283810-2aab119d8511" alt="Construction site" className="h-full w-full object-cover" />
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
          <img src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" alt="BuildTracker" className="h-8" />
        </div>
        
        <div className="mx-auto w-full max-w-md px-4 my-[40px]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                disabled={isSubmitting} 
                required 
                className="h-12" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••••" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                disabled={isSubmitting} 
                required 
                className="h-12" 
              />
            </div>
            
            <Button 
              type="submit" 
              className="h-12 w-full bg-[#D1522E] hover:bg-[#D1522E]/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Reset Password"}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                className="text-sm text-[#D1522E] hover:text-[#D1522E]/80" 
                type="button"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 