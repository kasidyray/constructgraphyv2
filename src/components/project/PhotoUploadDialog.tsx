
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, ImageIcon } from "lucide-react";

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  uploading: boolean;
  handleUpload: () => Promise<void>;
}

const PhotoUploadDialog: React.FC<PhotoUploadDialogProps> = ({
  open,
  onOpenChange,
  selectedFiles,
  setSelectedFiles,
  uploading,
  handleUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleRemoveFile = (index: number) => {
    // Create a new array without the file at the specified index
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Project Photos</DialogTitle>
          <DialogDescription>
            Add new photos to document the project's progress
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary/50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">Drag and drop files here or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG or GIF, up to 10MB each
          </p>
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*" 
            onChange={handleFileSelect}
          />
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
            <div className="max-h-[200px] overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="mb-2 flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center">
                    <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={selectedFiles.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;
