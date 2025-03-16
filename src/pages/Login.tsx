import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  const {
    user,
    loading,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we just logged out
  const searchParams = new URLSearchParams(location.search);
  const justLoggedOut = searchParams.get('logout') === 'true';

  useEffect(() => {
    // Only redirect if we're definitely authenticated, not loading, and not just logged out
    if (!loading && isAuthenticated && user && !justLoggedOut) {
      // Use window.location for a hard redirect instead of navigate
      window.location.href = "/dashboard";
    }
  }, [loading, isAuthenticated, user, navigate, justLoggedOut]);

  return <div className="flex min-h-screen w-full">
      {/* Left side - Image and caption */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-black/40">
          <img src="https://images.unsplash.com/photo-1460574283810-2aab119d8511" alt="Construction site" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#D1522E]/60 via-black/40 to-black/60" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-16 pl-24 text-white">
          <h1 className="mb-4 text-5xl font-bold leading-tight text-left">
            Everything you need,<br />
            to build anything you want.
          </h1>
          <p className="max-w-2xl text-lg text-white/80 text-left">
            Powerful tools to track construction progress, manage projects,
            and keep all stakeholders connected in one place.
          </p>
        </div>
        
        <div className="absolute bottom-8 left-8 flex items-center">
          
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2">
        <div className="mb-6 flex justify-center">
          <img src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" alt="BuildTracker" className="h-8" />
        </div>
        {justLoggedOut && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">
            <p className="text-center">You have been successfully logged out.</p>
          </div>
        )}
        <LoginForm />
      </div>
    </div>;
};
export default Login;
