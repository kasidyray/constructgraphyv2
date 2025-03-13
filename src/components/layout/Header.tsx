
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "@/components/ui/UserAvatar";

const Header: React.FC = () => {
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return <header className="glass sticky top-0 z-50 border-b border-border/40 shadow-sm backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo without navigation link */}
        <div className="flex items-center space-x-2">
          <img src="/lovable-uploads/f03a9d6d-3e35-4b47-a5da-11e2eb0d92b1.png" alt="Constructgraphy" className="h-8" />
        </div>

        <nav className="hidden md:flex md:items-center md:space-x-4">
          {isAuthenticated && <>
              
              
            </>}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <UserAvatar user={user} size="md" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex cursor-pointer items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="#" className="flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="#" className="flex cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex cursor-pointer items-center text-destructive focus:text-destructive" onClick={handleLogout}>
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
