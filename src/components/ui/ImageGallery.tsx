import React, { useState } from "react";
import { ProjectImage } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, ChevronLeft, ChevronRight, X, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };
  
  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };
  
  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
        onDelete(imageId);
      }
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
              src={image.url}
              alt={image.caption || "Project image"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="space-y-1">
                <Badge 
                  className={`${categoryColors[image.category]} text-white border-none`}
                >
                  {image.category}
                </Badge>
                {image.caption && (
                  <p className="line-clamp-1 text-sm text-white">{image.caption}</p>
                )}
              </div>
            </div>
            
            {editable && onDelete && (
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
          <DialogContent className="max-w-4xl p-0 sm:p-0">
            <div className="relative h-[80vh] w-full">
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].caption || "Project image"}
                className="h-full w-full object-contain"
              />
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={closeLightbox}
              >
                <X size={18} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={goToPrevious}
              >
                <ChevronLeft size={24} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={goToNext}
              >
                <ChevronRight size={24} />
              </Button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge 
                      className={`${categoryColors[images[selectedImageIndex].category]} text-white border-none mb-2`}
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
                
                {editable && onDelete && (
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
