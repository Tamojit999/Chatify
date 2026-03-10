# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Chatify is a real-time chat application with a monorepo structure: `backend/` (Express.js API) and `frontend/` (React SPA). Users can sign up, log in, message other users (text + images), and update their profile picture. Images are stored via Cloudinary. Welcome emails are sent on signup via Resend. Arcjet provides rate limiting, bot detection, and shield protection on all API routes.

## Commands

### Install & Build (from root)
```
npm run build
```
This installs dependencies for both backend and frontend, then builds the frontend.

### Run Backend (development)
```
npm run dev --prefix backend
```
Uses nodemon for auto-reload. Server starts on `PORT` from `backend/.env` (default 3000).

### Run Backend (production, from root)
```
npm start
```
In production mode, the backend serves the built frontend from `frontend/dist/`.

### Run Frontend (development)
```
npm run dev --prefix frontend
```
Vite dev server with HMR. Defaults to port 5173.

### Lint Frontend
```
npm run lint --prefix frontend
```
ESLint with react-hooks and react-refresh plugins. Config in `frontend/eslint.config.js`.

### Build Frontend Only
```
npm run build --prefix frontend
```

## Architecture

### Backend (`backend/src/`)

Express.js server using ES modules (`"type": "module"`). Entry point: `server.js`.

**Routing & middleware chain:**
All routes go through Arcjet middleware (rate limiting + bot detection + shield) first. Auth routes (`/api/auth`) have public endpoints (signup, login) and protected endpoints (logout, update-profile, check). Message routes (`/api/messages`) are fully protected — the `protectRoute` middleware verifies the JWT cookie and attaches `req.user`.

**Key layers:**
- `controller/` — Route handlers for auth (signup/login/logout/updateProfile) and messages (getallContacts/getMessagesByUserId/sendMessage/getChatPartners)
- `models/` — Mongoose schemas: `User` (email, fullName, password, profilePic) and `Message` (senderId, receiverId, text, image)
- `middleware/` — `auth.middleware.js` (JWT cookie verification), `arcjet.middleware.js` (rate limit/bot/shield)
- `libs/` — Service clients: `db.js` (MongoDB connection), `cloudinary.js`, `resend.js`, `arcjet.js`, `utilies.js` (JWT generation + cookie setting)
- `email/` — `emailHandler.js` sends welcome email using Resend; `emailTemplate.js` contains the HTML template

**Authentication flow:** Signup/login generates a JWT (7-day expiry), sets it as an HTTP-only cookie named `jwt`. The `protectRoute` middleware reads this cookie, verifies it, and loads the user (minus password) onto `req.user`.

**Image uploads:** Profile pictures and message images are sent as base64 in the request body and uploaded to Cloudinary. The returned `secure_url` is stored in MongoDB.

**Chat partners endpoint:** `getChatPartners` uses a MongoDB aggregation pipeline to find all users the logged-in user has exchanged messages with, ordered by most recent message.

### Frontend (`frontend/src/`)

React 19 + Vite app using ES modules. Styling with Tailwind CSS + DaisyUI.

**State management:** Zustand stores in `store/`:
- `useAuthStore` — handles auth state (`authUser`, `isCheckingAuth`, `isSigningUp`, `isLogging`) and actions (checkAuth, SignUp, Login, Logout)
- `useChatStore` — holds chat state (allContacts, chats, messages, selectedUser, activeTab, isSoundEnabled)

**API layer:** `libs/axios.js` creates an axios instance. In development it points to `http://localhost:3000/api`; in production it uses relative `/api` (since backend serves the frontend).

**Routing:** React Router v7 in `App.jsx` with three routes: `/` (ChatPage, requires auth), `/login` (LoginPage), `/signup` (SignupPage). Auth-gated via redirects based on `authUser` state. App checks auth on mount via `checkAuth()`.

**UI notifications:** `react-hot-toast` for success/error toasts throughout auth flows.

## Environment Variables

Backend requires these in `backend/.env`:
- `PORT`, `NODE_ENV` — Server port and mode (development/production)
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret for signing JWTs
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` — Resend email service config
- `CLIENT_URL` — Frontend URL (used for CORS and welcome email links)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary config
- `ARCJET_API_KEY`, `ARCJET_ENV` — Arcjet security service config

## Conventions

- Node >= 20 required (specified in root `package.json` engines)
- Both backend and frontend use ES modules (`"type": "module"`)
- Backend controllers follow the pattern: validate input, perform DB operation, return JSON response with appropriate HTTP status
- Frontend store actions are PascalCase (SignUp, Login, Logout) while state fields are camelCase
- No test framework is currently configured
