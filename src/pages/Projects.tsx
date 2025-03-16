import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Project } from "@/types";
import { getProjects, getHomeownerProjects, getBuilderProjects } from "@/services/projectService";
import { getUserById } from "@/services/userService";
import NewProjectDialog from "@/components/dashboard/NewProjectDialog";
import { toast } from "sonner";
import ProjectList from "@/components/dashboard/ProjectList";
import ProjectsSkeleton from "@/components/ui/ProjectsSkeleton";

const Projects: React.FC = () => {
  const { user } = useAuth();
  const { homeownerId, builderId: urlBuilderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get builderId from query params if it exists
  const queryParams = new URLSearchParams(location.search);
  const queryBuilderId = queryParams.get('builderId');
  
  // Use builderId from URL params or query params
  const effectiveBuilderId = urlBuilderId || queryBuilderId;
  
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      let fetchedProjects: Project[] = [];
      
      // Get projects based on user role, homeowner filter, or builder filter
      if (urlBuilderId) {
        // Use the dedicated function to get builder projects
        fetchedProjects = await getBuilderProjects(urlBuilderId);
        
        // Get builder name
        const builder = await getUserById(urlBuilderId);
        if (builder) {
          setDisplayName(builder.name);
        }
      } else if (homeownerId) {
        // Get homeowner projects
        fetchedProjects = await getHomeownerProjects(homeownerId);
        
        // If we have a builder ID from query params and the user is a builder,
        // filter projects to only show those associated with this builder
        if (queryBuilderId && user?.role === "builder") {
          fetchedProjects = fetchedProjects.filter(
            project => project.builderId === queryBuilderId
          );
        }
        
        // Get homeowner name
        const homeowner = await getUserById(homeownerId);
        if (homeowner) {
          setDisplayName(homeowner.name);
        }
      } else if (user?.role === "homeowner") {
        // Homeowner sees only their own projects
        fetchedProjects = await getHomeownerProjects(user.id);
        setDisplayName(user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.email || '');
      } else if (user?.role === "builder") {
        // Builder sees only their assigned projects
        fetchedProjects = await getBuilderProjects(user.id);
        setDisplayName(user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.email || '');
      } else {
        // Admin sees all projects
        fetchedProjects = await getProjects();
      }
      
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, [user, homeownerId, urlBuilderId, queryBuilderId]);
  
  const firstName = displayName ? displayName.split(' ')[0] : '';
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleProjectCreated = (newProject: Project) => {
    // Add the new project to the list
    setProjects(prev => [newProject, ...prev]);
    
    // Refresh all data to ensure consistency
    fetchProjects();
    
    toast.success("Project created successfully");
    
    // Close the dialog
    setShowNewProjectDialog(false);
  };

  // Determine page title
  let pageTitle = "Projects";
  if (homeownerId && firstName) {
    pageTitle = `${firstName}'s Projects`;
  } else if (effectiveBuilderId && firstName) {
    pageTitle = `${firstName}'s Projects`;
  }

  // Show skeleton loading while projects are loading
  if (loading) {
    return (
      <AuthLayout>
        <ProjectsSkeleton />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
              {user && (
                <p className="text-muted-foreground">
                  {homeownerId || urlBuilderId 
                    ? `Viewing projects for ${displayName}`
                    : `Viewing all projects`}
                </p>
              )}
            </div>
          </div>
          
          {/* Only show the New Project button for admins */}
          {user?.role === "admin" && !loading && (
            <Button onClick={() => setShowNewProjectDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          )}
        </div>
        
        <ProjectList 
          projects={projects} 
          isAdmin={user?.role === "admin"} 
          onAddProject={() => setShowNewProjectDialog(true)} 
        />
      </div>

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onProjectCreated={handleProjectCreated}
        homeownerId={homeownerId}
      />
    </AuthLayout>
  );
};

export default Projects;
