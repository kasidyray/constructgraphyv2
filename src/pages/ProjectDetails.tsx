import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockProjects } from "@/data/mockData";
import { getProjectImagesApi } from "@/data/mockApi";
import { Project, ProjectImage } from "@/types";
import ProjectLoading from "@/components/project/ProjectLoading";
import { 
  AdminProjectView, 
  BuilderProjectView, 
  HomeownerProjectView 
} from "@/components/project/views";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    setLoading(true);
    const fetchProject = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      const foundProject = mockProjects.find(p => p.id === id);
      if (!foundProject) {
        navigate("/projects");
        return;
      }

      // Check if homeowner has access to this project
      if (user?.role === "homeowner" && foundProject.homeownerId !== user.id) {
        navigate("/dashboard");
        return;
      }
      setProject(foundProject);
      
      // Fetch project images using our mock API
      if (id) {
        try {
          const images = await getProjectImagesApi(id);
          setProjectImages(images);
        } catch (error) {
          console.error("Error fetching project images:", error);
          toast.error("Failed to load project images");
        }
      }
      
      setLoading(false);
    };
    fetchProject();
  }, [id, navigate, user]);

  // Function to refresh project images
  const refreshProjectImages = async () => {
    if (id) {
      try {
        const images = await getProjectImagesApi(id);
        setProjectImages(images);
      } catch (error) {
        console.error("Error refreshing project images:", error);
      }
    }
  };

  if (loading || !project) {
    return <ProjectLoading />;
  }

  // Render the appropriate view based on user role
  const renderRoleSpecificView = () => {
    if (!user) return null;

    switch (user.role) {
      case "admin":
        return (
          <AdminProjectView 
            project={project} 
            projectImages={projectImages} 
            refreshProjectImages={refreshProjectImages} 
          />
        );
      case "builder":
        return (
          <BuilderProjectView 
            project={project} 
            projectImages={projectImages} 
          />
        );
      case "homeowner":
        return (
          <HomeownerProjectView 
            project={project} 
            projectImages={projectImages} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      {renderRoleSpecificView()}
    </AuthLayout>
  );
};

export default ProjectDetails;