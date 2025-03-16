import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadProjectImages } from '@/services/projectService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { User } from '@/types';

interface ProjectImageUploadProps {
  projectId: string;
  onSuccess?: () => void;
}

const IMAGE_CATEGORIES = [
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'structural', label: 'Structural' },
  { value: 'finishes', label: 'Finishes' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other' }
];

const ProjectImageUpload: React.FC<ProjectImageUploadProps> = ({ projectId, onSuccess }) => {
  const { user } = useAuth();
  const [images, setImages] = useState<{ file: File; caption: string; category: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        caption: '',
        category: 'general'
      }));
      setImages(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCaptionChange = (index: number, caption: string) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, caption } : img));
  };
  
  const handleCategoryChange = (index: number, category: string) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, category } : img));
  };
  
  const handleUpload = async () => {
    if (!user) {
      toast.error('You must be logged in to upload images');
      return;
    }
    
    if (images.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }
    
    setUploading(true);
    
    try {
      // Upload files to storage
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const filename = `${Date.now()}-${img.file.name}`;
          const path = `project-images/${projectId}/${filename}`;
          
          const { data, error } = await supabase.storage
            .from('images')
            .upload(path, img.file);
          
          if (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(path);
          
          return {
            url: publicUrl,
            caption: img.caption,
            category: img.category
          };
        })
      );
      
      // Convert auth user to the expected User type
      const userForUpload: User = {
        id: user.id,
        email: user.email || '',
        name: user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.email || '',
        role: user.role || 'admin',
        createdAt: new Date().toISOString()
      };
      
      // Save images to database and notify homeowner
      await uploadProjectImages(projectId, uploadedImages, userForUpload);
      
      toast.success(`Successfully uploaded ${images.length} images`);
      setImages([]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      logger.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Project Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label 
              htmlFor="image-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
              </div>
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploading}
              />
            </Label>
          </div>
          
          {images.length > 0 && (
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Selected Images ({images.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {img.file.name}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveImage(index)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`caption-${index}`}>Caption</Label>
                      <Textarea 
                        id={`caption-${index}`}
                        placeholder="Enter a caption for this image"
                        value={img.caption}
                        onChange={(e) => handleCaptionChange(index, e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`category-${index}`}>Category</Label>
                      <Select 
                        value={img.category} 
                        onValueChange={(value) => handleCategoryChange(index, value)}
                        disabled={uploading}
                      >
                        <SelectTrigger id={`category-${index}`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {IMAGE_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={images.length === 0 || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : `Upload ${images.length} Images`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectImageUpload; 