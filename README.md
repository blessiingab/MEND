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
- scrypt password hashing

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

### 2. Use the correct Node.js version

```bash
node -v
```

Use **Node.js 22+** (the backend uses `node:sqlite`).

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Initialize the database

```bash
npm run db:migrate
```

Optional: seed demo data and accounts.

```bash
npm run db:seed
```

### 5. Run the app in development

```bash
npm run dev
```

This starts both services:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

Backend health check: `http://localhost:5000/health`

## Environment Variables

### Backend

The backend reads `backend/.env` if present.

Common variables:

- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `DB_PATH` when deploying with a persistent disk
- `CLIENT_URL` and/or `CORS_ORIGINS` when the frontend is hosted on a different origin
- `APP_URL` if you want password reset previews to use a custom origin

### Frontend

```env
REACT_APP_API_URL=/api
```

The frontend now uses `/api` by default in both local development and deployed environments. In local development, `frontend/package.json` proxies `/api` requests to `http://localhost:5000`, so the browser and network behavior stay consistent.

## Available Scripts

From the project root:

```bash
npm run install:all
npm run dev
npm run build
npm start
npm run db:migrate
npm run db:seed
```

From `backend/`:

```bash
npm run dev
npm start
npm run db:migrate
npm run db:seed
```

From `frontend/`:

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
- Password hashing with `scrypt`
- Protected backend middleware

## Deployment Notes

For production, build the frontend and run the backend server:

```bash
npm run deploy:prepare
npm start
```

Deployment requirements:

1. Use Node.js 22+.
2. Set a strong `JWT_SECRET`.
3. Configure `DB_PATH` to a persistent location (for example `/var/data/mend.db`).
4. Set `APP_URL` to your public app URL for password reset links.

### Seeded demo accounts

If you run `npm run db:seed`, the following accounts are created for local testing:

- `user@mend.com` / `UserPass123`
- `therapist@mend.com` / `TherapistPass123`
- `mentor@mend.com` / `MentorPass123`
- `admin@mend.com` / `AdminPass123`

## Future Improvements

- Real email delivery for password recovery
- Real-time therapist and client communication
- Notifications and reminders
- Better analytics and reporting
- Automated tests across frontend and backend

## License

MIT
