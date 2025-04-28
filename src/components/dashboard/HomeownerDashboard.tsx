import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProjectList from "@/components/dashboard/ProjectList";
import { User, Project } from "@/types";
import { getHomeownerProjects } from "@/services/projectService";

interface HomeownerDashboardProps {
  user: User;
}

const HomeownerDashboard: React.FC<HomeownerDashboardProps> = ({
  user
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug user data
  console.log("HomeownerDashboard user data:", {
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
      const userProjects = await getHomeownerProjects(user.id);
      setProjects(userProjects);
      setError(null);
    } catch (err) {
      console.error("Error fetching homeowner projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user.id]);

  // Extract first name, try user.first_name first
  const firstName = user.first_name || user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User';
  const projectCount = projects.length;
  const projectText = projectCount === 1 ? 'project' : 'projects';

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight capitalize">Welcome, {firstName}!</h1>
        <p className="text-muted-foreground mt-1">
          {loading ? 'Loading project info...' : 
           error ? 'Could not load project info.' : 
           `You have ${projectCount} active ${projectText}. Click on any to see details.`}
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
