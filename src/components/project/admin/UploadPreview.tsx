import React from "react";
import { Button } from "@/components/ui/button";
import { Trash, X, Upload, Check, Loader2 } from "lucide-react";

interface UploadPreviewProps {
  files: File[];
  previewUrls: string[];
  onRemoveFile: (index: number) => void;
  onPublish: () => void;
  onDiscard: () => void;
  isUploading?: boolean;
  className?: string;
}

const UploadPreview: React.FC<UploadPreviewProps> = ({
  files,
  previewUrls,
  onRemoveFile,
  onPublish,
  onDiscard,
  isUploading = false,
  className = "",
}) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Selected Photos ({files.length})</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDiscard}
            className="flex items-center gap-1"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
            Discard
          </Button>
          <Button 
            size="sm" 
            onClick={onPublish}
            className="flex items-center gap-1"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</>
            ) : (
              <><Check className="h-4 w-4" /> Publish</>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={() => onRemoveFile(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-xs text-white truncate">{files[index].name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPreview; 