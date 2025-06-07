# Habit Tracker - Technical Specification

## Project Overview
A cloud-based habit tracker web application with Google SSO, daily habit tracking, streak monitoring, and progress visualization.

## Tech Stack
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js with Google Provider
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Hosting**: Vercel
- **Notifications**: Web Push API + Vercel Cron

## Features Requirements
- Daily check-ins with simple checkbox interface
- Streak tracking (current and longest streaks)
- Habit categories with predefined options
- Progress charts (weekly/monthly completion rates)
- Reminders: Default 8am daily, user can change global reminder time
- Multi-user support with Google SSO
- Modern, responsive design

## Database Schema

### Users Table (managed by NextAuth)
```sql
Users {
  id: String @id
  email: String @unique
  name: String?
  image: String?
  reminderTime: String @default("08:00") // 24hr format
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}
```

### Categories Table
```sql
Categories {
  id: String @id @default(cuid())
  name: String
  icon: String
  color: String
  createdAt: DateTime @default(now())
}
```

### Habits Table
```sql
Habits {
  id: String @id @default(cuid())
  userId: String
  name: String
  description: String?
  categoryId: String
  color: String @default("#3B82F6")
  isActive: Boolean @default(true)
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
  category: Category @relation(fields: [categoryId], references: [id])
  logs: HabitLog[]
}
```

### Habit Logs Table
```sql
HabitLogs {
  id: String @id @default(cuid())
  habitId: String
  completedDate: DateTime // Date only (YYYY-MM-DD)
  notes: String?
  createdAt: DateTime @default(now())
  
  habit: Habit @relation(fields: [habitId], references: [id], onDelete: Cascade)
  
  @@unique([habitId, completedDate])
}
```

## API Routes Structure

```
/api/auth/[...nextauth].ts - NextAuth configuration
/api/habits/
  - GET: List user's habits
  - POST: Create new habit
/api/habits/[id]/
  - PUT: Update habit
  - DELETE: Delete habit
/api/habits/[id]/logs/
  - GET: Get habit logs
  - POST: Log habit completion
  - DELETE: Remove habit log
/api/user/settings/
  - PUT: Update user settings (reminder time)
/api/cron/reminders - Cron job for sending reminders
```

## Predefined Categories
```typescript
const DEFAULT_CATEGORIES = [
  { name: "Health", icon: "💪", color: "#10B981" },
  { name: "Learning", icon: "📚", color: "#3B82F6" },
  { name: "Productivity", icon: "⚡", color: "#F59E0B" },
  { name: "Mindfulness", icon: "🧘", color: "#8B5CF6" },
  { name: "Social", icon: "👥", color: "#EF4444" },
  { name: "Creative", icon: "🎨", color: "#EC4899" }
];
```

## Environment Variables Required
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

## Cost Breakdown
- Vercel: Free (hobby plan)
- Supabase: Free (up to 500MB)
- Domain (optional): ~$10-15/year
- **Total: $0-15/year**
