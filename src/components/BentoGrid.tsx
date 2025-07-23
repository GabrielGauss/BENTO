import React from 'react';
import BentoCard from "./items/BentoCard";
import type { BentoItem } from "../types/bento";
import { Rnd } from 'react-rnd';
import type { DraggableEvent, DraggableData } from 'react-draggable';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  items: BentoItem[];
  selectedItems: string[];
  onSelectItem: (id: string, shiftKey: boolean) => void;
  onDeleteItem: (id: string) => void;
  onStarItem: (id: string) => void;
  onEditItem: (item: BentoItem) => void;
  setBentoItems: React.Dispatch<React.SetStateAction<BentoItem[]>>;
  onTogglePrivate?: (id: string) => void;
}

const BentoGrid: React.FC<BentoGridProps> = ({ items, selectedItems, onSelectItem, onDeleteItem, onStarItem, onEditItem, setBentoItems, onTogglePrivate }) => {
  // Handler for updating card position/size
  const handleUpdate = (id: string, data: { x?: number; y?: number; width?: number; height?: number; rotation?: number }) => {
    setBentoItems(items => items.map(item =>
      item.id === id ? { ...item, ...data } : item
    ));
  };

  // Track which card is being dragged for z-index and animation
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  return (
    <div
      className="relative w-full h-[90vh] min-h-[600px] bg-white bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] bg-[length:30px_30px] px-4 py-6 overflow-auto"
      style={{ position: 'relative' }}
    >
      {items.map((item) => {
        // Debug: log the item to check for React elements in content
        if (item && typeof item.content === 'object' && item.content !== null) {
          console.warn('BentoGrid: item.content is a React element or object:', item);
        }
        // Provide defaults if missing
        const x = item.x ?? Math.random() * 400 + 40;
        const y = item.y ?? Math.random() * 200 + 40;
        const width = item.width ?? 320;
        const height = item.height ?? 200;
        const rotation = item.rotation ?? ((Math.random() - 0.5) * 4);
        console.log('BentoGrid: About to render item', item);
        console.log('BentoGrid: Rnd props', { width, height, x, y, rotation, item });
        const bentoCardProps = { ...item, rotation, width, height, x, y };
        console.log('BentoGrid: BentoCard props', bentoCardProps);
        let card = null;
        try {
          card = (
            <div style={{ width: '100%', height: '100%' }}>
              <BentoCard
                item={bentoCardProps}
                isSelected={selectedItems.includes(item.id) && draggingId !== item.id}
                onSelect={onSelectItem}
                onDelete={onDeleteItem}
                onStar={onStarItem}
                onEdit={onEditItem}
                rotation={rotation}
                style={{ width: '100%', height: '100%' }}
                onTogglePrivate={onTogglePrivate}
                dragging={draggingId === item.id}
                resizing={resizingId === item.id}
              />
            </div>
          );
        } catch (err) {
          console.error('BentoGrid: Error rendering BentoCard', { item, err });
          card = null;
        }
        if (!card) return null;
        const isDragging = draggingId === item.id;
        const isResizing = resizingId === item.id;
        return (
          <Rnd
            key={item.id}
            size={{ width, height }}
            position={{ x, y }}
            onDragStart={() => setDraggingId(item.id)}
            onDragStop={(_e: DraggableEvent, d: DraggableData) => {
              setDraggingId(null);
              handleUpdate(item.id, { x: d.x, y: d.y });
            }}
            onResizeStart={() => setResizingId(item.id)}
            onResizeStop={(
              _e,
              _dir,
              ref: HTMLElement,
              _delta,
              pos: { x: number; y: number }
            ) => {
              setResizingId(null);
              handleUpdate(item.id, {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: pos.x,
                y: pos.y,
              });
            }}
            style={{
              zIndex: isDragging ? 100 : isResizing ? 90 : selectedItems.includes(item.id) ? 30 : 10,
              pointerEvents: isDragging ? 'auto' : undefined,
              transform: `rotate(${rotation}deg)`
            }}
            bounds="parent"
            enableResizing={true}
            // dragHandleClassName removed for full-card drag
          >
            {card}
          </Rnd>
        );
      })}
    </div>
  );
};

export default BentoGrid;