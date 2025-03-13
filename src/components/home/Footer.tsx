
import React from "react";

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
          
          <div className="text-center text-sm text-muted-foreground md:text-right">
            © {new Date().getFullYear()} Constructgraphy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
