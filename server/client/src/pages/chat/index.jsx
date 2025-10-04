import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import TopNavbar from "../../components/TopNavbar";
import ContactList from "../../components/ContactList";
import ChatContainer from "../../components/ChatContainer";
import AddContactModal from "../../components/AddContactModal";
import { Plus, Menu } from 'lucide-react';
import { useAppStore } from "../../store";
import apiClient from "../../lib/api-client";
import { MARK_MESSAGES_AS_READ_ROUTE } from "../../utils/constants";
import { toast } from "sonner";

const Chat = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const { contacts, setContacts } = useAppStore();

  const handleMarkAllRead = async () => {
    try {
      // Lấy tất cả contacts có tin nhắn chưa đọc
      const unreadContacts = contacts.filter(contact => contact.unreadCount > 0);

      if (unreadContacts.length === 0) {
        toast.info("Không có tin nhắn chưa đọc nào!");
        return;
      }

      // Đánh dấu tất cả tin nhắn là đã đọc
      for (const contact of unreadContacts) {
        await apiClient.post(MARK_MESSAGES_AS_READ_ROUTE, { contactId: contact._id });
      }

      // Cập nhật local state
      const updatedContacts = contacts.map(contact => ({
        ...contact,
        unreadCount: 0
      }));
      setContacts(updatedContacts);

      toast.success("Đã đánh dấu tất cả tin nhắn là đã đọc!");
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      toast.error("Có lỗi xảy ra khi đánh dấu tin nhắn!");
    }
  };

  const [showContactList, setShowContactList] = useState(true);

  const toggleContactList = () => {
    setShowContactList(prev => !prev);
  };

  return (
    <div className="h-screen bg-[#F6F6F6] dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar - Full Height */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={toggleContactList} />

        {/* Right Content Body */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header - Chat Title and Create Button */}
          <div className="bg-white dark:bg-gray-800 border-b border-[#EBEDF0] dark:border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-black dark:text-white">Chat</h2>
            </div>
            <button
              onClick={() => setShowAddContactModal(true)}
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#767C8C] dark:hover:bg-gray-200 transition-colors text-sm flex items-center"
            >
              <Plus size={16} className="mr-2" />
              <span className="hidden sm:inline">Add New Contact</span>
            </button>
          </div>

          {/* Chat Content Area */}
          <div className="flex-1 flex min-h-0">
            {/* Left Panel - Search and Chat List */}
            <div className={`
              absolute md:relative
              bg-white dark:bg-gray-800 
              border-r border-[#EBEDF0] dark:border-gray-700 
              flex flex-col transition-all duration-300
              h-full
              ${showContactList ? 'left-0' : '-left-full md:left-0'}
              ${sidebarCollapsed ? 'w-[280px]' : 'w-[320px]'}
              md:translate-x-0
              z-20
            `}>
              {/* Navbar Component - Fixed height */}
              <div className="flex-shrink-0">
                <Navbar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  contacts={contacts}
                  onMarkAllRead={handleMarkAllRead}
                />
              </div>

              {/* Chat List Area - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0 scrollbar-contacts">
                <ContactList searchTerm={searchTerm} activeTab={activeTab} />
              </div>
            </div>

            {/* Main Chat Area - Right Side */}
            <div className="flex-1 min-w-0">
              <ChatContainer />
            </div>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
      />
    </div>
  );
};

export default Chat;