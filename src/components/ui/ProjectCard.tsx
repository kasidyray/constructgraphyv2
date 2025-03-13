
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Project } from "@/types";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = "" }) => {
  const statusColors = {
    "planning": "bg-blue-500",
    "in-progress": "bg-amber-500",
    "completed": "bg-green-500",
    "on-hold": "bg-gray-500",
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md h-full ${className}`}>
        <div className="relative h-48 w-full overflow-hidden">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <Badge 
              className={`${statusColors[project.status]} text-white border-none`}
            >
              {project.status.replace("-", " ")}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-1 text-xl font-semibold">{project.title}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span className="line-clamp-1">{project.address}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>

        <CardFooter className="border-t bg-secondary/50 px-4 py-3">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Updated {formatDate(project.updatedAt)}</span>
            </div>
            <span>{project.homeownerName}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
