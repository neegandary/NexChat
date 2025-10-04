import { useAppStore } from "@/store";
import { User } from 'lucide-react';
import { format } from 'date-fns';

const MessageContainer = () => {
    const { selectedChatMessages, userInfo } = useAppStore();

    const formatTime = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return format(date, 'HH:mm');
        } catch {
            return '';
        }
    };

    const renderMessage = (message, index) => {
        const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
        const isOwn = senderId === userInfo.id;

        return (
            <div key={index} className={`flex items-start mb-4 ${isOwn ? 'justify-end' : ''}`}>
                {!isOwn && (
                    <div className="w-8 h-8 bg-[#EBEDF0] dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <User size={16} className="text-[#767C8C] dark:text-gray-300" />
                    </div>
                )}
                <div className={`rounded-lg px-4 py-2 max-w-xs ${isOwn
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-[#F6F6F6] dark:bg-gray-700 text-black dark:text-white'
                    }`}>
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 flex items-center ${isOwn ? 'justify-end text-gray-300 dark:text-gray-600' : 'text-[#767C8C] dark:text-gray-400'
                        }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {isOwn && (
                            <span className="ml-1">
                                {message.isRead ? '✓✓' : '✓'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {selectedChatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[#767C8C] dark:text-gray-400">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#F6F6F6] dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={24} />
                        </div>
                        <p className="text-lg font-medium mb-2">Chưa có tin nhắn nào</p>
                        <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {selectedChatMessages.map((message, index) => renderMessage(message, index))}
                </div>
            )}
        </>
    );
};

export default MessageContainer;