import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Loader2 } from "lucide-react"; // Removed Eye icon
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
} from "@/components/ui/alert-dialog";
import { User } from "@/types";
// No need to fetch projects for Admin table
// import { getProjects } from "@/services/projectService"; 
import { deleteUser } from "@/services/userService";
import EditUserDialog from "./EditUserDialog";
import { toast } from "sonner";

interface AdminTableProps {
  admins: User[];
  currentUser: User; // Pass the current logged-in admin user
  // onAdminSelect is not needed as Admins don't have specific project views like builders
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins: initialAdmins,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<User[]>(initialAdmins);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    setAdmins(initialAdmins);
  }, [initialAdmins]);

  // No need to fetch projects

  const filteredAdmins = admins.filter(admin => 
    (admin.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // No project count needed

  const handleEditClick = (admin: User) => {
    setUserToEdit(admin);
    setShowEditDialog(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setAdmins(prevAdmins => 
      prevAdmins.map(a => a.id === updatedUser.id ? updatedUser : a)
    );
    // Also need to potentially update currentUser if the admin edits themselves?
    // This depends on how profile updates are reflected in AuthContext.
    // For now, just update the table.
  };

  const handleDeleteClick = (admin: User) => {
    setUserToDelete(admin);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    // Double check: Prevent self-deletion (although button should be disabled)
    if (userToDelete.id === currentUser.id) {
      toast.error("You cannot delete your own account.");
      setShowDeleteConfirm(false);
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        toast.success(`Admin ${userToDelete.name || userToDelete.email} deleted successfully.`);
        setAdmins(prev => prev.filter(a => a.id !== userToDelete.id));
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } else {
         toast.error(`Failed to delete ${userToDelete.name || userToDelete.email}.`);
      }
    } catch (error: any) {
      console.error("Error deleting admin:", error);
      toast.error(error.message || `Failed to delete ${userToDelete.name || userToDelete.email}.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Administrators</CardTitle>
            <CardDescription>
              Manage administrator accounts.
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
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name || '-'}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {/* Removed View Projects Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(admin)}
                        title="Edit Admin"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClick(admin)}
                        title="Delete Admin"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={admin.id === currentUser.id} // Disable delete for self
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAdmins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No administrators found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit User Dialog (reused) */}
      <EditUserDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        userToEdit={userToEdit} // Pass admin user here
        onUserUpdated={handleUserUpdated}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the admin user 
              <span className="font-semibold">{userToDelete?.name || userToDelete?.email}</span>.
              {/* Removed mention of deleting projects, as it's less relevant for admins */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={isDeleting || userToDelete?.id === currentUser.id} // Double disable
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminTable; 