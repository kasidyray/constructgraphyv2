
import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";

const ProjectLoading: React.FC = () => {
  return (
    <AuthLayout>
      <div className="container flex h-64 items-center justify-center py-8">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ProjectLoading;
