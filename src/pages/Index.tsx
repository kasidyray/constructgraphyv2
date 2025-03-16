import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import HomeSkeleton from "@/components/home/HomeSkeleton";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Show skeleton for at least 1 second
    
    return () => clearTimeout(timer);
  }, []);

  // Show skeleton loading while content is loading
  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
