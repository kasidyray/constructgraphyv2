import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import PhotoDropzone from "./PhotoDropzone";
import UploadPreview from "./UploadPreview";
import { uploadProjectImages } from "@/services/imageService";

interface PhotoUploaderProps {
  projectId: string;
  onUploadComplete?: () => void;
  className?: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  projectId,
  onUploadComplete,
  className = "",
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    // Filter out non-image files
    const imageFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length !== selectedFiles.length) {
      toast.warning("Some files were skipped because they are not images");
    }
    
    // Create preview URLs for the images
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prevFiles => [...prevFiles, ...imageFiles]);
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  }, [previewUrls]);

  const handleDiscard = useCallback(() => {
    // Revoke all object URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
  }, [previewUrls]);

  const handlePublish = useCallback(async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Use the real API service to upload photos
      await uploadProjectImages(projectId, files);
      
      toast.success(`${files.length} photos uploaded successfully`);
      
      // Clean up
      handleDiscard();
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [files, projectId, handleDiscard, onUploadComplete]);

  return (
    <div className={`space-y-6 ${className}`}>
      <PhotoDropzone 
        onFilesSelected={handleFilesSelected} 
        disabled={isUploading}
      />
      
      <UploadPreview 
        files={files}
        previewUrls={previewUrls}
        onRemoveFile={handleRemoveFile}
        onPublish={handlePublish}
        onDiscard={handleDiscard}
        isUploading={isUploading}
      />
    </div>
  );
};

export default PhotoUploader; 