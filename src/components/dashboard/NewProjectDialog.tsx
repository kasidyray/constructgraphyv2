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
      // Create new project object without ID (let Supabase generate it)
      const newProjectData = {
        title,
        description,
        address,
        status: status as "planning" | "in-progress" | "completed" | "on-hold",
        homeownerId,
        homeownerName: selectedHomeowner.name,
        builderId: builderId === "none" ? undefined : builderId,
        thumbnail: thumbnail || undefined,
        progress: progress,
      };
      
      console.log('Submitting project data:', newProjectData);
      
      // Save to database
      const savedProject = await createProject(newProjectData);
      
      if (!savedProject) {
        throw new Error('Failed to create project');
      }
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      // Call onProjectCreated callback if provided
      if (onProjectCreated && savedProject) {
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

  const handleDialogClose = (open: boolean) => {
    // Only prevent closing by clicking outside when dialog is open
    // Allow closing when explicitly requested (e.g., by clicking the X button)
    if (!open) {
      // If dialog is being closed
      if (isSubmitting) {
        // Don't allow closing while submitting
        return;
      }
      
      if (onClose) {
        onClose();
      } else {
        onOpenChange(open);
      }
    } else {
      // If dialog is being opened, always allow
      onOpenChange(open);
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
                <Label htmlFor="homeowner" className="capitalize-text">Homeowner *</Label>
                <Select value={homeownerId} onValueChange={setHomeownerId} disabled={!!preSelectedHomeownerId || !!propHomeownerId}>
                  <SelectTrigger id="homeowner">
                    <SelectValue placeholder="Select homeowner" />
                  </SelectTrigger>
                  <SelectContent>
                    {homeowners.map((homeowner) => (
                      <SelectItem key={homeowner.id} value={homeowner.id} className="capitalize-text">
                        {homeowner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="builder" className="capitalize-text">Builder</Label>
                <Select value={builderId} onValueChange={setBuilderId}>
                  <SelectTrigger id="builder">
                    <SelectValue placeholder="Select builder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {builders.map((builder) => (
                      <SelectItem key={builder.id} value={builder.id} className="capitalize-text">
                        {builder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
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
                  <Label htmlFor="progress">Progress: {progress}%</Label>
                  <Slider
                    id="progress"
                    value={[progress]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setProgress(value[0])}
                    className="py-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    onOpenChange(false);
                  }
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog; 