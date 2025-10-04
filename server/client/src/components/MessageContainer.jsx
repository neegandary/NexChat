import { useAppStore } from "@/store";
import { User } from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import MessageItem from './MessageItem';

const MessageContainer = () => {
    const { selectedChatMessages, userInfo } = useAppStore();
    const containerRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // Tối ưu messages với useMemo
    const optimizedMessages = useMemo(() => {
        return selectedChatMessages.map((message, index) => ({
            ...message,
            id: message._id || `msg-${index}`,
            senderId: typeof message.sender === 'object' ? message.sender._id : message.sender
        }));
    }, [selectedChatMessages]);

    // Auto scroll to bottom khi có message mới
    useEffect(() => {
        if (autoScroll && containerRef.current) {
            const container = containerRef.current;
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            
            if (isNearBottom) {
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
            }
        }
    }, [optimizedMessages, autoScroll]);

    // Kiểm tra xem user có scroll lên trên không
    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            setAutoScroll(isNearBottom);
        }
    }, []);

    const renderMessage = (message) => {
        return (
            <MessageItem
                key={message.id}
                message={message}
                currentUserId={userInfo.id}
                onImageClick={(imageUrl) => {
                    // Handle image click - có thể mở modal
                    console.log('Image clicked:', imageUrl);
                }}
            />
        );
    };

    return (
        <>
            {optimizedMessages.length === 0 ? (
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
                <div 
                    ref={containerRef}
                    className="space-y-2 h-full overflow-y-auto scroll-smooth"
                    onScroll={handleScroll}
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {optimizedMessages.map((message) => renderMessage(message))}
                    
                    {/* Auto-scroll button */}
                    {!autoScroll && (
                        <button
                            onClick={() => {
                                setAutoScroll(true);
                                if (containerRef.current) {
                                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                                }
                            }}
                            className="fixed bottom-20 right-6 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                        >
                            ↓
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default MessageContainer;