import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import ProjectCard from "@/components/ui/ProjectCard";
import { getHomeownerProjects, getBuilderProjects, mockProjects, mockUsers } from "@/data/mockData";
import NewProjectDialog from "@/components/dashboard/NewProjectDialog";

const Projects: React.FC = () => {
  const { user } = useAuth();
  const { homeownerId, builderId } = useParams();
  const navigate = useNavigate();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  
  // Get projects based on user role, homeowner filter, or builder filter
  const rawProjects = builderId
    ? getBuilderProjects(builderId)
    : homeownerId 
      ? getHomeownerProjects(homeownerId)
      : user?.role === "homeowner" 
        ? getHomeownerProjects(user.id)
        : user?.role === "builder"
          ? getBuilderProjects(user.id)
          : mockProjects;
  
  // Get homeowner or builder name if viewing specific projects
  const homeowner = homeownerId ? mockUsers.find(u => u.id === homeownerId) : null;
  const builder = builderId ? mockUsers.find(u => u.id === builderId) : null;
  
  const displayName = homeowner?.name || builder?.name || '';
  const firstName = displayName ? displayName.split(' ')[0] : '';
  
  // Sort projects by updated date
  const filteredProjects = rawProjects
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const handleBack = () => {
    navigate(-1);
  };

  // Determine if the current user is an admin viewing a homeowner's projects
  const isAdminViewingHomeowner = user?.role === "admin" && homeownerId;

  let pageTitle = "All Projects";
  if (homeownerId) {
    pageTitle = `${firstName}'s Projects`;
  } else if (builderId) {
    pageTitle = `${firstName}'s Builder Projects`;
  }

  return (
    <AuthLayout>
      <div className="container py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
              <p className="text-muted-foreground">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Show New Project button only for admins */}
            {(user?.role === "admin") && (
              <Button onClick={() => setShowNewProjectDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            )}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search projects..."
                className="h-9 w-[150px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px]"
              />
            </div>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {homeownerId
                ? "This homeowner doesn't have any projects yet."
                : builderId
                ? "This builder doesn't have any projects yet."
                : "There are no projects to display."}
            </p>
            {user?.role === "admin" && (
              <Button onClick={() => setShowNewProjectDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* New Project Dialog */}
      <NewProjectDialog 
        open={showNewProjectDialog} 
        onOpenChange={setShowNewProjectDialog}
        preSelectedHomeownerId={homeownerId}
      />
    </AuthLayout>
  );
};

export default Projects;
