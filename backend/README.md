# Portfolio Backend — Express + MongoDB

## Setup

1. Make sure MongoDB is running locally (or use MongoDB Atlas).

2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your values:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=any_long_random_string
   ```

4. Start the backend:
   ```bash
   # Development (auto-restarts on save)
   npm run dev

   # Production
   npm start
   ```

The server runs on http://localhost:4000

## API Endpoints

| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| POST | /auth/signup | No | Register a new user |
| POST | /auth/login | No | Login, returns JWT token |
| GET | /projects | No | Get all projects (public) |
| POST | /projects | Yes (Bearer token) | Add a new project |
| PUT | /projects/:id | Yes (Bearer token) | Edit a project |
| DELETE | /projects/:id | Yes (Bearer token) | Delete a project |

## Viewing users in MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Open the `portfolio` database
4. You will see two collections: `users` and `projects`

## Frontend environment variable

In the root of the project (not inside /backend), your `.env` should have:
```
VITE_API_URL=http://localhost:4000
```

For production, set `VITE_API_URL` to your deployed backend URL (e.g. on Render or Railway).
