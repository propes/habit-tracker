"use client";

import { Button } from "@/components/ui/Button";

interface CheckInButtonProps {
  habitId: string;
  isCompleted: boolean;
  onCheckIn: (habitId: string) => void;
  onUndoCheckIn: (habitId: string) => void;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CheckInButton({
  habitId,
  isCompleted,
  onCheckIn,
  onUndoCheckIn,
  isLoading = false,
  size = "md",
}: CheckInButtonProps) {
  const handleClick = () => {
    if (isCompleted) {
      onUndoCheckIn(habitId);
    } else {
      onCheckIn(habitId);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      className={`${
        isCompleted
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {isLoading ? (
        "Loading..."
      ) : isCompleted ? (
        <>
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Done
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
          Check In
        </>
      )}
    </Button>
  );
}
