import React, { useState, useMemo } from "react";
import { Project, ProjectImage, User } from "@/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectPhotoFilters from "@/components/project/shared/ProjectPhotoFilters";
import ImageGallery from "@/components/ui/ImageGallery";
import ProjectStatusUpdate from "@/components/project/admin/ProjectStatusUpdate";
import { toast } from "sonner";
import { updateProject } from "@/services/projectService";
import { updateProjectImage } from "@/services/imageService";
import { useAuth } from "@/contexts/AuthContext";
import AdminOnlyMessage from "../admin/AdminOnlyMessage";

interface BuilderProjectViewProps {
  project: Project;
  projectImages: ProjectImage[];
  onProjectUpdate: (updatedProject: Project) => void;
  onImageUpload: (newImages: ProjectImage[]) => void;
  onImageDelete: (deletedImageId: string) => void;
  onImageUpdate: (updatedImage: ProjectImage) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BuilderProjectView: React.FC<BuilderProjectViewProps> = ({
  project,
  projectImages,
  onProjectUpdate,
  onImageUpload,
  onImageDelete,
  onImageUpdate,
}) => {
  // Get current year and month for default filters
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = MONTHS[currentDate.getMonth()];

  // State for filters
  const [yearFilter, setYearFilter] = useState<string>(currentYear);
  const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const [showAdminOnlyMessage, setShowAdminOnlyMessage] = useState(false);

  // Handle project update
  const handleProjectUpdate = async (updatedProjectData: Partial<Project>) => {
    if (!project) return;
    
    // Check if trying to update status or progress as a non-admin
    const hasStatusOrProgressUpdates = 
      updatedProjectData.status !== undefined || 
      updatedProjectData.progress !== undefined;
    
    if (hasStatusOrProgressUpdates && user?.role !== 'admin') {
      setShowAdminOnlyMessage(true);
      toast.error("Only administrators can update project status or progress");
      return;
    }
    
    setIsUpdating(true);
    try {
      // Convert AuthUser to User type if needed
      const userForUpdate = user ? {
        id: user.id,
        email: user.email,
        name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.email,
        role: user.role,
        createdAt: user.created_at
      } as User : undefined;
      
      const updatedProject = await updateProject(project.id, updatedProjectData, userForUpdate);
      onProjectUpdate(updatedProject);
      setShowAdminOnlyMessage(false);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter images based on selected year and month
  const filteredImages = useMemo(() => {
    return projectImages.filter(image => {
      const imageDate = new Date(image.createdAt);
      const imageYear = imageDate.getFullYear().toString();
      const imageMonth = MONTHS[imageDate.getMonth()];
      
      const yearMatch = yearFilter === 'All' || imageYear === yearFilter;
      const monthMatch = monthFilter === 'All' || imageMonth === monthFilter;
      
      return yearMatch && monthMatch;
    });
  }, [projectImages, yearFilter, monthFilter]);

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-6">
      <ProjectHeader 
        project={project} 
        isAdmin={false}
      />
      
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Project Photos</h2>
          <div className="w-full md:w-auto overflow-x-auto">
            <div className="flex flex-row items-center gap-2 min-w-max">
              <ProjectPhotoFilters
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                monthFilter={monthFilter}
                setMonthFilter={setMonthFilter}
              />
            </div>
          </div>
        </div>
        
        {filteredImages.length > 0 ? (
          <div className="relative">
            <ImageGallery 
              images={filteredImages} 
              editable={true}
              onDelete={onImageDelete}
              onUpdate={(imageId, updates) => {
                updateProjectImage(imageId, updates)
                  .then(updatedImage => {
                    if (updatedImage) {
                      onImageUpdate(updatedImage);
                    }
                  })
                  .catch(error => {
                    console.error("Error updating image:", error);
                    toast.error("Failed to update image");
                  });
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">No photos found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No photos match your current filters.
            </p>
          </div>
        )}
      </div>

      {showAdminOnlyMessage && (
        <AdminOnlyMessage message="Only administrators can update project status or progress. Other project details can be updated by builders." />
      )}
    </div>
  );
};

export default BuilderProjectView; 