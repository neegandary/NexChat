import { Sun, Moon, ChevronDown, Menu } from "lucide-react";
import { useAppStore } from "@/store";
import { useEffect } from "react";

const TopNavbar = ({ onMenuClick }) => {
  const { userInfo, isDarkMode, toggleDarkMode, initializeDarkMode } = useAppStore();

  // Initialize dark mode on component mount
  useEffect(() => {
    initializeDarkMode();
  }, [initializeDarkMode]);  // Get user initials for fallback
  const getUserInitials = (user) => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.lastName) {
      return user.lastName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    if (!user) return "User";

    // Check if firstName and lastName exist
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    // If only firstName exists
    if (user.firstName) {
      return user.firstName;
    }

    // If only lastName exists
    if (user.lastName) {
      return user.lastName;
    }

    // Fallback to "User" if no name fields are available
    return "User";
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-[#EBEDF0] dark:border-gray-700 px-4 md:px-6 py-2 flex items-center justify-between">
      {/* Left Side - Menu Button & Theme Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-[#F6F6F6] dark:hover:bg-gray-700 transition-colors"
        >
          <Menu size={20} className="text-[#767C8C] dark:text-gray-400" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F6F6F6] dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? (
            <>
              <Moon size={18} className="text-[#767C8C] dark:text-gray-400" />
              <span className="hidden sm:inline text-sm text-[#767C8C] dark:text-gray-400 font-medium">Dark mode</span>
            </>
          ) : (
            <>
              <Sun size={18} className="text-[#767C8C] dark:text-gray-400" />
              <span className="hidden sm:inline text-sm text-[#767C8C] dark:text-gray-400 font-medium">Light mode</span>
            </>
          )}
        </button>
      </div>

      {/* Right Side - User Profile */}
      <div className="flex items-center gap-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F6F6F6] dark:hover:bg-gray-700 transition-colors cursor-pointer">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            {userInfo?.image ? (
              <img
                src={userInfo.image}
                alt={getUserDisplayName(userInfo)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ${userInfo?.image ? 'hidden' : 'flex'}`}
            >
              <span className="text-white text-sm font-semibold">
                {getUserInitials(userInfo)}
              </span>
            </div>
          </div>
          <span className="text-sm font-semibold text-black dark:text-white">
            {getUserDisplayName(userInfo)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;