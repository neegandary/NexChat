import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";

export const useMarkAsRead = () => {
    const socket = useSocket();
    const { userInfo } = useAppStore();

    const markAsRead = (contactId) => {
        if (socket && userInfo) {
            socket.emit("markAsRead", {
                contactId,
                userId: userInfo.id
            });
        }
    };

    return { markAsRead };
};