import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { getUserByEmail } from "@/services/userService";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Check for existing session on load and set up auth state listener
  useEffect(() => {
    setLoading(true);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the users table
  const fetchUserProfile = async (authUserId: string) => {
    try {
      // Query the users table to get the user profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else if (data) {
        // Convert the data to match our User type
        const userProfile: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          avatar: data.avatar || undefined,
          createdAt: data.createdAt,
          phone: data.phone || undefined,
          builderId: data.builderId || undefined,
        };
        setUser(userProfile);
      } else {
        console.error('User profile not found');
        setUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error("No session returned from Supabase");
      }

      // Session and user will be set by the auth state listener
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
