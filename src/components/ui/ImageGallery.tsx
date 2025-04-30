import React, { useState, useEffect } from "react";
import { ProjectImage } from "@/types";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, X, Trash, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: ProjectImage[];
  className?: string;
  editable?: boolean;
  favorites?: Set<string>;
  onDelete?: (imageId: string) => void;
  onUpdate?: (imageId: string, updates?: Partial<ProjectImage>) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  className = "",
  editable = false,
  favorites = new Set(),
  onDelete,
  onUpdate
}) => {
  const { user } = useAuth();
  const isBuilder = user?.role === "builder";
  const isHomeowner = user?.role === "homeowner";
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
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

  const toggleFavorite = (imageId: string) => {
    if (onUpdate && (isHomeowner || isBuilder)) {
      onUpdate(imageId);
    }
  };

  const downloadImage = (url: string, caption: string) => {
    try {
      console.log('Downloading image from URL:', url);
      
      // For cross-origin images, we need to fetch them first
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          // Create a blob URL for the image
          const blobUrl = URL.createObjectURL(blob);
          
          // Create a link element
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = caption || 'project-image';
          
          // Append to body, click, and clean up
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Release the blob URL
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
          
          console.log('Image download initiated successfully');
        })
        .catch(error => {
          console.error('Error downloading image:', error);
          // Fallback to the original method if fetch fails
          const link = document.createElement('a');
          link.href = url;
          link.download = caption || 'project-image';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } catch (error) {
      console.error('Error in downloadImage function:', error);
      // Open the image in a new tab as a last resort
      window.open(url, '_blank');
    }
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-md border bg-muted"
            onClick={() => openLightbox(index)}
          >
            <img
              src={imageLoadErrors[image.id] ? placeholderImage : image.url}
              alt={image.caption || "Project image"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => handleImageError(image.id)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="flex justify-between items-center">
                <p className="text-sm text-white font-medium">{formatDate(image.createdAt)}</p>
                {(isHomeowner || isBuilder) && (
                  <div className="flex items-center bg-white/90 rounded-full p-1">
                    <button
                      className="p-1.5 rounded-full flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(image.id);
                      }}
                    >
                      <Heart 
                        className={cn(
                          "h-5 w-5", 
                          favorites.has(image.id) ? "fill-red-500 text-red-500" : "text-gray-700"
                        )} 
                      />
                    </button>
                    <div className="h-4 w-px bg-gray-300 mx-0.5"></div>
                    <button
                      className="p-1.5 rounded-full flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.url, image.caption || "project-image");
                      }}
                    >
                      <Download className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {editable && onDelete && !isBuilder && (
              <button
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(e, image.id)}
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

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
                  {(isHomeowner || isBuilder) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white/10 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(images[selectedImageIndex].id);
                      }}
                    >
                      <Heart 
                        className={cn(
                          "h-5 w-5 transition-colors", 
                          favorites.has(images[selectedImageIndex].id) ? "fill-red-500 text-red-500" : "text-white"
                        )} 
                      />
                    </Button>
                  )}
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
                  
                  {editable && onDelete && !isBuilder && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
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
