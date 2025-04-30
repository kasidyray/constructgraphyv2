import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, UserPlus, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User, Project } from "@/types";
import StatCards from "@/components/dashboard/StatCards";
import HomeownerTable from "@/components/dashboard/HomeownerTable";
import BuilderTable from "@/components/dashboard/BuilderTable";
import AdminTable from "@/components/dashboard/AdminTable";
import NewUserDialog from "@/components/dashboard/NewUserDialog";
import NewProjectDialog from "@/components/dashboard/NewProjectDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers } from "@/services/userService";
import { getProjects } from "@/services/projectService";
import { toast } from "sonner";

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [selectedHomeowner, setSelectedHomeowner] = useState<User | null>(null);
  const [selectedBuilder, setSelectedBuilder] = useState<User | null>(null);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [homeowners, setHomeowners] = useState<User[]>([]);
  const [builders, setBuilders] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const users = await getUsers();
      setHomeowners(users.filter(u => u.role === "homeowner"));
      setBuilders(users.filter(u => u.role === "builder"));
      setAdmins(users.filter(u => u.role === "admin"));
      
      // Fetch projects
      const allProjects = await getProjects();
      setProjects(allProjects);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleUserCreated = (newUser: User) => {
    // Add the new user to the appropriate list
    if (newUser.role === "homeowner") {
      setHomeowners(prev => [newUser, ...prev]);
    } else if (newUser.role === "builder") {
      setBuilders(prev => [newUser, ...prev]);
    } else if (newUser.role === "admin") {
      setAdmins(prev => [newUser, ...prev]);
    }
    
    toast.success(`${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} created successfully`);
    
    // Refresh all data to ensure consistency
    fetchData();
  };

  const handleProjectCreated = (newProject: Project) => {
    // Add the new project to the list
    setProjects(prev => [newProject, ...prev]);
    
    toast.success("Project created successfully");
    
    // Refresh all data to ensure consistency
    fetchData();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
        <div className="rounded-lg border border-destructive p-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {
                user.first_name 
                  ? <span className="capitalize-text">{user.first_name}</span>
                  : user.name 
                    ? <span className="capitalize-text">{user.name.split(' ')[0]}</span>
                    : 'Admin'
              }
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening with your construction projects today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowNewUserDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              New User
            </Button>
            <Button onClick={() => setShowNewProjectDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        
        <StatCards projects={projects} />
        
        <Tabs defaultValue="homeowners" className="mt-6">
          <TabsList>
            <TabsTrigger value="homeowners">Homeowners</TabsTrigger>
            <TabsTrigger value="builders">Builders</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
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
          <TabsContent value="admins" className="mt-6">
            <AdminTable 
              admins={admins} 
              currentUser={user}
            />
          </TabsContent>
        </Tabs>
        
        {/* Dialogs */}
        <NewUserDialog 
          open={showNewUserDialog} 
          onOpenChange={setShowNewUserDialog}
          onUserCreated={handleUserCreated}
        />
        
        <NewProjectDialog 
          open={showNewProjectDialog} 
          onOpenChange={setShowNewProjectDialog}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
