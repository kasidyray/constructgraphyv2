
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  requiredRoles?: Array<"admin" | "builder" | "homeowner">;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (
      !loading && 
      isAuthenticated && 
      requiredRoles.length > 0 && 
      user && 
      !requiredRoles.includes(user.role)
    ) {
      navigate("/dashboard");
    }
  }, [loading, isAuthenticated, user, navigate, requiredRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
