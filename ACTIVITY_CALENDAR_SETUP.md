# 📅 Activity Calendar Setup Guide

## ✅ Implementation Complete

### Backend Changes

1. **Database Schema** (`backend/prisma/schema.prisma`)
   - ✅ Added `ActivityLog` model
   - ✅ Relations to User model
   - ✅ Unique constraint on `userId_date`

2. **API Endpoints** 
   - ✅ `POST /api/activity/log` - Log activity
   - ✅ `GET /api/activity` - Get user activity (last 365 days)

3. **Activity Logging**
   - ✅ Course generation logs activity
   - ✅ Lesson completion logs activity

### Frontend Changes

1. **CalendarHeatmap Component** (`frontend/src/components/CalendarHeatmap.jsx`)
   - ✅ GitHub-style contribution calendar
   - ✅ 365-day grid (7 days × 52 weeks)
   - ✅ Color intensity based on activity count
   - ✅ Hover tooltips
   - ✅ Dark/light mode support
   - ✅ Smooth animations

2. **Dashboard Integration**
   - ✅ Calendar displayed at top of dashboard
   - ✅ Shows total contributions

---

## 🚀 Setup Steps

### 1. Run Database Migration

```bash
cd backend
npm run prisma:migrate
```

This will:
- Create the `ActivityLog` table
- Set up indexes and constraints

### 2. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

### 3. Restart Backend

```bash
cd backend
npm run dev
```

### 4. Restart Frontend

```bash
cd frontend
npm run dev
```

---

## 📊 How It Works

### Activity Tracking

Activities are automatically logged when:
1. **Course Generation**: User creates a new course
2. **Lesson Completion**: User marks a lesson as complete

### Calendar Display

- **Grid**: 7 columns (days of week) × 52 rows (weeks)
- **Colors**:
  - Gray: 0 activities
  - Light green: 1-2 activities
  - Medium green: 3-5 activities
  - Dark green: 6+ activities

### Data Flow

1. User action (generate course / complete lesson)
2. Backend logs activity to `ActivityLog` table
3. Frontend fetches activities via `GET /api/activity`
4. Calendar renders with activity data
5. Updates automatically when new activities occur

---

## 🎨 Features

- ✅ GitHub-style design
- ✅ Hover tooltips with date and count
- ✅ Smooth fade-in animations
- ✅ Dark/light mode compatible
- ✅ Responsive design
- ✅ Real-time updates

---

## 📝 API Endpoints

### POST /api/activity/log
Logs activity for the current day (increments count if exists).

**Response:**
```json
{
  "success": true,
  "data": {
    "activity": {
      "id": "...",
      "userId": "...",
      "date": "2024-01-07",
      "count": 1
    }
  }
}
```

### GET /api/activity
Gets all activity for the authenticated user (last 365 days).

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "...",
        "userId": "...",
        "date": "2024-01-07",
        "count": 3
      }
    ],
    "totalContributions": 101
  }
}
```

---

## 🎯 Next Steps

1. Run the migration: `npm run prisma:migrate` in backend
2. Generate Prisma client: `npm run prisma:generate` in backend
3. Restart both servers
4. Test by creating a course or completing a lesson
5. Check the calendar on the dashboard!

---

**The activity calendar is ready to use!** 🎉

