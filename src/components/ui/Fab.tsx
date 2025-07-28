import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Type, Image, Music, Video, Link, StickyNote } from 'lucide-react';
import type { FABItem } from '../../types/bento';

interface FabProps {
  isOpen: boolean;
  onToggle: () => void;
  onCreateItem: (item: FABItem) => void;
}

const FAB_ITEMS: FABItem[] = [
  { icon: Type, label: '', type: 'text' },
  { icon: StickyNote, label: '', type: 'sticky' },
  { icon: Image, label: '', type: 'image' },
  { icon: Music, label: '', type: 'audio' },
  { icon: Video, label: '', type: 'video' },
  { icon: Link, label: '', type: 'link' },
];

const Fab: React.FC<FabProps> = ({ isOpen, onToggle, onCreateItem }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* FAB Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {FAB_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.type}
                  onClick={() => onCreateItem(item)}
                  className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.15 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={onToggle}
        className="w-14 h-14 bg-black rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 45 : 0,
          transition: { duration: 0.2 }
        }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default Fab;