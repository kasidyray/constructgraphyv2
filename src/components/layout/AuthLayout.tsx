import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    // Only proceed with checks after loading is complete
    if (loading) {
      return;
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      if (location.pathname !== "/login") {
        navigate("/login");
      }
      return;
    }
    
    // Check role requirements if user is authenticated
    if (user && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        navigate("/dashboard");
      }
    }
  }, [loading, isAuthenticated, user, navigate, requiredRoles, location.pathname]);

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
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

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
