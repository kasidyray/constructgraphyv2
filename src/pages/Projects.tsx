import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import ProjectCard from "@/components/ui/ProjectCard";
import { Project } from "@/types";
import { getProjects, getHomeownerProjects, getBuilderProjects } from "@/services/projectService";
import { getUserById } from "@/services/userService";
import NewProjectDialog from "@/components/dashboard/NewProjectDialog";
import { toast } from "sonner";

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
        fetchedProjects = await getHomeownerProjects(user.id);
      } else if (user?.role === "builder") {
        // Use the dedicated function to get builder projects
        fetchedProjects = await getBuilderProjects(user.id);
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
  
  // Sort projects by updated date
  const filteredProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleBack = () => {
    navigate(-1);
  };

  const handleProjectCreated = (newProject: Project) => {
    // Add the new project to the list
    setProjects(prev => [newProject, ...prev]);
    
    // Refresh all data to ensure consistency
    fetchProjects();
    
    toast.success("Project created successfully");
  };

  // Determine if the current user is an admin viewing a homeowner's projects
  const isAdminViewingHomeowner = user?.role === "admin" && homeownerId;

  // Determine page title
  let pageTitle = "Projects";
  if (homeownerId && firstName) {
    pageTitle = `${firstName}'s Projects`;
  } else if (effectiveBuilderId && firstName) {
    pageTitle = `${firstName}'s Projects`;
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <div className="ml-auto flex gap-2">
            {(user?.role === "admin" || (user?.role === "builder" && !homeownerId && !effectiveBuilderId)) && (
              <Button onClick={() => setShowNewProjectDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {user?.role === "homeowner" 
                ? "You don't have any projects yet. Your builder will create one for you."
                : "No projects have been created yet."}
            </p>
            {(user?.role === "admin" || user?.role === "builder") && !homeownerId && !effectiveBuilderId && (
              <Button onClick={() => setShowNewProjectDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isAdmin={user?.role === "admin"} 
                isBuilder={user?.role === "builder"}
              />
            ))}
          </div>
        )}
      </div>

      {showNewProjectDialog && (
        <NewProjectDialog
          open={showNewProjectDialog}
          onOpenChange={(open) => setShowNewProjectDialog(open)}
          onClose={() => setShowNewProjectDialog(false)}
          onProjectCreated={handleProjectCreated}
          homeownerId={homeownerId}
        />
      )}
    </AuthLayout>
  );
};

export default Projects;
