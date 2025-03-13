import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

interface PhotoDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

const PhotoDropzone: React.FC<PhotoDropzoneProps> = ({
  onFilesSelected,
  disabled = false,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (filesArray.length > 0) {
        onFilesSelected(filesArray);
      }
    }
  }, [onFilesSelected, disabled]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
  };

  return (
    <div 
      className={`
        border-2 border-dashed rounded-lg p-8 
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'} 
        transition-colors duration-200 
        flex flex-col items-center justify-center
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-medium">Upload Project Photos</h3>
        <p className="mb-4 text-sm text-muted-foreground max-w-xs">
          Drag and drop your photos here, or click to browse your files
        </p>
        <div className="relative">
          <Button disabled={disabled}>
            <Upload className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileInputChange}
            accept="image/*"
            multiple
            disabled={disabled}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Supported formats: JPEG, PNG, GIF, WebP
        </p>
      </div>
    </div>
  );
};

export default PhotoDropzone; 