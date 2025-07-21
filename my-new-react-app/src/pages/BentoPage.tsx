import React, { useState } from "react";

// Import icons
import {
    Home,
    Clock,
    Star,
    Folder,
    Share2,
    FileText,
    FolderPlus,
    Trash2,
    Settings,
    ThumbsUp,
} from "lucide-react";

// Import components
import SidebarButton from "../components/common/SidebarButton";
import CreateBentoModal from "../components/modals/CreateBentoModal";
import type { BentoItem } from "../types/bento";
import useMultiSelect from "../hooks/useMultiSelect";
import useCreateBento from "../hooks/useCreateBento";
import useFilteredItems from "../hooks/useFilteredItems";
import Header from "../components/layout/Header";
// ===============================
// Types & Interfaces
// ===============================

interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: BentoItem['type'];
}

// ===============================
// Constants
// ===============================

const INITIAL_TAGS = ["Inspo", "Work", "Play", "Quotes", "Ideas", "Travel", "Recipes", "Links"];

// Example initial items with more structure
// Replace with actual data fetching later
const INITIAL_BENTO_ITEMS: BentoItem[] = [
    {
        id: '1',
        content: "Don’t forget meeting at 3 PM",
        className: "bg-yellow-100",
        type: 'text',
        starred: false
    },
    {
        id: '2',
        content: (
            <>
                <strong className="block mb-1">Morning Dump</strong>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                    <li>Feeling kinda blah</li>
                    <li>Need to get some fresh air</li>
                    <li>Work on project</li>
                </ul>
            </>
        ),
        className: "bg-pink-100",
        type: 'text',
        starred: false
    },
    {
        id: '3',
        content: (
            <>
                Suggestions<br />
                <span className="text-xs text-gray-600">Add to your journal?</span>
            </>
        ),
        className: "bg-orange-100",
        type: 'text',
        starred: false
    },
    {
        id: '4',
        content: (
            <>
                {/* Use a placeholder service */}
                <img
                    src="https://placehold.co/200x300/E0E0E0/BDBDBD?text=Image"
                    alt="Placeholder image"
                    className="w-full h-32 object-cover rounded-t-lg"
                    // Add error handling for real images
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x300/CCCCCC/999999?text=Error')}
                />
                <div className="text-center text-xs py-2 font-medium">Today</div>
            </>
        ),
        url: "https://placehold.co/200x300", // Store original URL if needed
        className: "bg-white overflow-hidden",
        type: 'image',
        starred: false
    },
    {
        id: '5',
        content: (
            <>
                <strong className="block mb-1">Project Brainstorm</strong>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                    <li>Initial Ideas</li>
                    <li>Research</li>
                    <li>Sketches</li>
                </ul>
            </>
        ),
        className: "bg-blue-100",
        type: 'text',
        starred: false
    },
    {
        id: '6',
        content: (
            <iframe
                width="100%"
                height="200"
                // Use a valid embed URL structure, replace VIDEO_ID
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Example: Rick Astley
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg block" // Add block display
            />
        ),
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Store original watch URL
        className: "bg-gray-900 p-1 rounded-lg", // Darker background for video
        type: 'youtube',
        starred: false
    },
    {
        id: '7',
        content: (
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                React Documentation
            </a>
        ),
        url: "https://react.dev",
        className: "bg-green-100 p-4 rounded-lg",
        type: 'link',
        starred: false
    },
    {
        id: '8',
        content: (
            <audio controls className="w-full h-10"> {/* Added height */}
                {/* Provide a valid audio source */}
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        ),
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        className: "bg-purple-100 p-2 rounded-lg",
        type: 'audio',
        starred: false
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
    const { isCreating, newBentoType, newBentoContent, newBentoUrl, cancelCreateBento, addBentoItem, setNewBentoContent, setNewBentoUrl } = useCreateBento(bentoItems, setBentoItems, () => {});

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

    // ===============================
    // Filtered Items
    // ===============================
    const filteredItems = useFilteredItems(bentoItems, searchTerm, selectedTag);

    // Add dummy handlers for sidebar/fab toggles for now
    const toggleMobileSidebar = () => {};
    const toggleSidebarCollapse = () => {};
    const toggleFabMenu = () => {};

    // Render
    // ===============================

    return (
  <div className="h-screen flex flex-col font-sans text-gray-800 bg-gray-100">
    {/* Header: always at the top */}
    <Header
      toggleMobileSidebar={toggleMobileSidebar}
      toggleSidebarCollapse={toggleSidebarCollapse}
      toggleFabMenu={toggleFabMenu}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
    {/* Main area: sidebar + content */}
    <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-gray-900 text-white shrink-0 flex flex-col shadow-lg p-4">
        {/* Sidebar content */}
        <div className="space-y-2">
          <SidebarButton icon={Home} label="Home" isActive={!selectedTag} onClick={clearTag} />
          <SidebarButton icon={Star} label="Favorites" isActive={false} onClick={() => {}} />
          <SidebarButton icon={Folder} label="Collections" isActive={false} onClick={() => {}} />
          <SidebarButton icon={Share2} label="Shared with me" isActive={false} onClick={() => {}} />
        </div>
        <div className="border-t border-gray-700 my-4" />
        <div className="space-y-2">
          <SidebarButton icon={FileText} label="My Bentos" isActive={false} onClick={() => {}} />
          <SidebarButton icon={FolderPlus} label="Drafts" isActive={false} onClick={() => {}} />
          <SidebarButton icon={Clock} label="Recently Opened" isActive={false} onClick={() => {}} />
          <SidebarButton icon={ThumbsUp} label="Liked Items" isActive={false} onClick={() => {}} />
          <SidebarButton icon={Trash2} label="Trash" isActive={false} onClick={() => {}} />
        </div>
        <div className="border-t border-gray-700 my-4" />
        <SidebarButton icon={Settings} label="Settings" isActive={false} onClick={() => {}} />
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Tag Bar */}
        <div className="sticky top-14 w-full bg-[#fcf9f6]/80 border-b border-gray-200 px-4 py-2 z-20 flex gap-2 overflow-x-auto whitespace-nowrap">
          {INITIAL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => selectTag(tag)}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition
                ${selectedTag === tag ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="flex-1 w-full px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border shadow p-6 transition-transform duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${item.className || 'bg-white'}`}
                // TODO: Add selection/hover menu in the future
              >
                {typeof item.content === 'string' ? <div>{item.content}</div> : item.content}
              </div>
            ))}
          </div>
        </div>

        {/* Create New Bento Item Modal */}
        <CreateBentoModal
          isOpen={isCreating && !!newBentoType}
          onCancel={cancelCreateBento}
          bentoType={newBentoType as FABItem | null}
          content={newBentoContent}
          url={newBentoUrl}
          onContentChange={e => setNewBentoContent(e.target.value)}
          onUrlChange={e => setNewBentoUrl(e.target.value)}
          onAddItem={addBentoItem}
        />
      </main>
    </div>
  </div>
);
};

export default BentoPage;