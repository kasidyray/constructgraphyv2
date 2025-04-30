import React, { useState, useMemo, useEffect } from "react";
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
import Breadcrumb from "@/components/ui/breadcrumb";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getUserProjectFavorites, addToFavorites, removeFromFavorites } from "@/services/favoriteService";

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

  // --- Favorite State --- 
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // --- Load Favorites Effect --- 
  useEffect(() => {
    const loadFavorites = async () => {
      if (user && project) {
        setIsLoadingFavorites(true);
        try {
          // Load favorites for the current user (builder) and project
          const favoriteIds = await getUserProjectFavorites(user.id, project.id);
          setFavorites(new Set(favoriteIds));
        } catch (error) {
          console.error("Error loading favorites:", error);
          toast.error("Failed to load favorites");
        } finally {
          setIsLoadingFavorites(false);
        }
      }
    };
    loadFavorites();
  }, [user, project]); // Rerun if user or project changes

  // --- Toggle Favorite Function --- 
  const toggleFavorite = async (imageId: string) => {
    if (!user) {
      toast.error("You must be logged in to favorite images");
      return;
    }

    const image = projectImages.find(img => img.id === imageId);
    const isFavorited = favorites.has(imageId);
    
    // Optimistic UI update
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (isFavorited) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      return newFavorites;
    });

    try {
      let success;
      if (isFavorited) {
        success = await removeFromFavorites(user.id, imageId);
        if (success) {
          toast.success(image?.caption 
            ? `"${image.caption}" removed from favorites` 
            : "Image removed from favorites"
          );
        }
      } else {
        success = await addToFavorites(user.id, imageId, project.id);
        if (success) {
          toast.success(image?.caption 
            ? `"${image.caption}" added to favorites` 
            : "Image added to favorites"
          );
        }
      }

      if (!success) {
        // Revert UI change if operation failed
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorited) {
            newFavorites.add(imageId);
          } else {
            newFavorites.delete(imageId);
          }
          return newFavorites;
        });
        toast.error("Failed to update favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
      
      // Revert UI change on error
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (isFavorited) {
          newFavorites.add(imageId);
        } else {
          newFavorites.delete(imageId);
        }
        return newFavorites;
      });
    }
  };

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
    let filtered = projectImages;
    
    // Filter by favorites if enabled
    if (showOnlyFavorites) {
      filtered = filtered.filter(image => favorites.has(image.id));
      // When showing only favorites, return them directly without applying date filters
      // But still sort by date (newest first)
      return [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    // Otherwise, apply year and month filters
    filtered = filtered.filter(image => {
      const imageDate = new Date(image.createdAt);
      const imageYear = imageDate.getFullYear().toString();
      const imageMonth = MONTHS[imageDate.getMonth()];
      
      const yearMatch = yearFilter === 'all' || imageYear === yearFilter;
      const monthMatch = monthFilter === 'all' || imageMonth === monthFilter;
      
      return yearMatch && monthMatch;
    });
    
    // Sort filtered images from newest to oldest
    return [...filtered].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [projectImages, yearFilter, monthFilter, favorites, showOnlyFavorites]);

  // --- Handle Image Action (for ImageGallery) ---
  const handleImageAction = (imageId: string, updates?: Partial<ProjectImage>) => {
     if (updates) {
        // Handle existing editable updates (caption etc.)
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
     } else {
        // If no updates, assume it's a favorite toggle click
         toggleFavorite(imageId);
     }
   };

  // Breadcrumb segments
  const breadcrumbSegments = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: project?.title || 'Project Details' }
  ];

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-6">
      <Breadcrumb segments={breadcrumbSegments} />
      <ProjectHeader 
        project={project} 
        isAdmin={false}
      />
      
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Project Photos</h2>
          <div className="w-full md:w-auto overflow-x-auto">
            <div className="flex flex-row items-center gap-2 min-w-max">
              <Button 
                variant={showOnlyFavorites ? "default" : "outline"}
                size="sm" 
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className="flex items-center gap-1 rounded-full whitespace-nowrap"
                disabled={isLoadingFavorites}
              >
                <Heart className={cn("h-4 w-4", showOnlyFavorites && "fill-current")} />
                Favorites
                {favorites.size > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                    {favorites.size}
                  </Badge>
                )}
              </Button>
              <div className="h-6 w-px bg-border mx-1" />
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
              favorites={favorites}
              onDelete={onImageDelete}
              onUpdate={handleImageAction}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">No photos found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {showOnlyFavorites
                ? "You haven't favorited any photos for this project."
                : "No photos match your current filters."}
            </p>
            {showOnlyFavorites && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowOnlyFavorites(false)}
              >
                Show all photos
              </Button>
            )}
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