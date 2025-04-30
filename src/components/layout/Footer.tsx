import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t mt-auto py-4">
      <div className="container mx-auto px-4 md:max-w-screen-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Copyright */}
        <div className="text-sm text-center sm:text-left">
          &copy; {currentYear} Constructography. All rights reserved.
        </div>

        {/* Center: Legal Links */}
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          <Link to="/about" className="hover:text-foreground transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
          <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/cookie-policy" className="hover:text-foreground transition-colors">Cookies</Link>
        </nav>

        {/* Right Side: Social Links */}
        <div className="flex space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Facebook">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 