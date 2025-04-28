import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, LogOut, Settings, User as UserIcon, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { User } from "@/types";

const Header: React.FC = () => {
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a project detail page
  const isProjectDetailPage = location.pathname.startsWith('/projects/') && location.pathname.split('/').length > 2;
  
  const handleLogout = async () => {
    // Let the AuthContext's logout function handle the redirection
    await logout();
    // No need to navigate here as the logout function will redirect
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  // Convert AuthUser to User type expected by UserAvatar
  const avatarUser: User | null = user ? {
    id: user.id,
    email: user.email,
    name: user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user.email,
    role: user.role,
    createdAt: user.created_at
  } : null;
  
  // Get display name for the dropdown with capitalized first letter
  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} ${user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)}`
    : user?.email.split('@')[0].charAt(0).toUpperCase() + user?.email.split('@')[0].slice(1); // Capitalize username part of email
  
  return <header className="glass sticky top-0 z-50 border-b border-border/40 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4 md:max-w-screen-xl flex h-16 items-center justify-between">
        {/* Logo and/or back button */}
        <div className="flex items-center space-x-2">
          {isProjectDetailPage ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleGoBack} 
                className="md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Link to="/dashboard">
                <img 
                  src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" 
                  alt="Constructgraphy" 
                  className="h-8 hidden md:block cursor-pointer" 
                />
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <img 
                src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" 
                alt="Constructgraphy" 
                className="h-8 cursor-pointer" 
              />
            </Link>
          )}
        </div>

        <nav className="hidden md:flex md:items-center md:space-x-4">
          {/* Removed About Us link */}
          {/* {isAuthenticated && <> ... other links could go here ... </>} */}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
                  <UserAvatar user={avatarUser} size="md" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 [&_*]:focus-visible:ring-0 [&_*]:focus-visible:ring-offset-0 [&_*]:focus-visible:outline-none">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="hover:border-transparent">
                  <Link to="/dashboard" className="flex cursor-pointer items-center w-full">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:border-transparent">
                  <Link to="/profile-settings" className="flex cursor-pointer items-center w-full">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:border-transparent">
                  {/* Removed original Settings link, as it's merged */}
                  {/* <Link to="#" className="flex cursor-pointer items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link> */}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex cursor-pointer items-center text-destructive hover:border-transparent" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Button size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>}
        </div>
      </div>
    </header>;
};

export default Header;
