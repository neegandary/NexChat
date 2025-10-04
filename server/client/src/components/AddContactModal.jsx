import { useState, useEffect, useCallback } from "react";
import { X, Search, User, MessageCircle } from "lucide-react";
import apiClient from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { toast } from "sonner";

const AddContactModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setSelectedChatData, setSelectedChatType } = useAppStore();

    const searchContacts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm });
            if (response.status === 200) {
                setSearchResults(response.data.contacts);
            }
        } catch (error) {
            console.error("Error searching contacts:", error);
            toast.error("Có lỗi khi tìm kiếm liên hệ");
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm.length > 0) {
            searchContacts();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, searchContacts]);

    const handleStartChat = (contact) => {
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        toast.success(`Bắt đầu trò chuyện với ${contact.firstName} ${contact.lastName}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#EBEDF0] dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Tìm kiếm liên hệ
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-[#F6F6F6] dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} className="text-[#767C8C] dark:text-gray-400" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#767C8C] dark:text-gray-400"
                        />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm theo tên hoặc email..."
                            className="w-full pl-10 pr-4 py-2 border-2 border-[#EBEDF0] dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Search Results */}
                <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                        </div>
                    ) : searchResults.length === 0 && searchTerm ? (
                        <div className="flex flex-col items-center justify-center py-8 text-[#767C8C] dark:text-gray-400">
                            <User size={48} className="mb-2" />
                            <p>Không tìm thấy liên hệ nào</p>
                        </div>
                    ) : searchTerm === "" ? (
                        <div className="flex flex-col items-center justify-center py-8 text-[#767C8C] dark:text-gray-400">
                            <Search size={48} className="mb-2" />
                            <p>Nhập tên hoặc email để tìm kiếm</p>
                        </div>
                    ) : (
                        <div className="space-y-1 p-2">
                            {searchResults.map((contact) => (
                                <div
                                    key={contact._id}
                                    className="flex items-center p-3 rounded-lg hover:bg-[#F6F6F6] dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={() => handleStartChat(contact)}
                                >
                                    <div className="mr-3">
                                        {contact.image ? (
                                            <img
                                                src={contact.image}
                                                alt={`${contact.firstName} ${contact.lastName}`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-[#EBEDF0] dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                <User size={18} className="text-[#767C8C] dark:text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-black dark:text-white">
                                            {contact.firstName && contact.lastName
                                                ? `${contact.firstName} ${contact.lastName}`
                                                : contact.email
                                            }
                                        </h4>
                                        <p className="text-sm text-[#767C8C] dark:text-gray-400">
                                            {contact.email}
                                        </p>
                                    </div>
                                    <MessageCircle size={18} className="text-[#767C8C] dark:text-gray-400" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#EBEDF0] dark:border-gray-700">
                    <p className="text-xs text-[#767C8C] dark:text-gray-400 text-center">
                        Click vào một liên hệ để bắt đầu trò chuyện
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddContactModal;