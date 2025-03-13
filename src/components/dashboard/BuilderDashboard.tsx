
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/StatCards";
import HomeownerTable from "@/components/dashboard/HomeownerTable";
import { User } from "@/types";
import { getHomeownerProjects, mockUsers } from "@/data/mockData";

interface BuilderDashboardProps {
  user: User;
}

const BuilderDashboard: React.FC<BuilderDashboardProps> = ({
  user
}) => {
  const [selectedHomeowner, setSelectedHomeowner] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const userProjects = getHomeownerProjects(user.id);
  const homeowners = mockUsers.filter(user => user.role === "homeowner");

  const handleHomeownerSelect = (homeowner: User) => {
    setSelectedHomeowner(homeowner);
    // Navigate to projects page with homeowner filter
    navigate(`/homeowner/${homeowner.id}/projects`);
  };

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

      <StatCards projects={userProjects} />
      
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
