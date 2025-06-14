# Habit Tracker - Development Plan

## Component Architecture

```
src/
├── components/
│   ├── ui/ (shadcn/ui components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── dialog.tsx
│   ├── habits/
│   │   ├── HabitCard.tsx
│   │   ├── HabitForm.tsx
│   │   ├── HabitList.tsx
│   │   └── CheckInButton.tsx
│   ├── dashboard/
│   │   ├── DashboardStats.tsx
│   │   ├── StreakDisplay.tsx
│   │   └── ProgressChart.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Layout.tsx
│   └── auth/
│       └── AuthButton.tsx
├── pages/
│   ├── api/ (API routes)
│   │   ├── auth/[...nextauth].ts
│   │   ├── habits/
│   │   │   ├── index.ts
│   │   │   └── [id]/
│   │   │       ├── index.ts
│   │   │       └── logs.ts
│   │   ├── user/settings.ts
│   │   └── cron/reminders.ts
│   ├── dashboard/
│   │   └── index.tsx
│   ├── habits/
│   │   ├── index.tsx
│   │   └── new.tsx
│   ├── settings/
│   │   └── index.tsx
│   └── _app.tsx, index.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── queries.ts
├── types/
│   └── index.ts
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

## Development Phases

### Phase 1: Foundation (Day 1-2) ✅ COMPLETE
**Goal**: Set up project structure and basic authentication

**Tasks**:
1. ✅ Create Next.js project with TypeScript
2. ✅ Install and configure dependencies:
   - Prisma + Supabase
   - Supabase Auth (Magic Links)
   - Tailwind CSS
   - React Query
   - Recharts
3. ✅ Set up Prisma schema
4. ✅ Configure Supabase Auth with Magic Link authentication
5. ✅ Create basic layout components
6. ✅ Set up environment variables

**Deliverables**:
- ✅ Working Next.js app with TypeScript
- ✅ Database connection established
- ✅ Magic Link authentication working
- ✅ Basic navigation and layout

### Phase 2: Core Features (Day 3-4) ✅ COMPLETE
**Goal**: Implement habit management and daily check-ins

**Tasks**:
1. ✅ Create habit CRUD API routes
2. ✅ Build habit management components:
   - HabitForm (create/edit)
   - HabitList (display habits)
   - HabitCard (individual habit display)
3. ✅ Implement daily check-in interface
4. ✅ Create dashboard with today's habits
5. ✅ Add category system with predefined categories

**Deliverables**:
- ✅ Users can create, edit, delete habits
- ✅ Daily check-in interface working
- ✅ Habits organized by categories
- ✅ Basic dashboard showing today's habits

**Actual Implementation**:
- **API Routes**: Complete CRUD operations with validation
- **Components**: HabitForm, HabitCard, HabitList, CheckInButton
- **Pages**: Dashboard, Habits management, New habit creation
- **Features**: Real-time updates, streak tracking, statistics, error handling

### Phase 3: Analytics & Tracking (Day 5)
**Goal**: Add streak tracking and progress visualization

**Tasks**:
1. Implement streak calculation logic
2. Create progress charts with Recharts:
   - Weekly completion rates
   - Monthly overview
   - Streak visualization
3. Build statistics dashboard
4. Add habit completion history

**Deliverables**:
- Streak tracking (current and longest)
- Visual progress charts
- Statistics dashboard
- Historical data view

### Phase 4: Enhancements (Day 6)
**Goal**: Polish the application and improve user experience

**Tasks**:
1. Mobile responsiveness improvements
2. UI/UX polish and animations
3. Error handling and loading states
4. Testing and bug fixes
5. Performance optimizations

**Deliverables**:
- Fully responsive design
- Polished user experience
- Robust error handling
- Production-ready application

### Phase 5: Enhanced Authentication (Optional)
**Goal**: Add multiple authentication providers

**Tasks**:
1. Implement Google OAuth integration
2. Add additional social providers (GitHub, Apple)
3. Enhanced user profile management
4. Account linking functionality
5. Migration tools for existing users

**Deliverables**:
- Multiple sign-in options
- Enhanced user experience
- Professional authentication flow
- Account management features

### Phase 6: Row Level Security Implementation
**Goal**: Add database-level security while maintaining Prisma ORM benefits

**Overview**: Implement PostgreSQL Row Level Security (RLS) policies while keeping Prisma for complex queries and type safety. This provides database-level security that works regardless of how the database is accessed.

**Implementation Strategy**: Hybrid RLS with Prisma
- Keep existing Prisma setup for complex queries
- Add Supabase user context to database connections
- Implement RLS policies at the PostgreSQL level
- Create custom Prisma client wrapper for authenticated operations

**Tasks**:

#### Step 1: Database RLS Policies Setup (1-2 hours)
1. **Enable RLS on all user-related tables**:
   ```sql
   ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "Habit" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "HabitLog" ENABLE ROW LEVEL SECURITY;
   ```

2. **Create comprehensive RLS policies**:
   ```sql
   -- Users can only access their own profile
   CREATE POLICY "user_own_profile" ON "User" 
   FOR ALL USING (auth.uid()::text = id);

   -- Users can only manage their own habits
   CREATE POLICY "user_own_habits" ON "Habit" 
   FOR ALL USING (auth.uid()::text = "userId");

   -- Users can only access logs for their habits
   CREATE POLICY "user_own_habit_logs" ON "HabitLog" 
   FOR ALL USING (
     EXISTS (
       SELECT 1 FROM "Habit" 
       WHERE "Habit".id = "HabitLog"."habitId" 
       AND "Habit"."userId" = auth.uid()::text
     )
   );

   -- Categories are readable by all authenticated users
   CREATE POLICY "categories_read_all" ON "Category" 
   FOR SELECT USING (auth.role() = 'authenticated');
   ```

#### Step 2: Custom Prisma Client with User Context (2-3 hours)
1. **Create authenticated Prisma client wrapper** (`lib/prisma-rls.ts`)
2. **Create helper function for authenticated operations** (`lib/auth-prisma.ts`)
3. **Abstract user authentication and context setting**

#### Step 3: Update API Routes for RLS (3-4 hours)
1. **Modify existing API routes to use authenticated Prisma client**
2. **Remove manual userId filtering** (RLS handles this automatically)
3. **Update error handling for unauthorized access**
4. **Ensure all routes use the new authenticated client**

#### Step 4: Frontend Authentication Integration (2-3 hours)
1. **Update API calls to include auth headers**
2. **Create authenticated fetch wrapper**
3. **Update React Query hooks to use authenticated requests**
4. **Handle authentication errors gracefully**

#### Step 5: Testing & Validation (2-3 hours)
1. **Create RLS test suite**:
   - Test that users can only access their own data
   - Test that unauthenticated requests are blocked
   - Test that malicious requests can't bypass RLS
   - Verify all existing functionality still works
2. **Performance testing**: Ensure RLS policies don't impact performance
3. **Security audit**: Review policies for potential bypasses

#### Step 6: Migration Strategy (1-2 hours)
1. **Gradual rollout approach**: Deploy in permissive mode first
2. **Rollback plan**: Document how to disable RLS if issues arise
3. **Database backup**: Before policy deployment

**Benefits**:
- Database-level security (protection even if application code has bugs)
- Maintains Prisma benefits (type safety and complex queries)
- Automatic filtering (no need to manually add userId filters)
- Future-proof (works with any database access method)
- Compliance ready (meets security requirements for data isolation)

**Potential Challenges & Solutions**:
- **Connection Complexity**: Abstract behind helper functions
- **Performance Impact**: Optimize policies with proper indexes
- **Development Complexity**: Comprehensive documentation and examples

**Success Metrics**:
- [ ] All user data properly isolated by RLS policies
- [ ] No performance degradation > 10%
- [ ] All existing functionality works unchanged
- [ ] Security audit passes with no critical issues
- [ ] Development team comfortable with new patterns

**Deliverables**:
- Database-level security with RLS policies
- Custom authenticated Prisma client wrapper
- Updated API routes with automatic user context
- Comprehensive test suite for security validation
- Documentation for RLS implementation patterns

### Phase 7: Reminder System (Day 7)
**Goal**: Implement comprehensive notification and reminder system

**Overview**: Add a robust reminder system that helps users stay consistent with their habits through timely notifications and customizable reminder settings.

**Tasks**:

#### Step 1: Web Push API Setup (2-3 hours)
1. **Configure service worker for push notifications**:
   - Create service worker file for handling push events
   - Register service worker in the application
   - Handle notification click events and routing
2. **Implement push subscription management**:
   - Create API endpoints for subscription CRUD operations
   - Store push subscriptions in database with user association
   - Handle subscription updates and cleanup

#### Step 2: Notification Settings & User Preferences (2-3 hours)
1. **Create user notification preferences schema**:
   - Add notification settings to User model
   - Include reminder time, frequency, and enabled status
   - Support per-habit notification customization
2. **Build notification settings UI**:
   - Settings page for notification preferences
   - Time picker for daily reminder time
   - Toggle switches for different notification types
   - Test notification functionality

#### Step 3: Vercel Cron Job Implementation (3-4 hours)
1. **Create cron API endpoint** (`/api/cron/reminders.ts`):
   - Scheduled function to run every hour
   - Query users with matching reminder times
   - Generate personalized reminder messages
   - Send push notifications to subscribed devices
2. **Implement notification logic**:
   - Check user's incomplete habits for the day
   - Create contextual reminder messages
   - Handle timezone considerations
   - Log notification delivery status

#### Step 4: Advanced Notification Features (2-3 hours)
1. **Smart notification timing**:
   - Avoid sending notifications for already completed habits
   - Implement streak-based encouragement messages
   - Add motivational quotes and progress highlights
2. **Notification templates and personalization**:
   - Dynamic message generation based on habit progress
   - Celebration notifications for milestones
   - Weekly/monthly progress summaries

#### Step 5: Testing & Optimization (1-2 hours)
1. **Comprehensive testing**:
   - Test notification delivery across different browsers
   - Verify cron job execution and timing
   - Test notification permission handling
2. **Performance optimization**:
   - Optimize database queries for cron jobs
   - Implement efficient notification batching
   - Add error handling and retry logic

**Technical Implementation Details**:

```typescript
// Database Schema Extensions
model User {
  // ... existing fields
  notificationSettings Json? // Stores notification preferences
  pushSubscriptions PushSubscription[]
}

model PushSubscription {
  id String @id @default(cuid())
  userId String
  endpoint String
  keys Json // p256dh and auth keys
  user User @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

// Cron Job Structure
export default async function handler(req: Request) {
  // 1. Get current hour in different timezones
  // 2. Query users with matching reminder times
  // 3. For each user, check incomplete habits
  // 4. Generate and send personalized notifications
  // 5. Log delivery status and handle errors
}
```

**Benefits**:
- Increased user engagement and habit consistency
- Personalized reminder experience
- Flexible notification scheduling
- Cross-platform push notification support
- Analytics on notification effectiveness

**Success Metrics**:
- [ ] Push notifications working across major browsers
- [ ] Cron job executing reliably every hour
- [ ] User notification preferences properly stored and respected
- [ ] Notification delivery rate > 95%
- [ ] User engagement increase measurable after implementation

**Deliverables**:
- Working push notification system
- Customizable user notification preferences
- Automated daily reminder system via cron jobs
- Smart notification logic based on habit completion
- Comprehensive notification analytics and logging

## Key Implementation Details

### Authentication Flow (Magic Links)
1. User enters email address
2. Supabase sends magic link to email
3. User clicks link in email
4. Supabase verifies and creates session
5. User redirected to dashboard
6. Protected routes check authentication status

### Future: Google OAuth Flow
1. User clicks "Sign in with Google"
2. Supabase handles OAuth flow
3. User record created/updated in database
4. Session established with user data
5. Protected routes check authentication status

### Habit Completion Logic
```typescript
// Daily check-in process
1. Fetch user's active habits for today
2. Check existing completions for today
3. Display habits with completion status
4. On toggle: create/delete HabitLog entry
5. Recalculate streaks after each change
```

### Streak Calculation
```typescript
// Current streak: consecutive days from today backwards
// Longest streak: maximum consecutive days in history
function calculateStreaks(habitLogs: HabitLog[]) {
  // Sort logs by date descending
  // Count consecutive days from today
  // Find longest consecutive sequence
}
```

### Reminder System
```typescript
// Vercel cron job runs every hour
// Checks users with reminder time matching current hour
// Sends push notifications to subscribed users
// Users can enable/disable notifications in settings
```

## Dependencies Installed ✅ (Latest Versions as of June 2025)

```json
{
  "dependencies": {
    "next": "^15.3.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "typescript": "^5.8.3",
    "@prisma/client": "^6.9.0",
    "prisma": "^6.9.0",
    "@supabase/supabase-js": "^2.50.0",
    "@tanstack/react-query": "^5.80.6",
    "recharts": "^2.15.3",
    "tailwindcss": "^4.1.8",
    "lucide-react": "^0.513.0",
    "date-fns": "^4.1.0",
    "web-push": "^3.6.7",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^15.3.3",
    "tsx": "^4.19.4"
  }
}
```

## Environment Setup Checklist

- [x] Supabase project created
- [x] Environment variables set
- [x] Database schema deployed
- [x] Magic link authentication configured
- [ ] Email sending configured (optional for magic links)
- [ ] Vercel project connected
- [ ] Push notification keys generated
- [ ] Google OAuth app configured (Phase 5)

## Testing Strategy

1. **Unit Tests**: Core utility functions (streak calculation, date handling)
2. **Integration Tests**: API routes and database operations
3. **E2E Tests**: Critical user flows (sign in, create habit, check-in)
4. **Manual Testing**: Cross-browser compatibility, mobile responsiveness

## Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database migrations run
- [ ] Google OAuth redirect URLs updated
- [ ] Cron jobs configured
- [ ] Push notification setup complete
- [ ] Domain configured (if custom domain)
