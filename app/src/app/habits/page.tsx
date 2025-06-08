"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/SessionProvider";
import { HabitList } from "@/components/habits/HabitList";
import { HabitForm } from "@/components/habits/HabitForm";
import { Button } from "@/components/ui/Button";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  currentStreak: number;
  completionRate: number;
  completedToday: boolean;
  totalLogs: number;
}

export default function Habits() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

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

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/habits?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      } else {
        setError("Failed to fetch habits");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError("Failed to fetch habits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (response.ok) {
        await fetchHabits(); // Refresh habits to update stats
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to check in");
      }
    } catch (error) {
      console.error("Error checking in:", error);
      setError("Failed to check in");
    }
  };

  const handleUndoCheckIn = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `/api/habits/${habitId}/logs?userId=${user.id}&completedDate=${today}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchHabits(); // Refresh habits to update stats
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to undo check-in");
      }
    } catch (error) {
      console.error("Error undoing check-in:", error);
      setError("Failed to undo check-in");
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete = async (habitId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this habit? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/habits/${habitId}?userId=${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchHabits(); // Refresh habits list
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete habit");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      setError("Failed to delete habit");
    }
  };

  const handleFormSubmit = async (habitData: {
    name: string;
    description: string;
    categoryId: string;
    color: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingHabit
        ? `/api/habits/${editingHabit.id}`
        : "/api/habits";
      const method = editingHabit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...habitData,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingHabit(null);
        await fetchHabits(); // Refresh habits list
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save habit");
      }
    } catch (error) {
      console.error("Error saving habit:", error);
      setError("Failed to save habit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
    setError(null);
  };

  const handleNewHabit = () => {
    router.push("/habits/new");
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {editingHabit ? "Edit Habit" : "Create New Habit"}
            </h1>
            <p className="text-gray-600">
              {editingHabit
                ? "Update your habit details."
                : "Start building a new positive routine in your life."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <HabitForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              initialData={
                editingHabit
                  ? {
                      name: editingHabit.name,
                      description: editingHabit.description || "",
                      categoryId: editingHabit.category.id,
                      color: editingHabit.color,
                    }
                  : undefined
              }
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <Button onClick={handleNewHabit}>Add New Habit</Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg">Loading habits...</div>
          </div>
        ) : (
          <HabitList
            habits={habits}
            onCheckIn={handleCheckIn}
            onUndoCheckIn={handleUndoCheckIn}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isSubmitting}
          />
        )}

        {habits.length === 0 && !isLoading && (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💡 Tips for Creating Great Habits
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Start small - aim for 1-2 minutes per day</li>
              <li>• Be specific about when and where you&apos;ll do it</li>
              <li>• Stack new habits onto existing routines</li>
              <li>• Focus on consistency over perfection</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
