
import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectList from "@/components/dashboard/ProjectList";
import { User } from "@/types";
import { getHomeownerProjects } from "@/data/mockData";

interface HomeownerDashboardProps {
  user: User;
}

const HomeownerDashboard: React.FC<HomeownerDashboardProps> = ({
  user
}) => {
  const userProjects = getHomeownerProjects(user.id);

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

      <ProjectList projects={userProjects} />
    </div>
  );
};

export default HomeownerDashboard;
