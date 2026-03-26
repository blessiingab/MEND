# MEND – Mental and Emotional Nurturing Digital

MEND (Mental and Emotional Nurturing Digital) is a full-stack digital platform designed to support mental health, emotional well-being, and personal development. It integrates assessments, therapy sessions, community interaction, and career guidance into a single system.

🧩 System Overview

MEND consists of two main parts:

Frontend: A responsive React application for users and administrators
Backend: A RESTful API server handling business logic, authentication, and data management
🚀 Features
👤 User Features
Secure user authentication (JWT-based)
Mental health assessments (PHQ-9, GAD-7)
Therapy session booking system
Creative community (posts, likes, comments)
Personalized career guidance and progress tracking
🛠️ Admin Features
User management
Platform analytics and statistics
Monitoring assessments, sessions, and posts
📱 General
Fully responsive design (mobile, tablet, desktop)
Clean and modular architecture
Scalable backend API
🏗️ Project Structure
MEND/
├── frontend/                # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
│
├── backend/                # Node.js backend API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── index.js
│   ├── migrations/
│   └── package.json
⚙️ Installation & Setup

1. Clone the Repository
 git clone
cd MEND
2. Backend Setup
cd backend
npm install

Create .env file:

cp .env.example .env

Update environment variables (example):

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mend
JWT_SECRET=your_secret_key

Run database migrations:

npm run db:migrate

(Optional) Seed sample data:

npm run db:seed

Start backend server:

npm run dev

Backend runs on:
<http://localhost:5000>

1. Frontend Setup
cd ../frontend
npm install

Create .env file:

REACT_APP_API_URL=<http://localhost:5000/api>

Start frontend:

npm start

Frontend runs on:
<http://localhost:3000>

🔌 API Endpoints (Backend)
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/change-password
GET /api/auth/profile
Assessments
POST /api/assessments/phq9
POST /api/assessments/gad7
GET /api/assessments/history
GET /api/assessments/stats
GET /api/assessments/latest/:type
Therapy Sessions
POST /api/sessions/book
GET /api/sessions/my-sessions
GET /api/sessions/available-therapists
GET /api/sessions/:sessionId
PUT /api/sessions/:sessionId
PUT /api/sessions/:sessionId/cancel
Creative Posts
POST /api/posts
GET /api/posts
GET /api/posts/:postId
PUT /api/posts/:postId
DELETE /api/posts/:postId
POST /api/posts/:postId/like
DELETE /api/posts/:postId/like
POST /api/posts/:postId/comments
GET /api/posts/:postId/comments
Career Guidance
POST /api/career/guidance
GET /api/career/my-path
GET /api/career/resources
POST /api/career/progress
GET /api/career/progress/tracking
Admin
GET /api/admin/dashboard/stats
GET /api/admin/users
GET /api/admin/users/:userId
DELETE /api/admin/users/:userId
GET /api/admin/assessments/stats
GET /api/admin/sessions/stats
GET /api/admin/posts/stats
🧠 Technology Stack
Frontend
React 18
React Router v6
Axios
Tailwind CSS
Backend
Node.js
Express.js
Relational Database (MySQL/PostgreSQL)
JWT Authentication
🔄 System Flow
User interacts with the React frontend
Frontend sends requests to backend API
Backend processes logic and interacts with database
Data is returned and displayed in the UI
🔐 Security
JWT-based authentication
Protected routes (frontend & backend)
Input validation and middleware checks
📦 Deployment (Optional)
Frontend: Vercel / Netlify
Backend: Render / Railway / VPS
Database: Cloud SQL / PostgreSQL
📌 Future Improvements
Real-time chat with therapists
AI-based mental health insights
Notifications system
Multi-language support
👨‍💻 Author

MEND Project – Built for mental health support and digital well-being.
