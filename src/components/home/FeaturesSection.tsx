
import React from "react";
import { Camera, Home, Shield, UserCheck } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to manage your projects
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our platform provides all the tools you need to keep track of construction 
            progress, share updates, and ensure everyone stays informed.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Camera size={24} />}
            title="Photo Documentation"
            description="Upload, organize, and share high-quality photos of your construction project at every stage of development."
          />
          
          <FeatureCard
            icon={<UserCheck size={24} />}
            title="Role-Based Access"
            description="Different permissions for admins, builders, and homeowners ensure everyone sees exactly what they need."
          />
          
          <FeatureCard
            icon={<Home size={24} />}
            title="Project Management"
            description="Easily create and manage multiple building projects, tracking progress and milestones along the way."
          />
          
          <FeatureCard
            icon={<Shield size={24} />}
            title="Secure Data Storage"
            description="All your project data and images are securely stored and backed up, with controlled access for authorized users only."
          />
          
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            }
            title="Communication Tools"
            description="Keep all project stakeholders in the loop with comments, notifications, and updates on project progress."
          />
          
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            }
            title="Progress Tracking"
            description="Monitor construction progress with visual timelines, milestone tracking, and percentage complete indicators."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
