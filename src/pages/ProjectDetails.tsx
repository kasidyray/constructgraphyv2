import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getProjectImages, mockProjects } from "@/data/mockData";
import { Project } from "@/types";

// Import components
import ProjectLoading from "@/components/project/ProjectLoading";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectOverview from "@/components/project/ProjectOverview";
import PhotoUploadDialog from "@/components/project/PhotoUploadDialog";
import { Button } from "@/components/ui/button";
const ProjectDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
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
      setLoading(false);
    };
    fetchProject();
  }, [id, navigate, user]);
  if (loading || !project) {
    return <ProjectLoading />;
  }
  const projectImages = getProjectImages(project.id);
  const isAdmin = user?.role === "admin";
  const handleUploadButtonClick = () => {
    setUploadDialogOpen(true);
    setSelectedFiles([]);
  };
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`Successfully uploaded ${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''}`);
    setUploading(false);
    setUploadDialogOpen(false);
    setSelectedFiles([]);
  };
  return <AuthLayout>
      <div className="container py-8">
        
        
        <ProjectHeader project={project} isAdmin={isAdmin} />
        
        <ProjectOverview project={project} isAdmin={isAdmin} projectImages={projectImages} handleUploadButtonClick={handleUploadButtonClick} setActiveTab={tab => {}} // Empty function as we removed tabs
      />
      </div>

      <PhotoUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} uploading={uploading} handleUpload={handleUpload} />
    </AuthLayout>;
};
export default ProjectDetails;