import React from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { ProjectImage } from "@/types";
import ImageGallery from "@/components/ui/ImageGallery";

interface ProjectPhotosProps {
  projectImages: ProjectImage[];
  isAdmin: boolean;
  handleUploadButtonClick: () => void;
}

const ProjectPhotos: React.FC<ProjectPhotosProps> = ({ 
  projectImages,
  isAdmin, 
  handleUploadButtonClick 
}) => {
  const hasImages = projectImages.length > 0;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Photos</h2>
        {isAdmin && (
          <Button onClick={handleUploadButtonClick}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
        )}
      </div>
      
      {hasImages ? (
        <div className="space-y-4">
          <ImageGallery 
            images={projectImages} 
            editable={isAdmin}
          />
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No Photos Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload photos to document the project's progress
          </p>
          {isAdmin && (
            <Button className="mt-4" onClick={handleUploadButtonClick}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectPhotos;
