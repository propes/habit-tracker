"use client";

import { HabitCard } from "./HabitCard";

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

interface HabitListProps {
  habits: Habit[];
  onCheckIn: (habitId: string) => void;
  onUndoCheckIn: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  isLoading?: boolean;
}

export function HabitList({
  habits,
  onCheckIn,
  onUndoCheckIn,
  onEdit,
  onDelete,
  isLoading = false,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No habits created yet
        </h3>
        <p className="text-gray-500">
          Start building better routines by creating your first habit.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onCheckIn={onCheckIn}
          onUndoCheckIn={onUndoCheckIn}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
