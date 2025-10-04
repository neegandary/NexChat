import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  MessageCircle,
  Settings,
  FolderOpen,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User
} from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useAppStore } from "@/store";
import { motion, AnimatePresence } from "motion/react";

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const { handleLogout } = useLogout();

  const menuItems = [
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      path: '/chat',
      active: location.pathname === '/chat'
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: Users,
      path: '/accounts',
      active: location.pathname === '/accounts'
    }
  ];

  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
        type: "tween"
      }
    },
    collapsed: {
      width: 64,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
        type: "tween"
      }
    }
  };

  const textVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.2,
        ease: "easeOut"
      }
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="bg-white dark:bg-gray-800 border-r border-[#EBEDF0] dark:border-gray-700 flex flex-col h-screen overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#EBEDF0] dark:border-gray-700">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.h1
                key="nexchat"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-xl font-bold text-black dark:text-white"
              >
                NexChat
              </motion.h1>
            ) : (
              <motion.h1
                key="n"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-xl font-bold text-black dark:text-white"
              >
                N
              </motion.h1>
            )}
          </AnimatePresence>

          <motion.button
            onClick={onToggle}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-8 h-8 flex items-center justify-center text-[#767C8C] dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg flex-shrink-0"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={item.id} className="relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className={`mx-3 flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group relative ${item.active
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-[#767C8C] dark:text-gray-400 hover:bg-[#EBEDF0] dark:hover:bg-gray-700 hover:text-black dark:hover:text-white'
                    }`}
                >
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                  </motion.div>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="whitespace-nowrap"
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.hasDropdown && (
                          <ChevronDown size={16} className="ml-auto inline-block" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* Tooltip for collapsed state */}
              <AnimatePresence>
                {isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-16 top-1/2 -translate-y-1/2 bg-black dark:bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 pointer-events-none z-10"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#EBEDF0] dark:border-gray-700">
        <div className={`flex items-center gap-3 px-3 py-3 ${isCollapsed ? 'justify-center' : ''}`}>

        </div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`flex items-center gap-3 w-full px-3 py-3 text-[#767C8C] dark:text-gray-400 hover:bg-[#EBEDF0] dark:hover:bg-gray-700 hover:text-black dark:hover:text-white rounded-lg group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <LogOut size={20} className="flex-shrink-0" />
          </motion.div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;