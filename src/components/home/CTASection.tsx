
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to transform how you manage building projects?
          </h2>
          <p className="mt-4 text-primary-foreground/90">
            Join thousands of builders and homeowners who are already using our platform 
            to streamline their construction documentation.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8">
            <Link to="/login">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
