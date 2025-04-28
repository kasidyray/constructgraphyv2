import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { updateUser } from "@/services/userService"; // Assuming updateUser will be here
import { toast } from "sonner";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit: User | null;
  onUserUpdated: (updatedUser: User) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  userToEdit,
  onUserUpdated,
}) => {
  // State for all fields
  const [name, setName] = useState(""); // For Builder/Admin name
  const [firstName, setFirstName] = useState(""); // For Homeowner first name
  const [lastName, setLastName] = useState(""); // For Homeowner last name
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setEmail(userToEdit.email || "");
      setPhone(userToEdit.phone || "");
      setError(null);

      // Populate name fields based on role
      if (userToEdit.role === 'homeowner') {
        setFirstName(userToEdit.first_name || userToEdit.name?.split(' ')[0] || "");
        setLastName(userToEdit.last_name || userToEdit.name?.split(' ').slice(1).join(' ') || "");
        setName(""); // Clear general name state for homeowners
      } else {
        setName(userToEdit.name || "");
        setFirstName(""); // Clear homeowner states
        setLastName("");
      }
    } else {
      // Reset all form fields if dialog is closed
      setName("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setError(null);
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    setIsSubmitting(true);
    setError(null);

    let updates: Partial<User> = {
      // Common fields
      email: email, // Still consider if email should be editable
      phone: phone,
      // Role-specific name fields
    };

    if (userToEdit.role === 'homeowner') {
      updates.first_name = firstName;
      updates.last_name = lastName;
      updates.name = `${firstName} ${lastName}`.trim(); // Update the main name field too
    } else {
      updates.name = name;
    }

    try {
      // Send the updates object directly
      const updatedUser = await updateUser(userToEdit.id, updates);
      if (updatedUser) {
        toast.success("User details updated successfully");
        onUserUpdated(updatedUser);
        onOpenChange(false);
      } else {
        throw new Error("Failed to update user");
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "Failed to update user details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent closing while submitting
  const handleOpenChangeIntercept = (newOpenState: boolean) => {
    if (isSubmitting && !newOpenState) {
      return; // Don't close if submitting
    }
    onOpenChange(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeIntercept}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {userToEdit?.role === 'homeowner' ? 'Homeowner' : 'Builder/Admin'} Details</DialogTitle>
          <DialogDescription>
            Make changes to the profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {userToEdit ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Conditional Name Fields */} 
            {userToEdit.role === 'homeowner' ? (
              <>
                <div className="grid grid-cols-2 gap-4"> {/* Grid for first/last name */} 
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly // Make email read-only
                className="text-muted-foreground"
                // onChange={(e) => setEmail(e.target.value)} 
                // required
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Loading user data...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog; 