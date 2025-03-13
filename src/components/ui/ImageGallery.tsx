
import React, { useState } from "react";
import { ProjectImage } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: ProjectImage[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = "" }) => {
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const categoryColors = {
    "interior": "bg-blue-500",
    "exterior": "bg-green-500",
    "structural": "bg-amber-500",
    "finishes": "bg-purple-500",
    "other": "bg-gray-500",
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
              alt={image.caption}
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
                <p className="line-clamp-1 text-sm text-white">{image.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl p-0 sm:p-0">
            <div className="relative h-[80vh] w-full">
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].caption}
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
                    <h3 className="text-lg font-medium">{images[selectedImageIndex].caption}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Calendar size={14} />
                    <span>{formatDate(images[selectedImageIndex].createdAt)}</span>
                  </div>
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
