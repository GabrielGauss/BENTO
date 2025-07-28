import { motion } from "framer-motion";
import { Folder, Download, Trash2, XCircle } from "lucide-react";
import Button from "./Button";

interface MultiSelectToolbarProps {
    selectedCount: number;
    onDeselect: () => void;
    onExport: () => void;
    onMove: () => void;
    onDeleteSelected: () => void;
}

const MultiSelectToolbar: React.FC<MultiSelectToolbarProps> = ({ selectedCount, onDeselect, onExport, onMove, onDeleteSelected }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-28 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-3 py-1.5 z-[9995] flex gap-2 items-center border"
    >
      <span className="text-sm font-medium px-2">{selectedCount} selected</span>
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:bg-blue-50 h-7 px-2"
        onClick={onMove}
      >
        <Folder className="w-4 h-4 mr-1" /> Move
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-green-600 hover:bg-green-50 h-7 px-2"
        onClick={onExport}
      >
        <Download className="w-4 h-4 mr-1" /> Export
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:bg-red-50 h-7 px-2"
        onClick={onDeleteSelected}
      >
        <Trash2 className="w-4 h-4 mr-1" /> Delete
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-500 hover:bg-gray-100 h-7 w-7 ml-1"
        onClick={onDeselect}
      >
        <XCircle className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default MultiSelectToolbar;