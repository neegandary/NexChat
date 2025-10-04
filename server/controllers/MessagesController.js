import Message from "../models/MessageModel.js";
import mongoose from "mongoose";
import { mkdirSync, renameSync } from "fs";

export const getMessagesWithContacts = async (request, response, next) => {
    try {
        const userId = request.userId;
        const { searchTerm } = request.body;

        // Aggregate pipeline to get latest message for each contact
        const pipeline = [
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(userId) },
                        { recipient: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessage: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $ne: ["$sender", new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ["$isRead", false] }
                                    ]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: "$contactInfo._id",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    email: "$contactInfo.email",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                    lastMessage: {
                        content: "$lastMessage.content",
                        messageType: "$lastMessage.messageType",
                        fileUrl: "$lastMessage.fileUrl",
                        timestamp: "$lastMessage.timestamp",
                        sender: "$lastMessage.sender",
                        isFromCurrentUser: { $eq: ["$lastMessage.sender", new mongoose.Types.ObjectId(userId)] }
                    },
                    unreadCount: 1,
                    timestamp: "$lastMessage.timestamp",
                    isArchived: { $ifNull: ["$lastMessage.isArchived", false] },
                    isOnline: { $ifNull: ["$contactInfo.isOnline", false] }
                }
            }
        ];

        // Add search filter if provided
        if (searchTerm) {
            pipeline.push({
                $match: {
                    $or: [
                        { firstName: { $regex: searchTerm, $options: "i" } },
                        { lastName: { $regex: searchTerm, $options: "i" } },
                        { email: { $regex: searchTerm, $options: "i" } }
                    ]
                }
            });
        }

        pipeline.push({ $sort: { timestamp: -1 } });

        const contactsWithMessages = await Message.aggregate(pipeline);

        return response.status(200).json({ contacts: contactsWithMessages });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getMessages = async (request, response, next) => {
    try {
        const user1 = request.userId;
        const user2 = request.body.id;

        if (!user1 || !user2) {
            return response.status(400).send("Both user IDs are required");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).populate("sender", "_id email firstName lastName image")
            .populate("recipient", "_id email firstName lastName image")
            .sort({ timestamp: 1 });

        // Đánh dấu tin nhắn đã đọc khi lấy tin nhắn
        await Message.updateMany(
            {
                sender: user2,
                recipient: user1,
                isRead: false
            },
            { isRead: true }
        );

        return response.status(200).json({ messages });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const uploadFile = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("No file uploaded");
        }
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${request.file.originalname}`;

        mkdirSync(fileDir, { recursive: true });

        renameSync(request.file.path, fileName);
        return response.status(200).json({ filePath: fileName });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

// Đánh dấu tin nhắn là đã đọc
export const markMessagesAsRead = async (request, response, next) => {
    try {
        const userId = request.userId;
        const { contactId } = request.body;

        if (!contactId) {
            return response.status(400).send("Contact ID is required");
        }

        await Message.updateMany(
            {
                sender: contactId,
                recipient: userId,
                isRead: false
            },
            { isRead: true }
        );

        return response.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

// Lưu trữ cuộc trò chuyện
export const archiveConversation = async (request, response, next) => {
    try {
        const userId = request.userId;
        const { contactId, isArchived } = request.body;

        if (!contactId) {
            return response.status(400).send("Contact ID is required");
        }

        // Cập nhật trạng thái lưu trữ trong tin nhắn
        await Message.updateMany(
            {
                $or: [
                    { sender: userId, recipient: contactId },
                    { sender: contactId, recipient: userId }
                ]
            },
            { isArchived: isArchived }
        );

        return response.status(200).json({
            message: isArchived ? "Conversation archived" : "Conversation unarchived"
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};