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
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
            });

            const handleReceiveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

                if (selectedChatData && selectedChatType === "contact" &&
                    message.sender && message.recipient &&
                    (selectedChatData._id === (message.sender._id || message.sender.id) ||
                        selectedChatData._id === (message.recipient._id || message.recipient.id))) {
                    addMessage(message);
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