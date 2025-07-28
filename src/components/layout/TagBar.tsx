import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Send, 
  Sparkles, 
  SlidersHorizontal, 
  Check, 
  Edit3 
} from 'lucide-react';
import TagButton from '../common/TagButton';
import Button from '../ui/Button';

interface TagBarProps {
    tags: string[]; // All available tags
    selectedTag: string | null; // Currently selected tag for filtering
    onSelectTag: (tag: string) => void; // Callback when a tag is selected
    onClearTag: () => void; // Callback to clear tag filter
    onCreateTag?: (tag: string) => void; // Callback to create a new tag
    boardName?: string; // Current board name
    onBoardNameChange?: (newName: string) => void; // Callback when board name changes
    onBoardPreferences?: () => void; // Callback for board preferences
    onBoardShare?: () => void; // Callback for board share
}

const TagBar: React.FC<TagBarProps> = ({
    tags,
    selectedTag,
    onSelectTag,
    onClearTag,
    onCreateTag,
    boardName = "My Workspace",
    onBoardNameChange,
    onBoardPreferences,
    onBoardShare
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [isEditingBoardName, setIsEditingBoardName] = useState(false);
    const [editingBoardName, setEditingBoardName] = useState(boardName);
    
    const tagsPerPage = 6;
    const totalPages = Math.ceil(tags.length / tagsPerPage);
    const startIndex = currentPage * tagsPerPage;
    const endIndex = startIndex + tagsPerPage;
    const currentTags = tags.slice(startIndex, endIndex);

    const handleCreateTag = () => {
        if (newTagName.trim()) {
            onCreateTag?.(newTagName.trim());
            setNewTagName('');
            setShowCreateModal(false);
        }
    };

    const handleBoardNameDoubleClick = () => {
        setIsEditingBoardName(true);
        setEditingBoardName(boardName);
    };

    const handleBoardNameSave = () => {
        if (editingBoardName.trim() && editingBoardName !== boardName) {
            onBoardNameChange?.(editingBoardName.trim());
        }
        setIsEditingBoardName(false);
    };

    const handleBoardNameCancel = () => {
        setEditingBoardName(boardName);
        setIsEditingBoardName(false);
    };

    return (
        <div className="w-full bg-white border-b border-gray-200">
            {/* Tag Bar Content - Fixed at bottom of header */}
            <div className="px-4 py-2">
                <div className="flex items-center justify-between">
                    {/* Left: Create Tag Button */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={() => setShowCreateModal(true)}
                            className="text-sm px-3 py-1 h-7 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Plus className="w-3 h-3 mr-1 inline" />
                            Create Tag
                        </motion.button>
                        {/* #All filter button */}
                        <motion.button
                            onClick={onClearTag}
                            className={`text-sm px-3 py-1 h-7 rounded-full border transition-all duration-150 font-medium ${
                                !selectedTag
                                    ? 'bg-black text-white border-black shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                        >
                            #All
                        </motion.button>
                    </div>

                    {/* Center: Tag carousel */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-1 max-w-2xl overflow-hidden">
                            {/* Tags */}
                            <div className="flex items-center gap-1">
                                {currentTags.map((tag) => (
                                    <TagButton
                                        key={tag}
                                        tag={tag}
                                        isSelected={selectedTag === tag}
                                        onClick={() => onSelectTag(tag)}
                                        existingTags={tags}
                                    />
                                ))}
                            </div>

                            {/* Show More button instead of slider */}
                            {totalPages > 1 && (
                                <button
                                    onClick={() => setCurrentPage(prev => (prev + 1) % totalPages)}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    Show More
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Empty space for balance */}
                    <div className="w-24"></div>
                </div>
            </div>

            {/* Board Name Section - Below TagBar */}
            <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Board Name with Double-Click Edit */}
                        <div className="flex items-center gap-2">
                            {isEditingBoardName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editingBoardName}
                                        onChange={(e) => setEditingBoardName(e.target.value)}
                                        className="text-lg font-semibold text-gray-900 bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-600"
                                        autoFocus
                                        onKeyPress={(e) => e.key === 'Enter' && handleBoardNameSave()}
                                        onKeyDown={(e) => e.key === 'Escape' && handleBoardNameCancel()}
                                    />
                                    <button
                                        onClick={handleBoardNameSave}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleBoardNameCancel}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h2 
                                        className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
                                        onDoubleClick={handleBoardNameDoubleClick}
                                        title="Double-click to edit"
                                    >
                                        {boardName}
                                    </h2>
                                    <Edit3 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Board Action Icons */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Share board"
                            onClick={onBoardShare}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Board preferences"
                            onClick={onBoardPreferences}
                        >
                            <Sparkles className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Board settings"
                            onClick={onBoardPreferences}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Inline Tag Creation Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-xl p-6 w-80 max-w-[90vw]"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Create New Tag</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Enter tag name..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateTag}
                                    disabled={!newTagName.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TagBar;