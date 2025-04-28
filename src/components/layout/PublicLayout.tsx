import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 md:max-w-screen-xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 