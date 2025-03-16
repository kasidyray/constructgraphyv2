import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import BuilderDashboard from "@/components/dashboard/BuilderDashboard";
import HomeownerDashboard from "@/components/dashboard/HomeownerDashboard";
import { User as AuthUser } from "@/contexts/AuthContext";
import { User } from "@/types";
import AuthLayout from "@/components/layout/AuthLayout";

const Dashboard: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    window.location.href = "/login";
    return null;
  }

  // Convert AuthUser to User type expected by dashboard components
  const dashboardUser: User = {
    id: user.id,
    email: user.email,
    name: user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    createdAt: user.created_at
  };

  // Render the appropriate dashboard based on user role
  return (
    <AuthLayout>
      {user.role === "admin" && <AdminDashboard user={dashboardUser} />}
      {user.role === "builder" && <BuilderDashboard user={dashboardUser} />}
      {user.role === "homeowner" && <HomeownerDashboard user={dashboardUser} />}
    </AuthLayout>
  );
};

export default Dashboard;
