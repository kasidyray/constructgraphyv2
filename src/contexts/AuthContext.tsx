import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

// Define the user profile type
export interface User {
  id: string;
  email: string;
  role: "admin" | "builder" | "homeowner";
  name?: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshAuthUser: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the auth provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile from the database
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile for refresh:", error);
        return null;
      }
      return data as User;
    } catch (error) {
       console.error("Catch block error fetching profile for refresh:", error);
      return null;
    }
  };

  // Function to create a user profile in the database
  const createUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
    try {
      const newProfile = {
        id: authUser.id,
        email: authUser.email || '',
        role: "homeowner" as const,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        return null;
      }

      return data as User;
    } catch (error) {
      return null;
    }
  };

  // Initialize auth state
  const initializeAuth = async () => {
    try {
      setLoading(true);

      // Check for existing session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      setSession(currentSession);

      if (currentSession?.user) {
        // Try to fetch the user profile
        const profile = await fetchUserProfile(currentSession.user.id);

        if (profile) {
          setUser(profile);
        } else {
          // If no profile exists, create one
          const newProfile = await createUserProfile(currentSession.user);
          
          if (newProfile) {
            setUser(newProfile);
          }
        }
      }

      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);

          if (event === "SIGNED_IN" && newSession?.user) {
            // Try to fetch the user profile
            const profile = await fetchUserProfile(newSession.user.id);

            if (profile) {
              setUser(profile);
            } else {
              // If no profile exists, create one
              const newProfile = await createUserProfile(newSession.user);
              
              if (newProfile) {
                setUser(newProfile);
              }
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setSession(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to initialize authentication. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth on component mount
  useEffect(() => {
    const cleanup = initializeAuth();
    
    // Clean up the subscription when the component unmounts
    return () => {
      cleanup.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  // NEW: Function to manually refresh the user profile data in the context
  const refreshAuthUser = async () => {
    // setLoading(true); // Optional: show loading state during refresh
    try {
      // Get the latest Supabase Auth user data
      const { data: { user: currentAuthUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (currentAuthUser) {
        // Fetch the associated profile using the existing function
        const profile = await fetchUserProfile(currentAuthUser.id);
        if (profile) {
          setUser(profile); // Update the context state
        } else {
          // Handle case where profile might have been deleted unexpectedly
          console.warn("Profile not found during refresh for user:", currentAuthUser.id);
          setUser(null); // Clear user if profile is gone
          // Optionally logout or handle differently
        }
      } else {
        // No authenticated user found
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        variant: "destructive",
        title: "Refresh Error",
        description: "Could not refresh user data.",
      });
      // Optionally logout if refresh fails critically
      // await logout();
    } finally {
      // setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // The user profile will be set by the auth state change listener
      return {};
    } catch (error) {
      return { 
        error: error instanceof Error 
          ? error.message 
          : "An unexpected error occurred during login" 
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      
      // Force redirect to login page
      window.location.href = "/login?logout=true";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user && !!session,
        login,
        logout,
        refreshAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
