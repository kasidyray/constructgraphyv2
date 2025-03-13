
import React from "react";
import { FolderOpen } from "lucide-react";
import { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <FolderOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No projects are currently assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
