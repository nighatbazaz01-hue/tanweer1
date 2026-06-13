# Tanweer School Management Platform

## Overview
AI-powered, multi-tenant SaaS School Management Platform designed for modern education. Targets schools from 500 to 50,000+ students.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Shadcn UI + Radix UI + Tailwind CSS
- **State**: Zustand (global UI state) + TanStack React Query (server state)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Theme**: next-themes (dark/light mode ready)

## Project Structure
- `src/app/` — Next.js App Router pages
  - `(auth)/login` — Login page
  - `(dashboard)/` — Protected dashboard layout + module pages
- `src/components/` — Shared UI components
  - `ui/` — Shadcn/Radix primitives
  - `common/` — Layout components (Sidebar, Topbar, AI Drawer, etc.)
- `src/features/` — Feature-specific modules
- `src/lib/` — Utilities, mock data
- `src/store/` — Zustand stores
- `src/types/` — Global TypeScript types

## Key Modules
1. Dashboard — KPI cards, activity feed, schedule
2. Students — Student records, search, profiles
3. Admissions — Lead pipeline management
4. Academics — Subjects, timetable, exams
5. Attendance — Daily attendance tracking
6. Finance/Fees — Fee collection, payment tracking
7. AI Insights — Predictive analytics, risk alerts
8. Settings — School configuration

## Running the App
```bash
npm run dev   # Starts on port 5000
```

## User Preferences
- Planning documents are in the `plan/` directory — refer to these for feature specs
- The app uses mock data in `src/lib/mockData.ts` until a real backend is connected
- Architecture designed for PostgreSQL + NestJS backend (planned, not yet implemented)
