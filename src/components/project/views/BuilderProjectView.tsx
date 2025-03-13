import React, { useState, useMemo } from "react";
import { Project, ProjectImage } from "@/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectPhotoFilters from "@/components/project/shared/ProjectPhotoFilters";
import ImageGallery from "@/components/ui/ImageGallery";

interface BuilderProjectViewProps {
  project: Project;
  projectImages: ProjectImage[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BuilderProjectView: React.FC<BuilderProjectViewProps> = ({
  project,
  projectImages,
}) => {
  // Get current year and month for default filters
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = MONTHS[currentDate.getMonth()];

  // State for filters
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
  
  return (
    <div className="container py-8">
      <ProjectHeader project={project} isAdmin={false} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Project Media</h2>
              
              <div className="flex items-center justify-between mb-4">
                <ProjectPhotoFilters
                  yearFilter={yearFilter}
                  setYearFilter={setYearFilter}
                  monthFilter={monthFilter}
                  setMonthFilter={setMonthFilter}
                />
              </div>
              
              <div className="mt-4">
                {recentImages.length > 0 ? (
                  <ImageGallery 
                    images={recentImages} 
                    className="grid-cols-3"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">No images match the selected filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
  );
};

export default BuilderProjectView; 