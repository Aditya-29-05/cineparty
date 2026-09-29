# CineParty

> **Real-time movie watch parties with zero video streaming.**  
> CineParty enables friends to watch movies together in perfect synchronization using local video files stored on each person's device. No video is ever uploaded or streamed through the server.

---

## 1. Project Overview

Watching movies online with friends usually requires high-bandwidth screen sharing or uploading large multi-gigabyte video files to cloud servers. **CineParty takes a completely different approach**:

* Every participant has their own copy of the movie file stored locally on their device (MP4, WebM, MKV).
* The browser plays the file directly using the HTML5 `<video>` element via standard browser `URL.createObjectURL()`.
* **Zero video data is transferred to the server.**
* The CineParty Node.js + Socket.IO server only transmits lightweight control events (~100 bytes): `play`, `pause`, `seek`, and periodic drift-correction timestamps.

```text
User A (Host)                            User B (Participant)
┌───────────────────────┐                ┌───────────────────────┐
│ Local Video File      │                │ Local Video File      │
│         ↓             │                │         ↓             │
│ HTML5 <video> Element │                │ HTML5 <video> Element │
│         ↓             │                │         ↑             │
│ Playback Events       │                │ Playback State Sync   │
└──────────┬────────────┘                └───────────▲───────────┘
           │                                         │
           │           Socket.IO (WSS)               │
           └────────────────► Server ────────────────┘
                         (Control Relay)
```

---

## 2. Core Features

* **Zero-Upload Video Playback**: Direct playback from local disk via HTML5 File API. No bandwidth bills, no storage costs, and instant playback regardless of file size.
* **Smart File Verification**: Extracts video duration, dimensions, file size, and mime type in-browser to warn participants if their local file differs from the host's reference file.
* **Sub-Second Playback Sync**: Real-time Socket.IO synchronization with automatic drift detection:
  * Drift < 0.5s: Ignored (smooth playback without stutter).
  * Drift ≥ 0.5s: Client automatically seeks to the host's timestamp.
* **Event Loop Prevention**: Ref-based state tracking prevents echoing received socket events back to the room.
* **Host Control Modes**:
  * **Host Only**: Only the room host can play, pause, or seek.
  * **Open Controls**: Any participant in the room can control playback.
* **Real-Time Room Management**:
  * Auto-generated 6-character room codes.
  * Room locking (prevents new participants from joining).
  * Live participant list with real-time join/leave tracking.
* **Integrated Real-Time Chat**:
  * Real-time message broadcast with sender name and avatar.
  * Message history persistence in MongoDB.
  * Auto-scroll with unread indicator and responsive mobile layout.
* **Dual Authentication**:
  * Traditional Email/Password registration & login with bcrypt password hashing.
  * Google Sign-In with Google Identity Services (GIS) and JWT validation.
* **Professional, Minimal UI**:
  * Engineered according to rigorous design standards (no neon blobs, no AI gradients, no fake statistics).
  * Clean dark-mode palette (#0b0d13 background, #12151e cards, #2563eb accents).
  * Fully responsive across desktop, tablet, and mobile browsers.

---

## 3. Tech Stack

### Frontend (`client/`)
* **Framework**: React 19 + Vite
* **Routing**: React Router DOM v7
* **Styling**: Tailwind CSS v4 + Vanilla CSS tokens
* **Icons**: Lucide React
* **Real-time Client**: Socket.IO Client v4
* **HTTP Client**: Axios with JWT request interceptors

### Backend (`server/`)
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **WebSockets**: Socket.IO v4
* **Authentication**: JSON Web Tokens (jsonwebtoken) + bcryptjs
* **Google Auth**: `google-auth-library`
* **Logging**: Winston logger

---

## 4. Architecture & Local Video Pipeline

### How Local Video Works Without Uploading

1. The user selects their video file using the browser file picker `<input type="file" accept="video/*">`.
2. The browser creates an ephemeral local reference URL using `URL.createObjectURL(file)`.
3. An invisible HTML5 `<video>` probe element loads the metadata without rendering to capture:
   * Exact duration in seconds
   * Video natural width & height
   * File name & file size in bytes
4. The host's file metadata is saved to the room record via `PATCH /api/rooms/:roomCode/metadata`.
5. When participants join, their local metadata is compared against the room's reference metadata. Any duration difference (> 2s) or resolution mismatch triggers an advisory banner.
6. The primary `<video>` element plays the blob URL directly at 60fps with zero server communication needed for media delivery.

### Playback Synchronization Protocol

```text
Host Action                Socket.IO Server           Participant
    │                             │                        │
    ├───── play (time: 42.1) ────►│                        │
    │                             ├───── playback_play ───►│
    │                             │      (time: 42.1)      │ Apply play
    │                             │                        │
    ├───── seek (time: 120.0) ───►│                        │
    │                             ├───── playback_seek ───►│
    │                             │      (time: 120.0)     │ video.currentTime = 120
    │                             │                        │
    ├───── heartbeat (5s) ───────►│                        │
    │      (time: 125.0)          ├───── sync_state ──────►│
    │                             │      (time: 125.0)     │ Drift check:
    │                             │                        │ |local - server| > 0.5s?
    │                             │                        │ -> seek to 125.0s
```

---

## 5. Folder Structure

```text
cineparty/
├── client/                     # Vite + React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # GoogleSignInButton, AuthForm
│   │   │   ├── chat/           # ChatBox, MessageList, MessageInput
│   │   │   ├── common/         # Navbar, Footer, ProtectedRoute
│   │   │   ├── room/           # RoomHeader, HostControls, ParticipantList
│   │   │   └── video/          # FilePicker, FileVerification, VideoPlayer, SyncIndicator
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── hooks/              # useRoom, useVideoSync
│   │   ├── pages/              # Home, Login, Register, Dashboard, CreateRoom, Room, NotFound
│   │   ├── services/           # api, authService, roomService
│   │   ├── utils/              # formatTime, videoMetadata
│   │   ├── App.jsx             # Main Router layout
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Design tokens & Tailwind CSS
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js, google.js
│   ├── controllers/            # authController, roomController
│   ├── middleware/             # authMiddleware, errorHandler
│   ├── models/                 # User.js, Room.js, Message.js
│   ├── routes/                 # authRoutes, roomRoutes
│   ├── sockets/                # socketHandler, roomSocket, syncSocket, chatSocket
│   ├── utils/                  # jwt.js, logger.js
│   ├── server.js               # HTTP + Socket.IO bootstrap
│   └── package.json
│
├── devlopment.md               # Master development specification
└── README.md                   # Project documentation
```

---

## 6. Environment Setup

### Server Configuration (`server/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/cineparty
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Client Configuration (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 7. Installation & Running Locally

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **MongoDB** (running locally on port 27017, or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cineparty.git
cd cineparty
```

### 2. Setup Server
```bash
cd server
npm install
npm run dev
# Server running at http://localhost:5000
```

### 3. Setup Client
```bash
cd ../client
npm install
npm run dev
# Client running at http://localhost:3000
```

---

## 8. API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account with name, email, password | No |
| `POST` | `/api/auth/login` | Login with email and password | No |
| `POST` | `/api/auth/google` | Sign in or register with Google ID credential | No |
| `GET` | `/api/auth/me` | Fetch authenticated user's profile | Yes (Bearer) |

### Room Endpoints (`/api/rooms`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/rooms` | Create a new room (returns 6-char room code) | Yes (Bearer) |
| `GET` | `/api/rooms/:roomCode` | Retrieve room details & current state | Yes (Bearer) |
| `POST` | `/api/rooms/:roomCode/join` | Join room with code (and optional password) | Yes (Bearer) |
| `POST` | `/api/rooms/:roomCode/leave` | Leave active room | Yes (Bearer) |
| `PATCH` | `/api/rooms/:roomCode/controls`| Toggle host-only controls (Host only) | Yes (Bearer) |
| `PATCH` | `/api/rooms/:roomCode/lock` | Lock or unlock room (Host only) | Yes (Bearer) |
| `PATCH` | `/api/rooms/:roomCode/metadata`| Save movie metadata reference (Host only) | Yes (Bearer) |
| `DELETE`| `/api/rooms/:roomCode` | End room for all participants (Host only) | Yes (Bearer) |

---

## 9. Socket.IO Events

### Room Management (`roomSocket.js`)

| Event Sent by Client | Payload | Server Response / Broadcast |
|---|---|---|
| `join_room` | `{ roomCode, userId }` | Broadcasts `user_joined` with updated participants |
| `leave_room` | `{ roomCode, userId }` | Broadcasts `user_left` with updated participants |
| `end_room` | `{ roomCode, userId }` | Broadcasts `room_ended` to all participants |

### Playback Synchronization (`syncSocket.js`)

| Event Sent by Client | Payload | Broadcast / Action |
|---|---|---|
| `play` | `{ roomCode, currentTime, userId }` | Broadcasts `playback_play` with time |
| `pause` | `{ roomCode, currentTime, userId }` | Broadcasts `playback_pause` with time |
| `seek` | `{ roomCode, currentTime, userId }` | Broadcasts `playback_seek` with time |
| `sync_request` | `{ roomCode }` | Emits `sync_state` back with host's current state |
| `heartbeat` | `{ roomCode, currentTime, isPlaying, userId }` | Relays sync state; flags drift if > 0.5s |

### Real-Time Chat (`chatSocket.js`)

| Event Sent by Client | Payload | Broadcast / Action |
|---|---|---|
| `send_message` | `{ roomCode, text, userId, userName, userAvatar }` | Persists to DB, broadcasts `receive_message` |
| `fetch_messages` | `{ roomCode, limit }` | Emits `message_history` with recent room messages |

---

## 10. Security & Privacy Highlights

* **Privacy First**: Video files remain entirely on the user's hard drive; zero frames or audio samples cross the network.
* **Password Hashing**: Bcrypt with 10 salt rounds used for all user passwords and private room passwords.
* **Token Security**: Stateless JWTs with 7-day expiration; passwords explicitly stripped from database responses via Mongoose projection.
* **Sanitized Inputs**: Chat messages capped at 500 characters, whitespace-trimmed, and rendered safely via React's JSX escaping.
* **Room Access Control**: Protected routes and socket event handlers enforce host ownership before mutating room states.

---

## 11. License

MIT License. Designed and built with the MERN stack.
