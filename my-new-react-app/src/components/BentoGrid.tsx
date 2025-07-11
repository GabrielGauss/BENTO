import React, { useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/items/BentoCard"; // Assuming BentoCard is here now
import { cn } from "@/utils/cn"; // Corrected import for cn
import { BentoItem } from "@/types"; // Import BentoItem interface from types

interface BentoGridProps {
 items: BentoItem[]; // Corrected type
 selectedItems: string[];
 onSelectItem: (id: string, shiftKey: boolean) => void;
 onDeleteItem: (id: string) => void;
 onStarItem: (id: string) => void;
 onShareItem: (id: string) => void;
 draggedItemId: string | null;
 setDraggedItemId: React.Dispatch<React.SetStateAction<string | null>>;
 dragItemNode: React.RefObject<HTMLDivElement>;
 dragOverItemNode: React.MutableRefObject<HTMLDivElement | null>;
 setBentoItems: React.Dispatch<React.SetStateAction<BentoItem[]>>;
}

const BentoGrid: React.FC<BentoGridProps> = ({ items, selectedItems, onSelectItem, onDeleteItem, onStarItem, onShareItem, draggedItemId, setDraggedItemId, dragItemNode, dragOverItemNode, setBentoItems }) => {
 // Removed state and refs related to drag and drop, they are now passed as props

    // --- Drag and Drop Handlers ---

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
 // console.log('Drag Start:', id);
 setDraggedItemId(id);
 dragItemNode.current = e.currentTarget; // Store the node being dragged
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id); // Set data for transfer
        // Add dragging style class immediately
        e.currentTarget.classList.add('opacity-50', 'scale-95', 'cursor-grabbing');
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
 // console.log('Drag Enter:', targetId);
 if (!draggedItemId || !dragItemNode.current || dragItemNode.current === e.currentTarget) {
 return; // Don't process if not dragging or entering the same item
        }
 // console.log(`Dragging ${draggedItemId} over ${targetId}`);
 dragOverItemNode.current = e.currentTarget; // Store the node being dragged over

 // Only reorder if the dragged item is different from the target item
 if (draggedItemId !== targetId) {
            setBentoItems(prevItems => {
 // Find indices in the *current* state array
 const draggedIndex = prevItems.findIndex(item => item.id === draggedItemId);
 const targetIndex = prevItems.findIndex(item => item.id === targetId);

 // Ensure both items are found
 if (draggedIndex === -1 || targetIndex === -1) {
 console.warn("Dragged or target item not found in state array");
 return prevItems; // Should not happen if state is consistent
                }

 // Create a new array and perform the swap
 const newItems = [...prevItems];
 const [draggedItem] = newItems.splice(draggedIndex, 1); // Remove dragged item
 newItems.splice(targetIndex, 0, draggedItem); // Insert dragged item at target index

 return newItems;
            });
        }
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
 // console.log('Drag End');
 // Remove dragging styles from the original item
 if (dragItemNode.current) {
            dragItemNode.current.classList.remove('opacity-50', 'scale-95', 'cursor-grabbing');
        }
 // Clear refs and state
 setDraggedItemId(null);
 dragItemNode.current = null;
 dragOverItemNode.current = null;
    };

 // Add onDragOver to the grid container to allow dropping
 const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
 e.preventDefault(); // Necessary to allow dropping
 e.dataTransfer.dropEffect = 'move'; // Indicate it's a move operation
    }

  return (
    <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4 md:p-6"
            onDragOver={handleDragOver} // Add DragOver handler to the container
 >
 {/* AnimatePresence for add/delete animations */}
 <AnimatePresence>
 {items.map((item) => (
 <div
 key={item.id}
 draggable // Make the outer div draggable
 onDragStart={(e) => handleDragStart(e, item.id)}
 onDragEnter={(e) => handleDragEnter(e, item.id)}
 onDragEnd={handleDragEnd}
 // No onDragOver needed on individual items when container handles it
 className={cn(
 "transition-opacity duration-300",
 // Apply dragging styles dynamically based on state
 draggedItemId === item.id ? 'opacity-50 scale-95 cursor-grabbing' : 'cursor-grab'
 )}
 >
 <BentoCard
 item={item}
 isSelected={selectedItems.includes(item.id)}
 onSelect={onSelectItem}
 isHovered={false} // Hover state managed internally
 onDelete={onDeleteItem}
 onStar={onStarItem}
 onShare={onShareItem}
 />
 </div>
 ))}
 </AnimatePresence>
 </div>
  );
}

export default BentoGrid;