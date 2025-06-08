"use client";

import { useAuth } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/Button";
import { isDemoModeAvailable } from "@/lib/demo";

export default function DemoButton() {
  const { signInDemo } = useAuth();

  // Only show demo button in development environments
  if (!isDemoModeAvailable()) {
    return null;
  }

  const handleDemoSignIn = async () => {
    try {
      await signInDemo();
    } catch (error) {
      console.error("Error signing in with demo mode:", error);
    }
  };

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🎭</span>
        <h3 className="font-semibold text-yellow-800">Development Mode</h3>
      </div>
      <p className="text-sm text-yellow-700 mb-3">
        Try the app instantly without setting up authentication. Perfect for
        testing and development.
      </p>
      <Button
        onClick={handleDemoSignIn}
        variant="outline"
        className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
      >
        🚀 Try Demo Mode
      </Button>
      <p className="text-xs text-yellow-600 mt-2">
        * Demo mode is only available in development environments
      </p>
    </div>
  );
}
