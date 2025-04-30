import React, { useState, useEffect } from "react";
import { Eye, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { User, Project } from "@/types";
import { getProjects } from "@/services/projectService";
import { deleteUser } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import EditUserDialog from "./EditUserDialog";
import { toast } from "sonner";

interface HomeownerTableProps {
  homeowners: User[];
  onHomeownerSelect: (homeowner: User) => void;
}

const HomeownerTable: React.FC<HomeownerTableProps> = ({
  homeowners: initialHomeowners,
  onHomeownerSelect
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [homeowners, setHomeowners] = useState<User[]>(initialHomeowners);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setHomeowners(initialHomeowners);
  }, [initialHomeowners]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects();
        
        const filteredProjects = user?.role === "builder" 
          ? allProjects.filter(project => project.builderId === user.id)
          : allProjects;
          
        setProjects(filteredProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [user]);
  
  const filteredHomeowners = homeowners.filter(homeowner => 
    homeowner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    homeowner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHomeownerProjectCount = (homeownerId: string): number => {
    return projects.filter(project => 
      project.homeownerId === homeownerId
    ).length;
  };

  const handleEditClick = (homeowner: User) => {
    setUserToEdit(homeowner);
    setShowEditDialog(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setHomeowners(prevHomeowners => 
      prevHomeowners.map(h => h.id === updatedUser.id ? updatedUser : h)
    );
  };

  const handleDeleteClick = (homeowner: User) => {
    setUserToDelete(homeowner);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        toast.success(`Homeowner ${userToDelete.name} deleted successfully.`);
        setHomeowners(prev => prev.filter(h => h.id !== userToDelete.id));
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } else {
        toast.error(`Failed to delete ${userToDelete.name}.`);
      }
    } catch (error: any) {
      console.error("Error deleting homeowner:", error);
      toast.error(error.message || `Failed to delete ${userToDelete.name}.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Homeowners</CardTitle>
            <CardDescription>
              {user?.role === "builder" 
                ? "View and manage your homeowners and their projects" 
                : "View and manage all homeowners and their projects"}
            </CardDescription>
          </div>
          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Projects</TableHead>
                {user?.role !== "builder" && <TableHead>Builder</TableHead>}
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHomeowners.map(homeowner => (
                <TableRow key={homeowner.id}>
                  <TableCell className="font-medium">{homeowner.name}</TableCell>
                  <TableCell>{homeowner.email}</TableCell>
                  <TableCell>{homeowner.phone || "N/A"}</TableCell>
                  <TableCell>{getHomeownerProjectCount(homeowner.id)}</TableCell>
                  {user?.role !== "builder" && <TableCell>{homeowner.builderName || "Unassigned"}</TableCell>}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onHomeownerSelect(homeowner)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View Projects</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(homeowner)}
                        title="Edit Homeowner"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user?.role !== 'builder' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(homeowner)}
                          title="Delete Homeowner"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHomeowners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={user?.role === "builder" ? 5 : 6} className="text-center py-6 text-muted-foreground">
                    No homeowners found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <EditUserDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        userToEdit={userToEdit}
        onUserUpdated={handleUserUpdated}
      />
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user 
              <span className="font-semibold">{userToDelete?.name}</span> 
              and all associated projects. 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};

export default HomeownerTable;
