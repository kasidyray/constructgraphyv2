import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ImageGallery from "@/components/ui/ImageGallery";
import { Project, ProjectImage } from "@/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, ChevronDown, Heart, Download, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PhotoUploader from "./admin/PhotoUploader";
import LazyImage from "@/components/ui/LazyImage";
import { getUserProjectFavorites, addToFavorites, removeFromFavorites } from "@/services/favoriteService";
import { Badge } from "@/components/ui/badge";

interface ProjectOverviewProps {
  project: Project;
  isAdmin: boolean;
  projectImages: ProjectImage[];
  handleUploadButtonClick: () => void;
  setActiveTab: (tab: string) => void;
}

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  isAdmin, 
  projectImages, 
  handleUploadButtonClick, 
  setActiveTab 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isHomeowner = user?.role === "homeowner";
  
  // Get current month and year
  const currentDate = new Date();
  const currentMonthName = MONTHS[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear().toString();
  
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthName);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  // Generate years array (current year and 2 years ahead)
  const availableYears = useMemo(() => {
    const currentYearNum = currentDate.getFullYear();
    return [
      (currentYearNum - 1).toString(),
      currentYearNum.toString(),
      (currentYearNum + 1).toString()
    ];
  }, [currentDate]);

  // Get months that have images for the selected year
  const monthsForSelectedYear = useMemo(() => {
    if (selectedYear === "all" || !isHomeowner) return MONTHS;
    
    const monthsSet = new Set<string>();
    
    projectImages.forEach(image => {
      const date = new Date(image.createdAt);
      const year = date.getFullYear().toString();
      
      if (year === selectedYear) {
        const monthIndex = date.getMonth();
        monthsSet.add(MONTHS[monthIndex]);
      }
    });
    
    return Array.from(monthsSet).length > 0 
      ? Array.from(monthsSet).sort((a, b) => {
          return MONTHS.indexOf(a) - MONTHS.indexOf(b);
        }) 
      : MONTHS;
  }, [projectImages, selectedYear, isHomeowner]);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const currentYear = new Date().getFullYear();
    const imageYear = dateObj.getFullYear();
    
    // If current year, show as Month Day
    if (imageYear === currentYear) {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } 
    // If past years, show as Month Day Year
    else {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Extract unique years and months from project images
  const { years, months } = useMemo(() => {
    const yearsSet = new Set<string>();
    const monthsSet = new Set<string>();
    
    projectImages.forEach(image => {
      const date = new Date(image.createdAt);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString('default', { month: 'long' });
      
      yearsSet.add(year);
      monthsSet.add(month);
    });
    
    return {
      years: Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a)),
      months: Array.from(monthsSet).sort((a, b) => {
        const monthOrder = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
      })
    };
  }, [projectImages]);

  // Filter images based on selected year and month
  const filteredImages = useMemo(() => {
    if (isHomeowner) {
      // If showing only favorites, ignore year and month filters
      if (showOnlyFavorites) {
        return projectImages.filter(image => favorites.has(image.id));
      }
      
      let filtered = projectImages;
      
      // Filter by year
      if (selectedYear !== "all") {
        filtered = filtered.filter(image => {
          const date = new Date(image.createdAt);
          return date.getFullYear().toString() === selectedYear;
        });
      }
      
      // Filter by month
      if (selectedMonth !== "all") {
        filtered = filtered.filter(image => {
          const date = new Date(image.createdAt);
          return date.toLocaleString('default', { month: 'long' }).toUpperCase() === selectedMonth;
        });
      }
      
      return filtered;
    } else {
      return projectImages.filter(image => {
        const date = new Date(image.createdAt);
        const imageYear = date.getFullYear().toString();
        const imageMonth = date.toLocaleString('default', { month: 'long' });
        
        const yearMatch = yearFilter === "all" || imageYear === yearFilter;
        const monthMatch = monthFilter === "all" || imageMonth === monthFilter;
        
        return yearMatch && monthMatch;
      });
    }
  }, [projectImages, yearFilter, monthFilter, isHomeowner, selectedYear, selectedMonth, favorites, showOnlyFavorites]);

  // Get the most recent 3 images for display
  const recentImages = useMemo(() => {
    return [...filteredImages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [filteredImages]);

  // Load favorites from database on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      if (user && project && isHomeowner) {
        setIsLoadingFavorites(true);
        try {
          // Use the user ID from context directly
          console.log("Loading favorites for user:", user.id);
          
          const favoriteIds = await getUserProjectFavorites(user.id, project.id);
          setFavorites(new Set(favoriteIds));
        } catch (error) {
          console.error("Error loading favorites:", error);
          toast({
            title: "Error",
            description: "Failed to load favorites",
            variant: "destructive",
          });
        } finally {
          setIsLoadingFavorites(false);
        }
      }
    };

    loadFavorites();
  }, [user, project, isHomeowner]);

  const toggleFavorite = async (imageId: string) => {
    if (!user || !isHomeowner) {
      toast({
        title: "Error",
        description: "You must be logged in as a homeowner to favorite images",
        variant: "destructive",
      });
      return;
    }

    const image = projectImages.find(img => img.id === imageId);
    const isFavorited = favorites.has(imageId);
    
    // Optimistically update UI
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (isFavorited) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      return newFavorites;
    });

    try {
      let success;
      if (isFavorited) {
        success = await removeFromFavorites(user.id, imageId);
        if (success) {
          toast({
            title: "Removed from favorites",
            description: image?.caption ? `"${image.caption}" removed from favorites` : "Image removed from favorites",
            duration: 3000,
          });
        }
      } else {
        success = await addToFavorites(user.id, imageId, project.id);
        if (success) {
          toast({
            title: "Added to favorites",
            description: image?.caption ? `"${image.caption}" added to favorites` : "Image added to favorites",
            duration: 3000,
          });
        }
      }

      if (!success) {
        // Revert UI change if operation failed
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorited) {
            newFavorites.add(imageId);
          } else {
            newFavorites.delete(imageId);
          }
          return newFavorites;
        });
        toast({
          title: "Error",
          description: "Failed to update favorites",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
      
      // Revert UI change on error
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (isFavorited) {
          newFavorites.add(imageId);
        } else {
          newFavorites.delete(imageId);
        }
        return newFavorites;
      });
    }
  };

  // Find next and previous images for the preview navigation
  const getAdjacentImages = (currentImageId: string) => {
    const currentIndex = filteredImages.findIndex(img => img.id === currentImageId);
    
    const prevImage = currentIndex > 0 
      ? filteredImages[currentIndex - 1] 
      : filteredImages[filteredImages.length - 1];
      
    const nextImage = currentIndex < filteredImages.length - 1 
      ? filteredImages[currentIndex + 1] 
      : filteredImages[0];
      
    return { prevImage, nextImage };
  };

  // Homeowner view
  if (isHomeowner) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Project Photos</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant={showOnlyFavorites ? "default" : "outline"}
                  size="sm" 
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className="flex items-center gap-1 rounded-full"
                >
                  <Heart className={cn("h-4 w-4", showOnlyFavorites && "fill-current")} />
                  Favorites
                  {favorites.size > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                      {favorites.size}
                    </Badge>
                  )}
                </Button>
                
                {/* Year select */}
                <Select 
                  value={selectedYear} 
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    // Reset month when year changes
                    setSelectedMonth("all");
                  }}
                >
                  <SelectTrigger className="h-9 w-[100px] border-[#e2e8f0]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Month select */}
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-9 w-[130px] border-[#e2e8f0]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {monthsForSelectedYear.map(month => (
                      <SelectItem key={month} value={month}>
                        {month.charAt(0) + month.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Photo grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.length > 0 ? (
                filteredImages.map(image => (
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(image.id);
                          }}
                        >
                          <Heart className={cn("h-5 w-5", favorites.has(image.id) && "fill-red-500 text-red-500")} />
                        </Button>
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
                ))
              ) : (
                <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-muted-foreground">No images match the selected filters</p>
                </div>
              )}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-white/10 text-white"
                          onClick={() => toggleFavorite(previewImage.id)}
                        >
                          <Heart className={cn("h-5 w-5", favorites.has(previewImage.id) && "fill-red-500 text-red-500")} />
                        </Button>
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
                      {filteredImages.length > 1 && (
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
          </div>
        </div>
      </div>
    );
  }

  // Admin and Builder view (original view)
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-2 space-y-6">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Photos</h2>
              <Button variant="link" size="sm" onClick={() => setActiveTab("photos")}>
                <span className="flex items-center">
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="ml-1 h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
              </Button>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by:</span>
              </div>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="h-8 w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(yearFilter !== "all" || monthFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setYearFilter("all");
                    setMonthFilter("all");
                  }}
                  className="h-8 px-2 text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="mt-4">
              {recentImages.length > 0 ? (
                <ImageGallery 
                  images={recentImages} 
                  className="grid-cols-3"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-muted-foreground">No images match the selected filters</p>
                </div>
              )}
            </div>
            
            {isAdmin && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Upload New Photos</h3>
                <PhotoUploader 
                  projectId={project.id} 
                  onUploadComplete={() => {
                    // Refresh the project images
                    handleUploadButtonClick();
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Project Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1 capitalize">{project.status.replace("-", " ")}</dd>
              </div>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Homeowner</dt>
                <dd className="mt-1">{project.homeownerName}</dd>
              </div>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd className="mt-1">{project.address}</dd>
              </div>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created On</dt>
                <dd className="mt-1">{formatDate(project.createdAt)}</dd>
              </div>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="mt-1">{formatDate(project.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
