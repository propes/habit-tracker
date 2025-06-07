# Habit Tracker

A modern, cloud-based habit tracking web application built with Next.js, TypeScript, and Supabase.

## Features

- 🔐 **Google SSO Authentication** - Secure login with Google accounts
- ✅ **Daily Check-ins** - Simple checkbox interface for habit completion
- 🔥 **Streak Tracking** - Monitor current and longest streaks
- 📊 **Progress Analytics** - Visual charts showing weekly/monthly progress
- 🏷️ **Habit Categories** - Organize habits with predefined categories
- 🔔 **Smart Reminders** - Daily notifications at customizable times
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ☁️ **Cloud-Based** - Access your habits from anywhere

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js with Google Provider
- **Charts**: Recharts
- **Hosting**: Vercel
- **Notifications**: Web Push API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console account (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the required environment variables:
```env
DATABASE_URL=your_supabase_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── habits/         # Habit-related components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   └── auth/           # Authentication components
│   ├── pages/              # Next.js pages and API routes
│   │   ├── api/            # API endpoints
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── habits/         # Habit management pages
│   │   └── settings/       # Settings pages
│   ├── lib/                # Utility functions and configurations
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── docs/                   # Documentation files
```

## API Routes

- `GET /api/habits` - Get user's habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/[id]` - Update habit
- `DELETE /api/habits/[id]` - Delete habit
- `POST /api/habits/[id]/logs` - Log habit completion
- `DELETE /api/habits/[id]/logs` - Remove habit completion
- `PUT /api/user/settings` - Update user settings

## Database Schema

The application uses four main tables:
- **Users** - User accounts (managed by NextAuth.js)
- **Categories** - Predefined habit categories
- **Habits** - User's habits with category assignments
- **HabitLogs** - Daily completion records

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:
- Update `NEXTAUTH_URL` to your production domain
- Configure Google OAuth redirect URLs
- Set up Vercel cron jobs for reminders

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
