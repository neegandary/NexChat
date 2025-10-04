import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import User from "./models/UserModel.js";
import Conversation from "./models/ConversationModel.js";

// Cache cho user data để tránh query lại
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Hàm helper để get user data với cache
const getCachedUser = async (userId) => {
    const cacheKey = userId.toString();
    const cached = userCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    
    const userData = await User.findById(userId).select("_id email firstName lastName image").lean();
    userCache.set(cacheKey, {
        data: userData,
        timestamp: Date.now()
    });
    
    return userData;
};

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "https://nex-chat-kqkx.vercel.app",
                "https://nex-chat-ten.vercel.app",
                process.env.CLIENT_URL || "https://your-app.vercel.app"
            ],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
        },
        // Tối ưu performance
        transports: ['websocket', 'polling'],
        allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000,
        upgradeTimeout: 30000,
        maxHttpBufferSize: 1e6,
        // Compression
        compression: true,
        // Connection state recovery
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        }
    });

    const userSocketMap = new Map();

    const handleDisconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        try {
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);

            // Tối ưu: Sử dụng Promise.all với cached user data
            const [conversation, senderData, recipientData] = await Promise.all([
                // Find or create conversation
                Conversation.findOneAndUpdate(
                    {
                        participants: { $all: [message.sender, message.recipient] },
                        isGroup: false
                    },
                    {
                        participants: [message.sender, message.recipient],
                        isGroup: false
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                ).lean(),
                // Get cached sender data
                getCachedUser(message.sender),
                // Get cached recipient data  
                getCachedUser(message.recipient)
            ]);

            // Create message với conversation ID
            const messageWithConversation = {
                ...message,
                conversation: conversation._id
            };

            const createdMessage = await Message.create(messageWithConversation);

            // Tối ưu: Update conversation và tạo response data song song
            const [, messageData] = await Promise.all([
                // Update conversation
                Conversation.findByIdAndUpdate(conversation._id, {
                    lastMessage: createdMessage._id,
                    lastMessageTime: createdMessage.timestamp
                }),
                // Tạo message data để gửi
                Promise.resolve({
                    ...createdMessage.toObject(),
                    sender: senderData,
                    recipient: recipientData
                })
            ]);

            // Check if populate worked
            if (!messageData.sender) {
                console.error("Failed to populate sender data for ID:", message.sender);
            }
            if (!messageData.recipient) {
                console.error("Failed to populate recipient data for ID:", message.recipient);
            }

            if (recipientSocketId) {
                console.log("Sending to recipient:", recipientSocketId);
                io.to(recipientSocketId).emit("receiveMessage", messageData);
            } else {
                console.log("Recipient not connected or socket ID not found for user:", message.recipient);
            }

            if (senderSocketId) {
                console.log("Sending to sender:", senderSocketId);
                io.to(senderSocketId).emit("receiveMessage", messageData);
            } else {
                console.log("Sender socket ID not found for user:", message.sender);
            }
        } catch (error) {
            console.error("Error in sendMessage:", error);
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
            console.log("Updated userSocketMap:", Object.fromEntries(userSocketMap));
        } else {
            console.log("User ID not provided during connection");
        }

        socket.on("sendMessage", sendMessage);

        socket.on("markAsRead", async (data) => {
            const { contactId, userId } = data;
            try {
                await Message.updateMany(
                    {
                        sender: contactId,
                        recipient: userId,
                        isRead: false
                    },
                    { isRead: true }
                );

                const contactSocketId = userSocketMap.get(contactId);
                if (contactSocketId) {
                    io.to(contactSocketId).emit("messagesRead", { userId });
                }
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        });

        socket.on("disconnect", () => handleDisconnect(socket));
    });

    return io;
};

export default setupSocket;