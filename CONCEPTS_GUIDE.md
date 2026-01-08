# PlanMyStudy AI - Concepts Explained

This guide explains the key concepts and technologies used in this project, step by step.

---

## 🏗️ Architecture Concepts

### 1. Full-Stack Application

**What it means:**
- **Frontend**: The user interface (what users see and interact with)
- **Backend**: The server that processes requests, talks to databases, and calls external APIs
- **Database**: Stores all data (users, courses, progress)

**Why this architecture:**
- Separation of concerns (UI separate from business logic)
- Security (sensitive operations on server)
- Scalability (can scale frontend and backend independently)

### 2. REST API

**What it means:**
REST (Representational State Transfer) is a way to structure API endpoints.

**How it works:**
- `GET`: Retrieve data (e.g., get all courses)
- `POST`: Create new data (e.g., create a course)
- `PUT`: Update existing data (e.g., update progress)
- `DELETE`: Remove data

**Example:**
```
GET /api/course → Returns all courses
POST /api/course/generate → Creates a new course
GET /api/course/123 → Returns course with ID 123
```

### 3. JWT Authentication

**What it means:**
JWT (JSON Web Token) is a way to authenticate users without storing session data on the server.

**How it works:**
1. User logs in with email/password
2. Server verifies credentials
3. Server creates a token (contains user ID)
4. Server sends token to client
5. Client stores token (localStorage)
6. Client sends token with every request
7. Server verifies token and extracts user ID

**Why JWT:**
- Stateless (no server-side session storage)
- Scalable (works across multiple servers)
- Secure (signed with secret key)

**Token Structure:**
```
Header.Payload.Signature
```

The payload contains: `{ userId: "123", exp: 1234567890 }`

---

## 🗄️ Database Concepts

### 1. Relational Database (PostgreSQL)

**What it means:**
Data is stored in tables with relationships between them.

**Our Tables:**
- `User`: Stores user information
- `Course`: Stores course data (linked to User)
- `Progress`: Stores lesson completion (linked to Course)

**Relationships:**
- One User can have many Courses (1-to-many)
- One Course can have many Progress records (1-to-many)

### 2. ORM (Object-Relational Mapping)

**What it means:**
Prisma is an ORM that lets us write JavaScript instead of SQL.

**Example:**
```javascript
// Instead of SQL:
// SELECT * FROM users WHERE email = 'user@example.com'

// We write:
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

**Benefits:**
- Type-safe queries
- Auto-completion in IDE
- Prevents SQL injection
- Easy migrations

### 3. Database Migrations

**What it means:**
Migrations are scripts that modify the database structure.

**How it works:**
1. Define schema in `schema.prisma`
2. Run `npx prisma migrate dev`
3. Prisma generates SQL migration
4. Prisma applies migration to database
5. Database structure is updated

**Why migrations:**
- Version control for database
- Reproducible across environments
- Safe updates

---

## 🤖 AI Integration Concepts

### 1. OpenAI API

**What it means:**
OpenAI provides AI models that can generate text based on prompts.

**How we use it:**
1. User provides: topic, level, days, time
2. We create a detailed prompt
3. Send prompt to OpenAI API
4. OpenAI generates structured course plan (JSON)
5. We parse and validate the JSON
6. Save to database

**Prompt Engineering:**
- We craft specific prompts to get structured output
- System message enforces JSON-only responses
- User message contains course requirements

**Example Prompt:**
```
Create a 7-day study plan for "React Development" at beginner level.
Generate JSON with modules, daily plans, and learning objectives.
```

### 2. Structured Output

**What it means:**
We need consistent JSON structure from AI, not free-form text.

**How we ensure it:**
- Detailed prompt with exact structure
- System message: "Always return valid JSON only"
- Validation after receiving response
- Retry logic if JSON is malformed

**JSON Structure:**
```json
{
  "overview": { "title", "description", "objectives" },
  "modules": [{ "id", "title", "description" }],
  "dailyPlan": [{ "day", "lessons": [...] }]
}
```

### 3. Retry Logic

**What it means:**
If AI returns invalid JSON, we try again.

**How it works:**
1. Call OpenAI API
2. Try to parse JSON
3. If fails, wait 1 second
4. Try again (up to 3 times)
5. If still fails, return error

**Why needed:**
- AI sometimes returns markdown instead of JSON
- Network issues can corrupt responses
- Ensures reliability

---

## 🎨 Frontend Concepts

### 1. React Components

**What it means:**
React uses components (reusable UI pieces) to build interfaces.

**Component Types:**
- **Pages**: Full page components (Login, Dashboard)
- **Components**: Reusable pieces (Layout, ProtectedRoute)
- **Services**: API communication layer

**Example:**
```jsx
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}
```

### 2. React Hooks

**What it means:**
Hooks let components use state and side effects.

**useState:**
```jsx
const [count, setCount] = useState(0);
// count is the value
// setCount is the function to update it
```

**useEffect:**
```jsx
useEffect(() => {
  // Runs after component mounts
  fetchData();
}, [dependencies]);
```

**Why hooks:**
- Functional components (simpler than classes)
- Reusable logic
- Better performance

### 3. React Router

**What it means:**
Handles navigation between pages without full page reloads.

**How it works:**
- Define routes in `App.jsx`
- Use `<Link>` for navigation
- Use `<Navigate>` for redirects
- Protected routes check authentication

**Example:**
```jsx
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/login" element={<Login />} />
```

### 4. State Management

**What it means:**
Managing data that changes over time.

**Local State:**
- Component-specific data
- Managed with `useState`
- Example: form inputs, loading states

**Global State:**
- Shared across components
- In this app: localStorage for auth
- Could use Context API or Redux for complex apps

---

## 🔐 Security Concepts

### 1. Password Hashing

**What it means:**
Passwords are never stored in plain text.

**How it works:**
1. User creates password: "mypassword123"
2. Server hashes it: "a1b2c3d4e5f6..." (bcrypt)
3. Store hash in database
4. When user logs in, hash the input password
5. Compare hashes (not plain text)

**Why hash:**
- Even if database is compromised, passwords are safe
- bcrypt is slow (prevents brute force attacks)
- One-way function (can't reverse)

### 2. JWT Tokens

**What it means:**
Tokens prove user is authenticated without storing sessions.

**Token Lifecycle:**
1. User logs in → Server creates token
2. Token stored in localStorage (client)
3. Token sent with every API request
4. Server verifies token signature
5. Token expires after 7 days

**Security:**
- Signed with secret key (only server can verify)
- Contains expiration time
- No sensitive data in token

### 3. CORS (Cross-Origin Resource Sharing)

**What it means:**
Browsers block requests from different origins (domains) by default.

**How we handle it:**
- Backend allows requests from frontend URL
- Configured in Express with `cors` middleware
- Only allows specific origin (security)

**Example:**
```
Frontend: http://localhost:5173
Backend: http://localhost:5000
→ Backend allows requests from frontend
```

### 4. Input Validation

**What it means:**
Validate all user input before processing.

**Why needed:**
- Prevent invalid data
- Security (prevent injection attacks)
- Better user experience (catch errors early)

**Example:**
```javascript
if (!email || !password) {
  throw new Error('Email and password required');
}
if (password.length < 6) {
  throw new Error('Password too short');
}
```

---

## 📡 API Communication Concepts

### 1. HTTP Requests

**What it means:**
Frontend and backend communicate via HTTP.

**Request Structure:**
- **Method**: GET, POST, PUT, DELETE
- **URL**: Endpoint path
- **Headers**: Authorization, Content-Type
- **Body**: Data (for POST/PUT)

**Example:**
```javascript
POST /api/auth/login
Headers: { "Content-Type": "application/json" }
Body: { "email": "user@example.com", "password": "..." }
```

### 2. Axios Interceptors

**What it means:**
Interceptors modify requests/responses automatically.

**Request Interceptor:**
- Adds JWT token to every request
- No need to manually add token each time

**Response Interceptor:**
- Handles 401 errors globally
- Redirects to login if token invalid

**Example:**
```javascript
// Automatically adds token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Async/Await

**What it means:**
Handle asynchronous operations (API calls) without callbacks.

**How it works:**
```javascript
// Old way (callbacks):
fetch('/api/course').then(response => {
  response.json().then(data => {
    console.log(data);
  });
});

// New way (async/await):
const response = await fetch('/api/course');
const data = await response.json();
console.log(data);
```

**Why async/await:**
- Cleaner code
- Easier error handling
- More readable

---

## 🎯 Business Logic Concepts

### 1. Course Generation Flow

**Step-by-step:**
1. User submits form → Frontend validates
2. Frontend sends request → Backend receives
3. Backend validates input → Checks requirements
4. Backend calls OpenAI → Generates course plan
5. Backend validates JSON → Ensures structure
6. Backend enriches with videos → YouTube API
7. Backend saves to database → Prisma
8. Backend returns course → Frontend receives
9. Frontend displays course → User sees plan

### 2. Progress Tracking

**How it works:**
1. User clicks "Mark Complete"
2. Frontend sends PUT request
3. Backend upserts Progress record
4. Backend returns updated progress
5. Frontend refreshes course data
6. UI updates (progress bar, checkmarks)

**Upsert:**
- If progress exists → Update
- If doesn't exist → Create
- Ensures one record per lesson

### 3. PDF Export

**How it works:**
1. User clicks "Export PDF"
2. Frontend calls `exportCourseToPDF()`
3. jsPDF library creates PDF
4. Adds course data (text, formatting)
5. Downloads PDF file

**jsPDF:**
- JavaScript library for PDF generation
- Creates PDF in browser
- No server needed

---

## 🛠️ Development Concepts

### 1. Environment Variables

**What it means:**
Configuration values that change per environment.

**Why use .env:**
- Keep secrets out of code
- Different values for dev/production
- Easy to change without code changes

**Example:**
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### 2. Development vs Production

**Development:**
- Hot reload (auto-refresh on changes)
- Detailed error messages
- Debug logging
- Local database

**Production:**
- Optimized builds
- Generic error messages
- Minimal logging
- Production database
- HTTPS required

### 3. Error Handling

**Backend:**
- Try-catch blocks
- Custom error classes
- Global error handler
- Returns structured error responses

**Frontend:**
- Try-catch in async functions
- Toast notifications
- Loading states
- Graceful degradation

---

## 📦 Build & Deployment Concepts

### 1. Vite (Build Tool)

**What it means:**
Vite is a fast build tool for frontend.

**Development:**
- Fast hot module replacement
- Instant server start
- Optimized dev experience

**Production:**
- Bundles all code
- Minifies JavaScript
- Optimizes assets
- Creates `dist/` folder

### 2. Prisma Migrations

**What it means:**
Scripts that update database structure.

**Development:**
- `prisma migrate dev` - Creates and applies migration
- Resets database if needed

**Production:**
- `prisma migrate deploy` - Applies migrations only
- Never resets data

### 3. Database Seeding

**What it means:**
Populating database with initial data.

**Not implemented here, but could:**
- Create default courses
- Add sample users
- Initialize settings

---

## 🎓 Learning Path

### For Beginners:

1. **Start with Frontend:**
   - Understand React components
   - Learn JSX syntax
   - Practice with useState/useEffect

2. **Then Backend:**
   - Learn Express basics
   - Understand REST APIs
   - Practice with database queries

3. **Then Integration:**
   - Connect frontend to backend
   - Handle authentication
   - Work with external APIs

### Key Files to Study:

**Frontend:**
- `src/pages/CreateCourse.jsx` - Form handling
- `src/services/api.js` - API communication
- `src/pages/CourseDetail.jsx` - Complex component

**Backend:**
- `src/controllers/courseController.js` - Business logic
- `src/services/openaiService.js` - AI integration
- `src/middleware/auth.js` - Authentication

---

## 🔍 Debugging Tips

### 1. Check Console

**Frontend:**
- Browser DevTools → Console
- Network tab for API requests
- React DevTools for component state

**Backend:**
- Terminal output
- Check error messages
- Add console.log for debugging

### 2. Common Issues

**"Cannot connect to backend":**
- Check backend is running
- Verify PORT in .env
- Check CORS settings

**"Database error":**
- Check PostgreSQL is running
- Verify DATABASE_URL
- Check database exists

**"API key error":**
- Verify key is correct
- Check key has permissions
- Verify quota/credits

---

This guide covers the main concepts. For specific implementation details, see the code comments in each file!

