import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/types";
import { createUser } from "@/services/userService";
import { Loader2 } from "lucide-react";

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: (user: User) => void;
}

type ActiveTab = "homeowner" | "builder" | "admin";

const NewUserDialog: React.FC<NewUserDialogProps> = ({ 
  open, 
  onOpenChange,
  onUserCreated
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("homeowner");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameBuilder, setNameBuilder] = useState("");
  const [email, setEmail] = useState("");
  const [builderEmail, setBuilderEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [builderPhoneNumber, setBuilderPhoneNumber] = useState("");
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhoneNumber, setAdminPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let newUser: Omit<User, "id" | "createdAt"> | null = null;
    let validationError = false;

    try {
      if (activeTab === "homeowner") {
        if (!firstName || !lastName || !email || !phoneNumber) {
          validationError = true;
        }
        newUser = {
          name: `${firstName} ${lastName}`,
          email,
          phone: phoneNumber,
          role: "homeowner" as UserRole,
        };
      } else if (activeTab === "builder") {
        if (!nameBuilder || !builderEmail || !builderPhoneNumber) {
           validationError = true;
        }
        newUser = {
          name: nameBuilder,
          email: builderEmail,
          phone: builderPhoneNumber,
          role: "builder" as UserRole,
        };
      } else if (activeTab === "admin") {
        if (!adminFirstName || !adminLastName || !adminEmail || !adminPhoneNumber) {
          validationError = true;
        }
         newUser = {
          name: `${adminFirstName} ${adminLastName}`,
          email: adminEmail,
          phone: adminPhoneNumber,
          role: "admin" as UserRole,
        };
      }

      if (validationError || !newUser) {
         toast({
            title: "Error",
            description: "Please fill all required fields for the selected role.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
      }
        
      const createdUser = await createUser(newUser);
        
      if (createdUser) {
        const roleName = newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1);
        toast({
          title: "Success",
          description: `${roleName} created successfully. An invitation email has been sent.`, 
        });
          
        if (onUserCreated) {
          onUserCreated(createdUser);
        }
          
        resetForm();
        onOpenChange(false);
      } else {
        throw new Error(`Failed to create ${newUser.role}`);
      }

    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setNameBuilder("");
    setEmail("");
    setBuilderEmail("");
    setPhoneNumber("");
    setBuilderPhoneNumber("");
    setAdminFirstName("");
    setAdminLastName("");
    setAdminEmail("");
    setAdminPhoneNumber("");
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open && isSubmitting) {
        return;
    }
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Select the role and add the details for the new user.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="homeowner" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as ActiveTab)}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="homeowner">Homeowner</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="homeowner" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="capitalize-text">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="capitalize-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="capitalize-text">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="capitalize-text"
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
                <Label htmlFor="nameBuilder" className="capitalize-text">Name</Label>
                <Input
                  id="nameBuilder"
                  placeholder="Builder Company Name"
                  value={nameBuilder}
                  onChange={(e) => setNameBuilder(e.target.value)}
                  className="capitalize-text"
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

            <TabsContent value="admin" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminFirstName" className="capitalize-text">First Name</Label>
                  <Input
                    id="adminFirstName"
                    placeholder="Admin"
                    value={adminFirstName}
                    onChange={(e) => setAdminFirstName(e.target.value)}
                    className="capitalize-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminLastName" className="capitalize-text">Last Name</Label>
                  <Input
                    id="adminLastName"
                    placeholder="User"
                    value={adminLastName}
                    onChange={(e) => setAdminLastName(e.target.value)}
                    className="capitalize-text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPhoneNumber">Phone Number</Label>
                <Input
                  id="adminPhoneNumber"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={adminPhoneNumber}
                  onChange={(e) => setAdminPhoneNumber(e.target.value)}
                />
              </div>
            </TabsContent>

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserDialog;
