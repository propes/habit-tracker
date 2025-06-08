"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/SessionProvider";
import { HabitForm } from "@/components/habits/HabitForm";

export default function NewHabit() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (habitData: {
    name: string;
    description: string;
    categoryId: string;
    color: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...habitData,
        }),
      });

      if (response.ok) {
        router.push("/habits");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create habit");
      }
    } catch (error) {
      console.error("Error creating habit:", error);
      setError("Failed to create habit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/habits");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Habit
          </h1>
          <p className="text-gray-600">
            Start building a new positive routine in your life.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <HabitForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Tips for Creating Great Habits
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Start small - aim for 1-2 minutes per day</li>
            <li>• Be specific about when and where you&apos;ll do it</li>
            <li>• Stack new habits onto existing routines</li>
            <li>• Focus on consistency over perfection</li>
            <li>• Celebrate small wins to build momentum</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
