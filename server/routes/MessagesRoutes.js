import { Router } from ".pnpm/express@5.1.0/node_modules/express";
import {
    getMessages,
    getMessagesWithContacts,
    markMessagesAsRead,
    archiveConversation,
    uploadFile
} from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "nexchat-files",
        resource_type: "auto", // Supports images, videos, and raw files
        public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
    },
});

const messagesRoutes = Router();
const upload = multer({ storage: storage });

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/get-messages-with-contacts", verifyToken, getMessagesWithContacts);
messagesRoutes.post("/mark-as-read", verifyToken, markMessagesAsRead);
messagesRoutes.post("/archive-conversation", verifyToken, archiveConversation);
messagesRoutes.post("/upload-file", verifyToken, upload.single('file'), uploadFile)

export default messagesRoutes;