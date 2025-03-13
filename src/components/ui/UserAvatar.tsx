
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = "md", 
  showStatus = false 
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <Avatar className={`${sizeClasses[size]} bg-muted`}>
        <AvatarFallback className="text-muted-foreground">
          ?
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
      )}
    </div>
  );
};

export default UserAvatar;
