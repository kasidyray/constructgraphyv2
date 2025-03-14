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
    }
    
    // Then apply year and month filters
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
    <div className="container mx-auto px-4 py-6">
      <ProjectHeader 
        project={project} 
        isAdmin={false}
      />
      
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Project Photos</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              variant={showOnlyFavorites ? "default" : "outline"}
              size="sm" 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className="flex items-center gap-1 rounded-full"
              disabled={isLoadingFavorites}
            >
              <Star className="h-4 w-4" />
              Favorites
            </Button>
            
            <ProjectPhotoFilters
              yearFilter={yearFilter}
              setYearFilter={setYearFilter}
              monthFilter={monthFilter}
              setMonthFilter={setMonthFilter}
            />
          </div>
        </div>
        
        {filteredImages.length > 0 ? (
          <div className="relative">
            <ImageGallery 
              images={filteredImages} 
              editable={false}
              onUpdate={(imageId) => handleImageAction(imageId)}
            />
            {/* Add favorite buttons as an overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full">
                {filteredImages.map((image) => (
                  <div key={image.id} className="relative">
                    <div className="absolute top-2 right-2 pointer-events-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image.id);
                        }}
                        disabled={isLoadingFavorites}
                      >
                        <Heart className={cn("h-5 w-5", favorites.has(image.id) && "fill-red-500 text-red-500")} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              {showOnlyFavorites 
                ? "You haven't favorited any photos yet" 
                : "No photos found for the selected filters"}
            </p>
            {showOnlyFavorites && (
              <Button 
                variant="outline" 
                onClick={() => setShowOnlyFavorites(false)}
              >
                View All Photos
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeownerProjectView; 