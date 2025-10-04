import { useAppStore } from "@/store";
import { User, Archive, Clock, MessageCircle, MoreVertical, ArchiveX } from 'lucide-react';
import { useEffect } from "react";
import apiClient from "@/lib/api-client";
import { useMarkAsRead } from "@/hooks/useMarkAsRead";
import {
    SEARCH_CONTACTS_ROUTE,
    GET_MESSAGES_WITH_CONTACTS_ROUTE,
    MARK_MESSAGES_AS_READ_ROUTE,
    ARCHIVE_CONVERSATION_ROUTE
} from "@/utils/constants";

const ContactList = ({ searchTerm, activeTab }) => {
    const { contacts, setSelectedChatData, setSelectedChatType, selectedChatData, setContacts } = useAppStore();
    const { markAsRead } = useMarkAsRead();

    // Format time helper function
    const formatTime = (timestamp) => {
        if (!timestamp) return '';

        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInHours = (now - messageTime) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Vừa xong';
        } else if (diffInHours < 24) {
            return messageTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } else if (diffInHours < 24 * 7) {
            const days = Math.floor(diffInHours / 24);
            return `${days} ngày`;
        } else {
            return messageTime.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit'
            });
        }
    };

    useEffect(() => {
        const getContactsWithMessages = async () => {
            try {
                // Try to get contacts with their latest messages
                const response = await apiClient.post(GET_MESSAGES_WITH_CONTACTS_ROUTE, { searchTerm });
                if (response.status === 200 && response.data.contacts) {
                    setContacts(response.data.contacts);
                } else {
                    // Only fallback to search all users if user is actively searching
                    if (searchTerm.trim()) {
                        const fallbackResponse = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm });
                        if (fallbackResponse.status === 200 && fallbackResponse.data.contacts) {
                            // Add empty lastMessage to make them look like contacts without messages
                            const searchResults = fallbackResponse.data.contacts.map(contact => ({
                                ...contact,
                                lastMessage: null,
                                unreadCount: 0,
                                timestamp: new Date().toISOString(),
                                isArchived: false,
                                isOnline: false
                            }));
                            setContacts(searchResults);
                        }
                    } else {
                        // No search term and no messages = empty inbox
                        setContacts([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching contacts with messages:", error);
                setContacts([]);
            }
        };
        getContactsWithMessages();
    }, [searchTerm, setContacts]);

    const displayContacts = contacts || [];

    const filteredContacts = displayContacts.filter(contact => {
        // First filter by search term
        const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
        const email = contact.email.toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch = fullName.includes(search) || email.includes(search);

        if (!matchesSearch) return false;

        // Then filter by active tab
        switch (activeTab) {
            case 'inbox':
                return !contact.isArchived;
            case 'archived':
                return contact.isArchived;
            default:
                return !contact.isArchived;
        }
    });

    const handleContactClick = async (contact) => {
        setSelectedChatType("contact");
        setSelectedChatData(contact);

        // Đánh dấu tin nhắn là đã đọc khi click vào contact
        if (contact.unreadCount > 0) {
            try {
                await apiClient.post(MARK_MESSAGES_AS_READ_ROUTE, { contactId: contact._id });
                // Gửi sự kiện qua socket
                markAsRead(contact._id);
                // Cập nhật local state
                const updatedContacts = contacts.map(c =>
                    c._id === contact._id ? { ...c, unreadCount: 0 } : c
                );
                setContacts(updatedContacts);
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }
    };

    const handleArchiveContact = async (e, contact) => {
        e.stopPropagation(); // Prevent contact click
        try {
            const isArchiving = !contact.isArchived;
            await apiClient.post(ARCHIVE_CONVERSATION_ROUTE, {
                contactId: contact._id,
                isArchived: isArchiving
            });

            // Cập nhật local state
            const updatedContacts = contacts.map(c =>
                c._id === contact._id ? { ...c, isArchived: isArchiving } : c
            );
            setContacts(updatedContacts);
        } catch (error) {
            console.error("Error archiving conversation:", error);
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            {filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
                    <div className="text-6xl mb-4">
                        {activeTab === 'archived' && '📦'}
                        {(activeTab === 'inbox' || !activeTab) && '💬'}
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium mb-2">
                            {activeTab === 'archived' && 'Không có cuộc trò chuyện đã lưu trữ'}
                            {(activeTab === 'inbox' || !activeTab) && 'Không có cuộc trò chuyện nào'}
                        </p>
                        <p className="text-sm">
                            {activeTab === 'archived' && 'Lưu trữ các cuộc trò chuyện để dọn dẹp hộp thư'}
                            {(activeTab === 'inbox' || !activeTab) && 'Bắt đầu cuộc trò chuyện mới'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-1 p-2">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact._id}
                            onClick={() => handleContactClick(contact)}
                            className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedChatData?._id === contact._id
                                ? 'bg-[#F6F6F6] dark:bg-gray-700 shadow-md'
                                : contact.unreadCount > 0
                                    ? 'bg-[#EBEDF0] dark:bg-gray-700 hover:bg-[#F6F6F6] dark:hover:bg-gray-600'
                                    : 'hover:bg-[#F6F6F6] dark:hover:bg-gray-700 hover:shadow-sm'
                                } ${contact.isArchived ? 'opacity-75' : ''}`}
                        >
                            <div className="flex items-center">
                                <div className="relative mr-3">
                                    {contact.image ? (
                                        <img
                                            src={contact.image}
                                            alt={contact.firstName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-[#EBEDF0] dark:bg-gray-600 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-[#767C8C] dark:text-gray-300" />
                                        </div>
                                    )}
                                    {contact.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-medium text-black dark:text-white truncate">
                                            {contact.firstName && contact.lastName
                                                ? `${contact.firstName} ${contact.lastName}`
                                                : contact.email
                                            }
                                        </h4>
                                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                            {contact.unreadCount > 0 && (
                                                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-black rounded-full">
                                                    {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                                                </span>
                                            )}
                                            <span className={`text-xs ${contact.unreadCount > 0
                                                ? 'text-black dark:text-white font-medium'
                                                : 'text-[#767C8C] dark:text-gray-400'
                                                }`}>
                                                {formatTime(contact.timestamp)}
                                            </span>
                                            {/* Only show archive button for contacts with messages */}
                                            {contact.lastMessage && (
                                                <button
                                                    onClick={(e) => handleArchiveContact(e, contact)}
                                                    className="p-1 rounded-full hover:bg-[#EBEDF0] dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    title={contact.isArchived ? 'Bỏ lưu trữ' : 'Lưu trữ'}
                                                >
                                                    {contact.isArchived ? (
                                                        <ArchiveX size={14} className="text-[#767C8C] dark:text-gray-400" />
                                                    ) : (
                                                        <Archive size={14} className="text-[#767C8C] dark:text-gray-400" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm truncate flex-1 ${contact.unreadCount > 0
                                            ? 'text-black dark:text-white font-medium'
                                            : 'text-[#767C8C] dark:text-gray-400'
                                            }`}>
                                            {contact.lastMessage?.messageType === 'file' ?
                                                '📎 File đính kèm' :
                                                contact.lastMessage?.content || "Chưa có tin nhắn"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactList;