import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Star, 
  Clock, 
  Folder, 
  Trash2, 
  Plus
} from 'lucide-react';
import Button from '../ui/Button';

interface SidebarProps {
  isCollapsed: boolean;
  onNavigateToFavorites?: () => void;
  onNavigateToTrash?: () => void;
  onNavigateToMain?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onNavigateToFavorites, 
  onNavigateToTrash, 
  onNavigateToMain 
}) => {
  const menuItems = [
    { icon: Home, label: 'Home', count: 0, action: onNavigateToMain || (() => console.log('Navigate to Home')) },
    { icon: Search, label: 'Search', count: 0, action: () => console.log('Open Search') },
    { icon: Star, label: 'Favorites', count: 3, action: onNavigateToFavorites || (() => console.log('Show Favorites')) },
    { icon: Clock, label: 'Recent', count: 0, action: () => console.log('Show Recent') },
    { icon: Folder, label: 'Collections', count: 2, action: () => console.log('Show Collections') },
    { icon: Trash2, label: 'Trash', count: 0, action: onNavigateToTrash || (() => console.log('Show Trash')) },
  ];

  return (
    <motion.div
      className={`bg-white border-r border-gray-200 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out`}
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          {/* Empty header - no redundant text */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                item.label === 'Home' 
                  ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 text-left"
                >
                  {item.label}
                </motion.span>
              )}
              {!isCollapsed && item.count > 0 && (
                <motion.span
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {item.count}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          onClick={() => console.log('Create new board')}
        >
          {!isCollapsed && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Plus className="w-4 h-4" />
              <span>New Board</span>
            </motion.div>
          )}
          {isCollapsed && <Plus className="w-4 h-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;