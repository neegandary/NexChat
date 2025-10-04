import { Router } from "express";
import {
    getMessages,
    getMessagesWithContacts,
    markMessagesAsRead,
    archiveConversation,
    uploadFile
} from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const messagesRoutes = Router();
const upload = multer({ dest: 'uploads/files' });

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/get-messages-with-contacts", verifyToken, getMessagesWithContacts);
messagesRoutes.post("/mark-as-read", verifyToken, markMessagesAsRead);
messagesRoutes.post("/archive-conversation", verifyToken, archiveConversation);
messagesRoutes.post("/upload-file", verifyToken, upload.single('file'), uploadFile)

export default messagesRoutes;