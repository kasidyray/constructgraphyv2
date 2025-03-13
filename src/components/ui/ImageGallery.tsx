import React, { useState, useEffect } from "react";
import { ProjectImage } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, X, Trash, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
  const isBuilder = user?.role === "builder";
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  
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
      const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
      console.log('Navigating to previous image, index:', newIndex);
      setSelectedImageIndex(newIndex);
    }
  };
  
  const goToNext = () => {
    if (selectedImageIndex !== null) {
      const newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
      console.log('Navigating to next image, index:', newIndex);
      setSelectedImageIndex(newIndex);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="space-y-1">
                <Badge 
                  className={`${categoryColors[image.category as keyof typeof categoryColors] || "bg-gray-500"} text-white border-none`}
                >
                  {image.category}
                </Badge>
                {image.caption && (
                  <p className="line-clamp-1 text-sm text-white">{image.caption}</p>
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
              <div className="flex justify-between items-center p-4 text-white">
                <div className="text-sm">
                  {images[selectedImageIndex].caption && (
                    <h3 className="font-medium">{images[selectedImageIndex].caption}</h3>
                  )}
                  <p className="text-white/70">{formatDate(images[selectedImageIndex].createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10 text-white"
                    onClick={() => {
                      console.log('Opening image in new tab:', images[selectedImageIndex].url);
                      window.open(images[selectedImageIndex].url, '_blank');
                    }}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10 text-white"
                    onClick={closeLightbox}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 relative">
                <img
                  src={imageLoadErrors[images[selectedImageIndex].id] ? placeholderImage : images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].caption || "Project image"}
                  className="max-h-full max-w-full object-contain"
                  onError={() => handleImageError(images[selectedImageIndex].id)}
                />
                
                {/* Navigation buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 rounded-full bg-black/30 hover:bg-black/50 text-white"
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
                      className="absolute right-4 rounded-full bg-black/30 hover:bg-black/50 text-white"
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
              <div className="p-4 bg-black/70 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge 
                      className={`${categoryColors[images[selectedImageIndex].category as keyof typeof categoryColors] || "bg-gray-500"} text-white border-none mb-2`}
                    >
                      {images[selectedImageIndex].category}
                    </Badge>
                    {images[selectedImageIndex].caption && (
                      <h3 className="text-lg font-medium">{images[selectedImageIndex].caption}</h3>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Calendar size={14} />
                    <span>{formatDate(images[selectedImageIndex].createdAt)}</span>
                  </div>
                </div>
                
                {editable && onDelete && !isBuilder && (
                  <div className="mt-4 flex justify-end gap-2">
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
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ImageGallery;
