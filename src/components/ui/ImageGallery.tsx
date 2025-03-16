import React, { useState, useEffect } from "react";
import { ProjectImage } from "@/types";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, X, Trash, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import PhotoGallery from "@/components/project/shared/PhotoGallery";

interface ImageGalleryProps {
  images: ProjectImage[];
  className?: string;
  editable?: boolean;
  onDelete?: (imageId: string) => void;
  onUpdate?: (imageId: string, updates: Partial<ProjectImage>) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  className = "",
  editable = false,
  onDelete,
  onUpdate
}) => {
  const { user } = useAuth();
  const isHomeowner = user?.role === "homeowner";
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Log images when they change
  useEffect(() => {
    console.log('ImageGallery received images:', images.length);
    if (images.length > 0) {
      console.log('First image URL:', images[0].url);
    }
  }, [images]);
  
  const openLightbox = (index: number) => {
    console.log('Opening lightbox for image index:', index);
    setSelectedImageIndex(index);
  };
  
  const closeLightbox = () => {
    console.log('Closing lightbox');
    setSelectedImageIndex(null);
  };
  
  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setIsTransitioning(true);
      const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
      console.log('Navigating to previous image, index:', newIndex);
      setTimeout(() => {
        setSelectedImageIndex(newIndex);
        setIsTransitioning(false);
      }, 200);
    }
  };
  
  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setIsTransitioning(true);
      const newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
      console.log('Navigating to next image, index:', newIndex);
      setTimeout(() => {
        setSelectedImageIndex(newIndex);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    const currentYear = new Date().getFullYear();
    const imageYear = dateObj.getFullYear();
    
    // If current year, show as Month Day
    if (imageYear === currentYear) {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } 
    // If past years, show as Month Day Year
    else {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const handleDelete = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation(); // Prevent opening the lightbox
    if (onDelete) {
      if (window.confirm("Are you sure you want to delete this image?")) {
        console.log('Deleting image:', imageId);
        onDelete(imageId);
      }
    }
  };

  const handleImageError = (imageId: string) => {
    console.error('Image failed to load:', imageId);
    setImageLoadErrors(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const handleToggleFavorite = (imageId: string) => {
    if (onUpdate && isHomeowner) {
      // Call the onUpdate function which will be handled by the parent component
      onUpdate(imageId, {});
    }
  };

  const downloadImage = (url: string, caption: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = caption || 'project-image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categoryColors = {
    "interior": "bg-blue-500",
    "exterior": "bg-green-500",
    "structural": "bg-amber-500",
    "finishes": "bg-purple-500",
    "other": "bg-gray-500",
    "general": "bg-gray-500",
  };
  
  if (images.length === 0) {
    return (
      <div className={`flex h-64 items-center justify-center rounded-md border border-dashed ${className}`}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  // Use a local placeholder image instead of via.placeholder.com
  const placeholderImage = "/placeholder-image.jpg";

  return (
    <div className={className}>
      <PhotoGallery 
        images={images}
        onToggleFavorite={isHomeowner ? handleToggleFavorite : undefined}
        favorites={favorites}
        columns={4}
      />

      {selectedImageIndex !== null && (
        <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 sm:p-0 border-none bg-black/95">
            <div className="relative h-full w-full flex flex-col">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 text-white bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${categoryColors[images[selectedImageIndex].category as keyof typeof categoryColors] || "bg-gray-500"} text-white border-none`}
                  >
                    {images[selectedImageIndex].category}
                  </Badge>
                  <span className="text-sm text-white/80">
                    {selectedImageIndex + 1} / {images.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(images[selectedImageIndex].id);
                    }}
                  >
                    <Heart 
                      className={cn(
                        "h-5 w-5 transition-colors", 
                        favorites.has(images[selectedImageIndex].id) ? "fill-red-500 text-red-500" : "text-white"
                      )} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(images[selectedImageIndex].url, images[selectedImageIndex].caption);
                    }}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white/10 text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </DialogClose>
                </div>
              </div>
              
              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 relative">
                <img
                  src={imageLoadErrors[images[selectedImageIndex].id] ? placeholderImage : images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].caption || "Project image"}
                  className={cn(
                    "max-h-[85vh] max-w-[85vw] object-contain",
                    isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100",
                    "transition-all duration-300 ease-in-out"
                  )}
                  onError={() => handleImageError(images[selectedImageIndex].id)}
                />
                
                {/* Navigation buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 rounded-full bg-white/10 hover:bg-white/20 text-white h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 rounded-full bg-white/10 hover:bg-white/20 text-white h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <div className="flex items-start justify-between">
                  <div>
                    {images[selectedImageIndex].caption && (
                      <h3 className="text-lg font-medium">{images[selectedImageIndex].caption}</h3>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-300 mt-1">
                      <Calendar size={14} />
                      <span>{formatDate(images[selectedImageIndex].createdAt)}</span>
                    </div>
                  </div>
                  
                  {editable && onDelete && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        if (onDelete && window.confirm("Are you sure you want to delete this image?")) {
                          onDelete(images[selectedImageIndex].id);
                          closeLightbox();
                        }
                      }}
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ImageGallery;
