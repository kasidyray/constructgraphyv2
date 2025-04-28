import React, { useState, useEffect } from "react";
import { Eye, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Project } from "@/types";
import { getProjects } from "@/services/projectService";
import EditUserDialog from "./EditUserDialog";

interface BuilderTableProps {
  builders: User[];
  onBuilderSelect: (builder: User) => void;
}

const BuilderTable: React.FC<BuilderTableProps> = ({
  builders: initialBuilders,
  onBuilderSelect
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [builders, setBuilders] = useState<User[]>(initialBuilders);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  useEffect(() => {
    setBuilders(initialBuilders);
  }, [initialBuilders]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects();
        setProjects(allProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const filteredBuilders = builders.filter(builder => 
    builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    builder.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the number of projects each builder is handling
  const getBuilderProjectCount = (builderId: string): number => {
    return projects.filter(project => project.builderId === builderId).length;
  };

  // Handlers for Edit Dialog
  const handleEditClick = (builder: User) => {
    setUserToEdit(builder);
    setShowEditDialog(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setBuilders(prevBuilders => 
      prevBuilders.map(b => b.id === updatedUser.id ? updatedUser : b)
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Builders</CardTitle>
            <CardDescription>
              View and manage all builders and their projects
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuilders.map(builder => (
                <TableRow key={builder.id}>
                  <TableCell className="font-medium">{builder.name}</TableCell>
                  <TableCell>{builder.email}</TableCell>
                  <TableCell>{builder.phone || "N/A"}</TableCell>
                  <TableCell>{getBuilderProjectCount(builder.id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2"> 
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onBuilderSelect(builder)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View All Projects
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(builder)}
                        title="Edit Builder"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBuilders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No builders found matching your search.
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
    </>
  );
};

export default BuilderTable;
