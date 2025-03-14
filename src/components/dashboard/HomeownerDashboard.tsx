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

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}!
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
