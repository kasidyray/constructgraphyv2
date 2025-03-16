import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/StatCards";
import HomeownerTable from "@/components/dashboard/HomeownerTable";
import { User, Project } from "@/types";
import { getBuilderProjects } from "@/services/projectService";
import { getUsers } from "@/services/userService";
import NewProjectDialog from "@/components/dashboard/NewProjectDialog";
import { toast } from "sonner";

interface BuilderDashboardProps {
  user: User;
}

const BuilderDashboard: React.FC<BuilderDashboardProps> = ({
  user
}) => {
  const [selectedHomeowner, setSelectedHomeowner] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [homeowners, setHomeowners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects assigned to this builder using the dedicated function
      const builderProjects = await getBuilderProjects(user.id);
      setProjects(builderProjects);
      
      // Fetch homeowners
      const users = await getUsers();
      
      // Filter homeowners to only include those with projects related to this builder
      // First, get all homeowner IDs from the builder's projects
      const homeownerIdsWithProjects = new Set(
        builderProjects.map(project => project.homeownerId)
      );
      
      // Then filter the homeowners to only include those with projects
      const homeownerUsers = users.filter(
        user => user.role === "homeowner" && homeownerIdsWithProjects.has(user.id)
      );
      
      setHomeowners(homeownerUsers);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleHomeownerSelect = (homeowner: User) => {
    setSelectedHomeowner(homeowner);
    // Navigate to projects page with homeowner filter and builder filter
    // This ensures only projects associated with this builder are shown
    navigate(`/homeowner/${homeowner.id}/projects?builderId=${user.id}`);
  };

  const handleProjectCreated = (newProject: Project) => {
    // Add the new project to the list
    setProjects(prev => [newProject, ...prev]);
    
    toast.success("Project created successfully");
    
    // Refresh all data to ensure consistency
    fetchData();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
        <div className="rounded-lg border border-destructive p-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {
              user.first_name 
                ? user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)
                : user.name 
                  ? user.name.split(' ')[0].charAt(0).toUpperCase() + user.name.split(' ')[0].slice(1)
                  : 'Builder'
            }!
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/projects">
              View All Projects
            </Link>
          </Button>
        </div>
      </div>

      <StatCards projects={projects} />
      
      <div className="mt-6">
        <HomeownerTable 
          homeowners={homeowners} 
          onHomeownerSelect={handleHomeownerSelect} 
        />
      </div>

      {/* New Project Dialog */}
      <NewProjectDialog 
        open={showNewProjectDialog} 
        onOpenChange={setShowNewProjectDialog}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default BuilderDashboard;
