import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/data/mockData";

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewUserDialog: React.FC<NewUserDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [activeTab, setActiveTab] = useState<"homeowner" | "builder">("homeowner");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameBuilder, setNameBuilder] = useState("");
  const [email, setEmail] = useState("");
  const [builderEmail, setBuilderEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [builderPhoneNumber, setBuilderPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "homeowner") {
      if (!firstName || !lastName || !email || !phoneNumber) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }
      
      // Create new homeowner
      const newUser: User = {
        id: uuidv4(),
        name: `${firstName} ${lastName}`,
        email,
        phone: phoneNumber,
        role: "homeowner" as UserRole,
        createdAt: new Date(),
        projects: [],
      };
      
      // Add to mock data
      mockUsers.push(newUser);
      
      toast({
        title: "Success",
        description: "Homeowner created successfully",
      });
    } else {
      if (!nameBuilder || !builderEmail || !builderPhoneNumber) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }
      
      // Create new builder
      const newUser: User = {
        id: uuidv4(),
        name: nameBuilder,
        email: builderEmail,
        phone: builderPhoneNumber,
        role: "builder" as UserRole,
        createdAt: new Date(),
        projects: [],
      };
      
      // Add to mock data
      mockUsers.push(newUser);
      
      toast({
        title: "Success",
        description: "Builder created successfully",
      });
    }
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setNameBuilder("");
    setEmail("");
    setBuilderEmail("");
    setPhoneNumber("");
    setBuilderPhoneNumber("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new homeowner or builder to the system.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="homeowner" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "homeowner" | "builder")}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="homeowner">Homeowner</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="homeowner" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="builder" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nameBuilder">Name</Label>
                <Input
                  id="nameBuilder"
                  placeholder="Builder Company Name"
                  value={nameBuilder}
                  onChange={(e) => setNameBuilder(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="builderEmail">Email</Label>
                <Input
                  id="builderEmail"
                  type="email"
                  placeholder="contact@buildercompany.com"
                  value={builderEmail}
                  onChange={(e) => setBuilderEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="builderPhoneNumber">Phone Number</Label>
                <Input
                  id="builderPhoneNumber"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={builderPhoneNumber}
                  onChange={(e) => setBuilderPhoneNumber(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <div className="flex justify-end mt-6">
              <Button type="button" variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserDialog;
