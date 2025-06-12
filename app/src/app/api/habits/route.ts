import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger, getRequestContext, getRequestBody } from "@/lib/logger";

const prisma = new PrismaClient();

// GET /api/habits - Get all habits for the authenticated user
export async function GET(request: NextRequest) {
  const context = getRequestContext(request);
  logger.apiRequest(request.method, request.url, context);

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      logger.apiResponse(request.method, request.url, 400, {
        ...context,
        error: "User ID is required",
      });
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        category: true,
        logs: {
          where: {
            completedDate: {
              gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
          orderBy: {
            completedDate: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate streaks and completion rates for each habit
    const habitsWithStats = habits.map((habit) => {
      const logs = habit.logs;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate current streak
      let currentStreak = 0;
      const checkDate = new Date(today);

      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        const logExists = logs.some(
          (log) => log.completedDate.toISOString().split("T")[0] === dateStr
        );

        if (logExists) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate completion rate for last 7 days
      const last7Days: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split("T")[0]);
      }

      const completedInLast7Days = logs.filter((log) =>
        last7Days.includes(log.completedDate.toISOString().split("T")[0])
      ).length;

      const completionRate = Math.round((completedInLast7Days / 7) * 100);

      // Check if completed today
      const todayStr = today.toISOString().split("T")[0];
      const completedToday = logs.some(
        (log) => log.completedDate.toISOString().split("T")[0] === todayStr
      );

      return {
        ...habit,
        currentStreak,
        completionRate,
        completedToday,
        totalLogs: logs.length,
      };
    });

    logger.apiResponse(request.method, request.url, 200, {
      ...context,
      userId,
      habitsCount: habitsWithStats.length,
    });
    return NextResponse.json(habitsWithStats);
  } catch (error) {
    logger.error("Error fetching habits", error, {
      ...context,
      userId: new URL(request.url).searchParams.get("userId") || undefined,
    });
    logger.apiResponse(request.method, request.url, 500, {
      ...context,
      error: "Failed to fetch habits",
    });
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
  const context = getRequestContext(request);
  logger.apiRequest(request.method, request.url, context);

  try {
    const body = await getRequestBody(request);
    const { userId, name, description, categoryId, color } = body as {
      userId: string;
      name: string;
      description?: string;
      categoryId: string;
      color?: string;
    };

    if (!userId || !name || !categoryId) {
      logger.apiResponse(request.method, request.url, 400, {
        ...context,
        body,
        error: "User ID, name, and category are required",
      });
      return NextResponse.json(
        { error: "User ID, name, and category are required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logger.apiResponse(request.method, request.url, 404, {
        ...context,
        body,
        userId,
        error: "User not found",
      });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      logger.apiResponse(request.method, request.url, 404, {
        ...context,
        body,
        userId,
        categoryId,
        error: "Category not found",
      });
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        description,
        categoryId,
        color: color || category.color,
      },
      include: {
        category: true,
      },
    });

    logger.apiResponse(request.method, request.url, 201, {
      ...context,
      userId,
      habitId: habit.id,
      habitName: habit.name,
    });
    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    logger.error("Error creating habit", error, {
      ...context,
      body: await getRequestBody(request),
    });
    logger.apiResponse(request.method, request.url, 500, {
      ...context,
      error: "Failed to create habit",
    });
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
