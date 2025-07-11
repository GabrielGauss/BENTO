import { useState, useCallback } from 'react';
import { BentoItem } from '@/components/BentoGrid'; // Assuming BentoItem is defined here or in a shared types file

// This hook will be used for managing the logic for selecting multiple bento items.
const useMultiSelect = (items: BentoItem[]) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = useCallback((id: string, shiftKey: boolean) => {
    setSelectedItems(prevSelected => {
      const lastSelected = prevSelected[prevSelected.length - 1];
      const currentIndex = items.findIndex(item => item.id === id);
      if (currentIndex === -1) return prevSelected; // Item not in the current items list

      if (shiftKey && lastSelected && prevSelected.length > 0) {
        const lastIndex = items.findIndex(item => item.id === lastSelected);
        if (lastIndex === -1) { // Last selected not in current view, treat as single select
           return prevSelected.includes(id) ? prevSelected.filter(i => i !== id) : [...prevSelected, id];
        }

        const start = Math.min(currentIndex, lastIndex);
        const end = Math.max(currentIndex, lastIndex);
        const rangeIds = items.slice(start, end + 1).map(item => item.id);
        // Combine previous selection with the new range, removing duplicates
        return [...new Set([...prevSelected, ...rangeIds])];
      } else {
        // Toggle single item selection
        return prevSelected.includes(id)
            ? prevSelected.filter(i => i !== id)
            : [...prevSelected, id];
      }
    });
  }, [items]); // Depend on items so the hook updates when items change (filtering/reordering)

  const clearSelection = useCallback(() => setSelectedItems([]), []);

  return {
    selectedItems,
    handleSelectItem,
    clearSelection,
  };
};

export default useMultiSelect;