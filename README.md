# DashApp — Full-Stack Authentication & Dashboard

A production-ready MERN stack application with secure JWT authentication, MongoDB Atlas integration, and a polished React dashboard. Express serves both the API and the built React frontend from a single server.

---

## Tech Stack

| Layer      | Technologies                                      |
|------------|---------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Tailwind CSS, Axios, Lucide Icons |
| Backend    | Node.js, Express.js, Mongoose, JWT, bcryptjs      |
| Database   | MongoDB Atlas                                     |
| Security   | Helmet, express-rate-limit, HTTP-only cookies     |

---

## Project Structure

```
my-dashboard-app/
├── web/                    # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js      # build.outDir = "build"
├── config/db.js
├── models/User.js
├── controllers/
├── routes/
├── middleware/
├── server.js               # Express entry — serves API + web/build
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Prerequisites

1. **Node.js** 18 or higher — [Download](https://nodejs.org/)
2. **MongoDB Atlas** account (free tier works) — [Sign up](https://www.mongodb.com/cloud/atlas)

### Create a MongoDB Atlas cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free **M0** cluster
3. Under **Database Access**, create a database user (username + password)
4. Under **Network Access**, add IP `0.0.0.0/0` (allow from anywhere) or your current IP
5. Click **Connect → Drivers → Node.js** and copy the connection string  
   Example:  
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/dashboard-app?retryWrites=true&w=majority`

---

## Local Setup (Windows / macOS / Linux)

Open a terminal in the project root (`my-dashboard-app`).

### 1. Install root dependencies

```bash
npm install
```

### 2. Install frontend dependencies

```bash
npm --prefix web install
```

### 3. Create environment file

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

### 4. Edit `.env`

Open `.env` and fill in real values:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dashboard-app?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_string_at_least_32_characters
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

> **Generate a JWT secret** (optional helper):  
> `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 5. Run in development mode

```bash
npm run dev
```

This starts:

- Express API on **http://localhost:5000**
- Vite frontend on **http://localhost:5173** (proxies `/api` → Express)

Open **http://localhost:5173** in your browser.

---

## Production Build & Run

```bash
# Build the React app into web/build
npm run build

# Start the single Express server (serves API + static frontend)
npm start
```

Visit **http://localhost:5000**.

Express serves the SPA from `web/build` and handles all `/api/*` routes. React Router routes work on page refresh thanks to the SPA fallback.

---

## API Endpoints

| Method | Endpoint                      | Auth | Description                |
|--------|-------------------------------|------|----------------------------|
| POST   | `/api/auth/signup`            | No   | Register a new user        |
| POST   | `/api/auth/login`             | No   | Login                      |
| POST   | `/api/auth/logout`            | No   | Clear auth cookie          |
| GET    | `/api/auth/me`                | Yes  | Get current user           |
| GET    | `/api/users/profile`          | Yes  | Get profile                |
| PATCH  | `/api/users/profile`          | Yes  | Update name / avatar       |
| PATCH  | `/api/users/change-password`  | Yes  | Change password            |
| GET    | `/api/health`                 | No   | Health + DB status check   |

---

## Features

- **Signup** — name, email, password + confirm, strength indicator, duplicate-email protection
- **Login** — email/password, show/hide toggle, generic error messages
- **JWT + HTTP-only cookies** — secure session, 7-day expiry
- **Protected routes** — frontend & backend
- **Dashboard** — welcome message, real account stats from MongoDB
- **Profile** — edit name & optional avatar URL (persisted to DB)
- **Change password** — current-password verification
- **Logout** — clears cookie and session
- **Rate limiting** on auth endpoints
- **Helmet** security headers
- **Responsive** dark sidebar + light content layout

---

## Deployment

Suitable platforms that support a **persistent Node.js process** and environment variables:

- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **Fly.io**
- **Heroku**
- Any VPS (Ubuntu + PM2 / Docker)

### General steps

1. Push the repository (without `node_modules` and `.env`)
2. Set environment variables on the host:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT` (usually provided by the host)
   - `CLIENT_URL` (your production domain, e.g. `https://yourapp.com`)
3. Build command: `npm run build` (or `npm install && npm --prefix web install && npm run build`)
4. Start command: `npm start`

### Important production notes

- Cookies are set with `Secure` and `SameSite=None` when `NODE_ENV=production` — **HTTPS is required**.
- In production, CORS is disabled (same-origin serving). If you ever host the frontend separately, re-enable CORS carefully.
- **Vercel / Netlify**: These are primarily serverless / static hosts. A persistent `app.listen()` Express server does **not** work unchanged. You would need a serverless adapter or a different architecture. Prefer Railway, Render, or a VPS for this project.

### Health check

`GET /api/health` returns database connectivity status — useful for platform health probes.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `MONGODB_URI is not defined` | Create `.env` from `.env.example` and fill in the URI |
| MongoDB connection error | Check username/password, network access IP whitelist, and that the cluster is running |
| `EADDRINUSE :5000` | Another process is using port 5000 — change `PORT` in `.env` or kill the process |
| Frontend shows blank / 404 after `npm start` | Run `npm run build` first so `web/build` exists |
| Cookies not set / login fails after refresh | Ensure `withCredentials: true` (already set) and that you are on the same origin in production |
| CORS errors in development | Confirm `CLIENT_URL=http://localhost:5173` and that the Vite proxy is active |
| `Too many attempts` | Rate limiter kicked in — wait 15 minutes or restart the server |
| Build fails | Make sure you ran `npm --prefix web install` before `npm run build` |

---

## Security Notes

- Passwords are hashed with **bcrypt** (cost factor 12) before storage
- Password field is never returned in API responses (`select: false` + `toJSON`)
- Role is always set to `user` on signup — clients cannot self-elevate
- Auth endpoints are rate-limited
- Generic login error messages prevent email enumeration
- JWT secret and MongoDB credentials must never be committed

---

## License

MIT
