import React, { useState, useEffect, useMemo } from "react";
import { Project, ProjectImage } from "@/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectPhotoFilters from "@/components/project/shared/ProjectPhotoFilters";
import ImageGallery from "@/components/ui/ImageGallery";
import { toast } from "sonner";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProjectFavorites, addToFavorites, removeFromFavorites } from "@/services/favoriteService";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

interface HomeownerProjectViewProps {
  project: Project;
  projectImages: ProjectImage[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const HomeownerProjectView: React.FC<HomeownerProjectViewProps> = ({
  project,
  projectImages,
}) => {
  const { user } = useAuth();
  
  // Get current year and month for default filters
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = MONTHS[currentDate.getMonth()];

  // State for filters
  const [yearFilter, setYearFilter] = useState<string>(currentYear);
  const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // Load favorites from database on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      if (user && project) {
        setIsLoadingFavorites(true);
        try {
          // Use the user ID from context directly
          console.log("Loading favorites for user:", user.id);
          
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
  }, [user, project]);

  // Toggle favorite status for an image
  const toggleFavorite = async (imageId: string) => {
    if (!user) {
      toast.error("You must be logged in to favorite images");
      return;
    }

    const image = projectImages.find(img => img.id === imageId);
    const isFavorited = favorites.has(imageId);
    
    // Optimistically update UI
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

  // Filter images based on selected year and month and favorites
  const filteredImages = useMemo(() => {
    let filtered = projectImages;
    
    // If showing only favorites, filter by favorites first
    if (showOnlyFavorites) {
      filtered = filtered.filter(image => favorites.has(image.id));
      // When showing only favorites, return them directly without applying date filters
      return filtered;
    }
    
    // Otherwise, apply year and month filters to all images
    return filtered.filter(image => {
      const imageDate = new Date(image.createdAt);
      const imageYear = imageDate.getFullYear().toString();
      const imageMonth = MONTHS[imageDate.getMonth()];
      
      const yearMatch = yearFilter === 'All' || imageYear === yearFilter;
      const monthMatch = monthFilter === 'All' || imageMonth === monthFilter;
      
      return yearMatch && monthMatch;
    });
  }, [projectImages, yearFilter, monthFilter, favorites, showOnlyFavorites]);

  // Custom image renderer to add favorite functionality
  const handleImageAction = (imageId: string) => {
    toggleFavorite(imageId);
  };

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-6">
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
              editable={false}
              favorites={favorites}
              onUpdate={(imageId) => handleImageAction(imageId)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Heart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No photos found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {showOnlyFavorites 
                ? "You haven't favorited any photos yet."
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
    </div>
  );
};

export default HomeownerProjectView; 