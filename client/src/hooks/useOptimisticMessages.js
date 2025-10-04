import { useState, useCallback } from 'react';
import { useAppStore } from '@/store';

export const useOptimisticMessages = () => {
    const [pendingMessages, setPendingMessages] = useState(new Map());
    const { addMessage } = useAppStore();

    const sendOptimisticMessage = useCallback((message, onSend) => {
        // Tạo temporary ID cho message
        const tempId = `temp_${Date.now()}_${Math.random()}`;
        
        // Tạo optimistic message
        const optimisticMessage = {
            ...message,
            _id: tempId,
            timestamp: new Date(),
            isPending: true,
            isOptimistic: true
        };

        // Thêm vào store ngay lập tức
        addMessage(optimisticMessage);
        
        // Track pending message
        setPendingMessages(prev => new Map(prev).set(tempId, optimisticMessage));

        // Gửi message thực sự
        const sendPromise = onSend(message);
        
        sendPromise
            .then((realMessage) => {
                // Thay thế optimistic message bằng real message
                setPendingMessages(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(tempId);
                    return newMap;
                });
                
                // Update message trong store
                const { messages, setMessages } = useAppStore.getState();
                const updatedMessages = messages.map(msg => 
                    msg._id === tempId ? { ...realMessage, isPending: false } : msg
                );
                setMessages(updatedMessages);
            })
            .catch((error) => {
                // Xóa optimistic message nếu gửi thất bại
                setPendingMessages(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(tempId);
                    return newMap;
                });
                
                // Xóa khỏi store
                const { messages, setMessages } = useAppStore.getState();
                const filteredMessages = messages.filter(msg => msg._id !== tempId);
                setMessages(filteredMessages);
                
                console.error('Failed to send message:', error);
            });

        return tempId;
    }, [addMessage]);

    const retryPendingMessage = useCallback((tempId, onSend) => {
        const message = pendingMessages.get(tempId);
        if (message) {
            sendOptimisticMessage(message, onSend);
        }
    }, [pendingMessages, sendOptimisticMessage]);

    return {
        sendOptimisticMessage,
        retryPendingMessage,
        pendingMessages: Array.from(pendingMessages.values())
    };
};