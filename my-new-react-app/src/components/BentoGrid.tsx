import React from 'react';
import { AnimatePresence, motion } from "framer-motion";
import BentoCard from "./items/BentoCard";
import { cn } from "../utils/cn";
import type { BentoItem } from "../types/bento";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { useMemo } from 'react';

interface BentoGridProps {
  items: BentoItem[];
  selectedItems: string[];
  onSelectItem: (id: string, shiftKey: boolean) => void;
  onDeleteItem: (id: string) => void;
  onStarItem: (id: string) => void;
  onEditItem: (item: BentoItem) => void;
  setBentoItems: React.Dispatch<React.SetStateAction<BentoItem[]>>;
  onToggleShowTags?: (id: string) => void;
  onTogglePrivate?: (id: string) => void;
}

function SortableBentoCard({ item, selectedItems, onSelectItem, onDeleteItem, onStarItem, onEditItem, onToggleShowTags, onTogglePrivate }: {
  item: BentoItem;
  selectedItems: string[];
  onSelectItem: (id: string, shiftKey: boolean) => void;
  onDeleteItem: (id: string) => void;
  onStarItem: (id: string) => void;
  onEditItem: (item: BentoItem) => void;
  onToggleShowTags?: (id: string) => void;
  onTogglePrivate?: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  // Analog scrapbook feel: random rotation/offset only when not dragging
  const rotation = useMemo(() => (Math.random() - 0.5) * 4, [item.id]);
  const offsetX = useMemo(() => (Math.random() - 0.5) * 8, [item.id]);
  const offsetY = useMemo(() => (Math.random() - 0.5) * 8, [item.id]);
  const style = isDragging
    ? {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }
    : {
        transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`,
        transition,
      };
  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      className={cn(
        'transition-opacity duration-300',
        isDragging ? 'z-30 shadow-2xl ring-2 ring-blue-400 cursor-grabbing' : 'cursor-grab'
      )}
      {...attributes}
      {...listeners}
    >
      <BentoCard
        item={item}
        isSelected={selectedItems.includes(item.id)}
        onSelect={onSelectItem}
        onDelete={onDeleteItem}
        onStar={onStarItem}
        onEdit={onEditItem}
        rotation={rotation}
        onToggleShowTags={onToggleShowTags}
        onTogglePrivate={onTogglePrivate}
      />
    </motion.div>
  );
}

const BentoGrid: React.FC<BentoGridProps> = ({ items, selectedItems, onSelectItem, onDeleteItem, onStarItem, onEditItem, onShareItem, setBentoItems }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleToggleTagVisible(id: string) {
    setBentoItems(items => items.map(item =>
      item.id === id ? { ...item, tagVisible: item.tagVisible === false ? true : false } : item
    ));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setBentoItems(arrayMove(items, oldIndex, newIndex));
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setBentoItems(arrayMove(items, oldIndex, newIndex));
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2 gap-y-1 auto-rows-min items-start w-full h-full min-h-screen overflow-visible bg-white bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] bg-[length:30px_30px] px-4 py-6"
        >
          <AnimatePresence>
            {items.map((item) => (
              <SortableBentoCard
                key={item.id}
                item={item}
                selectedItems={selectedItems}
                onSelectItem={onSelectItem}
                onDeleteItem={onDeleteItem}
                onStarItem={onStarItem}
                onEditItem={onEditItem}
                onToggleShowTags={handleToggleTagVisible}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </SortableContext>
    </DndContext>
  );
};

export default BentoGrid;