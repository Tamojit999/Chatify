# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Chatify is a real-time chat application with a monorepo structure: `backend/` (Express.js API) and `frontend/` (React SPA). Users can sign up, log in, message other users (text + images), and update their profile picture. Images are stored via Cloudinary. Welcome emails are sent on signup via Resend. Arcjet provides rate limiting (500 req/min sliding window), bot detection, and shield protection on all API routes.

## Commands

### Install & Build (from root)
```
npm run build
```
Installs dependencies for both backend and frontend, then builds the frontend.

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
ESLint with react-hooks and react-refresh plugins. Config in `frontend/eslint.config.js`. Custom rule: `no-unused-vars` ignores variables starting with uppercase or underscore.

### Build Frontend Only
```
npm run build --prefix frontend
```

### No test framework is configured. No backend lint command exists.

## Architecture

### Backend (`backend/src/`)

Express.js server using ES modules (`"type": "module"`). Entry point: `server.js`. JSON body limit is 5MB (relevant for base64 image uploads).

**Routing & middleware chain:**
All routes go through Arcjet middleware first. Auth routes (`/api/auth`) have public endpoints (signup, login) and protected endpoints (logout, update-profile, check). Message routes (`/api/messages`) are fully protected — `protectRoute` middleware verifies the JWT cookie and attaches `req.user`.

**Key layers:**
- `controller/` — Route handlers for auth (signup/login/logout/updateProfile) and messages (getallContacts/getMessagesByUserId/sendMessage/getChatPartners)
- `models/` — Mongoose schemas: `User` (email, fullName, password, profilePic) and `Message` (senderId, receiverId, text [maxlength 2000], image). Both have `timestamps: true`.
- `middleware/` — `auth.middleware.js` (JWT cookie verification), `arcjet.middleware.js` (rate limit/bot/shield)
- `libs/` — Service clients: `db.js` (MongoDB connection), `cloudinary.js`, `resend.js`, `arcjet.js`, `utilies.js` (JWT generation + cookie setting). Note the typo: the file is named `utilies.js`, not `utilities.js`.
- `email/` — `emailHandler.js` sends welcome email via Resend (fire-and-forget, not awaited after signup response); `emailTemplate.js` contains the HTML template

**Authentication flow:** Signup/login generates a JWT (7-day expiry), sets it as an HTTP-only secure cookie named `jwt`. The `protectRoute` middleware reads this cookie, verifies it, and loads the user (minus password) onto `req.user`.

**Image uploads:** Profile pictures and message images are sent as base64 in the request body and uploaded to Cloudinary. The returned `secure_url` is stored in MongoDB.

**Chat partners endpoint:** `getChatPartners` uses a MongoDB aggregation pipeline to find all users the logged-in user has exchanged messages with, ordered by most recent message.

### Frontend (`frontend/src/`)

React 19 + Vite app using ES modules. Styling with Tailwind CSS v3 + DaisyUI v4.

**State management:** Zustand stores in `store/`:
- `useAuthStore` — auth state and actions. Actions use PascalCase: `SignUp`, `Login`, `Logout`, `updateProfile`. State: `authUser`, `isCheckingAuth`, `isSigningUp`, `isLogging`, `isUpdatingProfile`.
- `useChatStore` — chat state and actions. Actions use camelCase: `getAllContacts`, `getMyChatPartners`, `getMessagesByUserId`, `sendMessages`, `setSelectuser`, `setActiveTab`, `toggleSound`. `isSoundEnabled` is persisted to `localStorage`.

**API layer:** `libs/axios.js` creates an axios instance with `withCredentials: true`. In development it points to `http://localhost:3000/api`; in production it uses relative `/api`.

**Routing:** React Router v7 in `App.jsx` with three routes: `/` (ChatPage, requires auth), `/login` (LoginPage), `/signup` (SignupPage). Auth-gated via `<Navigate>` redirects based on `authUser` state.

**Sound feature:** `hooks/useKeyboardSound.js` plays random keystroke sounds from `/public/sounds/`. Toggled via `useChatStore.toggleSound()` and persisted in `localStorage`.

**UI notifications:** `react-hot-toast` for toasts throughout auth and chat flows.

## Environment Variables

Backend requires these in `backend/.env`:
- `PORT`, `NODE_ENV` — Server port and mode (development/production)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWTs
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` — Resend email service config
- `CLIENT_URL` — Frontend URL (used for CORS origin and welcome email links)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary config
- `ARCJET_API_KEY`, `ARCJET_ENV` — Arcjet security service config

## Conventions

- Node >= 20 required (root `package.json` engines)
- Backend and frontend use ES modules (`"type": "module"`); root package.json is commonjs
- Backend controllers: validate input, perform DB operation, return JSON with HTTP status
- Auth store actions are PascalCase (`SignUp`, `Login`, `Logout`); chat store actions are camelCase (`getAllContacts`, `sendMessages`)
- Icons from `lucide-react`
