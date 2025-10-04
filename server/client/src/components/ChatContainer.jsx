import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { useState, useRef, useEffect } from "react";
import { User, Phone, Video, MoreVertical, Paperclip, Smile, Send, Menu } from 'lucide-react';
import apiClient from "@/lib/api-client";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";
import MessageContainer from "./MessageContainer";

const ChatContainer = () => {
    const { selectedChatData, selectedChatMessages, userInfo, setSelectedChatMessages } = useAppStore();
    const socket = useSocket();
    const fileInputRef = useRef();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const getMessages = async () => {
            if (selectedChatData?._id) {
                try {
                    const response = await apiClient.post(GET_MESSAGES_ROUTE, { id: selectedChatData._id });
                    if (response.data.messages) {
                        setSelectedChatMessages(response.data.messages);
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };
        getMessages();
    }, [selectedChatData, setSelectedChatMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedChatMessages]);

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedChatData || !socket) return;

        const messageData = {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            messageType: "text",
            content: message.trim(),
            timestamp: new Date()
        };

        socket.emit("sendMessage", messageData);
        setMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!selectedChatData) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 h-full">
                <div className="text-center text-[#767C8C] dark:text-gray-400">
                    <div className="w-16 h-16 bg-[#F6F6F6] dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Chọn một cuộc trò chuyện</h3>
                    <p>Chọn một người bạn để bắt đầu nhắn tin</p>
                </div>
            </div>
        );
    }


    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0];
            console.log({ file })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 h-full w-full">
            {/* Chat Header */}
            <div className="flex-shrink-0 border-b border-[#EBEDF0] dark:border-gray-700 p-3 md:p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#EBEDF0] dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <User size={18} className="text-[#767C8C] dark:text-gray-300" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm md:text-base text-black dark:text-white">
                            {selectedChatData.firstName && selectedChatData.lastName
                                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                                : selectedChatData.email
                            }
                        </h3>
                        <p className="text-sm text-[#767C8C] dark:text-gray-400">Online</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-[#F6F6F6] dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Phone size={18} className="text-[#767C8C] dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#F6F6F6] dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Video size={18} className="text-[#767C8C] dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#F6F6F6] dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-[#767C8C] dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0 overflow-y-auto p-4 scrollbar-chat">
                    <MessageContainer />
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0 border-t border-[#EBEDF0] dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                    <button onClick={handleAttachmentClick} className="p-2 hover:bg-[#F6F6F6] dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Paperclip size={18} className="text-[#767C8C] dark:text-gray-400" />
                    </button>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            className="w-full px-4 py-3 bg-[#F6F6F6] dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[#EBEDF0] dark:hover:bg-gray-600 rounded transition-colors">
                            <Smile size={18} className="text-[#767C8C] dark:text-gray-400" />
                        </button>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg hover:bg-[#767C8C] dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                        disabled={!message.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;