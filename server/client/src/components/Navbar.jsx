import { Search, Inbox, Archive, CheckCheck } from "lucide-react";

const Navbar = ({ searchTerm, setSearchTerm, activeTab, setActiveTab, contacts = [], onMarkAllRead }) => {
  // Calculate counts for each tab
  const getTabCounts = () => {
    const counts = {
      inbox: 0,
      archived: 0,
      unread: 0
    };

    contacts.forEach(contact => {
      if (!contact.isArchived) {
        counts.inbox++;
        if (contact.unreadCount > 0) {
          counts.unread++;
        }
      } else {
        counts.archived++;
      }
    });

    return counts;
  };

  const tabCounts = getTabCounts();

  const tabs = [
    {
      id: 'inbox',
      label: 'Hộp thư',
      count: tabCounts.inbox,
      icon: Inbox
    },
    {
      id: 'archived',
      label: 'Lưu trữ',
      count: tabCounts.archived,
      icon: Archive
    }
  ];

  return (
    <div className="flex-shrink-0 p-6 border-b border-[#EBEDF0] dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#EBEDF0] dark:bg-gray-700 border border-[#767C8C] dark:border-gray-600 rounded-lg px-4 py-2 pl-10 text-black dark:text-white placeholder-[#767C8C] dark:placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-all duration-200"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-[#767C8C] dark:text-gray-400" />
        </div>

        {/* Mark all as read button */}
        {tabCounts.unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="p-2 rounded-lg bg-black dark:bg-white hover:bg-[#242423] dark:hover:bg-gray-200 text-white dark:text-black transition-all duration-200"
            title="Đánh dấu tất cả là đã đọc"
          >
            <CheckCheck size={16} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 text-sm bg-[#F6F6F6] dark:bg-gray-700 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-md transition-all duration-200 flex items-center justify-center space-x-2 font-medium ${isActive
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-[#767C8C] dark:text-gray-300 hover:bg-[#EBEDF0] dark:hover:bg-gray-600 hover:text-black dark:hover:text-white'
                }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-semibold ${isActive
                  ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                  : 'bg-[#767C8C] dark:bg-gray-500 text-white dark:text-gray-200'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;