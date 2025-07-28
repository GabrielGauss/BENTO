import React from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import BentoCard from './items/BentoCard';
import type { BentoItem } from '../types/bento';

interface BentoGridProps {
  items: BentoItem[];
  onEditItem?: (item: BentoItem) => void;
  onDeleteItem?: (item: BentoItem) => void;
  onToggleStar?: (item: BentoItem) => void;
  onTogglePrivate?: (item: BentoItem) => void;
  isTrashView?: boolean;
  selectedItems?: string[];
  onSelectItem?: (itemId: string) => void;
}

const BentoGrid: React.FC<BentoGridProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onToggleStar,
  onTogglePrivate,
  isTrashView = false,
  selectedItems = [],
  onSelectItem,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'bento-grid',
  });

  const getGridSpan = (scale: number) => {
    if (scale <= 1) return 1;
    if (scale <= 1.5) return 2;
    if (scale <= 2) return 3;
    return 4;
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-6 transition-all duration-200 ${
        isOver ? 'bg-blue-50 rounded-lg' : ''
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-min">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="w-full"
            style={{
              gridColumn: `span ${getGridSpan(item.scale || 1)}`,
              gridRow: `span ${getGridSpan(item.scale || 1)}`,
            }}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            <BentoCard
              item={item}
              onEdit={() => onEditItem?.(item)}
              onDelete={() => onDeleteItem?.(item)}
              onToggleStar={() => onToggleStar?.(item)}
              onTogglePrivate={() => onTogglePrivate?.(item)}
              scale={item.scale || 1}
              isTrashItem={isTrashView}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => onSelectItem?.(item.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;