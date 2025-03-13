import React from "react";
import { Project, ProjectImage } from "@/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectOverview from "@/components/project/ProjectOverview";

interface BuilderProjectViewProps {
  project: Project;
  projectImages: ProjectImage[];
}

const BuilderProjectView: React.FC<BuilderProjectViewProps> = ({
  project,
  projectImages,
}) => {
  // Builders can view project details but have limited editing capabilities
  // compared to admins
  
  return (
    <div className="container py-8">
      <ProjectHeader project={project} isAdmin={false} />
      
      <ProjectOverview 
        project={project} 
        isAdmin={false} 
        projectImages={projectImages} 
        handleUploadButtonClick={() => {}} // Builders can't upload photos
        setActiveTab={tab => {}} // Empty function as we removed tabs
      />
    </div>
  );
};

export default BuilderProjectView; 