import React from "react";
import { Project, ProjectImage } from "@/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectOverview from "@/components/project/ProjectOverview";

interface HomeownerProjectViewProps {
  project: Project;
  projectImages: ProjectImage[];
}

const HomeownerProjectView: React.FC<HomeownerProjectViewProps> = ({
  project,
  projectImages,
}) => {
  // Homeowners have a different view focused on viewing progress
  // and photos rather than project management
  
  return (
    <div className="container py-8">
      <ProjectHeader project={project} isAdmin={false} />
      
      <ProjectOverview 
        project={project} 
        isAdmin={false} 
        projectImages={projectImages} 
        handleUploadButtonClick={() => {}} // Homeowners can't upload photos
        setActiveTab={tab => {}} // Empty function as we removed tabs
      />
    </div>
  );
};

export default HomeownerProjectView; 