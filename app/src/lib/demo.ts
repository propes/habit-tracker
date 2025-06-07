/**
 * Demo Mode Utilities
 *
 * Provides secure demo mode functionality that is only available
 * during local development and never in production deployments.
 */

export interface DemoUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    avatar_url?: string;
  };
  app_metadata: {
    provider: string;
    providers: string[];
  };
  aud: string;
  created_at: string;
  updated_at: string;
}

/**
 * Checks if demo mode is available in the current environment
 *
 * Demo mode is only available when:
 * 1. NODE_ENV is 'development'
 * 2. Running on localhost or local network
 * 3. Demo mode is not explicitly disabled
 */
export const isDemoModeAvailable = (): boolean => {
  // Only in development environment
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  // Only on localhost/local IPs (client-side check)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.") ||
      hostname.endsWith(".local") ||
      hostname === "0.0.0.0";

    if (!isLocal) {
      console.warn("Demo mode not available: not running on local network");
      return false;
    }
  }

  // Check if explicitly disabled
  if (process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "false") {
    return false;
  }

  return true;
};

/**
 * Creates a mock demo user for testing purposes
 */
export const createDemoUser = (): DemoUser => {
  if (!isDemoModeAvailable()) {
    throw new Error("Demo mode is not available in this environment");
  }

  console.log("🎭 Demo mode activated - Development only!");

  return {
    id: "demo-user-12345",
    email: "demo@habittracker.app",
    user_metadata: {
      full_name: "Demo User",
      avatar_url: undefined,
    },
    app_metadata: {
      provider: "demo",
      providers: ["demo"],
    },
    aud: "authenticated",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

/**
 * Demo mode storage keys
 */
export const DEMO_STORAGE_KEY = "habit-tracker-demo-mode";

/**
 * Checks if currently in demo mode
 */
export const isInDemoMode = (): boolean => {
  if (!isDemoModeAvailable()) return false;

  if (typeof window !== "undefined") {
    return localStorage.getItem(DEMO_STORAGE_KEY) === "true";
  }

  return false;
};

/**
 * Enables demo mode
 */
export const enableDemoMode = (): void => {
  if (!isDemoModeAvailable()) {
    throw new Error("Demo mode is not available in this environment");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(DEMO_STORAGE_KEY, "true");
  }
};

/**
 * Disables demo mode
 */
export const disableDemoMode = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_STORAGE_KEY);
  }
};
