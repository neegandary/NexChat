import { useRef, useCallback } from 'react';

export const useMessageQueue = (socket) => {
    const messageQueue = useRef([]);
    const isProcessing = useRef(false);
    const batchTimeout = useRef(null);

    const processQueue = useCallback(async () => {
        if (isProcessing.current || messageQueue.current.length === 0) {
            return;
        }

        isProcessing.current = true;
        
        // Lấy tối đa 10 messages để batch process
        const batch = messageQueue.current.splice(0, 10);
        
        try {
            // Gửi từng message trong batch
            for (const message of batch) {
                if (socket && socket.connected) {
                    socket.emit("sendMessage", message.data);
                    // Resolve promise nếu thành công
                    message.resolve(message.data);
                } else {
                    // Reject nếu socket không connected
                    message.reject(new Error('Socket not connected'));
                }
                
                // Thêm delay nhỏ giữa các messages để tránh spam
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        } catch (error) {
            // Reject tất cả messages trong batch nếu có lỗi
            batch.forEach(message => message.reject(error));
        }
        
        isProcessing.current = false;
        
        // Tiếp tục process queue nếu còn messages
        if (messageQueue.current.length > 0) {
            setTimeout(processQueue, 50); // Delay 50ms trước khi process batch tiếp theo
        }
    }, [socket]);

    const queueMessage = useCallback((messageData) => {
        return new Promise((resolve, reject) => {
            messageQueue.current.push({
                data: messageData,
                resolve,
                reject,
                timestamp: Date.now()
            });

            // Clear existing timeout
            if (batchTimeout.current) {
                clearTimeout(batchTimeout.current);
            }

            // Set new timeout để batch process
            batchTimeout.current = setTimeout(() => {
                processQueue();
            }, 100); // Đợi 100ms để collect thêm messages vào batch
        });
    }, [processQueue]);

    const clearQueue = useCallback(() => {
        // Reject tất cả pending messages
        messageQueue.current.forEach(message => {
            message.reject(new Error('Queue cleared'));
        });
        messageQueue.current = [];
        
        if (batchTimeout.current) {
            clearTimeout(batchTimeout.current);
            batchTimeout.current = null;
        }
        
        isProcessing.current = false;
    }, []);

    return {
        queueMessage,
        clearQueue,
        getQueueLength: () => messageQueue.current.length
    };
};