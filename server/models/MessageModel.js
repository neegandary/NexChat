import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true  // Thêm index
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
        index: true  // Thêm index
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations",
        required: false,
        index: true  // Thêm index
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    fileName: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: -1  // Descending index cho sorting
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true  // Thêm index
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    // Tối ưu performance
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound indexes cho queries phổ biến
messageSchema.index({ sender: 1, recipient: 1, timestamp: -1 });
messageSchema.index({ conversation: 1, timestamp: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

const Message = mongoose.model("Messages", messageSchema);
export default Message;