"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/Button";

export default function AuthButton() {
  const { user, loading, isDemo, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [message, setMessage] = useState("");

  if (loading) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
              🎭 Demo
            </span>
          )}
          <span className="text-sm text-gray-600">
            Welcome, {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        <Button onClick={signOut} variant="outline">
          {isDemo ? "Exit Demo" : "Sign Out"}
        </Button>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSigningIn(true);
    setMessage("");

    try {
      await signInWithEmail(email);
      setMessage("Check your email for the magic link!");
      setEmail("");
    } catch (error) {
      setMessage("Error sending magic link. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (showEmailForm) {
    return (
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSignIn} className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSigningIn}
            required
          />
          <Button
            type="submit"
            disabled={isSigningIn || !email.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSigningIn ? "Sending..." : "Send Link"}
          </Button>
        </form>
        {message && (
          <p
            className={`text-sm ${
              message.includes("Check") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <Button
          onClick={() => setShowEmailForm(false)}
          variant="outline"
          className="text-sm"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowEmailForm(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Sign In with Email
    </Button>
  );
}
