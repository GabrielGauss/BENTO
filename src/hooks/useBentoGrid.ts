import useMultiSelect from './useMultiSelect';
import useDragAndDrop from './useDragAndDrop';
import type { BentoItem } from '../types/bento';

function useBentoGrid(bentoItems: BentoItem[], setBentoItems: React.Dispatch<React.SetStateAction<BentoItem[]>>) {
  // Multi-select logic
  const { selectedItems, handleSelectItem, clearSelection } = useMultiSelect(bentoItems);

  // Drag-and-drop logic
  const {
    draggedItemId,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragEnd,
    dragItemNode,
    dragOverItemNode,
  } = useDragAndDrop<BentoItem>(bentoItems, setBentoItems);

  // Optionally, you can add more grid-specific logic here

  return {
    selectedItems,
    handleSelectItem,
    clearSelection,
    draggedItemId,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragEnd,
    dragItemNode,
    dragOverItemNode,
    setBentoItems,
  };
}

export default useBentoGrid; 