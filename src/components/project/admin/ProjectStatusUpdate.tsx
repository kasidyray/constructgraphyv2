import React, { useState } from "react";
import { Project, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateProject } from "@/services/projectService";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectStatusUpdateProps {
  project: Project;
  onProjectUpdate: (updatedProject: Project) => void;
}

const PROJECT_STATUSES = [
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In Progress" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" }
];

const ProjectStatusUpdate: React.FC<ProjectStatusUpdateProps> = ({ 
  project, 
  onProjectUpdate 
}) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>(project.status);
  const [progress, setProgress] = useState<number>(project.progress);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Only allow admins to update project status and progress
  const isAdmin = user?.role === "admin";
  
  const handleUpdate = async () => {
    if (!isAdmin) {
      toast.error("Only administrators can update project status and progress");
      return;
    }
    
    if (status === project.status && progress === project.progress) {
      toast.info("No changes to update");
      return;
    }
    
    setIsUpdating(true);
    try {
      // Convert AuthUser to User type if needed
      const userForUpdate = user ? {
        id: user.id,
        email: user.email,
        name: (user.first_name && user.last_name) 
              ? `${user.first_name} ${user.last_name}` 
              : user.first_name 
                ? user.first_name 
                : user.email,
        role: user.role,
        createdAt: user.created_at || new Date(),
        // Add other fields as needed, ensuring they exist on the AuthContext user type
      } as User : undefined;

      const updatedProject = await updateProject(
        project.id, 
        {
          status: status as "in-progress" | "completed" | "on-hold",
          progress
        }, 
        userForUpdate // Pass the correctly typed user object
      );
      
      if (updatedProject) {
        onProjectUpdate(updatedProject);
        toast.success("Project status updated successfully");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="rounded-lg border bg-card shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Update Project Status</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={status} 
            onValueChange={setStatus}
            disabled={!isAdmin}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            disabled={!isAdmin}
            className={!isAdmin ? "opacity-70" : ""}
          />
        </div>
        
        <Button 
          onClick={handleUpdate} 
          disabled={isUpdating || !isAdmin || (status === project.status && progress === project.progress)}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Project"}
        </Button>
        
        {!isAdmin && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            Only administrators can update project status and progress
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectStatusUpdate; 