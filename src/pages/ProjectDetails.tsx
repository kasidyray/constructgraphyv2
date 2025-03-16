import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Project, ProjectImage } from "@/types";
import ProjectDetailsSkeleton from "@/components/ui/ProjectDetailsSkeleton";
import { 
  AdminProjectView, 
  BuilderProjectView, 
  HomeownerProjectView 
} from "@/components/project/views";
import { getProjectById, updateProject, updateProjectThumbnail } from "@/services/projectService";
import { getProjectImages } from "@/services/imageService";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to update project thumbnail
  const updateProjectThumbnailImage = async (projectId: string, images: ProjectImage[]) => {
    if (images.length > 0 && project) {
      // Only update if the thumbnail is different from the first image
      if (project.thumbnail !== images[0].url) {
        console.log('Updating project thumbnail to:', images[0].url);
        try {
          const updatedProject = await updateProjectThumbnail(projectId, images[0].url);
          
          if (updatedProject) {
            console.log('Project thumbnail updated successfully');
            setProject(updatedProject);
          }
        } catch (error) {
          console.error("Error updating project thumbnail:", error);
          toast.error("Failed to update project thumbnail");
        }
      }
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/projects");
      return;
    }

    const fetchProjectData = async () => {
      setLoading(true);
      try {
        console.log('Fetching project data for ID:', id);
        
        // Fetch project details
        const foundProject = await getProjectById(id);
        
        if (!foundProject) {
          console.error('Project not found for ID:', id);
          toast.error("Project not found");
          navigate("/projects");
          return;
        }

        console.log('Project found:', foundProject.title);

        // Check if homeowner has access to this project
        if (user?.role === "homeowner" && foundProject.homeownerId !== user.id) {
          console.error('Homeowner does not have access to this project');
          toast.error("You don't have access to this project");
          navigate("/dashboard");
          return;
        }
        
        setProject(foundProject);
        
        // Fetch project images
        console.log('Fetching images for project:', id);
        const images = await getProjectImages(id);
        console.log('Retrieved images count:', images.length);
        
        if (images.length === 0) {
          console.log('No images found for project');
        } else {
          console.log('First image URL:', images[0].url);
        }
        
        setProjectImages(images);
        
        // Update project thumbnail to first image if available
        if (images.length > 0) {
          updateProjectThumbnailImage(id, images);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, user, navigate]);

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
    toast.success("Project updated successfully");
  };

  const handleImageUpload = (newImages: ProjectImage[]) => {
    console.log('New images uploaded:', newImages.length);
    const updatedImages = [...newImages, ...projectImages];
    setProjectImages(updatedImages);
    toast.success(`${newImages.length} image${newImages.length === 1 ? '' : 's'} uploaded successfully`);
    
    // Update project thumbnail if this is the first image
    if (project && (projectImages.length === 0 || newImages.length > 0)) {
      updateProjectThumbnailImage(project.id, updatedImages);
    }
  };

  const handleImageDelete = (deletedImageId: string) => {
    console.log('Deleting image:', deletedImageId);
    const updatedImages = projectImages.filter(img => img.id !== deletedImageId);
    setProjectImages(updatedImages);
    
    // Update thumbnail if the first image was deleted
    if (project && updatedImages.length > 0) {
      updateProjectThumbnailImage(project.id, updatedImages);
    }
  };

  const handleImageUpdate = (updatedImage: ProjectImage) => {
    console.log('Updating image:', updatedImage.id);
    const updatedImages = projectImages.map(img => 
      img.id === updatedImage.id ? updatedImage : img
    );
    setProjectImages(updatedImages);
  };

  const refreshProjectImages = async () => {
    if (id) {
      console.log('Refreshing project images for ID:', id);
      try {
        const images = await getProjectImages(id);
        console.log('Refreshed images count:', images.length);
        setProjectImages(images);
        
        // Update project thumbnail if needed
        if (images.length > 0 && project) {
          updateProjectThumbnailImage(id, images);
        }
      } catch (error) {
        console.error("Error refreshing project images:", error);
      }
    }
  };

  // Show skeleton loading while project data is loading
  if (loading) {
    return (
      <AuthLayout>
        <ProjectDetailsSkeleton />
      </AuthLayout>
    );
  }

  if (!project) {
    return null; // This should never happen as we redirect in the useEffect
  }

  // Render the appropriate view based on user role
  return (
    <AuthLayout>
      {user?.role === "admin" ? (
        <AdminProjectView 
          project={project} 
          projectImages={projectImages}
          onProjectUpdate={handleProjectUpdate}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onImageUpdate={handleImageUpdate}
        />
      ) : user?.role === "builder" ? (
        <BuilderProjectView 
          project={project} 
          projectImages={projectImages}
          onProjectUpdate={handleProjectUpdate}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onImageUpdate={handleImageUpdate}
        />
      ) : (
        <HomeownerProjectView 
          project={project} 
          projectImages={projectImages} 
        />
      )}
    </AuthLayout>
  );
};

export default ProjectDetails;