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

### Backend

Copy `backend/.env.example` to `backend/.env` and set production values for:

- `JWT_SECRET`
- `DB_PATH` when deploying with a persistent disk
- `CLIENT_URL` only if the frontend is hosted on a different origin

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

This repository is set up for a single-service deployment where the Express backend serves the built React frontend.

### Render Blueprint

The included `render.yaml` deploys the app as one Node web service and mounts a persistent disk for SQLite.

1. Push this repository to GitHub.
2. In Render, create a new Blueprint instance from the repo.
3. Confirm the generated `JWT_SECRET` and keep `DB_PATH=/var/data/mend.db`.
4. Set `APP_URL` to your public Render URL after the first deploy if you want password reset links to use the deployed domain.
5. Run `npm run db:seed` once from a Render shell only if you want demo users and sample content.

### Generic Node Host

Use these commands on hosts such as Render, Railway, or a VPS:

```bash
npm run deploy:prepare
npm start
```

The backend serves `frontend/build` automatically in production, so the app can run behind a single public URL.

## Future Improvements

- Real email delivery for password recovery
- Real-time therapist and client communication
- Notifications and reminders
- Better analytics and reporting
- Automated tests across frontend and backend

## License

MIT
