// src/hooks/useDragAndDrop.ts
import { useRef, useState } from 'react';

export const PLACEHOLDER_ID = 'ghost-placeholder';

function useDragAndDrop<T extends { id: string }>(items: T[], setItems: React.Dispatch<React.SetStateAction<T[]>>) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const dragItemNode = useRef<HTMLDivElement | null>(null);
  const dragOverItemNode = useRef<HTMLDivElement | null>(null);
  const originalItemRef = useRef<T | null>(null);
  const originalIndexRef = useRef<number | null>(null);
  const lastPlaceholderIndex = useRef<number | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    dragItemNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    e.currentTarget.classList.add('opacity-50', 'scale-95', 'cursor-grabbing');
    setItems((prevItems: T[]) => {
      const newItems = prevItems.filter(item => item.id !== PLACEHOLDER_ID);
      const idx = newItems.findIndex(item => item.id === id);
      if (idx === -1) return newItems;
      originalItemRef.current = newItems[idx];
      originalIndexRef.current = idx;
      lastPlaceholderIndex.current = idx;
      newItems.splice(idx, 1, { id: PLACEHOLDER_ID, type: 'placeholder' } as unknown as T);
      return newItems;
    });
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    if (!draggedItemId || !dragItemNode.current || dragItemNode.current === e.currentTarget) {
      return;
    }
    dragOverItemNode.current = e.currentTarget;
    setItems((prevItems: T[]) => {
      const newItems = prevItems.filter(item => item.id !== PLACEHOLDER_ID);
      const targetIdx = newItems.findIndex(item => item.id === targetId);
      if (targetIdx === -1) return prevItems;
      lastPlaceholderIndex.current = targetIdx;
      newItems.splice(targetIdx, 0, { id: PLACEHOLDER_ID, type: 'placeholder' } as unknown as T);
      return newItems;
    });
  };

  const onDragEnd = () => {
    if (dragItemNode.current) {
      dragItemNode.current.classList.remove('opacity-50', 'scale-95', 'cursor-grabbing');
    }
    setItems((prevItems: T[]) => {
      const placeholderIdx = prevItems.findIndex(item => item.id === PLACEHOLDER_ID);
      let newItems = prevItems.filter(item => item.id !== PLACEHOLDER_ID);
      const originalItem = originalItemRef.current;
      const originalIndex = originalIndexRef.current;
      if (originalItem) {
        // Remove any existing instance of the original item by id
        newItems = newItems.filter(item => item.id !== originalItem.id);
        if (placeholderIdx !== -1) {
          newItems.splice(placeholderIdx, 0, originalItem);
        } else if (originalIndex !== null && originalIndex >= 0 && originalIndex <= newItems.length) {
          newItems.splice(originalIndex, 0, originalItem);
        } else {
          newItems.push(originalItem);
        }
        // Final check: if the original item is still missing, append it
        if (!newItems.some(item => item.id === originalItem.id)) {
          newItems.push(originalItem);
        }
      }
      return newItems;
    });
    setDraggedItemId(null);
    originalItemRef.current = null;
    originalIndexRef.current = null;
    lastPlaceholderIndex.current = null;
    dragItemNode.current = null;
    dragOverItemNode.current = null;
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return {
    draggedItemId,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragEnd,
    dragItemNode,
    dragOverItemNode,
  };
}

export default useDragAndDrop;