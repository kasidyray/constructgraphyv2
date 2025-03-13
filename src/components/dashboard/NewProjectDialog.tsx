import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Project, User } from "@/types";
import { createProject } from "@/services/projectService";
import { getUsers, getUserById } from "@/services/userService";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedHomeownerId?: string;
  homeownerId?: string;
  onClose?: () => void;
  onProjectCreated?: (project: Project) => void;
}

const PROJECT_STATUSES = [
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In Progress" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" }
];

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ 
  open, 
  onOpenChange,
  preSelectedHomeownerId,
  homeownerId: propHomeownerId,
  onClose,
  onProjectCreated
}) => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<string>("planning");
  const [homeownerId, setHomeownerId] = useState<string>(propHomeownerId || preSelectedHomeownerId || "");
  const [builderId, setBuilderId] = useState<string>("none");
  const [progress, setProgress] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for users from database
  const [homeowners, setHomeowners] = useState<User[]>([]);
  const [builders, setBuilders] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const users = await getUsers();
        
        // Filter users by role
        setHomeowners(users.filter(user => user.role === "homeowner"));
        setBuilders(users.filter(user => user.role === "builder"));
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Update homeownerId when preSelectedHomeownerId changes
  useEffect(() => {
    if (propHomeownerId) {
      setHomeownerId(propHomeownerId);
    } else if (preSelectedHomeownerId) {
      setHomeownerId(preSelectedHomeownerId);
    }
  }, [preSelectedHomeownerId, propHomeownerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !address || !homeownerId) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Find the selected homeowner to get their name
    const selectedHomeowner = homeowners.find(h => h.id === homeownerId);
    if (!selectedHomeowner) {
      toast({
        title: "Error",
        description: "Selected homeowner not found",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new project
      const newProject: Project = {
        id: uuidv4(),
        title,
        description,
        address,
        status: status as "planning" | "in-progress" | "completed" | "on-hold",
        homeownerId,
        homeownerName: selectedHomeowner.name,
        builderId: builderId === "none" ? undefined : builderId,
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnail: thumbnail || undefined,
        progress: progress,
      };
      
      // Save to database
      const savedProject = await createProject(newProject);
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      // Call onProjectCreated callback if provided
      if (onProjectCreated) {
        onProjectCreated(savedProject);
      }
      
      // Reset form and close dialog
      resetForm();
      
      if (onClose) {
        onClose();
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAddress("");
    setStatus("planning");
    if (!preSelectedHomeownerId && !propHomeownerId) {
      setHomeownerId("");
    }
    setBuilderId("none");
    setProgress(0);
    setThumbnail("");
  };

  const handleDialogClose = () => {
    if (onClose) {
      onClose();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new construction project to the system.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Modern Lakefront Home"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="A contemporary 3-bedroom lakefront property with panoramic views."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="123 Lake Dr, Laketown, CA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="homeowner">Homeowner *</Label>
                <Select 
                  value={homeownerId} 
                  onValueChange={setHomeownerId}
                  disabled={!!propHomeownerId || !!preSelectedHomeownerId}
                >
                  <SelectTrigger id="homeowner">
                    <SelectValue placeholder="Select homeowner" />
                  </SelectTrigger>
                  <SelectContent>
                    {homeowners.length > 0 ? (
                      homeowners.map((homeowner) => (
                        <SelectItem key={homeowner.id} value={homeowner.id}>
                          {homeowner.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-homeowners" disabled>
                        No homeowners found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="builder">Builder (Optional)</Label>
                <Select value={builderId} onValueChange={setBuilderId}>
                  <SelectTrigger id="builder">
                    <SelectValue placeholder="Select builder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No builder</SelectItem>
                    {builders.length > 0 ? (
                      builders.map((builder) => (
                        <SelectItem key={builder.id} value={builder.id}>
                          {builder.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-builders" disabled>
                        No builders found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="progress">Progress ({progress}%)</Label>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Slider
                id="progress"
                min={0}
                max={100}
                step={5}
                value={[progress]}
                onValueChange={(values) => setProgress(values[0])}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" className="mr-2" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog; 