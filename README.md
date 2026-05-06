# ChatApp - Frontend

A full-stack real-time chat application with secure messaging, encryption, and advanced features like message requests, typing indicators, and chat restoration.

## Live Demo

[View Live on Vercel](https://chat-app-frontend-mauve-pi.vercel.app/)

## Features

- Real-time messaging using Socket.io
- Secure user authentication with JWT
- AES (Advanced Encryption Standard) message encryption using Crypto.js
- Cursor-based message pagination with infinite scroll
- Online/Offline status indicator
- Typing indicator with debounce (shows when other user is typing)
- Message request system (first message requires acceptance before chat starts)
- Chat delete with auto-restore (if deleted user receives a new message, chat restores automatically)
- Optimized re-renders using useCallback and useMemo
- Responsive UI

## Audio Calling (WebRTC)

The app now supports real-time audio calling using WebRTC.

### Features

- Peer-to-peer audio calling
- Incoming call UI
- Ongoing call screen
- Call end screen
- Mute / Unmute
- Call timer
- Missed call tracking
- Multiple incoming call handling (while busy)

---

## TURN + ICE Servers

To ensure calls work on all networks:

- ICE servers fetched from backend
- Includes:
  - STUN (Google)
  - TURN (Twilio)

### Flow

1. Fetch ICE servers
2. Create peer connection
3. WebRTC chooses best route

---

## WebRTC Logic

Custom hook handles:

- Peer connection
- Offer / Answer
- ICE exchange
- Media handling
- Cleanup

### Updated Audio Calling Features

- Call records shown inside chats
- Callback support directly from call logs
- Remove single call log
- Clear all call logs

## Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Real-time:** Socket.io Client
- **Encryption:** Crypto.js
- **Data Fetching:** TanStack Query
- **Deployment:** Vercel

## Deployment

- **Frontend (Vercel):** https://chat-app-frontend-mauve-pi.vercel.app/
- **Backend (Railway):** https://chatapp-backend-production-05f2.up.railway.app/

> Note: Backend is used for API and real-time communication.

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vishal-coding02/chatApp-frontend.git

# Go to project folder
cd chatApp-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root folder and add:

VITE_API_URL=http://localhost:5000 # For production, use your deployed backend URL
VITE_CRYPTO_SECRET=your_secret_key

## Project Structure

chatApp-frontend/
├── src/
│ ├── api/ # API call functions
│ ├── call/ calls ui
│ ├── components/ # Reusable UI components
│ ├── hooks/ # Custom React hooks (useChat, useMessage, etc.)
│ ├── interfaces/ # TypeScript interfaces
│ ├── pages/ # App pages (Login, Chat, etc.)
│ ├── store/ # Redux store and slices
│ ├── utils/ # Helper functions (encryption, debounce, etc.)
│ └── App.tsx # Main app file
├── public/
├── index.html
└── vite.config.ts

## Backend Repository

> This is only the frontend. Backend repo is here:
> [chatApp-backend](https://github.com/vishal-coding02/chatApp-backend)
