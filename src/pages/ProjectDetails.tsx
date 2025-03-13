import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Project, ProjectImage } from "@/types";
import ProjectLoading from "@/components/project/ProjectLoading";
import { 
  AdminProjectView, 
  BuilderProjectView, 
  HomeownerProjectView 
} from "@/components/project/views";
import { getProjectById } from "@/services/projectService";
import { getProjectImages } from "@/services/imageService";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/projects");
      return;
    }

    const fetchProjectData = async () => {
      setLoading(true);
      try {
        // Fetch project details
        const foundProject = await getProjectById(id);
        
        if (!foundProject) {
          toast.error("Project not found");
          navigate("/projects");
          return;
        }

        // Check if homeowner has access to this project
        if (user?.role === "homeowner" && foundProject.homeownerId !== user.id) {
          toast.error("You don't have access to this project");
          navigate("/dashboard");
          return;
        }
        
        setProject(foundProject);
        
        // Fetch project images
        const images = await getProjectImages(id);
        setProjectImages(images);
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
    setProjectImages(prev => [...newImages, ...prev]);
    toast.success(`${newImages.length} image${newImages.length === 1 ? '' : 's'} uploaded successfully`);
  };

  const handleImageDelete = (deletedImageId: string) => {
    setProjectImages(prev => prev.filter(img => img.id !== deletedImageId));
  };

  const handleImageUpdate = (updatedImage: ProjectImage) => {
    setProjectImages(prev => 
      prev.map(img => img.id === updatedImage.id ? updatedImage : img)
    );
  };

  const refreshProjectImages = async () => {
    if (id) {
      try {
        const images = await getProjectImages(id);
        setProjectImages(images);
      } catch (error) {
        console.error("Error refreshing project images:", error);
      }
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <ProjectLoading />
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