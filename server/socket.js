import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import User from "./models/UserModel.js";
import Conversation from "./models/ConversationModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
            methods: ["GET", "POST"],
            credentials: true,
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
            console.log("Received sendMessage:", message);
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);
            console.log("Socket IDs - sender:", senderSocketId, "recipient:", recipientSocketId);
            console.log("Current userSocketMap:", Object.fromEntries(userSocketMap));

            // Verify users exist before creating message
            const senderExists = await User.findById(message.sender);
            const recipientExists = await User.findById(message.recipient);
            console.log("Sender exists:", !!senderExists, "Recipient exists:", !!recipientExists);

            // Find or create conversation between sender and recipient
            let conversation = await Conversation.findOne({
                participants: { $all: [message.sender, message.recipient] },
                isGroup: false
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [message.sender, message.recipient],
                    isGroup: false
                });
                console.log("Created new conversation:", conversation._id);
            } else {
                console.log("Found existing conversation:", conversation._id);
            }

            // Add conversation ID to message
            const messageWithConversation = {
                ...message,
                conversation: conversation._id
            };

            const createdMessage = await Message.create(messageWithConversation);
            console.log("Created message:", createdMessage);

            // Update conversation with last message
            await Conversation.findByIdAndUpdate(conversation._id, {
                lastMessage: createdMessage._id,
                lastMessageTime: createdMessage.timestamp
            });

            // Try to populate step by step
            let messageData;
            try {
                messageData = await Message.findById(createdMessage._id)
                    .populate("sender", "id _id email firstName lastName image")
                    .populate("recipient", "id _id email firstName lastName image")
                    .lean(); // Use lean for better performance

                console.log("Populated message data:", messageData);
            } catch (populateError) {
                console.error("Populate error:", populateError);
                // Fallback - manually fetch user data
                const sender = await User.findById(message.sender).select("_id email firstName lastName image");
                const recipient = await User.findById(message.recipient).select("_id email firstName lastName image");

                messageData = {
                    ...createdMessage.toObject(),
                    sender: sender,
                    recipient: recipient
                };
                console.log("Manual populated message data:", messageData);
            }

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