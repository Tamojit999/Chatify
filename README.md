# 💬 Chatify — Real-Time Chat Application

Chatify is a full-stack real-time chat application that enables instant messaging between users with WebSocket-based communication, secure authentication, and enterprise-grade security features.

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Socket Events](#-socket-events)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [License](#-license)
- [Author](#-author)

## 🧠 Overview

Chatify provides a seamless real-time messaging experience with:

- Instant message delivery via WebSockets
- Online presence indicators
- Image sharing capabilities
- Secure authentication with JWT
- Enterprise-grade security with Arcjet

## ✨ Features

### Authentication
- Secure Signup & Login with email/password
- JWT-based sessions with HTTP-only cookies
- Token expiration handling with automatic logout

### Real-Time Messaging
- Instant message delivery via Socket.io
- Online presence tracking — see who's online in real-time
- Text & image messages — share images seamlessly via Cloudinary
- Message history — persistent chat history stored in MongoDB

### User Experience
- Optimistic UI updates — messages appear instantly before server confirmation
- Notification sounds — audio alerts for incoming messages (toggleable)
- Keyboard sounds — satisfying keystroke feedback while typing
- Contact search — filter contacts and chat partners
- Responsive design — mobile-first UI with Tailwind CSS & DaisyUI

### Security
- Arcjet Shield — protection against SQL injection & common attacks
- Bot detection — blocks malicious bots while allowing search engines
- Rate limiting — sliding window rate limiter (100 req/min)
- Spoofed bot detection — identifies and blocks fake user agents

### Email
- Welcome emails — automated welcome email on registration via Resend

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| Socket.io | Real-time WebSocket communication |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| Arcjet | Security (rate limiting, bot detection, shield) |
| Cloudinary | Image uploads & CDN |
| Resend | Transactional emails |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite | Build tool & dev server |
| Zustand | State management |
| Socket.io-client | WebSocket client |
| Tailwind CSS | Utility-first CSS |
| DaisyUI | Component library |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Auth Store  │  │ Chat Store  │  │ Socket.io Client    │  │
│  │  (Zustand)  │  │  (Zustand)  │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Server (Node.js)                     │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │   Express.js        │  │      Socket.io Server       │   │
│  │   REST API          │  │   Real-time Events          │   │
│  │                     │  │                             │   │
│  │  • /api/auth/*      │  │  • connection               │   │
│  │  • /api/message/*   │  │  • newMessage               │   │
│  │                     │  │  • getOnlineUsers           │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
│                              │                               │
│  ┌───────────────────────────┴───────────────────────────┐  │
│  │                  Arcjet Security Layer                 │  │
│  │   • Shield (SQL Injection, XSS)                       │  │
│  │   • Bot Detection                                      │  │
│  │   • Rate Limiting (Sliding Window)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  MongoDB    │  │ Cloudinary  │  │      Resend         │  │
│  │  Database   │  │ Image CDN   │  │   Email Service     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Resend account
- Arcjet account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tamojit999/Chatify.git
   cd Chatify
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#-environment-variables))

4. **Run the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open the app**
   Navigate to `http://localhost:5173` in your browser.

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/chatify

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend
RESEND_API_KEY=your_resend_api_key

# Arcjet
ARCJET_KEY=your_arcjet_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/check` | Check authentication status |
| PUT | `/api/auth/update-profile` | Update profile picture |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/message/contacts` | Get all contacts |
| GET | `/api/message/chats` | Get chat partners |
| GET | `/api/message/:userId` | Get messages with a user |
| POST | `/api/message/send/:userId` | Send a message |

## 🔌 Socket Events

### Client → Server
| Event | Description |
|-------|-------------|
| `connection` | Establish WebSocket connection |
| `disconnect` | Close WebSocket connection |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `getOnlineUsers` | `string[]` (user IDs) | Broadcast online users list |
| `newMessage` | `Message object` | Deliver new message to recipient |

## 🛡 Security

Chatify implements multiple layers of security:

### Arcjet Protection
- **Shield Mode**: Protects against SQL injection, XSS, and other common attacks
- **Bot Detection**: Blocks malicious bots while allowing legitimate crawlers
- **Rate Limiting**: Sliding window algorithm limiting 100 requests per 60 seconds
- **Spoofed Bot Detection**: Identifies bots pretending to be legitimate user agents

### Authentication Security
- **HTTP-only Cookies**: JWT tokens stored in HTTP-only cookies to prevent XSS access
- **SameSite Strict**: Prevents CSRF attacks
- **Secure Flag**: Cookies only sent over HTTPS in production
- **Password Hashing**: bcrypt with salt rounds for secure password storage

### Socket Security
- **Socket Authentication Middleware**: Validates JWT from cookies on WebSocket handshake
- **User Verification**: Ensures socket connections belong to authenticated users

## 📁 Project Structure

```
chatify/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── message.controller.js
│   │   ├── emails/
│   │   │   ├── emailHandler.js
│   │   │   └── emailTemplate.js
│   │   ├── lib/
│   │   │   ├── arcjet.js
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   ├── resend.js
│   │   │   ├── socket.js
│   │   │   └── utils.js
│   │   ├── middlewares/
│   │   │   ├── arcjet.middleware.js
│   │   │   ├── auth.middleware.js
│   │   │   └── socket.auth.middleware.js
│   │   ├── models/
│   │   │   ├── Message.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── message.route.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── sounds/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatsList.jsx
│   │   │   ├── ContactList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── useKeyboardSound.js
│   │   ├── lib/
│   │   │   └── axios.js
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   └── NotFound.jsx
│   │   ├── store/
│   │   │   ├── useAuthStore.js
│   │   │   └── useChatStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 💡 Usage

- Sign up for a new account with email and password
- Browse contacts to find users to chat with
- Start a conversation by selecting a contact
- Send messages — text or images
- See online status — green indicator shows who's online
- Toggle sounds — enable/disable notification and keyboard sounds
- Update profile — change your profile picture

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

tamojit biswas

