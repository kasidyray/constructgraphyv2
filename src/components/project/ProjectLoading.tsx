import React from "react";

const ProjectLoading: React.FC = () => {
  return (
    <div className="container flex h-64 items-center justify-center py-8">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading project details...</p>
      </div>
    </div>
  );
};

export default ProjectLoading;
