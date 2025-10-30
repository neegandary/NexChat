# NexChat 💬

A real-time messaging platform designed to deliver seamless, instant communication with optimized performance and modern user experience.

![NexChat](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSocket technology (Socket.IO)
- **File Sharing**: Support for sending and receiving files with Cloudinary integration
- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **Contact Management**: Add and manage contacts with search functionality
- **Message Status**: Read receipts and message delivery status
- **Optimistic UI Updates**: Smooth user experience with instant UI feedback
- **Connection Recovery**: Automatic reconnection and message synchronization
- **Responsive Design**: Modern UI built with React and TailwindCSS
- **Dark/Light Theme**: Theme switching support with next-themes

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - File storage and CDN
- **Multer** - File upload handling

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- pnpm (recommended) or npm
- Cloudinary account (for file uploads)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/neegandary/NexChat.git
cd NexChat
```

2. **Install dependencies**
```bash
# Install root dependencies
pnpm install

# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd client
pnpm install
```

3. **Environment Setup**

Create `.env` file in the `server` directory:
```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `.env` file in the `server/client` directory:
```env
VITE_SERVER_URL=http://localhost:3001
```

4. **Create MongoDB Indexes** (Optional but recommended)
```bash
cd server
node create-indexes.js
```

## 🚀 Running the Application

### Development Mode

**Option 1: Run separately**
```bash
# Terminal 1 - Start backend server
cd server
pnpm run dev

# Terminal 2 - Start frontend
cd server/client
pnpm run dev
```

**Option 2: Run from root**
```bash
# Build and start (production-like)
pnpm run build
pnpm run start
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## 📁 Project Structure

```
NexChat/
├── server/
│   ├── client/              # Frontend React app
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── store/       # Zustand state management
│   │   │   ├── context/     # React context (Socket)
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utilities and API client
│   │   │   └── utils/       # Helper functions
│   │   └── package.json
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Express middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # Temporary file uploads
│   ├── socket.js           # Socket.IO configuration
│   ├── index.js            # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## 🔑 Key Features Implementation

### Real-time Communication
- Socket.IO with connection state recovery
- User presence tracking with socket mapping
- Optimistic message updates for instant UI feedback
- Message queue system for offline message handling

### Performance Optimization
- MongoDB compound indexes for fast queries
- Connection pooling (maxPoolSize: 50)
- User data caching with TTL (5 minutes)
- Compression middleware for reduced payload size
- Optimized Socket.IO configuration

### Security
- JWT authentication with HTTP-only cookies
- Bcrypt password hashing (10 rounds)
- CORS configuration with whitelist
- Input validation and sanitization
- Secure file upload handling

## 📊 Database Schema

### User Model
- Email, password (hashed)
- Profile information (firstName, lastName, image)
- Profile setup status

### Message Model
- Sender and recipient references
- Message type (text/file)
- Content or file URL
- Timestamp and read status
- Conversation reference

### Conversation Model
- Participants array
- Last message reference
- Group chat support
- Last message timestamp

## 🎨 UI Components

Built with Radix UI and custom components:
- Chat container with message list
- Contact list with search
- Message input with file upload
- User profile management
- Theme switcher (dark/light)
- Toast notifications (Sonner)

## 🔄 State Management

Using Zustand for global state:
- User authentication state
- Chat state (messages, contacts)
- Selected contact/conversation
- UI state (theme, modals)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user-info` - Get current user
- `POST /api/auth/logout` - User logout

### Contacts
- `GET /api/contacts` - Get user contacts
- `POST /api/contacts/search` - Search users
- `GET /api/contacts/dm-contacts` - Get DM contacts

### Messages
- `GET /api/messages/:contactId` - Get messages with contact
- `POST /api/messages/upload-file` - Upload file
- `PATCH /api/messages/mark-read/:contactId` - Mark messages as read

### WebSocket Events
- `sendMessage` - Send new message
- `receiveMessage` - Receive new message
- `markAsRead` - Mark messages as read
- `messagesRead` - Notification of read messages

## 🚢 Deployment

The application is configured for deployment on:
- **Frontend**: Vercel
- **Backend**: Render or Vercel

Deployment files included:
- `server/vercel.json` - Backend Vercel config
- `server/client/vercel.json` - Frontend Vercel config

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**neegandary**
- GitHub: [@neegandary](https://github.com/neegandary)

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- MongoDB for flexible data storage
- Cloudinary for file management
- Radix UI for accessible components
- TailwindCSS for styling utilities

---

Made with ❤️ by neegandary
