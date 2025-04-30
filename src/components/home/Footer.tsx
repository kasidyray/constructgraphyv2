import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-card py-8">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" 
              alt="Constructgraphy" 
              className="h-8"
            />
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
            <Link to="/about" className="hover:text-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/cookie-policy" className="hover:text-foreground transition-colors">Cookies</Link>
          </nav>
          
          <div className="text-center text-sm text-muted-foreground md:text-right">
            © {new Date().getFullYear()} Constructgraphy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
