import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import StatCards from "@/components/dashboard/StatCards";
import HomeownerTable from "@/components/dashboard/HomeownerTable";
import BuilderTable from "@/components/dashboard/BuilderTable";
import NewUserDialog from "@/components/dashboard/NewUserDialog";
import NewProjectDialog from "@/components/dashboard/NewProjectDialog";
import { mockUsers, mockProjects } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
  const [selectedHomeowner, setSelectedHomeowner] = useState<User | null>(null);
  const [selectedBuilder, setSelectedBuilder] = useState<User | null>(null);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const navigate = useNavigate();
  
  const homeowners = mockUsers.filter(user => user.role === "homeowner");
  const builders = mockUsers.filter(user => user.role === "builder");

  const handleHomeownerSelect = (homeowner: User) => {
    setSelectedHomeowner(homeowner);
    // Navigate to projects page with homeowner filter
    navigate(`/homeowner/${homeowner.id}/projects`);
  };

  const handleBuilderSelect = (builder: User) => {
    setSelectedBuilder(builder);
    // Navigate to builder's projects page to show all projects for homeowners linked with this builder
    navigate(`/builder/${builder.id}/projects`);
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage homeowners and projects</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowNewProjectDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
          <Button onClick={() => setShowNewUserDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            New User
          </Button>
        </div>
      </div>
      
      <StatCards projects={mockProjects} />
      
      <Tabs defaultValue="homeowners" className="mt-6">
        <TabsList>
          <TabsTrigger value="homeowners">Homeowners</TabsTrigger>
          <TabsTrigger value="builders">Builders</TabsTrigger>
        </TabsList>
        <TabsContent value="homeowners" className="mt-6">
          <HomeownerTable 
            homeowners={homeowners} 
            onHomeownerSelect={handleHomeownerSelect} 
          />
        </TabsContent>
        <TabsContent value="builders" className="mt-6">
          <BuilderTable 
            builders={builders} 
            onBuilderSelect={handleBuilderSelect} 
          />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <NewUserDialog 
        open={showNewUserDialog} 
        onOpenChange={setShowNewUserDialog} 
      />
      
      <NewProjectDialog 
        open={showNewProjectDialog} 
        onOpenChange={setShowNewProjectDialog} 
      />
    </div>
  );
};

export default AdminDashboard;
