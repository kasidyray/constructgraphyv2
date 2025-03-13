import React, { useState } from "react";
import { Project, ProjectImage } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ImageGallery from "@/components/ui/ImageGallery";
import PhotoUploader from "./PhotoUploader";

interface AdminProjectMediaTabsProps {
  project: Project;
  projectImages: ProjectImage[];
  recentImages: ProjectImage[];
  years: string[];
  months: string[];
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
  years,
  months,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  onUploadComplete,
}) => {
  const [activeTab, setActiveTab] = useState("upload");

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
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter by:</span>
                </div>
                
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="h-8 w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(yearFilter !== "all" || monthFilter !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setYearFilter("all");
                      setMonthFilter("all");
                    }}
                    className="h-8 px-2 text-xs"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminProjectMediaTabs; 