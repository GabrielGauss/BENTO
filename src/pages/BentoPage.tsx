import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { BentoItem } from '../types/bento';

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import TagBar from "../components/layout/TagBar";
import BentoGrid from "../components/BentoGrid";
import Fab from "../components/ui/Fab";
import Button from "../components/ui/Button";

import useSidebarState from "../hooks/useSidebarState";
import useFabMenuState from "../hooks/useFabMenuState";
import CreateEditBentoModal from "../components/modals/CreateBentoModal";


// Import FABItem type
import type { FABItem } from '../types/bento';
import { X } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';

// ===============================
// BENTO PAGE COMPONENT
// ===============================

const BentoPage: React.FC = () => {
    // ===============================
    // STATE MANAGEMENT
    // ===============================
    
    // Board management
    const [boards, setBoards] = useState<{ id: string; name: string; items: BentoItem[] }[]>([
      {
        id: 'board-1',
        name: 'My Workspace',
        items: [
          {
            id: 'item-1',
            title: 'Welcome to BENTO',
            content: 'This is your first BENTO workspace. Start creating and organizing your content!',
            type: 'text',
            starred: true,
            color: '#fffbe6',
            scale: 1.2,
            tags: ['welcome', 'getting-started'],
          },
          {
            id: 'item-2',
            title: 'Example Image',
            content: 'A beautiful landscape',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d134df?auto=format&fit=crop&w=400&q=80',
            type: 'image',
            starred: false,
            color: '#ffe6f7',
            scale: 1.5,
            tags: ['example', 'image'],
          },
          {
            id: 'item-3',
            title: 'Quick Notes',
            content: 'Use this space for quick thoughts, ideas, and reminders.',
            type: 'sticky',
            starred: false,
            color: '#e6f7ff',
            scale: 1.0,
            tags: ['notes', 'ideas'],
          }
        ]
      }
    ]);
    const [currentBoardId, setCurrentBoardId] = useState('board-1');

    // Page state
    const [currentPage, setCurrentPage] = useState<'main' | 'favorites' | 'trash'>('main');
    const [deletedItems, setDeletedItems] = useState<BentoItem[]>([]);
    const [selectedTrashItems, setSelectedTrashItems] = useState<string[]>([]);

    // Get current board items
    const currentBoard = boards.find(board => board.id === currentBoardId);
    const items = currentBoard?.items || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [boardName, setBoardName] = useState("My Workspace");
    const [showBoardPreferences, setShowBoardPreferences] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    
      // Sidebar state
    const { sidebarOpen, isSidebarCollapsed, toggleSidebarCollapse } = useSidebarState();
    const { fabOpen, toggleFabMenu } = useFabMenuState();

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingItem, setEditingItem] = useState<BentoItem | null>(null);
    
    // FAB create logic for internal items
    const handleCreateBento = (item: FABItem) => {
      console.log('Creating item from FAB:', item);
      setEditingItem(null);
      setShowCreateModal(true);
      if (fabOpen) toggleFabMenu();
    };

    // Update items for current board
    const updateCurrentBoardItems = (newItems: BentoItem[]) => {
      setBoards(prev => prev.map(board => 
        board.id === currentBoardId 
          ? { ...board, items: newItems }
          : board
      ));
    };

    // Header create logic for new boards
    const handleCreateNewBoard = () => {
      console.log('Creating new BENTO board...');
      const newBoardId = `board-${Date.now()}`;
      
      // Create a completely new BENTO workspace with demo content
      const newWorkspaceItems: BentoItem[] = [
        {
          id: `item-${Date.now()}-1`,
          content: "Welcome to your new BENTO workspace! This is a completely separate board where you can organize your thoughts, ideas, and content.",
          title: "Welcome to New Workspace",
          type: 'text',
          starred: true,
          color: '#fffbe6',
          scale: 1.2,
          tags: ['welcome', 'new-workspace'],
        },
        {
          id: `item-${Date.now()}-2`,
          content: undefined,
          title: "Add Your First Image",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d134df?auto=format&fit=crop&w=400&q=80",
          type: 'image',
          starred: false,
          color: '#ffe6f7',
          scale: 1.5,
          tags: ['example', 'image'],
        },
        {
          id: `item-${Date.now()}-3`,
          content: "Start adding your own content here. You can create notes, add images, links, and more! This is your new workspace.",
          title: "Getting Started",
          type: 'text',
          starred: false,
          color: '#e6f7ff',
          scale: 1.0,
          tags: ['guide', 'help'],
        }
      ];
      
      // Create new board (completely separate from current)
      const newBoard = {
        id: newBoardId,
        name: `My Workspace ${boards.length + 1}`,
        items: newWorkspaceItems
      };
      
      // Add new board to boards array
      setBoards(prev => [...prev, newBoard]);
      
      // Switch to the new board
      setCurrentBoardId(newBoardId);
      setSearchTerm('');
      setSelectedTag(null);
      setBoardName(newBoard.name);
      setCurrentPage('main');
      
      // Show success message
      alert(`New BENTO Workspace created! You now have ${boards.length + 1} separate boards.`);
    };

    const handleSaveBento = (item: Partial<BentoItem>, editingId?: string) => {
        console.log('Save bento:', item, editingId);
        
        if (editingId) {
            // Update existing item
            const updatedItems = items.map(i => i.id === editingId ? { ...i, ...item } : i);
            updateCurrentBoardItems(updatedItems);
        } else {
            // Create new item
            const newItem: BentoItem = {
                id: `item-${Date.now()}`,
                title: item.title || 'Untitled',
                content: item.content || '',
                type: item.type || 'text',
                url: item.url || '',
                color: item.color || '#ffffff',
                tags: item.tags || [],
                starred: false,
                private: false,
                scale: item.scale || 1,
            };
            updateCurrentBoardItems([newItem, ...items]);
        }
        
        setShowCreateModal(false);
        setEditingItem(null);
    };

    const handleEditItem = (item: BentoItem) => {
        console.log('Edit item:', item);
        setEditingItem(item);
        setShowCreateModal(true);
    };

    const handleDeleteItem = (item: BentoItem) => {
        console.log('Deleting item:', item.id);
        // Move to trash instead of permanent delete
        setDeletedItems(prev => [...prev, item]);
        const updatedItems = items.filter(i => i.id !== item.id);
        updateCurrentBoardItems(updatedItems);
    };

    const handleToggleStar = (item: BentoItem) => {
        console.log('Toggling star for item:', item.id);
        const updatedItems = items.map(i => 
            i.id === item.id ? { ...i, starred: !i.starred } : i
        );
        updateCurrentBoardItems(updatedItems);
    };

    const handleTogglePrivate = (item: BentoItem) => {
        console.log('Toggling private for item:', item.id);
        const updatedItems = items.map(i => 
            i.id === item.id ? { ...i, private: !i.private } : i
        );
        updateCurrentBoardItems(updatedItems);
    };



    // Navigation functions
    const handleNavigateToFavorites = () => {
      setCurrentPage('favorites');
      console.log('Navigate to Favorites');
    };

    const handleNavigateToTrash = () => {
      setCurrentPage('trash');
      console.log('Navigate to Trash');
    };

    const handleNavigateToMain = () => {
      setCurrentPage('main');
      console.log('Navigate to Main');
    };

    const handleClearTag = () => {
      setSelectedTag(null);
    };

    const handleSelectTag = (tag: string) => {
      setSelectedTag(tag === selectedTag ? null : tag);
    };

    const handleCreateTag = (tag: string) => {
        console.log('Creating tag:', tag);
        // Add the new tag to the list
        if (!allTags.includes(tag)) {
          setAllTags(prev => [...prev, tag]);
        }
    };

    const handleBoardNameChange = (newName: string) => {
        console.log('Board name changed to:', newName);
        setBoardName(newName);
    };

    const handleBoardPreferences = () => {
        console.log('Opening board preferences');
        setShowBoardPreferences(true);
    };

    const handleBoardShare = () => {
        console.log('Opening share modal');
        setShowShareModal(true);
    };

    // Initialize demo items
    React.useEffect(() => {
        const demoItems: BentoItem[] = [
            {
                id: '1',
                content: "This is a quick note. Welcome to your Bento Desk!",
                title: "Quick Note",
                type: 'text',
                starred: false,
                color: '#fffbe6',
                scale: 1.2,
                tags: ['personal', 'note', 'welcome', 'important', 'todo'],
            },
            {
                id: '2',
                content: undefined,
                title: "Polaroid Sunset",
                url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                type: 'image',
                starred: false,
                color: '#ffe6f7',
                scale: 1.7,
                tags: ['nature', 'cozy', 'professional', 'inspiration', 'art'],
                private: true,
            },
            {
                id: '3',
                content: undefined,
                title: "Chill Audio Track",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                type: 'audio',
                starred: false,
                color: '#f3e6ff',
                scale: 1.2,
                tags: ['music', 'chill', 'creative', 'relaxation', 'focus'],
            },
            {
                id: '4',
                content: undefined,
                title: "YouTube: Rick Astley",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                type: 'youtube',
                starred: false,
                color: '#e6f7ff',
                scale: 1.7,
                tags: ['video', 'fun', 'classic', 'entertainment', 'nostalgia'],
            },
            {
                id: '5',
                content: undefined,
                title: "Cognitive Freedom",
                url: "https://kiwix.org/es/",
                type: 'link',
                starred: false,
                color: '#e6ffe6',
                scale: 1.2,
                tags: ['work', 'research', 'professional', 'learning', 'knowledge'],
            },
        ];
        updateCurrentBoardItems(demoItems);
        
        // Extract all unique tags
        const tags = demoItems.flatMap(item => item.tags || []).filter((tag, index, arr) => arr.indexOf(tag) === index);
        setAllTags(tags);
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        console.log('Drag end:', event);
        const { active, over } = event;
        
        if (active && over && active.id !== over.id) {
            const activeId = active.id as string;
            const overId = over.id as string;
            
            // Handle card reordering
            if (activeId.startsWith('item-') && overId.startsWith('item-')) {
                const activeIndex = items.findIndex(item => item.id === activeId);
                const overIndex = items.findIndex(item => item.id === overId);
                
                if (activeIndex !== -1 && overIndex !== -1) {
                    const newItems = [...items];
                    const [movedItem] = newItems.splice(activeIndex, 1);
                    newItems.splice(overIndex, 0, movedItem);
                    updateCurrentBoardItems(newItems);
                }
            }
            
            // Handle tag reordering
            if (activeId.startsWith('tag-') && overId === 'tag-drop-zone') {
                // TODO: Implement tag reordering
                console.log('Tag reordering not implemented yet');
            }
        }
    };

    // Filter items based on current page
    const getDisplayItems = () => {
      switch (currentPage) {
        case 'favorites':
          return items.filter(item => item.starred);
        case 'trash':
          return deletedItems;
        default:
          return items;
      }
    };

    const displayItems = getDisplayItems();

    // Trash management functions
    const handleSelectTrashItem = (itemId: string) => {
      setSelectedTrashItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    };

    const handleRestoreItems = () => {
      const itemsToRestore = deletedItems.filter(item => selectedTrashItems.includes(item.id));
      const remainingTrash = deletedItems.filter(item => !selectedTrashItems.includes(item.id));
      
      // Add restored items back to current board
      updateCurrentBoardItems([...items, ...itemsToRestore]);
      setDeletedItems(remainingTrash);
      setSelectedTrashItems([]);
    };

    const handlePermanentlyDeleteItems = () => {
      const remainingTrash = deletedItems.filter(item => !selectedTrashItems.includes(item.id));
      setDeletedItems(remainingTrash);
      setSelectedTrashItems([]);
    };

    // Board switcher component
    const BoardSwitcher = () => (
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-gray-700">Current Board:</span>
        <select 
          value={currentBoardId}
          onChange={(e) => {
            setCurrentBoardId(e.target.value);
            setCurrentPage('main');
          }}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          {boards.map(board => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </div>
    );

    // Trash actions component
    const TrashActions = () => (
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={handleRestoreItems}
          disabled={selectedTrashItems.length === 0}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          Restore Selected ({selectedTrashItems.length})
        </Button>
        <Button
          onClick={handlePermanentlyDeleteItems}
          disabled={selectedTrashItems.length === 0}
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700"
        >
          Delete Permanently
        </Button>
      </div>
    );

    // ===============================
    // RENDER
    // ===============================

    return (
        <div className="flex h-screen bg-[#fcf9f6] overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebarCollapse}
                    />
                )}
            </AnimatePresence>
            
            {/* Main Layout */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header - Always on top */}
                        <Header
            toggleMobileSidebar={toggleSidebarCollapse}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onCreateBento={handleCreateNewBoard}
        />
                
                {/* Content Area with Sidebar */}
                <div className="flex-1 flex min-h-0">
                    {/* Sidebar */}
                    <Sidebar
                      isCollapsed={isSidebarCollapsed}
                      onNavigateToFavorites={handleNavigateToFavorites}
                      onNavigateToTrash={handleNavigateToTrash}
                      onNavigateToMain={handleNavigateToMain}
                    />
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-h-0">
                      {/* TagBar */}
                      <TagBar
                        tags={allTags}
                        selectedTag={selectedTag}
                        onSelectTag={handleSelectTag}
                        onClearTag={handleClearTag}
                        onCreateTag={handleCreateTag}
                        boardName={boardName}
                        onBoardNameChange={handleBoardNameChange}
                        onBoardPreferences={handleBoardPreferences}
                        onBoardShare={handleBoardShare}
                      />
                      
                      {/* Board Switcher */}
                      {currentPage === 'main' && <BoardSwitcher />}
                      
                      {/* Trash Actions */}
                      {currentPage === 'trash' && <TrashActions />}
                      
                      {/* Content Grid */}
                      <div className="flex-1 overflow-auto">
                        {!showCreateModal && (
                          <>
                            <DndContext onDragEnd={handleDragEnd}>
                              <BentoGrid
                                items={displayItems}
                                onEditItem={handleEditItem}
                                onDeleteItem={handleDeleteItem}
                                onToggleStar={handleToggleStar}
                                onTogglePrivate={handleTogglePrivate}
                                isTrashView={currentPage === 'trash'}
                                selectedItems={selectedTrashItems}
                                onSelectItem={handleSelectTrashItem}
                              />
                            </DndContext>
                            
                            {/* FAB */}
                            <Fab
                              isOpen={fabOpen}
                              onToggle={toggleFabMenu}
                              onCreateItem={handleCreateBento}
                            />
                          </>
                        )}
                      </div>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {showCreateModal && (
                    <CreateEditBentoModal
                        isOpen={showCreateModal}
                        onCancel={() => {
                            setShowCreateModal(false);
                            setEditingItem(null);
                        }}
                        onSave={handleSaveBento}
                        editingItem={editingItem}
                    />
                )}
            </AnimatePresence>

            {/* Board Preferences Modal */}
            <AnimatePresence>
                {showBoardPreferences && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl p-8 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                        <SlidersHorizontal className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Board Preferences</h3>
                                        <p className="text-sm text-gray-500">Customize your workspace</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBoardPreferences(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            {/* Content */}
                            <div className="space-y-6">
                                {/* Board Settings */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Board Settings
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Auto-save</span>
                                                <p className="text-xs text-gray-500">Automatically save changes</p>
                                            </div>
                                            <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                                                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Show grid lines</span>
                                                <p className="text-xs text-gray-500">Display grid for alignment</p>
                                            </div>
                                            <button className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors">
                                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Compact mode</span>
                                                <p className="text-xs text-gray-500">Reduce spacing between items</p>
                                            </div>
                                            <button className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors">
                                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Appearance */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Appearance
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Theme</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                <option>Light</option>
                                                <option>Dark</option>
                                                <option>Auto</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Card spacing</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                <option>Compact</option>
                                                <option>Normal</option>
                                                <option>Relaxed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Advanced */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        Advanced
                                    </h4>
                                    <div className="space-y-3">
                                        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                                            Export board data
                                        </button>
                                        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                                            Import board data
                                        </button>
                                        <button className="w-full text-left text-sm text-red-600 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors">
                                            Reset to defaults
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
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
                                <h3 className="text-lg font-semibold">Share Board</h3>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Share Link
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value="https://bento.app/board/abc123"
                                            readOnly
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                        />
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permissions
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                        <option>View only</option>
                                        <option>Can edit</option>
                                        <option>Full access</option>
                                    </select>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setShowShareModal(false)}
                                        className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BentoPage;