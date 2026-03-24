# ChatApp - Frontend

A full-stack real-time chat application with secure messaging, encryption, and advanced features like message requests, typing indicators, and chat restoration.

## Live Demo

[View Live on Vercel](https://chat-app-frontend-mauve-pi.vercel.app/)

## Features

- Real-time messaging using Socket.io
- Secure user authentication with JWT
- AES (Advanced Encryption Standard) message encryption using Crypto.js
- Message pagination with infinite scroll
- Online/Offline status indicator
- Typing indicator (shows when other user is typing)
- Message request system (first message requires acceptance before chat starts)
- Chat delete with auto-restore (if deleted user receives a new message, chat restores automatically)
- Responsive UI

## Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Real-time:** Socket.io Client
- **Encryption:** Crypto.js
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

```
VITE_API_URL=http://localhost:5000  # For production, use your deployed backend URL
VITE_CRYPTO_SECRET=your_secret_key
```

## Screenshots


## Project Structure

```
chatApp-frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # App pages (Login, Chat, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Helper functions
│   └── App.tsx        # Main app file
├── public/
├── index.html
└── vite.config.ts
```

## Backend Repository

> This is only the frontend. Backend repo is here:
> [chatApp-backend](https://github.com/vishal-coding02/chatApp-backend)
