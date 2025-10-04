import express from ".pnpm/express@5.1.0/node_modules/express";
import mongoose, { mongo } from "mongoose";
import cors from ".pnpm/cors@2.8.5/node_modules/cors";
import dotenv from "dotenv";
import cookieParser from ".pnpm/cookie-parser@1.4.7/node_modules/cookie-parser";
import compression from ".pnpm/compression@1.8.1/node_modules/compression";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const databaseUrl = process.env.MONGO_URI;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://nex-chat-kqkx.vercel.app",
        "https://nex-chat-ten.vercel.app",
        process.env.CLIENT_URL || "https://your-app.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200
}));

// Handle preflight requests for all routes
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(200);
    }
    next();
});

app.use(cookieParser());
app.use(express.json({
    limit: '10mb', // Tăng limit cho JSON payload
    verify: (req, res, buf) => {
        // Verify JSON payload
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 1000
}));

// Compression middleware
import compression from '.pnpm/compression@1.8.1/node_modules/compression';
app.use(compression({
    level: 6,
    threshold: 1024, // Only compress if size > 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

const server = app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

setupSocket(server);

mongoose.connect(databaseUrl, {
    // Tối ưu connection pooling
    maxPoolSize: 50,          // Maintain up to 50 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000,   // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0,      // Disable mongoose buffering
    bufferCommands: false,    // Disable mongoose buffering

    // Compression
    compressors: ['zlib'],

    // Connection management
    maxIdleTimeMS: 30000,     // Close connections after 30 seconds of inactivity
    waitQueueTimeoutMS: 5000, // How long a thread will wait for a connection to become available

    // Write concern
    w: 'majority',
    journal: true,

    // Read preference
    readPreference: 'primaryPreferred'
}).then(() => {
    console.log("Connected to MongoDB with optimized settings");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});
