import React, { useState } from "react";
import { Project, ProjectImage } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageGallery from "@/components/ui/ImageGallery";
import PhotoUploader from "./PhotoUploader";
import ProjectPhotoFilters from "../shared/ProjectPhotoFilters";

interface AdminProjectMediaTabsProps {
  project: Project;
  projectImages: ProjectImage[];
  recentImages: ProjectImage[];
  yearFilter: string;
  setYearFilter: (value: string) => void;
  monthFilter: string;
  setMonthFilter: (value: string) => void;
  onUploadComplete: () => void;
}

const AdminProjectMediaTabs: React.FC<AdminProjectMediaTabsProps> = ({
  project,
  projectImages,
  recentImages,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  onUploadComplete,
}) => {
  const [activeTab, setActiveTab] = useState("upload");

  // Ensure recentImages is defined
  const imagesToDisplay = recentImages && recentImages.length > 0 ? recentImages : [];

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Project Media</h2>
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload Photos</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-0">
            <div className="mt-2">
              <PhotoUploader 
                projectId={project.id} 
                onUploadComplete={() => {
                  onUploadComplete();
                  // Switch to photos tab after upload
                  setActiveTab("photos");
                }} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="photos" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <ProjectPhotoFilters
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                monthFilter={monthFilter}
                setMonthFilter={setMonthFilter}
              />
            </div>
            
            <div className="mt-4">
              {imagesToDisplay.length > 0 ? (
                <ImageGallery 
                  images={imagesToDisplay} 
                  className="grid-cols-3"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-muted-foreground">No images match the selected filters</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminProjectMediaTabs; 