"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClientSupabase } from "@/lib/supabase";
import {
  isDemoModeAvailable,
  isInDemoMode,
  enableDemoMode,
  disableDemoMode,
  createDemoUser,
} from "@/lib/demo";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  exitDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const supabase = createClientSupabase();

  // Function to ensure user exists in our database
  const ensureUserExists = async (supabaseUser: User) => {
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            null,
        }),
      });
    } catch (error) {
      console.error("Error ensuring user exists:", error);
    }
  };

  useEffect(() => {
    // Check for demo mode on initial load
    if (isInDemoMode()) {
      const demoUser = createDemoUser() as User;
      // Ensure demo user exists in database
      ensureUserExists(demoUser);
      setUser(demoUser);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await ensureUserExists(session.user);
      }

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await ensureUserExists(session.user);
      }

      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  const signInDemo = async () => {
    if (!isDemoModeAvailable()) {
      console.warn("Demo mode is not available in this environment");
      return;
    }

    const demoUser = createDemoUser() as User;

    // Ensure demo user exists in database
    await ensureUserExists(demoUser);

    setUser(demoUser);
    setIsDemo(true);
    enableDemoMode();
  };

  const exitDemo = () => {
    setUser(null);
    setIsDemo(false);
    disableDemoMode();
  };

  const signOut = async () => {
    if (isDemo) {
      exitDemo();
    } else {
      await supabase.auth.signOut();
    }
  };

  const value = {
    user,
    loading,
    isDemo,
    signIn,
    signInWithEmail,
    signInDemo,
    signOut,
    exitDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
