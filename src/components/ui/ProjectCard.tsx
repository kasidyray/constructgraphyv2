import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Project } from "@/types";
import { Calendar, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import LazyImage from './LazyImage';

interface ProjectCardProps {
  project: Project;
  className?: string;
  isAdmin?: boolean;
  isBuilder?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  className = "",
  isAdmin = false,
  isBuilder = false
}) => {
  const statusColors: Record<Project["status"], string> = {
    "in-progress": "bg-yellow-500",
    completed: "bg-green-500",
    "on-hold": "bg-gray-500",
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to capitalize the first letter of each word
  const capitalizeFirstLetter = (string: string) => {
    return string.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format status text with capitalized first letter
  const formattedStatus = capitalizeFirstLetter(project.status.replace("-", " "));
  
  // Ensure description starts with a capital letter
  const formattedDescription = project.description.charAt(0).toUpperCase() + project.description.slice(1);

  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col ${className}`}>
        <div className="relative h-48 w-full overflow-hidden">
          {project.thumbnail && (
            <LazyImage
              src={project.thumbnail}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <Badge 
              className={`${statusColors[project.status]} text-white border-none`}
            >
              {formattedStatus}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-3 p-4 flex-grow flex flex-col">
          <div>
            <h3 className="line-clamp-1 text-xl font-semibold">{project.title}</h3>
            {/* <p className="line-clamp-2 text-sm text-muted-foreground">{formattedDescription}</p> */}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span className="line-clamp-1">{project.address}</span>
          </div>
          
          <div className="space-y-1 mt-auto">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>

        <CardFooter className="border-t bg-secondary/50 px-4 py-3 mt-auto">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Updated {formatDate(project.updatedAt)}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-1 h-4 w-4" />
              <span className="capitalize-text">
                {project.homeownerFirstName && project.homeownerLastName
                  ? `${project.homeownerFirstName} ${project.homeownerLastName}`
                  : project.homeownerName}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
