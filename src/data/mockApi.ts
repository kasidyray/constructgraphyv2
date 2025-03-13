import { v4 as uuidv4 } from 'uuid';
import { mockProjects, getProjectImages } from './mockData';
import { Project, ProjectImage } from '@/types';

// Mock delay to simulate API call
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock project images data
let projectImagesData: Record<string, ProjectImage[]> = {};

// Initialize project images data from mockData
export const initializeProjectImagesData = () => {
  mockProjects.forEach(project => {
    projectImagesData[project.id] = getProjectImages(project.id);
  });
};

// Call initialization
initializeProjectImagesData();

// Mock API for uploading project photos
export const uploadProjectPhotos = async (
  projectId: string, 
  files: File[]
): Promise<ProjectImage[]> => {
  // Simulate API delay
  await mockDelay(1500);
  
  // Validate project exists
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  
  // Create new project images
  const newImages: ProjectImage[] = files.map(file => {
    // In a real app, we would upload the file to a storage service
    // and get back a URL. Here we're creating a temporary object URL.
    const objectUrl = URL.createObjectURL(file);
    
    return {
      id: uuidv4(),
      projectId,
      url: objectUrl,
      caption: file.name.split('.')[0], // Use filename as caption
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "other", // Default category
    };
  });
  
  // Add new images to project images data
  projectImagesData[projectId] = [
    ...newImages,
    ...(projectImagesData[projectId] || []),
  ];
  
  return newImages;
};

// Mock API for getting project images
export const getProjectImagesApi = async (projectId: string): Promise<ProjectImage[]> => {
  // Simulate API delay
  await mockDelay(500);
  
  return projectImagesData[projectId] || [];
};

// Mock API for deleting a project image
export const deleteProjectImage = async (imageId: string): Promise<void> => {
  // Simulate API delay
  await mockDelay(500);
  
  // Find the project that contains this image
  let foundProjectId: string | null = null;
  
  for (const [projectId, images] of Object.entries(projectImagesData)) {
    if (images.some(img => img.id === imageId)) {
      foundProjectId = projectId;
      break;
    }
  }
  
  if (!foundProjectId) {
    throw new Error('Image not found');
  }
  
  // Remove the image from the project
  projectImagesData[foundProjectId] = projectImagesData[foundProjectId].filter(
    img => img.id !== imageId
  );
};

// Mock API for updating a project image
export const updateProjectImage = async (
  imageId: string, 
  updates: Partial<ProjectImage>
): Promise<ProjectImage> => {
  // Simulate API delay
  await mockDelay(500);
  
  // Find the image
  let foundImage: ProjectImage | null = null;
  let foundProjectId: string | null = null;
  
  for (const [projectId, images] of Object.entries(projectImagesData)) {
    const image = images.find(img => img.id === imageId);
    if (image) {
      foundImage = image;
      foundProjectId = projectId;
      break;
    }
  }
  
  if (!foundImage || !foundProjectId) {
    throw new Error('Image not found');
  }
  
  // Update the image
  const updatedImage = {
    ...foundImage,
    ...updates,
    updatedAt: new Date(),
  };
  
  // Replace the image in the project
  projectImagesData[foundProjectId] = projectImagesData[foundProjectId].map(
    img => img.id === imageId ? updatedImage : img
  );
  
  return updatedImage;
}; 