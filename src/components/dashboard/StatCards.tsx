
import React from "react";
import { BarChart, Calendar, FolderOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/types";

interface StatCardsProps {
  projects: Project[];
}

const StatCards: React.FC<StatCardsProps> = ({ projects }) => {
  const inProgressProjects = projects.filter(
    (p) => p.status === "in-progress"
  ).length;
  
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  
  const planningProjects = projects.filter(
    (p) => p.status === "planning"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="slide-up delay-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Projects
          </CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length}</div>
          <p className="text-xs text-muted-foreground">
            {projects.length === 1 ? 'Project' : 'Projects'} total
          </p>
        </CardContent>
      </Card>
      
      <Card className="slide-up delay-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            In Progress
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressProjects}</div>
          <p className="text-xs text-muted-foreground">
            Active projects underway
          </p>
        </CardContent>
      </Card>
      
      <Card className="slide-up delay-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Planning Phase
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{planningProjects}</div>
          <p className="text-xs text-muted-foreground">
            Projects in planning
          </p>
        </CardContent>
      </Card>
      
      <Card className="slide-up delay-400">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 text-muted-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedProjects}</div>
          <p className="text-xs text-muted-foreground">
            Successfully completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
