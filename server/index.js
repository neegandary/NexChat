import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const databaseUrl = process.env.MONGO_URI;

// CORS configuration - Sửa lỗi CORS
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests from specific origins
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174", 
            "http://localhost:5175",
            "https://nex-chat-xi.vercel.app",
            "https://nexchat-l5o4.onrender.com",
            process.env.CLIENT_URL
        ];
        
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    optionsSuccessStatus: 200,
    preflightContinue: false
}));

// Enhanced CORS middleware để xử lý preflight
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:5175",
        "https://nex-chat-kqkx.vercel.app",
        "https://nex-chat-xi.vercel.app",
        "https://nexchat-l5o4.onrender.com",
        process.env.CLIENT_URL
    ];

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    
    if (req.method === 'OPTIONS') {
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

// Connect to MongoDB first, then start server
mongoose.connect(databaseUrl, {
    // Tối ưu connection pooling
    maxPoolSize: 50,          // Maintain up to 50 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000,   // Close sockets after 45 seconds of inactivity

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
    
    // Start server only after MongoDB is connected
    const server = app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });

    setupSocket(server);
}).catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});
