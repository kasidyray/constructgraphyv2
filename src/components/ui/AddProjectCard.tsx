import React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AddProjectCardProps {
  onClick: () => void;
}

const AddProjectCard: React.FC<AddProjectCardProps> = ({ onClick }) => {
  return (
    <Card 
      className="flex h-full cursor-pointer flex-col items-center justify-center border-dashed p-6 transition-colors hover:border-primary hover:bg-muted/50"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center pt-6">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Add New Project</h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Click to create a new construction project
        </p>
      </CardContent>
    </Card>
  );
};

export default AddProjectCard; 