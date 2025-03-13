
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 md:py-32">
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="slide-up">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Track Your Building Project's Progress
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              A seamless platform for builders, homeowners, and project managers to 
              collaborate, share updates, and document construction progress.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-4">
              <Button asChild size="lg" className="h-12 px-8">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link to="/login">
                  View Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/5"></div>
      <div className="absolute -bottom-32 -left-40 h-[500px] w-[500px] rounded-full bg-primary/5"></div>
    </section>
  );
};

export default HeroSection;
