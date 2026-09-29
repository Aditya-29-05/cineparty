# CineParty — MERN Development Specification

## 1. Project Overview

Build **CineParty**, a professional real-time watch-party web application using the MERN stack.

CineParty allows multiple users who already have the **same movie/video file locally on their own devices** to watch together in real time.

The actual video file must **never be uploaded to or streamed through the backend**.

Each user plays their own local copy using the browser's HTML5 `<video>` element.

The backend only synchronizes lightweight information such as:

* Play
* Pause
* Seek
* Current playback position
* Room state
* Participant presence
* Chat messages

The core concept is:

```text
User A's Computer
    Local Movie
         ↓
    HTML5 Video
         ↑
    Playback Controls
         ↓
      Socket.IO
         ↓
       Server
         ↓
      Socket.IO
         ↓
    HTML5 Video
         ↑
    User B's Computer
         ↑
    Local Movie
```

---

# 2. Primary Goal

The primary goal is:

> Enable users to watch the same locally stored video together while synchronizing playback controls in real time without uploading or streaming the video through the server.

The application should demonstrate:

* MERN development
* Authentication
* REST APIs
* MongoDB
* WebSockets
* Socket.IO rooms
* Real-time synchronization
* Browser File API
* HTML5 video
* File metadata verification
* Real-time chat
* Secure application architecture

---

# 3. IMPORTANT UI/DESIGN REQUIREMENT

## DO NOT MAKE THE WEBSITE LOOK VIBE-CODED

This is a strict requirement.

The website must look like a **real professionally designed software product**, not an AI-generated landing page or template.

### Avoid

Do NOT use:

* Excessive gradients
* Purple/blue AI-style gradients everywhere
* Giant glowing headings
* Excessive glassmorphism
* Floating blobs
* Animated background particles
* Neon borders
* Excessive shadows
* Huge rounded cards everywhere
* Random decorative elements
* Emoji-based UI
* Fake statistics
* Fake reviews
* Fake users
* Fake activity
* Fake movie data
* Fake testimonials
* Fake "AI powered" labels
* Unnecessary dashboard charts
* Excessive animations
* Constantly moving backgrounds
* Cursor animations
* Fake loading states
* Fake notifications
* Marketing-style content inside functional pages

Do NOT create content just to make the interface appear populated.

If there is no real data, show an appropriate empty state.

Example:

```text
No participants yet
Share the room code with your friends.
```

NOT:

```text
12,482 users watching
98% satisfaction
4.9/5 rating
```

unless these values actually come from the application database.

---

# 4. UI DESIGN DIRECTION

Use:

* Clean professional layout
* Strong typography hierarchy
* Neutral color palette
* One restrained accent color
* Consistent spacing
* Thin borders
* Subtle shadows
* Real icons
* Lucide React icons
* Responsive layouts
* Accessible contrast
* Clear interaction states
* Minimal animation

The application should feel like a **real productivity/media application**.

Animations should communicate state or improve usability.

Good examples:

* Smooth room transitions
* Subtle participant join animation
* Connection status transition
* Video control transitions
* Synchronization indicator
* Button loading state
* Modal transitions

Bad examples:

* Constantly moving backgrounds
* Floating blobs
* Random particles
* Excessive hover animations
* Text constantly changing
* Neon effects

---

# 5. TECH STACK

## Frontend

Use:

* React.js
* Vite
* React Router
* Tailwind CSS
* Axios
* Socket.IO Client
* HTML5 `<video>`
* Browser File API
* Lucide React
* React Context

Optional:

* Zustand only if state management becomes unnecessarily complex

Do NOT add libraries without a clear reason.

---

## Backend

Use:

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose
* JWT
* bcrypt
* Helmet
* express-rate-limit
* CORS

---

## Database

MongoDB Atlas.

Collections:

```text
users
rooms
messages
```

Do NOT store the actual movie/video file in MongoDB.

---

# 6. PROJECT STRUCTURE

Create the following architecture:

```text
cineparty/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   └── GoogleSignInButton.jsx
│   │   │   │
│   │   │   ├── video/
│   │   │   │   ├── VideoPlayer.jsx
│   │   │   │   ├── VideoControls.jsx
│   │   │   │   ├── FilePicker.jsx
│   │   │   │   ├── FileVerification.jsx
│   │   │   │   └── SyncIndicator.jsx
│   │   │   │
│   │   │   ├── room/
│   │   │   │   ├── RoomHeader.jsx
│   │   │   │   ├── ParticipantList.jsx
│   │   │   │   ├── RoomCode.jsx
│   │   │   │   └── HostControls.jsx
│   │   │   │
│   │   │   └── chat/
│   │   │       ├── ChatBox.jsx
│   │   │       ├── MessageList.jsx
│   │   │       └── MessageInput.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateRoom.jsx
│   │   │   ├── JoinRoom.jsx
│   │   │   ├── Room.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useVideoSync.js
│   │   │   └── useRoom.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── roomService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── fileUtils.js
│   │   │   ├── videoUtils.js
│   │   │   └── formatTime.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── google.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   └── userController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimiter.js
│   │
│   ├── sockets/
│   │   ├── socketHandler.js
│   │   ├── roomSocket.js
│   │   ├── syncSocket.js
│   │   └── chatSocket.js
│   │
│   ├── services/
│   │   ├── roomService.js
│   │   ├── syncService.js
│   │   └── chatService.js
│   │
│   ├── utils/
│   │   ├── generateRoomCode.js
│   │   └── logger.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── README.md
├── .gitignore
└── package.json
```

---

# 7. AUTHENTICATION

Implement two authentication methods.

```text
Authentication
│
├── Email + Password
│
└── Google Sign-In
```

---

## Email Authentication

Implement:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Passwords must be hashed using bcrypt.

Never store plain-text passwords.

Use JWT for application authentication.

---

# 8. GOOGLE SIGN-IN

Implement Google Sign-In properly.

The flow should be:

```text
React
   ↓
Google Sign-In
   ↓
Google Credential
   ↓
Node/Express
   ↓
Verify Google identity
   ↓
Find/Create User
   ↓
Issue CineParty JWT
   ↓
React authentication state
```

Important:

Google authentication is only used to verify the user's Google identity.

After successful Google authentication, the backend should issue the application's own JWT.

This keeps email/password and Google authentication consistent throughout the CineParty backend.

---

## User Model

Use a model similar to:

```js
{
    name,
    email,
    password,
    googleId,
    avatar,
    authProvider,
    createdAt
}
```

Where:

```text
authProvider:
"local"
"google"
```

For Google-only users, `password` can be null.

For local users, `googleId` can be null.

---

# 9. LOGIN PAGE

Design should be simple and professional.

Example structure:

```text
CineParty

Sign in to CineParty

Email
[________________________]

Password
[________________________]

[ Sign In ]

────────── or ──────────

[ G  Continue with Google ]

Don't have an account?
Create account
```

Do not create a huge marketing page around the login form.

---

# 10. LOCAL VIDEO PLAYBACK

This is one of the most important features.

Users select a video using:

```html
<input type="file" accept="video/*" />
```

Use:

```js
URL.createObjectURL(file)
```

to create a local URL.

The video must play directly from the user's device.

Example concept:

```js
const file = event.target.files[0];

if (file) {
    const videoUrl = URL.createObjectURL(file);

    videoRef.current.src = videoUrl;
}
```

Do NOT send the video file to Express.

Do NOT upload it to MongoDB.

Do NOT store it on the backend.

---

# 11. FILE VERIFICATION

CineParty depends on users having compatible copies of the same video.

When the user selects a file, collect:

* File name
* File size
* MIME type
* Video duration

Display the information clearly.

Example:

```text
Movie

Avengers_Endgame.mp4

Duration
2:58:12

Size
2.4 GB

Format
MP4

✓ File information available
```

If room metadata is available, compare the selected file with the expected file.

Example:

```text
File mismatch

Expected duration:
02:58:12

Your duration:
01:42:18

Please select the correct file.
```

Do not upload files just for verification.

---

# 12. ROOM SYSTEM

Users must be able to:

```text
Create Room
Join Room
Leave Room
```

A room should have:

```text
roomCode
host
participants
movieMetadata
isActive
createdAt
```

Generate a short unique room code.

Example:

```text
C7K9P2
```

---

# 13. SOCKET.IO ROOM SYSTEM

When a user joins:

```text
socket.emit("join_room")
```

Server:

```text
socket.join(roomId)
```

Track:

* User joined
* User left
* Current participants
* Host
* Current playback state

---

# 14. PLAYBACK SYNCHRONIZATION

Synchronize:

```text
play
pause
seek
currentTime
```

Example:

```text
User A

Play
01:24:31
      ↓
Socket.IO
      ↓
Server
      ↓
Room
      ↓
Users B, C, D
```

Other clients should update their video player.

---

# 15. PREVENT EVENT LOOPS

Prevent this:

```text
A plays
 ↓
B receives play
 ↓
B emits play
 ↓
A receives play
 ↓
A emits play
 ↓
...
```

Use a remote-action flag.

Example:

```js
const isRemoteAction = useRef(false);
```

When applying a remote event:

```js
isRemoteAction.current = true;
```

After applying it:

```js
isRemoteAction.current = false;
```

Local video events should only emit synchronization events when the action originated locally.

---

# 16. PLAYBACK DRIFT

Different devices can drift slightly.

Example:

```text
User A → 125.42 sec
User B → 125.89 sec
User C → 125.51 sec
```

Implement periodic synchronization.

Suggested heartbeat:

```text
Every 5 seconds
```

If drift exceeds a configurable threshold, correct the player.

Start with:

```text
0.5 seconds
```

Do not constantly force the video position because this can create a bad viewing experience.

---

# 17. AUTOPLAY

Browsers may block automatic playback with sound.

Therefore create a clear room action:

```text
[ Ready to Watch ]
```

After the user interacts with the page, playback synchronization can safely attempt to control the video.

If autoplay fails, display a useful message rather than silently failing.

Example:

```text
Playback is waiting for your permission.

Click "Ready to Watch" to enable synchronized playback.
```

---

# 18. HOST CONTROLS

The room creator is the host.

Host controls can include:

```text
Play
Pause
Seek
End Room
```

Decide whether normal participants can control playback or whether only the host controls playback.

Make this behavior explicit in the UI.

Example:

```text
HOST
● Aaditya

Playback controlled by host
```

---

# 19. PARTICIPANT LIST

Display only real participants.

Example:

```text
Participants

● Aaditya        Host
● Rahul          Ready
● Priya          Ready
```

Use real-time Socket.IO events to update presence.

Do not use fake users.

---

# 20. CHAT

Implement real-time room chat.

Example:

```text
┌─────────────────────────┐
│ Chat                    │
├─────────────────────────┤
│ Rahul                   │
│ Ready?                  │
│                         │
│ You                     │
│ Yes, starting now.      │
├─────────────────────────┤
│ Message...       [Send] │
└─────────────────────────┘
```

Use Socket.IO for real-time delivery.

Persist messages in MongoDB if required.

---

# 21. WATCH ROOM UI

The watch room should be the main product screen.

Recommended layout:

```text
┌─────────────────────────────────────────────────────────┐
│ CineParty          Room: A7K29       4 participants      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                    VIDEO PLAYER                         │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ ▶ ─────────────●────────────────── 01:24 / 02:10       │
├───────────────────────────────┬─────────────────────────┤
│                               │ Participants             │
│ Movie information             │ ● You                   │
│ Avengers.mp4                  │ ● Rahul                 │
│ ✓ File matched                │ ● Priya                 │
│                               │                         │
│                               ├─────────────────────────┤
│                               │ Chat                    │
│                               │                         │
│                               │ Message...              │
└───────────────────────────────┴─────────────────────────┘
```

The video should receive the majority of visual attention.

---

# 22. SYNC STATUS

Show a subtle synchronization indicator.

Examples:

```text
● Synced
```

```text
◐ Synchronizing...
```

```text
! Connection unstable
```

Do not make this huge or flashy.

---

# 23. API STRUCTURE

Implement REST APIs such as:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
GET    /api/auth/me

GET    /api/rooms
POST   /api/rooms
GET    /api/rooms/:roomCode
POST   /api/rooms/:roomCode/join
DELETE /api/rooms/:roomCode

GET    /api/users/me
PATCH  /api/users/me
```

Socket events:

```text
join_room
leave_room

play
pause
seek
sync_request
sync_state

user_joined
user_left

send_message
receive_message

room_ended
```

Names may be adjusted if there is a strong architectural reason.

---

# 24. SECURITY

Implement:

* Password hashing
* JWT authentication
* Protected API routes
* Protected Socket.IO connections
* Helmet
* CORS
* Rate limiting
* Input validation
* MongoDB validation
* Environment variables

Never commit:

```text
.env
```

Never hard-code:

```text
JWT_SECRET
MongoDB URI
Google credentials
```

---

# 25. ENVIRONMENT VARIABLES

Client:

```env
VITE_API_URL=
VITE_SOCKET_URL=
VITE_GOOGLE_CLIENT_ID=
```

Server:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLIENT_URL=
```

Use appropriate Google OAuth configuration based on the chosen Google authentication implementation.

---

# 26. ERROR HANDLING

Never leave users with blank screens.

Handle:

```text
Invalid login
Google authentication failure
Room not found
Room full
Invalid room code
Socket disconnected
Movie file unavailable
File mismatch
Playback synchronization failure
Server unavailable
```

Use clear human-readable messages.

Example:

```text
Room not found

The room may have ended or the code may be incorrect.

[ Back to Dashboard ]
```

---

# 27. EMPTY STATES

Do not use fake data.

Examples:

Dashboard:

```text
No active rooms

Create a room or join one using a room code.

[ Create Room ]   [ Join Room ]
```

Chat:

```text
No messages yet.
Start the conversation.
```

Participants:

```text
You're the only participant.

Share the room code with your friends.
```

---

# 28. RESPONSIVE DESIGN

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Watch room on desktop:

```text
Video + Sidebar
```

Mobile:

```text
Video
↓
Room information
↓
Participants
↓
Chat
```

Do not simply shrink the desktop UI.

Create a sensible responsive layout.

---

# 29. ANIMATION RULES

Use animation only when useful.

Allowed:

* 150–300ms transitions
* Button hover states
* Modal transitions
* Participant join/leave transitions
* Connection status changes
* Page transitions
* Loading indicators

Avoid:

* Infinite background animation
* Floating blobs
* Excessive glow
* Neon animations
* Animated gradients
* Text effects
* Excessive bouncing
* Decorative particle systems

The product should remain calm and professional.

---

# 30. NO SAMPLE DATA

This is extremely important.

Do NOT create:

```text
Fake users
Fake rooms
Fake movies
Fake chat messages
Fake participant counts
Fake statistics
Fake reviews
Fake watch history
Fake dashboard numbers
```

During development, use the actual database and actual user actions.

If there is no data, display an empty state.

---

# 31. DEVELOPMENT APPROACH

Do not build the entire application in one giant implementation.

Build in phases.

## Phase 1 — Foundation

Create:

```text
client
server
MongoDB connection
Express server
React application
environment configuration
```

Verify both applications run correctly.

---

## Phase 2 — Authentication

Implement:

```text
Register
Login
Logout
JWT
Protected routes
Current user
Google Sign-In
```

Test both authentication methods.

---

## Phase 3 — Room System

Implement:

```text
Create Room
Join Room
Leave Room
Room Code
Host
Participants
```

---

## Phase 4 — Local Video

Implement:

```text
File Picker
Local Object URL
HTML5 Video
Video metadata
File verification
```

Verify that the movie is never uploaded to the backend.

---

## Phase 5 — Socket.IO

Implement:

```text
Socket connection
Room joining
Participant presence
```

---

## Phase 6 — Playback Synchronization

Implement:

```text
Play
Pause
Seek
Timestamp synchronization
Remote action handling
Drift correction
Heartbeat
```

This is the core technical feature.

---

## Phase 7 — Chat

Implement:

```text
Real-time messages
Message persistence
Message history
```

---

## Phase 8 — Professional UI

Polish:

* Typography
* Spacing
* Responsive layout
* Buttons
* Inputs
* Video player
* Room layout
* Empty states
* Error states
* Loading states
* Authentication pages

Do NOT add unnecessary visual effects.

---

## Phase 9 — Security

Review:

```text
JWT
Passwords
CORS
Helmet
Rate limiting
Input validation
Socket authentication
Environment variables
```

---

## Phase 10 — Testing

Test with at least:

```text
User A browser
User B browser
```

Then:

```text
User A creates room
User B joins
Both select same movie
User A presses Play
User B synchronizes

User A pauses
User B pauses

User A seeks
User B seeks

User leaves
Participant list updates

User reconnects
Synchronization works
```

---

# 32. IMPORTANT TECHNICAL RULE

The application should NOT pretend that the server has access to the user's movie.

The architecture must remain:

```text
             INTERNET
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
    User A              User B
       │                   │
 Local Movie           Local Movie
       │                   │
 HTML5 Video           HTML5 Video
       │                   │
       └────── Socket.IO ──┘
                 │
              Server
                 │
        Control Messages
```

The server handles synchronization, not video streaming.

---

# 33. QUALITY REQUIREMENTS

Code should be:

* Modular
* Readable
* Maintainable
* Reusable
* Properly named
* Properly structured
* Error handled
* Environment-variable based
* Free from unnecessary dependencies

Avoid:

* Giant components
* Duplicate logic
* Hard-coded URLs
* Hard-coded credentials
* Inline business logic everywhere
* Unnecessary abstractions
* Unused files
* Unused dependencies
* Dead code

---

# 34. README

Create a professional README containing:

```text
Project Overview
Features
Architecture
Tech Stack
Folder Structure
Authentication
Real-Time Synchronization
Local Video Architecture
Environment Setup
Installation
Running Locally
API Documentation
Socket Events
Security
Future Improvements
Screenshots
```

Clearly explain:

> CineParty does not upload or stream the video. Each participant plays their own local copy while CineParty synchronizes playback controls.

---

# 35. FINAL ACCEPTANCE CRITERIA

The project is considered complete when:

* [x] React frontend works
* [x] Node/Express backend works
* [x] MongoDB connects successfully
* [x] Email/password registration works
* [x] Email/password login works
* [x] Google Sign-In works
* [x] JWT authentication works
* [x] Protected routes work
* [x] User can create a room
* [x] User can join a room
* [x] Room code works
* [x] Participants update in real time
* [x] User can select a local video
* [x] Video plays locally
* [x] Video is NOT uploaded
* [x] File metadata is detected
* [x] File mismatch is detected
* [x] Play synchronizes
* [x] Pause synchronizes
* [x] Seek synchronizes
* [x] Playback drift is corrected
* [x] Connection status is shown
* [x] Chat works
* [x] Messages are persisted if enabled
* [x] Host controls work
* [x] Room can be left/ended
* [x] Authentication errors are handled
* [x] Socket disconnections are handled
* [x] Mobile layout works
* [x] Desktop layout works
* [x] No fake/sample data exists
* [x] No unnecessary animations exist
* [x] No vibe-coded visual design exists
* [x] Secrets are stored in `.env`
* [x] README is complete

---

# 36. ANTIGRAVITY AGENT INSTRUCTIONS

Before modifying code:

1. Inspect the existing project.
2. Determine what already exists.
3. Do not overwrite working functionality unnecessarily.
4. Do not create duplicate components.
5. Reuse existing architecture where appropriate.
6. Install only required dependencies.
7. Keep frontend and backend responsibilities separate.
8. Do not create fake data.
9. Do not upload local movie files.
10. Do not introduce a vibe-coded UI.
11. Test each phase before moving to the next phase.
12. Fix errors before continuing.
13. Keep authentication secure.
14. Keep Socket.IO synchronization logic isolated and maintainable.
15. Do not claim a feature is complete until it has been tested.

When making changes, explain:

```text
What was changed
Why it was changed
Files affected
Dependencies added
How to test it
```

Do not generate unnecessary documentation for trivial changes.

---

# 37. PRODUCT PRINCIPLE

CineParty should feel like a **real application built by a professional development team**.

The technical idea is the product.

The UI should support the product, not distract from it.

The final result should be:

```text
Professional
        +
Minimal
        +
Real-time
        +
Technically impressive
        +
Practical
        +
No fake data
        +
No vibe-coded UI
```

Build CineParty incrementally and verify every major feature before proceeding.
