
import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import HomeownerDashboard from "@/components/dashboard/HomeownerDashboard";
import BuilderDashboard from "@/components/dashboard/BuilderDashboard";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <AuthLayout>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "homeowner" && <HomeownerDashboard user={user} />}
      {user.role === "builder" && <BuilderDashboard user={user} />}
    </AuthLayout>
  );
};

export default Dashboard;
