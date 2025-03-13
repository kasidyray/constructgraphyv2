import React, { useState } from "react";
import { Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { getHomeownerProjects } from "@/data/mockData";

interface HomeownerTableProps {
  homeowners: User[];
  onHomeownerSelect: (homeowner: User) => void;
}

const HomeownerTable: React.FC<HomeownerTableProps> = ({
  homeowners,
  onHomeownerSelect
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredHomeowners = homeowners.filter(homeowner => 
    homeowner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    homeowner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the correct number of projects for a homeowner
  const getHomeownerProjectCount = (homeownerId: string): number => {
    return getHomeownerProjects(homeownerId).length;
  };

  return <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Homeowners</CardTitle>
          <CardDescription>
            View and manage all homeowners and their projects
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
              <TableHead>Builder</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHomeowners.map(homeowner => (
              <TableRow key={homeowner.id}>
                <TableCell className="font-medium">{homeowner.name}</TableCell>
                <TableCell>{homeowner.email}</TableCell>
                <TableCell>{homeowner.phone || "N/A"}</TableCell>
                <TableCell>{getHomeownerProjectCount(homeowner.id)}</TableCell>
                <TableCell>{homeowner.builderName || "Unassigned"}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onHomeownerSelect(homeowner)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Projects
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredHomeowners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No homeowners found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
};

export default HomeownerTable;
