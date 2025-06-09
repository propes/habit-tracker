import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/habits/[id]/logs - Get logs for a specific habit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const logs = await prisma.habitLog.findMany({
      where: {
        habitId: id,
        ...(Object.keys(dateFilter).length > 0 && {
          completedDate: dateFilter,
        }),
      },
      orderBy: {
        completedDate: "desc",
      },
      ...(limit && { take: parseInt(limit) }),
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching habit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit logs" },
      { status: 500 }
    );
  }
}

// POST /api/habits/[id]/logs - Create a new habit log (check-in)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, completedDate, notes } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Use provided date or today's date
    const logDate = completedDate ? new Date(completedDate) : new Date();
    logDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Check if log already exists for this date
    const existingLog = await prisma.habitLog.findUnique({
      where: {
        habitId_completedDate: {
          habitId: id,
          completedDate: logDate,
        },
      },
    });

    if (existingLog) {
      return NextResponse.json(
        { error: "Habit already completed for this date" },
        { status: 409 }
      );
    }

    const log = await prisma.habitLog.create({
      data: {
        habitId: id,
        completedDate: logDate,
        notes: notes || null,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error creating habit log:", error);
    return NextResponse.json(
      { error: "Failed to create habit log" },
      { status: 500 }
    );
  }
}

// DELETE /api/habits/[id]/logs - Delete a habit log (undo check-in)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const completedDate = searchParams.get("completedDate");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!completedDate) {
      return NextResponse.json(
        { error: "Completed date is required" },
        { status: 400 }
      );
    }

    // Verify habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const logDate = new Date(completedDate);
    logDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Find and delete the log
    const deletedLog = await prisma.habitLog.deleteMany({
      where: {
        habitId: id,
        completedDate: logDate,
      },
    });

    if (deletedLog.count === 0) {
      return NextResponse.json(
        { error: "Habit log not found for this date" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Habit log deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit log:", error);
    return NextResponse.json(
      { error: "Failed to delete habit log" },
      { status: 500 }
    );
  }
}
