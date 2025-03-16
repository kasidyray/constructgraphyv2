import React from "react";
import { Separator } from "@/components/ui/separator";
import { Project } from "@/types";

interface ProjectDetailsProps {
  project: Project;
  className?: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  project,
  className = ""
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle status/stage property which might have different names in different parts of the app
  const projectStatus = (project as any).stage || (project as any).status || "unknown";

  return (
    <div className={`rounded-lg border bg-card shadow-sm ${className}`}>
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Project Details</h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="mt-1 capitalize">{projectStatus.replace("-", " ")}</dd>
          </div>
          <Separator />
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Homeowner</dt>
            <dd className="mt-1 capitalize-text">{project.homeownerName}</dd>
          </div>
          <Separator />
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Address</dt>
            <dd className="mt-1">{project.address}</dd>
          </div>
          <Separator />
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created On</dt>
            <dd className="mt-1">{formatDate(project.createdAt)}</dd>
          </div>
          <Separator />
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
            <dd className="mt-1">{formatDate(project.updatedAt)}</dd>
          </div>
          {(project as any).budget && (
            <>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Budget</dt>
                <dd className="mt-1">${(project as any).budget.toLocaleString()}</dd>
              </div>
            </>
          )}
          {(project as any).type && (
            <>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="mt-1">{(project as any).type}</dd>
              </div>
            </>
          )}
          {(project as any).size && (
            <>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Size</dt>
                <dd className="mt-1">{(project as any).size.toLocaleString()} sq ft</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default ProjectDetails; 