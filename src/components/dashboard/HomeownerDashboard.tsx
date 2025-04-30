import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProjectList from "@/components/dashboard/ProjectList";
import { User, Project } from "@/types";
import { getHomeownerProjects } from "@/services/projectService";
import { useAuth } from "@/contexts/AuthContext";
import { AuthError } from "@supabase/supabase-js";
import logger from "@/utils/logger";

interface HomeownerDashboardProps {
  user: User;
}

const HomeownerDashboard: React.FC<HomeownerDashboardProps> = ({
  user
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  // Debug user data
  logger.debug("HomeownerDashboard user data:", {
    id: user.id,
    email: user.email,
    name: user.name,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProjects = await getHomeownerProjects(user.id);
      setProjects(userProjects);
    } catch (err: unknown) {
      logger.error("Error fetching homeowner projects:", err);

      let isAuthError = false;
      if (err instanceof AuthError) {
          isAuthError = true;
      } else if (typeof err === 'object' && err !== null && 'status' in err && err.status === 401) {
          isAuthError = true;
      } else if (err instanceof Error && (err.message.includes('JWT') || err.message.includes('Unauthorized') || err.message.includes('401'))) {
           isAuthError = true;
      }

      if (isAuthError) {
        logger.warn("Authentication error detected during project fetch. Logging out.");
        setError("Your session has expired. Please log in again.");
        setTimeout(() => logout(), 1500); 
      } else {
        setError("Failed to load projects. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
        fetchProjects();
    } else {
        logger.warn("HomeownerDashboard: User ID not available on mount, skipping project fetch.");
        setLoading(false);
        setError("User information is missing. Cannot load projects.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [user?.id]);

  // Extract first name, try user.first_name first
  const firstName = user?.first_name || user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const projectCount = projects.length;

  // Generate project count message based on count
  const generateProjectMessage = () => {
    if (loading) {
      return 'Loading project info...';
    } 
    if (error) {
       // Return the specific error message set in fetchProjects or useEffect
      return error; 
    }
    if (projectCount === 0) {
      return 'You have no active projects.';
    } else if (projectCount === 1) {
      return 'You have 1 active project. Click on it to see details.';
    } else {
      return `You have ${projectCount} active projects. Click on any to see details.`;
    }
  };

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight capitalize">Welcome, {firstName}!</h1>
        <p className="text-muted-foreground mt-1">
          {/* Use the new message generation function */} 
          {generateProjectMessage()}
          {/* {loading ? 'Loading project info...' : 
           error ? error : 
           `You have ${projectCount} active ${projectText}. Click on any to see details.`} // Old rendering logic */}
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading projects...</span>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive p-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
};

export default HomeownerDashboard;
