import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
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

    fetchProjects();
  }, [user.id]);

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}!
          </p>
        </div>
        
        <Button asChild>
          <Link to="/projects">
            <Plus className="mr-2 h-4 w-4" />
            View All Projects
          </Link>
        </Button>
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
