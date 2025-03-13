import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/StatCards";
import HomeownerTable from "@/components/dashboard/HomeownerTable";
import { User, Project } from "@/types";
import { getProjects } from "@/services/projectService";
import { getUsers } from "@/services/userService";

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
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects assigned to this builder
        const allProjects = await getProjects();
        const builderProjects = allProjects.filter(project => project.builderId === user.id);
        setProjects(builderProjects);
        
        // Fetch homeowners
        const users = await getUsers();
        const homeownerUsers = users.filter(user => user.role === "homeowner");
        setHomeowners(homeownerUsers);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleHomeownerSelect = (homeowner: User) => {
    setSelectedHomeowner(homeowner);
    // Navigate to projects page with homeowner filter
    navigate(`/homeowner/${homeowner.id}/projects`);
  };

  if (loading) {
    return (
      <div className="container flex h-64 items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive p-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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

      <StatCards projects={projects} />
      
      <div className="mt-6">
        <HomeownerTable 
          homeowners={homeowners} 
          onHomeownerSelect={handleHomeownerSelect} 
        />
      </div>
    </div>
  );
};

export default BuilderDashboard;
