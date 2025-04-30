import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import logger from "@/utils/logger";

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

  // --- Helper Functions ---
  const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*" // Select all profile fields
        )
        .eq("id", userId)
        .single();

      if (error) {
        logger.error("Error fetching profile:", error);
        return null;
      }
      return data as User;
    } catch (error) {
       logger.error("Catch block error fetching profile:", error);
      return null;
    }
  }, []); // No dependencies needed

  const createUserProfile = useCallback(async (authUser: SupabaseUser): Promise<User | null> => {
    // This function might need review based on the trigger implementation.
    // If the trigger handles everything, this might only be needed as a fallback.
    try {
      logger.info(`Attempting to create profile for new user: ${authUser.id}`);
      const newProfile = {
        id: authUser.id,
        email: authUser.email || '',
        // Default role - assumes trigger might override based on metadata?
        role: (authUser.user_metadata?.role || "homeowner") as User['role'], 
        created_at: new Date().toISOString(),
        name: authUser.user_metadata?.name,
        first_name: authUser.user_metadata?.first_name,
        last_name: authUser.user_metadata?.last_name,
        phone: authUser.user_metadata?.phone,
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (error) {
         // Handle potential race condition where trigger created profile first
         if (error.code === '23505') { // Unique violation
            logger.warn(`Profile for ${authUser.id} likely already created by trigger. Fetching.`);
            return fetchUserProfile(authUser.id);
         } else {
             logger.error('Error inserting profile:', error);
             return null;
         }
      }
      logger.info(`Successfully created profile for user: ${authUser.id}`);
      return data as User;
    } catch (error) {
      logger.error('Catch block error creating profile:', error);
      return null;
    }
  }, [fetchUserProfile]);

  // --- Core Auth Functions ---
  const refreshAuthUser = useCallback(async () => {
    logger.debug("Attempting to refresh auth user and session...");
    try {
      // Fetch latest session first
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      setSession(currentSession); // Update session state immediately

      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user.id);
        if (profile) {
          setUser(profile);
           logger.debug("User profile refreshed.");
        } else {
          logger.warn("Profile not found during refresh for user:", currentSession.user.id);
          // Attempt to create profile if missing - might indicate an issue
          const newProfile = await createUserProfile(currentSession.user);
          if (newProfile) {
            setUser(newProfile);
            logger.info("Created missing profile during refresh.");
          } else {
             setUser(null); // Clear user if profile is missing and couldn't be created
          }
        }
      } else {
        // No active session
        setUser(null);
        setSession(null); // Ensure session is also null
        logger.debug("No active session found during refresh.");
      }
    } catch (error) {
      logger.error("Error refreshing auth data:", error);
      // Don't toast here, might be annoying on background refreshes
      // Let interactions fail naturally if session is invalid
      setUser(null); // Assume failed refresh means invalid state
      setSession(null);
    }
  }, [toast, fetchUserProfile, createUserProfile]); // Added dependencies

  const initializeAuth = useCallback(async () => {
    setLoading(true);
    logger.info("Initializing Auth...");
    try {
       // Initial refresh handles fetching session, user, and profile
       await refreshAuthUser();

      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          logger.info(`Auth state changed: ${event}`, newSession ? `User: ${newSession.user.id}` : 'No session');
          setSession(newSession);

          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
             if (newSession?.user) {
                 const profile = await fetchUserProfile(newSession.user.id);
                 if (profile) {
                    setUser(profile);
                 } else {
                     logger.warn(`Profile not found on ${event} for user ${newSession.user.id}. Attempting creation.`);
                     const newProfile = await createUserProfile(newSession.user);
                     setUser(newProfile); // Set user even if null
                 }
             } else {
                 setUser(null); // Clear user if session exists but user doesn't
             }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setSession(null); // Ensure session is cleared on sign out
          }
        }
      );

      return () => {
        logger.info("Unsubscribing from auth state changes.");
        subscription.unsubscribe();
      };
    } catch (error) {
       logger.error("Error during auth initialization:", error);
      toast({ variant: "destructive", title: "Authentication Error", description: "Failed to initialize authentication. Please try again." });
    } finally {
      setLoading(false);
       logger.info("Auth initialization finished.");
    }
  }, [toast, refreshAuthUser, fetchUserProfile, createUserProfile]); // Added dependencies

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    logger.info(`Attempting login for ${email}`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        logger.error('Login error:', error);
        return { error: error.message };
      }
      // State update will be handled by onAuthStateChange listener
      logger.info(`Login successful for ${email}`);
      return {};
    } catch (error: any) {
      logger.error('Login exception:', error);
      return { error: error.message || "An unexpected error occurred during login" };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    logger.info("Attempting logout...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Log the error but proceed with cleanup
        logger.error("Supabase signOut error:", error);
      }
    } catch (error) {
        // Log the error but proceed with cleanup
        logger.error("Exception during signOut:", error);
    } finally {
       logger.info("Performing local state cleanup for logout.");
      // Ensure local state is always cleared on logout attempt
      setUser(null);
      setSession(null);
      // Redirect to login page after state is cleared
      window.location.href = "/login?logout=true";
    }
  }, []);

  // --- Effects ---

  // Initialize auth on component mount
  useEffect(() => {
    const cleanupPromise = initializeAuth();
    return () => {
      cleanupPromise.then(cleanup => {
        if (cleanup) cleanup();
      });
    };
  }, [initializeAuth]); // Depend on the memoized initializeAuth

  // Effect to refresh auth state when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        logger.info('Tab became visible, attempting to refresh auth state.');
        refreshAuthUser(); 
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    logger.debug('Visibility change listener added.');
    return () => { 
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        logger.debug('Visibility change listener removed.');
    };
  }, [refreshAuthUser]);

  // --- Context Provider --- 
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
