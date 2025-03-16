import React from "react";
import { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";
import AddProjectCard from "@/components/ui/AddProjectCard";

interface ProjectListProps {
  projects: Project[];
  isAdmin?: boolean;
  onAddProject?: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  isAdmin = false, 
  onAddProject 
}) => {
  // Sort projects by updated date
  const sortedProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (projects.length === 0) {
    // If there are no projects and user is admin, show only the add project card
    if (isAdmin && onAddProject) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AddProjectCard onClick={onAddProject} />
        </div>
      );
    }
    
    // Otherwise show a message
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No projects found</h3>
        <p className="text-muted-foreground mb-6">
          No projects have been created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProjects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          isAdmin={isAdmin} 
        />
      ))}
      
      {/* Add the "Add Project" card at the end for admin users */}
      {isAdmin && onAddProject && (
        <AddProjectCard onClick={onAddProject} />
      )}
    </div>
  );
};

export default ProjectList;
