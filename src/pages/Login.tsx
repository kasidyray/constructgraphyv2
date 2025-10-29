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
          A Smarter Way to Manage<br />
          Home Construction.
          </h1>
          <p className="max-w-2xl text-lg text-white/80 text-left">
            Powerful tools to track construction progress, manage projects,<br/>
            and keep all stakeholders connected in one place.
          </p>
        </div>
        
        <div className="absolute bottom-8 left-8 flex items-center">
          
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="relative flex w-full flex-col justify-between bg-white px-8 py-8 lg:w-1/2">
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
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#D1522E] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Bottom Links - Restructured */}
        <div className="flex flex-wrap justify-between items-center mt-8 border-t pt-6 border-gray-200">
          {/* Left: Text Links */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <Link to="/about" className="hover:text-gray-700">About Us</Link>
            <Link to="/contact" className="hover:text-gray-700">Contact Us</Link>
            <Link to="/terms-of-service" className="hover:text-gray-700">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-gray-700">Privacy</Link>
            <Link to="/cookie-policy" className="hover:text-gray-700">Cookies</Link>
          </div>
          {/* Right: Social Links */}
          <div className="flex space-x-6 mt-4 sm:mt-0">
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
      </div>
    </div>;
};
export default Login;
