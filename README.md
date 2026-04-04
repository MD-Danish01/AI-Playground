# AI Assistant

A minimal AI chat application built with Next.js, powered by Groq API, and authenticated with Google Sign-In.

## Features

- 💬 AI-powered conversations using Groq API
- 🔐 Google authentication (NextAuth)
- 📝 Chat history with auto-generated titles
- 💾 MongoDB for data persistence
- 🎨 Clean UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth (Google OAuth)
- **AI**: Groq API (llama-3.1-8b-instant)

## Setup

### Prerequisites

- Node.js (v16+)
- MongoDB instance
- Groq API key
- Google OAuth credentials

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` with:
   ```
   GROQ_API_KEY=your_groq_api_key
   DATABASE_URL=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_ID=your_google_client_id
   GOOGLE_SECRET=your_google_client_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (AI, auth, chat)
│   ├── chat/              # Chat interface pages
│   └── login/             # Authentication page
├── components/            # React components (Sidebar, SignIn)
├── models/                # MongoDB schemas
├── lib/                   # Database connection utilities
├── auth.js                # NextAuth configuration
└── public/                # Static files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
