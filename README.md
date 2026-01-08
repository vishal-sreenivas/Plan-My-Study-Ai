# PlanMyStudy AI

A production-ready AI-powered Course Builder web application that generates personalized study plans with structured syllabi, day-wise schedules, and curated learning resources.

## 🎯 Features

- **User Authentication**: Secure JWT-based authentication
- **AI-Powered Course Generation**: Generate structured courses using OpenAI
- **Day-wise Study Plans**: Personalized schedules based on available time
- **Learning Resources**: Auto-fetch relevant YouTube videos for each lesson
- **Progress Tracking**: Mark lessons as completed and track your progress
- **PDF Export**: Download your study plan as a PDF

## 🏗️ Project Structure

```
PlanMyStudy AI/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🚀 Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md)

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Groq API Key
- YouTube Data API Key

### Quick Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Edit with your credentials
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env  # Edit with API URL
npm run dev
```

See [SETUP.md](./SETUP.md) for complete instructions and troubleshooting.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Courses
- `POST /api/course/generate` - Generate new course
- `GET /api/course/:id` - Get course details
- `GET /api/course` - Get all user courses
- `PUT /api/course/progress` - Update lesson progress

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Prisma ORM
- **AI**: Groq API (Ultra-fast inference)
- **External APIs**: YouTube Data API
- **Auth**: JWT

## 📝 License

MIT

