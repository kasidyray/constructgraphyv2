import React, { useState } from "react";
import { ProjectImage } from "@/types";
import { Button } from "@/components/ui/button";
import { Heart, Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import LazyImage from "@/components/ui/LazyImage";

interface PhotoGalleryProps {
  images: ProjectImage[];
  onToggleFavorite?: (imageId: string) => void;
  favorites?: Set<string>;
  className?: string;
  columns?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  onToggleFavorite,
  favorites = new Set(),
  className = "",
  columns = 4,
}) => {
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Find next and previous images for the preview navigation
  const getAdjacentImages = (currentImageId: string) => {
    const currentIndex = images.findIndex(img => img.id === currentImageId);
    
    const prevImage = currentIndex > 0 
      ? images[currentIndex - 1] 
      : images[images.length - 1];
      
    const nextImage = currentIndex < images.length - 1 
      ? images[currentIndex + 1] 
      : images[0];
      
    return { prevImage, nextImage };
  };

  if (images.length === 0) {
    return (
      <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No images to display</p>
      </div>
    );
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2 md:grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <>
      <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4 ${className}`}>
        {images.map(image => (
          <div 
            key={image.id} 
            className="relative group aspect-square rounded-md overflow-hidden border cursor-pointer"
            onClick={() => {
              setPreviewImage(image);
              setPreviewOpen(true);
            }}
          >
            <LazyImage
              src={image.url}
              alt={image.caption}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(image.id);
                    }}
                  >
                    <Heart className={cn("h-5 w-5", favorites.has(image.id) && "fill-red-500 text-red-500")} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(image.url, '_blank');
                  }}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {favorites.has(image.id) && (
              <div className="absolute top-2 right-2">
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-xs text-white">{formatDate(image.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-6xl p-0 h-[80vh] bg-black/95 border-none">
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 text-white">
                <div className="text-sm">
                  {previewImage.caption && (
                    <h3 className="font-medium">{previewImage.caption}</h3>
                  )}
                  <p className="text-white/70">{formatDate(previewImage.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {onToggleFavorite && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white/10 text-white"
                      onClick={() => onToggleFavorite(previewImage.id)}
                    >
                      <Heart className={cn("h-5 w-5", favorites.has(previewImage.id) && "fill-red-500 text-red-500")} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10 text-white"
                    onClick={() => window.open(previewImage.url, '_blank')}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10 text-white"
                    onClick={() => setPreviewOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 relative">
                <LazyImage
                  src={previewImage.url}
                  alt={previewImage.caption}
                  className="max-h-full max-w-full object-contain"
                />
                
                {/* Navigation buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 rounded-full bg-black/30 hover:bg-black/50 text-white"
                      onClick={() => {
                        const { prevImage } = getAdjacentImages(previewImage.id);
                        setPreviewImage(prevImage);
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 rounded-full bg-black/30 hover:bg-black/50 text-white"
                      onClick={() => {
                        const { nextImage } = getAdjacentImages(previewImage.id);
                        setPreviewImage(nextImage);
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PhotoGallery; 