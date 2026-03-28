# MEND

**Mental and Emotional Nurturing Digital**

MEND is a full-stack platform for mental health support, therapy workflows, community engagement, and personal growth.

## Project Structure

```text
MEND/
|-- frontend/
|   |-- public/                  # Static assets
|   |-- src/
|   |   |-- components/          # Reusable UI and feature components
|   |   |-- context/             # Global providers such as auth and theme
|   |   |-- hooks/               # Custom React hooks
|   |   |-- pages/               # Route-level pages
|   |   |-- services/            # API client and service calls
|   |   |-- utils/               # Frontend helper utilities
|   |   |-- App.js               # Main app routing
|   |   |-- index.css            # Global styling
|   |   `-- index.js             # Frontend entry point
|   `-- package.json
|
|-- backend/
|   |-- src/
|   |   |-- config/              # Database and app configuration
|   |   |-- controllers/         # Request handlers
|   |   |-- middleware/          # Auth and role middleware
|   |   |-- migrations/          # Database migration and seed scripts
|   |   |-- models/              # SQLite data models
|   |   |-- routes/              # Express route modules
|   |   |-- services/            # Business logic layer
|   |   |-- utils/               # Backend helpers
|   |   `-- index.js             # Backend entry point
|   |-- mend.db                  # SQLite database file
|   `-- package.json
|
`-- README.md
```

## What The App Does

### Users

- Register and sign in securely
- Use Remember Me for session persistence
- Reset passwords through the recovery flow
- Take PHQ-9 and GAD-7 assessments
- Book therapy sessions
- Post, like, and comment in the community
- Explore career guidance features

### Therapists

- View a therapy dashboard
- Review upcoming sessions
- Manage client sessions
- Organize client groups
- Track therapist workflow from a dedicated workspace

### Mentors

- Access a dedicated Career Guidance workspace
- Access a dedicated Talent Development feature
- Work from a simplified mentor dashboard with feature entry points

### Admins

- Monitor users and platform activity
- View platform statistics
- Review sessions, posts, and assessments

## Frontend

The frontend is built with:

- React 18
- React Router v6
- Axios
- Tailwind CSS
- React Icons

Main frontend areas:

- `components/` for shared and feature UI
- `pages/` for dashboard, sessions, community, profile, career, and admin screens
- `context/` for auth and theme state
- `services/` for API calls

## Backend

The backend is built with:

- Node.js
- Express.js
- SQLite
- JWT authentication
- bcrypt password hashing

Main backend areas:

- `routes/` for API endpoints
- `controllers/` for request handling
- `services/` for business rules
- `models/` for database interaction
- `middleware/` for protected access
- `migrations/` for schema creation and seed data

## API Areas

The application currently exposes these main backend modules:

- `/api/auth`
- `/api/assessments`
- `/api/sessions`
- `/api/posts`
- `/api/career`
- `/api/admin`

Health check:

- `/health`

## Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd MEND
```

### 2. Start the backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Backend default URL:

```text
http://localhost:5000
```

### 3. Start the frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm start
```

Frontend default URL:

```text
http://localhost:3000
```

## Environment Variables

##  Backen
```

### Frontend

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

### Backend

```bash
npm run dev
npm run start
npm run db:migrate
npm run db:seed
```

### Frontend

```bash
npm start
npm run build
npm test
```

## Security

The current app includes:

- JWT-based authentication
- Role-protected routes
- Remember Me session handling
- Forgot Password and Reset Password flow
- Password hashing with bcrypt
- Protected backend middleware

## Deployment Notes

Typical deployment options:

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or VPS
- Database: SQLite for lightweight deployment

## Future Improvements

- Real email delivery for password recovery
- Real-time therapist and client communication
- Notifications and reminders
- Better analytics and reporting
- Automated tests across frontend and backend

## License

MIT
