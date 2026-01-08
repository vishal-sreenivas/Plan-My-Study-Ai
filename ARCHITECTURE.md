# PlanMyStudy AI - Architecture Documentation

This document explains the architecture, design decisions, and key concepts of the PlanMyStudy AI application.

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│  Frontend   │────────▶│   Backend   │
│  (React)    │◀────────│  (Vite)     │◀────────│  (Express)  │
└─────────────┘         └─────────────┘         └─────────────┘
                                                       │
                                                       ├──▶ PostgreSQL
                                                       ├──▶ OpenAI API
                                                       └──▶ YouTube API
```

### Technology Stack

**Frontend:**
- **React 18**: UI library for building interactive interfaces
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **jsPDF**: PDF generation library

**Backend:**
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Prisma**: Modern ORM for database access
- **PostgreSQL**: Relational database
- **JWT**: Token-based authentication
- **OpenAI SDK**: AI course generation
- **Axios**: HTTP client for external APIs

---

## 📁 Project Structure

### Backend Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── config/
│   │   ├── database.js        # Prisma client initialization
│   │   └── env.js             # Environment variable validation
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── courseController.js # Course management logic
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── courseRoutes.js    # Course endpoints
│   ├── services/
│   │   ├── openaiService.js   # AI course generation
│   │   └── youtubeService.js  # YouTube video fetching
│   ├── utils/
│   │   ├── errors.js          # Error handling utilities
│   │   └── jwt.js             # JWT token utilities
│   └── server.js              # Express app entry point
└── package.json
```

**Key Concepts:**

1. **Separation of Concerns**: Controllers handle HTTP, services handle business logic
2. **Middleware Pattern**: Authentication is handled via middleware
3. **Service Layer**: External API calls are abstracted into services
4. **Error Handling**: Centralized error handling with custom error classes

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx         # Page layout wrapper
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── Dashboard.jsx     # Course list
│   │   ├── CreateCourse.jsx   # Course generation form
│   │   └── CourseDetail.jsx  # Course details view
│   ├── services/
│   │   └── api.js             # API client with interceptors
│   ├── utils/
│   │   ├── auth.js            # Auth helper functions
│   │   └── pdfExport.js       # PDF generation utility
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
└── package.json
```

**Key Concepts:**

1. **Component-Based**: Reusable React components
2. **Service Layer**: API calls abstracted from components
3. **Protected Routes**: Authentication checks via route guards
4. **State Management**: Local state with React hooks

---

## 🔐 Authentication Flow

### Registration Flow

```
1. User submits registration form
   ↓
2. Frontend sends POST /api/auth/register
   ↓
3. Backend validates input
   ↓
4. Backend hashes password (bcrypt)
   ↓
5. Backend creates user in database
   ↓
6. Backend generates JWT token
   ↓
7. Frontend stores token in localStorage
   ↓
8. User redirected to dashboard
```

### Login Flow

```
1. User submits login form
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend finds user by email
   ↓
4. Backend verifies password (bcrypt.compare)
   ↓
5. Backend generates JWT token
   ↓
6. Frontend stores token in localStorage
   ↓
7. User redirected to dashboard
```

### Protected Route Flow

```
1. User navigates to protected route
   ↓
2. Frontend checks localStorage for token
   ↓
3. If no token → redirect to /login
   ↓
4. If token exists → make API request with token
   ↓
5. Backend middleware verifies JWT token
   ↓
6. If valid → attach userId to request
   ↓
7. If invalid → return 401, frontend redirects to login
```

---

## 🤖 AI Course Generation Flow

### Step-by-Step Process

```
1. User submits course form
   ↓
2. Frontend sends POST /api/course/generate
   {
     topic: "React Development",
     level: "beginner",
     days: 7,
     timePerDay: 60
   }
   ↓
3. Backend validates input
   ↓
4. Backend calls OpenAI API with structured prompt
   ↓
5. OpenAI generates JSON course plan
   ↓
6. Backend validates JSON structure
   ↓
7. Backend enriches with YouTube videos
   (For each lesson, search YouTube using keywords)
   ↓
8. Backend saves course to database
   ↓
9. Backend returns complete course plan
   ↓
10. Frontend displays course with all details
```

### AI Prompt Engineering

The system uses a carefully crafted prompt that:
- Specifies exact JSON structure
- Includes all user requirements
- Requests specific fields (objectives, time estimates, keywords)
- Uses system message to enforce JSON-only responses

**Retry Logic:**
- If JSON is malformed, retry up to 3 times
- Exponential backoff between retries
- Validates structure before returning

---

## 📊 Database Schema

### Entity Relationship Diagram

```
User (1) ────< (Many) Course
                    │
                    │ (1)
                    │
                    └───< (Many) Progress
```

### Models Explained

**User:**
- Stores authentication credentials
- Hashed passwords (never store plain text)
- One-to-many relationship with Course

**Course:**
- Stores course metadata (topic, level, days, timePerDay)
- Stores full course plan as JSON (planJson)
- Belongs to one User
- Has many Progress records

**Progress:**
- Tracks lesson completion
- Unique constraint on (courseId, day, lessonId)
- Allows marking individual lessons as complete
- Stores completion timestamp

### Why JSON for Course Plan?

The course plan is stored as JSON because:
- Structure is dynamic (varies by topic)
- AI generates different structures
- Easy to query and update
- Flexible for future enhancements

---

## 🎨 Frontend Architecture Patterns

### Component Hierarchy

```
App
├── Layout (header, navigation)
│   ├── Home
│   ├── Login
│   ├── Register
│   └── ProtectedRoute
│       ├── Dashboard
│       ├── CreateCourse
│       └── CourseDetail
```

### State Management

- **Local State**: Using `useState` for component-specific data
- **API State**: Managed in components with loading/error states
- **Auth State**: Stored in localStorage, checked on mount

### API Integration

**Axios Interceptors:**
- Request: Automatically adds JWT token to headers
- Response: Handles 401 errors globally (redirects to login)

**Error Handling:**
- Toast notifications for user feedback
- Try-catch blocks in async functions
- Graceful degradation (e.g., YouTube API failures don't break course generation)

---

## 🔄 Data Flow Examples

### Creating a Course

```
User Input (Form)
    ↓
CreateCourse Component
    ↓
courseAPI.generate() [services/api.js]
    ↓
POST /api/course/generate [with JWT token]
    ↓
authenticate middleware [verifies token]
    ↓
generateCourse controller
    ↓
generateCoursePlan() [OpenAI service]
    ↓
enrichCourseWithVideos() [YouTube service]
    ↓
Save to database [Prisma]
    ↓
Return course data
    ↓
Navigate to CourseDetail page
    ↓
Display course plan
```

### Tracking Progress

```
User clicks "Mark Complete"
    ↓
CourseDetail Component
    ↓
courseAPI.updateProgress()
    ↓
PUT /api/course/progress
    ↓
updateProgress controller
    ↓
Upsert Progress record [Prisma]
    ↓
Return updated progress
    ↓
Refresh course data
    ↓
Update UI (progress bar, checkmarks)
```

---

## 🛡️ Security Considerations

### Authentication Security

1. **Password Hashing**: bcrypt with 10 rounds
2. **JWT Tokens**: Signed with secret, 7-day expiration
3. **Token Storage**: localStorage (consider httpOnly cookies for production)
4. **Protected Routes**: Both frontend and backend checks

### API Security

1. **Input Validation**: All inputs validated before processing
2. **SQL Injection**: Prevented by Prisma (parameterized queries)
3. **CORS**: Configured to allow only frontend origin
4. **Rate Limiting**: Should be added in production

### Data Security

1. **Sensitive Data**: Never log passwords or tokens
2. **Error Messages**: Generic messages to users, detailed logs for debugging
3. **Environment Variables**: All secrets in .env (never commit)

---

## 🚀 Performance Optimizations

### Backend

1. **Database Indexing**: Indexes on userId, courseId for faster queries
2. **Connection Pooling**: Prisma handles connection pooling
3. **Async Operations**: All I/O operations are async/await
4. **Error Retry**: Exponential backoff for API calls

### Frontend

1. **Code Splitting**: React Router enables lazy loading
2. **API Caching**: Could add React Query for caching
3. **Image Optimization**: YouTube thumbnails are optimized
4. **Bundle Size**: Vite optimizes production builds

---

## 🔮 Future Enhancements

### Potential Improvements

1. **Real-time Updates**: WebSockets for live progress updates
2. **Offline Support**: Service workers for PWA
3. **Advanced Analytics**: Learning analytics dashboard
4. **Social Features**: Share courses, study groups
5. **More Resources**: Articles, books, practice exercises
6. **AI Chat**: Chatbot for course questions
7. **Mobile App**: React Native version
8. **Email Notifications**: Daily reminders, progress reports

### Scalability Considerations

1. **Database**: Add read replicas for high traffic
2. **Caching**: Redis for frequently accessed courses
3. **CDN**: Serve static assets via CDN
4. **Load Balancing**: Multiple backend instances
5. **Queue System**: Background job processing for AI generation

---

## 📝 Code Quality

### Best Practices Followed

1. **Clean Code**: Descriptive names, single responsibility
2. **Error Handling**: Comprehensive try-catch blocks
3. **Comments**: Inline comments explaining complex logic
4. **Consistency**: Uniform code style
5. **Modularity**: Reusable functions and components

### Testing Recommendations

1. **Unit Tests**: Test services and utilities
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test user flows
4. **AI Tests**: Mock OpenAI responses for testing

---

This architecture provides a solid foundation for a production-ready application with room for growth and enhancement.

