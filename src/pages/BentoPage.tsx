import React, { useState, useEffect } from "react";

// Import icons
import CreateEditBentoModal from "../components/modals/CreateBentoModal";
import type { BentoItem } from "../types/bento";
import useMultiSelect from "../hooks/useMultiSelect";
import useFilteredItems from "../hooks/useFilteredItems";
import Header from "../components/layout/Header";
import useSidebarState from "../hooks/useSidebarState";
import Sidebar from "../components/layout/Sidebar";
import BentoGrid from "../components/BentoGrid"; // Added import for BentoGrid
import Fab from "../components/ui/Fab";
import useFabMenuState from "../hooks/useFabMenuState";
import { Send, Sparkles, SlidersHorizontal } from "lucide-react";
import useBentoGrid from "../hooks/useBentoGrid";
import { TagBar } from "../components/layout/TagBar";
// ===============================
// Types & Interfaces
// ===============================

// Use FABItem type for handleCreateBento
interface FABItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
}

// ===============================
// Constants
// ===============================

const INITIAL_BENTO_ITEMS: BentoItem[] = [
  {
    id: '1',
    content: "This is a quick note. Welcome to your Bento Desk!",
    title: "Quick Note",
    className: "bg-yellow-100",
    type: 'text',
    starred: false,
    color: '#fffbe6',
    scale: 1.2,
  },
  {
    id: '2',
    content: undefined,
    title: "Polaroid Sunset",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    className: "bg-white overflow-hidden",
    type: 'image',
    starred: false,
    color: '#ffe6f7',
    scale: 1.7,
  },
  {
    id: '3',
    content: undefined,
    title: "Chill Audio Track",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    className: "bg-purple-100 p-2 rounded-lg",
    type: 'audio',
    starred: false,
    color: '#f3e6ff',
    scale: 1.2,
  },
  {
    id: '4',
    content: undefined,
    title: "YouTube: Rick Astley",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    className: "bg-gray-900 p-1 rounded-lg",
    type: 'youtube',
    starred: false,
    color: '#e6f7ff',
    scale: 1.7,
  },
  {
    id: '5',
    content: undefined,
    title: "Cognitive Freedom",
    url: "https://kiwix.org/es/",
    className: "bg-green-100 p-4 rounded-lg",
    type: 'link',
    starred: false,
    color: '#e6ffe6',
    scale: 1.2,
  },
];  

// ===============================
// Main Component
// ===============================

const BentoPage = () => {
    // ===============================
    // State
    // ===============================
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [bentoItems, setBentoItems] = useState<BentoItem[]>(INITIAL_BENTO_ITEMS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [showTidyModal, setShowTidyModal] = useState(false);
    const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
    // Add state for board name and date
    const [boardName, setBoardName] = useState('My Bento Board');
    const [editingBoardName, setEditingBoardName] = useState(false);

    // ===============================
    // Handlers
    // ===============================
    const selectTag = (tag: string) => {
        setSelectedTag(prev => prev === tag ? null : tag);
        clearSelection();
    };
    const clearTag = () => {
        setSelectedTag(null);
        clearSelection();
    };

    // Use the multi-select hook
    const { clearSelection } = useMultiSelect(bentoItems);

    // Multi-select and drag-and-drop logic
    const {
      selectedItems,
      handleSelectItem,
      setBentoItems: setBentoGridItems,
    } = useBentoGrid(bentoItems, setBentoItems);

    // Item action handlers
    const handleDeleteItem = (id: string) => setBentoItems(items => items.filter(item => item.id !== id));
    const handleToggleFavorite = (id: string) => setBentoItems(items => items.map(item => item.id === id ? { ...item, starred: !item.starred } : item));
    const handleEditItem = (item: BentoItem) => {
      setEditingItem(item);
      setShowModal(true);
    };
    const handleTogglePrivate = (id: string) => {
      setBentoItems(items => items.map(item => item.id === id ? { ...item, private: !item.private } : item));
    };

    // ===============================
    // Filtered Items
    // ===============================
    // Filtered items (no tagVisible logic)
    const filteredItems = useFilteredItems(
      bentoItems,
      searchTerm,
      selectedTag
    );

    // Tag management state
    const [tags, setTags] = useState<string[]>(() => {
      // Initialize from items
      return Array.from(
        new Set(
          bentoItems
            .filter(item => item.tagVisible !== false && Array.isArray(item.tags))
            .flatMap(item => item.tags || [])
        )
      );
    });

    // Tag management handlers
    const handleCreateTag = (newTag: string) => {
      console.log('Create tag:', newTag);
      if (!tags.includes(newTag)) {
        setTags(prev => [...prev, newTag]);
        setSelectedTag(newTag);
      }
    };
    const handleEditTag = (newTag: string) => {
      console.log('Edit tag:', selectedTag, '->', newTag);
      if (!selectedTag) return;
      if (tags.includes(newTag)) return;
      setTags(prev => prev.map(t => t === selectedTag ? newTag : t));
      setBentoItems(items => items.map(item =>
        item.tags && item.tags.includes(selectedTag)
          ? { ...item, tags: item.tags.map(t => t === selectedTag ? newTag : t) }
          : item
      ));
      setSelectedTag(newTag);
    };
    const handleDeleteTag = (tagToDelete: string) => {
      console.log('Delete tag:', tagToDelete);
      setTags(prev => prev.filter(t => t !== tagToDelete));
      setBentoItems(items => items.map(item =>
        item.tags && item.tags.includes(tagToDelete)
          ? { ...item, tags: item.tags.filter(t => t !== tagToDelete) }
          : item
      ));
      if (selectedTag === tagToDelete) setSelectedTag(null);
    };

    // Sidebar state
    const { sidebarOpen, isSidebarCollapsed, toggleMobileSidebar, toggleSidebarCollapse } = useSidebarState();
    const { fabOpen, toggleFabMenu } = useFabMenuState();

    // FAB create logic
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<BentoItem | null>(null);
    const [defaultType, setDefaultType] = useState<string>('text');
    // Remove fabType
    // Fix handleCreateBento to reliably open modal for correct type
    const handleCreateBento = (item: FABItem) => {
      setEditingItem(null);
      setDefaultType(item.type);
      setShowModal(true);
      if (fabOpen) toggleFabMenu();
    };
    const handleSaveBento = (item: Partial<BentoItem>, editingId?: string) => {
      console.log('Save bento:', item, editingId);
      if (editingId) {
        // Edit existing
        setBentoItems(items => {
          const updated = items.map(b => b.id === editingId ? { ...b, ...item, id: editingId } : b);
          setTags(deriveTagsFromItems(updated));
          return updated;
        });
      } else {
        // Create new
        setBentoItems(items => {
          const newItems = [
            {
              ...item,
              id: Date.now().toString(),
            } as BentoItem,
            ...items
          ];
          setTags(deriveTagsFromItems(newItems));
          return newItems;
        });
      }
      setShowModal(false);
      setEditingItem(null);
      // setFabType(null); // Removed as per edit hint
    };

    // Helper to derive tags from all cards
    function deriveTagsFromItems(items: BentoItem[]): string[] {
      return Array.from(new Set(items.flatMap(item => item.tags || [])));
    }

    // Organic initial layout: assign unique, non-overlapping positions and random rotation
    useEffect(() => {
      // Only run if items have no x/y
      if (bentoItems.some(item => item.x === undefined || item.y === undefined)) {
        const spacingX = 340; // px
        const spacingY = 220; // px
        const jitter = 30; // px
        const used: { [key: string]: { x: number, y: number } } = {};
        let col = 0, row = 0;
        const updated = bentoItems.map((item, i) => {
          if (item.x !== undefined && item.y !== undefined) return item;
          // Find a non-overlapping spot
          let x, y, tries = 0;
          do {
            x = 80 + col * spacingX + (Math.random() - 0.5) * jitter;
            y = 80 + row * spacingY + (Math.random() - 0.5) * jitter;
            tries++;
            col++;
            if (col > 2) { col = 0; row++; }
          } while (Object.values(used).some(pos => Math.abs(pos.x - x) < spacingX * 0.7 && Math.abs(pos.y - y) < spacingY * 0.7) && tries < 10);
          used[item.id] = { x, y };
          // Random rotation between -3 and +3 degrees
          const rotation = (Math.random() - 0.5) * 6;
          return { ...item, x, y, rotation };
        });
        setBentoItems(updated);
      }
    }, []); // Only on mount

    // Render
    // ===============================

    return (
  <div className="h-screen flex flex-col font-sans text-gray-800 bg-gray-100">
    {/* Header: always at the top */}
    <Header
      toggleMobileSidebar={toggleMobileSidebar}
      toggleSidebarCollapse={toggleSidebarCollapse}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      // Remove onShare, onTidy, onMoreOptions
    />
    {/* Main area: sidebar + content */}
    <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={isSidebarCollapsed}
        selectedTag={selectedTag}
        clearTag={clearTag}
      />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#fdf8f4]">
        {/* Board Title Tab and TagBar in a single seamless row */}
        <div className="w-full px-4 flex items-center" style={{ height: '3.25rem', background: 'white', backgroundImage: 'radial-gradient(circle,#e2e8f0_1px,transparent_1px)', backgroundSize: '30px 30px' }}>
          <div className="flex items-center gap-2 w-1/4 h-full bg-transparent rounded-tr-2xl pl-4">
            {editingBoardName ? (
              <input
                className="text-xl font-bold bg-transparent border-b border-gray-300 focus:border-blue-400 outline-none px-1 py-0.5 min-w-[120px]"
                value={boardName}
                onChange={e => setBoardName(e.target.value)}
                onBlur={() => setEditingBoardName(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingBoardName(false); }}
                autoFocus
              />
            ) : (
              <span
                className="text-xl font-bold cursor-pointer hover:underline"
                onClick={() => setEditingBoardName(true)}
                title="Click to edit board name"
              >
                {boardName}
              </span>
            )}
            {/* Board action icons with Lucide icons and modal logic */}
            <button
              className="relative p-1 rounded-full hover:bg-[#ffe9c7] focus:bg-[#ffe9c7] transition transform hover:scale-110 focus:scale-110 group"
              aria-label="Share this board"
              onClick={() => setShowShareModal(true)}
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20">Share</span>
              <Send className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>
            <button
              className="relative p-1 rounded-full hover:bg-[#e7f6ff] focus:bg-[#e7f6ff] transition transform hover:scale-110 focus:scale-110 group"
              aria-label="Tidy up board"
              onClick={() => setShowTidyModal(true)}
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20">Tidy</span>
              <Sparkles className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>
            <button
              className="relative p-1 rounded-full hover:bg-[#f3e8ff] focus:bg-[#f3e8ff] transition transform hover:scale-110 focus:scale-110 group"
              aria-label="Board options"
              onClick={() => setShowMoreOptionsModal(true)}
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-50">Options</span>
              <SlidersHorizontal className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>
          </div>
          {/* TagBar next to title tab, visible, flex-1, full bar style */}
          <div className="flex-1 h-full flex items-center px-4 py-2" style={{ background: 'white', backgroundImage: 'radial-gradient(circle,#e2e8f0_1px,transparent_1px)', backgroundSize: '30px 30px' }}>
            <TagBar
              tags={tags}
              selectedTag={selectedTag}
              onSelectTag={selectTag}
              onClearTag={clearTag}
              onCreateTag={handleCreateTag}
              onEditTag={handleEditTag}
              onDeleteTag={handleDeleteTag}
            />
          </div>
        </div>
        {/* Bento Grid */}
        <BentoGrid
          items={filteredItems}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onDeleteItem={handleDeleteItem}
          onStarItem={handleToggleFavorite}
          onEditItem={handleEditItem}
          setBentoItems={setBentoGridItems}
          onTogglePrivate={handleTogglePrivate}
        />
        {/* Create/Edit Bento Item Modal */}
        <CreateEditBentoModal
          isOpen={showModal}
          editingItem={editingItem}
          onSave={handleSaveBento}
          onCancel={() => { setShowModal(false); setEditingItem(null); }}
          defaultType={defaultType}
          existingTags={tags}
        />
        {/* FAB Floating Action Button */}
        <Fab
          fabOpen={fabOpen}
          toggleFabMenu={toggleFabMenu}
          handleCreateBento={handleCreateBento}
        />
        {/* Board-level Modals */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] flex flex-col gap-4">
              <div className="font-bold text-lg mb-2">Share this Board</div>
              <div className="text-gray-600 mb-4">Invite collaborators or share your desk with a link. (Coming soon!)</div>
              <button className="self-end px-4 py-2 bg-black text-white rounded-lg" onClick={() => setShowShareModal(false)}>Close</button>
            </div>
          </div>
        )}
        {showTidyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] flex flex-col gap-4">
              <div className="font-bold text-lg mb-2">Tidy Up Board</div>
              <div className="text-gray-600 mb-4">Auto-arrange or stack your cards for a cleaner desk. (Coming soon!)</div>
              <button className="self-end px-4 py-2 bg-black text-white rounded-lg" onClick={() => setShowTidyModal(false)}>Close</button>
            </div>
          </div>
        )}
        {showMoreOptionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] flex flex-col gap-4">
              <div className="font-bold text-lg mb-2">Board Options</div>
              <div className="text-gray-600 mb-4">Rename board, change desk surface, archive, and more. (Coming soon!)</div>
              <button className="self-end px-4 py-2 bg-black text-white rounded-lg" onClick={() => setShowMoreOptionsModal(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
);
};

export default BentoPage;