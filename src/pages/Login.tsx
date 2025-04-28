import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import LazyImage from "@/components/ui/LazyImage";
import { Facebook, Instagram, Linkedin } from 'lucide-react'; // Import social icons

const Login: React.FC = () => {
  const {
    user,
    loading,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect if we're definitely authenticated and not loading
    if (!loading && isAuthenticated && user) {
      // Use window.location for a hard redirect instead of navigate
      window.location.href = "/dashboard";
    }
  }, [loading, isAuthenticated, user, navigate]);

  return <div className="flex min-h-screen w-full">
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
      <div className="relative flex w-full flex-col justify-between bg-white px-8 py-8 lg:w-1/2">
        {/* Top Right Links */}
        <div className="absolute top-8 right-8 space-x-4">
          <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link>
        </div>

        {/* Center Content */}
        <div className="flex flex-col justify-center flex-grow">
        <div className="mb-6 flex justify-center">
          <LazyImage 
            src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" 
            alt="BuildTracker" 
            className="h-8" 
          />
        </div>
        <LoginForm />
        </div>

        {/* Bottom Social Links */}
        <div className="flex justify-center space-x-6 mt-8">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>;
};
export default Login;
