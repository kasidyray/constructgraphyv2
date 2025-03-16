import React, { useState, useMemo } from "react";
import { Project, ProjectImage } from "@/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectOverview from "@/components/project/ProjectOverview";
import AdminProjectMediaTabs from "@/components/project/admin/AdminProjectMediaTabs";
import ProjectStatusUpdate from "@/components/project/admin/ProjectStatusUpdate";
import { toast } from "sonner";
import { updateProject } from "@/services/projectService";
import { uploadProjectImages, deleteProjectImage, updateProjectImage, getProjectImages } from "@/services/imageService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Define the ImageCategory type directly here since it's not exported from imageService
type ImageCategory = 'other' | 'interior' | 'exterior' | 'structural' | 'finishes' | 'general';

interface AdminProjectViewProps {
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

const AdminProjectView: React.FC<AdminProjectViewProps> = ({
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

  const [yearFilter, setYearFilter] = useState<string>(currentYear);
  const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useAuth();

  // Filter images based on selected year and month
  const filteredImages = useMemo(() => {
    return projectImages.filter(image => {
      const date = new Date(image.createdAt);
      const imageYear = date.getFullYear().toString();
      const imageMonth = date.toLocaleString('default', { month: 'long' });
      
      const yearMatch = yearFilter === "all" || imageYear === yearFilter;
      const monthMatch = monthFilter === "all" || imageMonth === monthFilter;
      
      return yearMatch && monthMatch;
    });
  }, [projectImages, yearFilter, monthFilter]);

  // Get the most recent images for display
  const recentImages = useMemo(() => {
    return [...filteredImages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredImages]);

  // Handle project update
  const handleProjectUpdate = async (updatedProjectData: Partial<Project>) => {
    if (!project) return;
    
    setIsUpdating(true);
    try {
      const updatedProject = await updateProject(project.id, updatedProjectData, user);
      onProjectUpdate(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (files: File[], category: ImageCategory) => {
    if (!project) return;
    
    try {
      const uploadedImages = await uploadProjectImages(project.id, files, category);
      if (uploadedImages.length > 0) {
        onImageUpload(uploadedImages);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    }
  };

  // Handle image delete
  const handleImageDelete = async (imageId: string) => {
    try {
      await deleteProjectImage(imageId);
      onImageDelete(imageId);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  // Handle image update
  const handleImageUpdate = async (imageId: string, updates: Partial<ProjectImage>) => {
    try {
      const updatedImage = await updateProjectImage(imageId, updates);
      onImageUpdate(updatedImage);
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };

  // Refresh project images
  const refreshProjectImages = async () => {
    if (project) {
      try {
        const images = await getProjectImages(project.id);
        onImageUpload(images);
        toast.success("Images refreshed successfully");
      } catch (error) {
        console.error("Error refreshing project images:", error);
        toast.error("Failed to refresh images");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
        <ProjectHeader project={project} isAdmin={true} />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
          <div className="col-span-2 space-y-6">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </div>
            
            <AdminProjectMediaTabs
              project={project}
              projectImages={filteredImages}
              recentImages={recentImages}
              yearFilter={yearFilter}
              setYearFilter={setYearFilter}
              monthFilter={monthFilter}
              setMonthFilter={setMonthFilter}
              onUploadComplete={refreshProjectImages}
              onDeleteImage={handleImageDelete}
              onUpdateImage={handleImageUpdate}
            />
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Project Details</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="mt-1 capitalize">{project.status.replace("-", " ")}</dd>
                  </div>
                  <hr className="my-2" />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Homeowner</dt>
                    <dd className="mt-1">{project.homeownerName}</dd>
                  </div>
                  <hr className="my-2" />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                    <dd className="mt-1">{project.address}</dd>
                  </div>
                  <hr className="my-2" />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created On</dt>
                    <dd className="mt-1">{new Date(project.createdAt).toLocaleDateString()}</dd>
                  </div>
                  <hr className="my-2" />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                    <dd className="mt-1">{new Date(project.updatedAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <ProjectStatusUpdate 
              project={project}
              onProjectUpdate={onProjectUpdate}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProjectView; 