import React from "react";
import { Edit, MapPin, Trash2, User, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types";

interface ProjectHeaderProps {
  project: Project;
  isAdmin: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, isAdmin }) => {
  const navigate = useNavigate();
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusColors = {
    "planning": "bg-blue-500",
    "in-progress": "bg-amber-500",
    "completed": "bg-green-500",
    "on-hold": "bg-gray-500",
  };

  // Function to capitalize the first letter of each word
  const capitalizeFirstLetter = (string: string) => {
    return string.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format status text with capitalized first letter
  const formattedStatus = capitalizeFirstLetter(project.status.replace("-", " "));
  
  // Ensure title starts with a capital letter
  const formattedTitle = project.title.charAt(0).toUpperCase() + project.title.slice(1);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-2">
            <Badge 
              className={`${statusColors[project.status]} text-white border-none`}
            >
              {formattedStatus}
            </Badge>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{formattedTitle}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {project.address}
            </div>
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              {project.homeownerName}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {formatDate(project.createdAt)}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              Last updated: {formatDate(project.updatedAt)}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          {isAdmin && (
            <>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Project Progress</span>
          <span className="text-sm font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2.5" />
      </div>
    </>
  );
};

export default ProjectHeader;
