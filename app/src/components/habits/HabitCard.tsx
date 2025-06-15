"use client";

import { useState } from "react";
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

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habitId: string) => void;
  onUndoCheckIn: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  isLoading?: boolean;
}

export function HabitCard({
  habit,
  onCheckIn,
  onUndoCheckIn,
  onEdit,
  onDelete,
  isLoading = false,
}: HabitCardProps) {
  const [showActions, setShowActions] = useState(false);

  const handleCheckIn = () => {
    if (habit.completedToday) {
      onUndoCheckIn(habit.id);
    } else {
      onCheckIn(habit.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {habit.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{habit.category.icon}</span>
              <span className="truncate">{habit.category.name}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(habit);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Habit
                </button>
                <button
                  onClick={() => {
                    onDelete(habit.id);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Habit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {habit.description && (
        <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {habit.currentStreak}
          </div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {habit.completionRate}%
          </div>
          <div className="text-xs text-gray-500">This Week</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {habit.totalLogs}
          </div>
          <div className="text-xs text-gray-500">Total Days</div>
        </div>
      </div>

      <Button
        onClick={handleCheckIn}
        disabled={isLoading}
        className={`w-full ${
          habit.completedToday
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isLoading ? (
          "Loading..."
        ) : habit.completedToday ? (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">
              Completed Today - Click to Undo
            </span>
            <span className="sm:hidden">Completed ✓</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="hidden sm:inline">Mark as Done</span>
            <span className="sm:hidden">Check In</span>
          </>
        )}
      </Button>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}
