# Imageboard Project Analysis

## Project Overview

Imageboard is a modern full-stack imageboard/forum application inspired by classic sites like 4chan. It features a React frontend with TypeScript and Tailwind CSS, backed by a Node.js/Express server with SQLite database for persistent data storage. The app allows users to create threads and reply to posts with image uploads. All data is stored in the server database, enabling multi-user support and data persistence across sessions.

## Architecture

The project follows a full-stack architecture with clear separation of concerns:

- **Frontend**: React-based UI with component-based architecture
- **Backend**: Node.js/Express server with REST API
- **Database**: SQLite for data persistence
- **Modular Components**: UI broken into reusable React components
- **Service Layer**: Frontend services handle API communication
- **TypeScript**: Provides type safety throughout the application
- **Vite Build Tool**: Fast development and build process

## Technologies Used

- **React 19.1.1**: UI framework with hooks for state management
- **TypeScript ~5.8.2**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite 6.2.0**: Build tool and development server
- **Node.js**: Backend runtime environment
- **Express 4.18.2**: Web framework for the backend
- **better-sqlite3 9.2.2**: SQLite database driver
- **CORS 2.8.5**: Cross-origin resource sharing middleware

## Project Structure

```
imageboard/
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── database.db                   # SQLite database file
├── index.html                    # Main HTML template
├── index.tsx                     # React app entry point
├── App.tsx                       # Main app component
├── types.ts                      # TypeScript interfaces
├── metadata.json                 # App metadata
├── components/                   # React components
│   ├── Board.tsx                 # Main board with threads
│   ├── Header.tsx                # App header
│   ├── icons.tsx                 # SVG icon components
│   ├── Post.tsx                  # Individual post component
│   ├── PostForm.tsx              # Form for creating posts/replies
│   └── Thread.tsx                # Thread display component
├── services/                     # Frontend services
│   └── databaseService.ts        # API communication layer
└── backend/                      # Backend server
    ├── server.js                 # Express server entry point
    ├── models/
    │   └── database.js           # Database operations
    └── routes/
        ├── threads.js            # Thread API routes
        └── posts.js              # Post API routes
```

## Components Details

### App.tsx
- Main application component
- Renders Header and Board components
- Includes footer with project info
- Uses Tailwind classes for dark theme styling

### Header.tsx
- Simple header with app title "/g/ - Imageboard"
- Subtitle describing the app
- Styled with Tailwind CSS

### Board.tsx
- Central component managing thread display
- Fetches threads from databaseService
- Handles loading and error states
- Contains toggleable PostForm for new threads
- Maps threads to Thread components
- Sorts threads by last activity

### Thread.tsx
- Displays individual threads
- Shows OP post and last 3 replies (with count if more)
- Includes reply button and toggleable PostForm
- Styled with indentation for replies

### Post.tsx
- Renders individual posts
- Displays author, timestamp, post ID
- Handles image display with expand/collapse
- Implements post quote formatting (>> for replies, > for green text)
- Supports lazy loading for images

### PostForm.tsx
- Form for creating new posts/replies
- Fields: author (optional), subject (required for threads), comment (required)
- Image upload with 4MB size limit validation
- Form validation and submission
- Loading states for submission

### icons.tsx
- Collection of SVG icon components
- PlusCircleIcon, ReplyIcon, UploadIcon
- Used throughout the app for buttons and UI elements

## Services Details

### Frontend - databaseService.ts
- Handles API communication with the backend
- Key functions:
  - `getThreads()`: Fetches threads from backend API
  - `createThread()`: Creates new threads via API
  - `createReply()`: Adds replies via API
- Error handling for network requests
- TypeScript interfaces for API responses

### Backend - models/database.js
- Database operations using better-sqlite3
- Functions:
  - `getThreads()`: Retrieves and sorts threads with replies
  - `createThread()`: Inserts new thread and OP post
  - `createReply()`: Inserts reply to existing thread
- SQL query optimization with prepared statements

### Backend - routes/
- **threads.js**: API routes for thread operations
  - GET /api/threads - Retrieve all threads
  - POST /api/threads - Create new thread
- **posts.js**: API routes for post operations
  - POST /api/posts - Create new reply

## Configuration

### tsconfig.json
- Targets ES2022
- Uses React JSX transform
- Includes DOM and iterable libraries
- Module resolution set to bundler
- Aliases "@/*" for clean imports

### vite.config.ts
- Sets up React plugin
- Configures path aliases
- Proxy configuration for API calls to backend server

### package.json Scripts
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production

## Key Features

1. **Thread Creation**: Users can start new threads with subject, comment, and image
2. **Reply System**: Reply to existing threads with quotes (>>) and green text (>)
3. **Image Upload**: Support for PNG, JPEG, GIF files up to 4MB
4. **Persistent Storage**: All data stored in SQLite database on server
5. **Multi-user Support**: All users see the same threads and posts
6. **Responsive Design**: Mobile-friendly layout using Tailwind CSS
7. **Real-time Updates**: Threads sorted by activity, immediate UI updates

## API Endpoints

- `GET /api/threads` - Retrieve all threads
- `POST /api/threads` - Create new thread
- `POST /api/posts` - Create reply to thread
- `GET /api/health` - Server health check

## Data Flow

1. **Thread Loading**:
   - App loads → Board fetches threads → API call to backend → SQLite query → Return threads

2. **New Thread**:
   - User fills PostForm → Submits → API call to create thread → Database insert → Return new thread

3. **Reply Creation**:
   - User fills reply form → Submits → API call to create reply → Database insert → Return new reply

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the backend server: `npm run server`
4. In another terminal, start the frontend: `npm run dev`
5. Or run both together: `npm run dev:full`
6. Open browser to localhost:3000 and start using the app

## Limitations

- **No Authentication**: Users identified by self-reported names only
- **No Moderation**: No content moderation or spam prevention
- **File Storage**: Images stored as base64 in database (not optimal for large scale)
- **SQLite**: Single-writer database, may have concurrency issues with high traffic
- **No Image Optimization**: Large images stored as-is
- **Basic Error Handling**: Limited error recovery and validation

## Type Definitions

```typescript
interface PostData {
  id: number;
  author: string;
  comment: string;
  image?: {
    url: string; // base64 data URL
    filename: string;
  };
  timestamp: number;
}

interface ThreadData {
  id: number;
  op: PostData;
  replies: PostData[];
  subject: string;
}
```

This analysis covers the complete structure, functionality, and architecture of the Imageboard project, providing a comprehensive understanding of how this full-stack application works.