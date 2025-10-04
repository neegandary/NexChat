import { useAppStore } from "@/store";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
                // Tối ưu connection
                transports: ['websocket', 'polling'],
                upgrade: true,
                forceNew: false,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
                // Compression
                compression: true,
                // Auto connect
                autoConnect: true
            });

            socket.current.on("connect", () => {
            });

            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addMessageToSelected } = useAppStore.getState();

                // Thêm vào global messages store
                addMessage(message);

                // Thêm vào selected chat nếu đang mở chat đó
                if (selectedChatData && selectedChatType === "contact" &&
                    message.sender && message.recipient &&
                    (selectedChatData._id === (message.sender._id || message.sender.id) ||
                        selectedChatData._id === (message.recipient._id || message.recipient.id))) {
                    addMessageToSelected(message);
                }
            };

            const handleMessagesRead = (data) => {
                const { updateMessagesReadStatus } = useAppStore.getState();
                updateMessagesReadStatus(data.userId);
            };

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("messagesRead", handleMessagesRead);

            return () => {
                socket.current.off("receiveMessage", handleReceiveMessage);
                socket.current.off("messagesRead", handleMessagesRead);
                socket.current.disconnect();
            };
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}