import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  // Generate a background color based on the user's name for visual distinction
  const generateColorFromName = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-amber-100 text-amber-600",
      "bg-red-100 text-red-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
      "bg-cyan-100 text-cyan-600"
    ];
    
    // Simple hash function to get a consistent color for the same name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const avatarColorClass = generateColorFromName(user.name);

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarFallback className={avatarColorClass}>
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
