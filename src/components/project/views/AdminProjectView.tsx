import React, { useState, useMemo } from "react";
import { Project, ProjectImage } from "@/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectOverview from "@/components/project/ProjectOverview";
import PhotoUploadDialog from "@/components/project/PhotoUploadDialog";
import AdminProjectMediaTabs from "@/components/project/admin/AdminProjectMediaTabs";
import { toast } from "sonner";

interface AdminProjectViewProps {
  project: Project;
  projectImages: ProjectImage[];
  refreshProjectImages: () => Promise<void>;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AdminProjectView: React.FC<AdminProjectViewProps> = ({
  project,
  projectImages,
  refreshProjectImages,
}) => {
  // Get current year and month for default filters
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = MONTHS[currentDate.getMonth()];

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [yearFilter, setYearFilter] = useState<string>(currentYear);
  const [monthFilter, setMonthFilter] = useState<string>(currentMonth);

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
    
    // Refresh project images after upload
    refreshProjectImages();
  };

  return (
    <>
      <div className="container py-8">
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
              projectImages={projectImages}
              recentImages={recentImages}
              yearFilter={yearFilter}
              setYearFilter={setYearFilter}
              monthFilter={monthFilter}
              setMonthFilter={setMonthFilter}
              onUploadComplete={refreshProjectImages}
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
          </div>
        </div>
      </div>

      <PhotoUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen} 
        selectedFiles={selectedFiles} 
        setSelectedFiles={setSelectedFiles} 
        uploading={uploading} 
        handleUpload={handleUpload} 
      />
    </>
  );
};

export default AdminProjectView; 