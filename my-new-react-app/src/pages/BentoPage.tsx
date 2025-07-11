import React, { useState, useEffect, useRef, useMemo } from "react";

// Import icons
import {
    Plus,
    Search,
    User,
    Video,
    Bell,
    Menu,
    Mic,
    PenTool,
    Image,
    Music,
    Youtube,
    Brush,
    Link as LinkIcon, // Renamed to avoid conflict with HTML Link element
    Home,
    Clock,
    Download,
    ListVideo,
    GraduationCap,
    ThumbsUp,
    History,
    BadgeInfo,
    Star,
    Folder,
    Share2,
    FileText,
    FolderPlus,
    Trash2, // Assuming Trash2 is preferred over Trash
    Settings, // Assuming Settings is preferred over Gear or similar
    Tag,
    CheckCircle,
    XCircle,
    GripVertical,
    MoreVertical,
} from "lucide-react";

// Import animation library
import { motion, AnimatePresence } from "framer-motion";

// Import utility for class merging
import { clsx, type ClassValue } from "clsx"; // Importing ClassValue type explicitly
import { twMerge } from "tailwind-merge"; // For merging Tailwind classes

// Import components - using '@/components' alias assuming it's configured
import { Input as InputComponent } from "@/components/ui/Input"; // Assuming Input component file is Input.tsx
import { Button as ButtonComponent } from "@/components/ui/Button"; // Assuming Button component file is Button.tsx
import { Card as CardComponent } from "@/components/ui/Card"; // Assuming Card component file is Card.tsx
import { Textarea as TextareaComponent } from "@/components/ui/textarea"; // Assuming textarea component file is textarea.tsx
import { SidebarButton } from "@/components/common/SidebarButton"; // Assuming SidebarButton is here now
import { TagButton } from "@/components/common/TagButton"; // Assuming TagButton is here now
import { MultiSelectToolbar } from "@/components/ui/MultiSelectToolbar"; // Assuming MultiSelectToolbar is here now
import { BentoCard } from "@/components/items/BentoCard"; // Assuming BentoCard is here now
// import { Fab } from "@/components/ui/Fab"; // Assuming Fab component file is Fab.tsx - Note: Fab is used internally by FabMenu
import { FabMenu } from "@/components/ui/FabMenu"; // Assuming FabMenu component file is FabMenu.tsx
import { CreateBentoModal } from "@/components/modals/CreateBentoModal"; // Assuming CreateBentoModal component file is CreateBentoModal.tsx

// ===============================
// Utility Function (cn)
// ===============================
// Define the 'cn' utility function for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Import BentoGrid component and interface
import BentoGrid from "@/components/BentoGrid"; // Assuming BentoGrid is here now
import { BentoItem, BentoItemType } from "/my-new-react-app/src/types"; // Import BentoItem interface and BentoItemType

// Import custom hooks
import useMultiSelect from "@/hooks/useMultiSelect"; // Import the new hook
import useSidebarState from "/my-new-react-app/src/hooks/useSidebarState"; // Import the new hook
import useFabMenuState from "/my-new-react-app/src/hooks/useFabMenuState"; // Import the new hook
import useCreateBento from "@/hooks/useCreateBento"; // Import the new hook
// ===============================
// Types & Interfaces
// ===============================

interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: BentoItem['type']; // Add type to FAB item
}


// ===============================
// Constants
// ===============================

const FAB_ITEMS: FABItem[] = [
    { icon: PenTool, label: "Text", type: 'text' },
    { icon: Image, label: "Image", type: 'image' },
    { icon: Music, label: "Audio", type: 'audio' },
    { icon: Video, label: "Video", type: 'video' }, // Could be general video or YouTube
    { icon: LinkIcon, label: "Link", type: 'link' },
    { icon: Brush, label: "Drawing", type: 'drawing' },
    { icon: Youtube, label: "YouTube", type: 'youtube' },
];

const INITIAL_TAGS = ["Inspo", "Work", "Play", "Quotes", "Ideas", "Travel", "Recipes", "Links"]; // Added more tags

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

    // Use the useSidebarState hook
 const { sidebarOpen, isSidebarCollapsed, toggleMobileSidebar, toggleSidebarCollapse } = useSidebarState();
     // Use the useFabMenuState hook
 const { fabOpen, toggleFabMenu } = useFabMenuState();
    const [selectedTag, setSelectedTag] = useState<string | null>(null); // State for selected tag
    const [bentoItems, setBentoItems] = useState<BentoItem[]>(INITIAL_BENTO_ITEMS); // State for all bento items
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    // Use the useCreateBento hook
    const { isCreating, newBentoType, newBentoContent, newBentoUrl, handleCreateBento, cancelCreateBento, addBentoItem, setNewBentoContent, setNewBentoUrl } = useCreateBento(bentoItems, setBentoItems, toggleFabMenu); // Pass setBentoItems to the hook

    // Drag & Drop State (Managed internally by BentoGrid or a separate hook later)
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    // ===============================
    // Handlers
    // These handlers now come from the useSidebarState hook
    // ===============================
    // Toggle desktop sidebar collapse state
    // const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed); // Now handled by hook

    // Updated selectTag to also clear selection
    const selectTag = (tag: string) => {
        setSelectedTag(prev => prev === tag ? null : tag); // Toggle tag selection
        clearSelection(); // Clear item selection when changing tags
 };
    // Updated clearTag to also clear selection
    const clearTag = () => {
        setSelectedTag(null);
        clearSelection(); // Clear item selection when clearing tags
    };


    // Use the multi-select hook
    const { selectedItems, handleSelectItem, clearSelection } = useMultiSelect(filteredItems);

    const handleCreateBento = (fabItem: FABItem) => {
        // This handler is now managed by the useCreateBento hook
         // and passed into the FabMenu component.
         // The hook will handle setting state and opening the modal.
         // No direct action needed here.
    };

    const deleteBentoItem = (id: string) => {
        setBentoItems(prev => prev.filter(item => item.id !== id));
        // Also remove from selection if it was selected
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    };

     const deleteSelectedItems = () => {
        setBentoItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        clearSelection();
    };

    const handleStarItem = (id: string) => {
        setBentoItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, starred: !item.starred } : item
            )
        );
    };

    const handleShareItem = (id: string) => {
        // Implement sharing logic (e.g., copy link, open share dialog)
        const item = bentoItems.find(i => i.id === id);
        if (item) {
            // Prioritize URL for sharing if available
            const shareContent = item.url || (typeof item.content === 'string' ? item.content : `Bento item (${item.type})`);
            const shareText = `Check out this item: ${shareContent}`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareText)
                    .then(() => console.log("Item link/content copied to clipboard!")) // Use console log or UI notification
                    .catch(err => console.error('Failed to copy: ', err));
            } else {
                console.warn("Clipboard API not available.");
                // Fallback or different share mechanism needed here
            }
        }
        console.log(`Sharing item ${id}`);
    };

    // --- Drag and Drop Handlers ---


    // ===============================
    // Filtered Items (Memoize if performance becomes an issue)
    // ===============================
    // This calculation should ideally be memoized using useMemo if it becomes complex or slow
    // Use the custom hook for filtering items based on search and selected tag
    const filteredItems = useFilteredItems(bentoItems, searchTerm, selectedTag);


    // Render
    // ===============================

    return (
        <div className="w-full h-screen flex flex-col font-sans text-gray-800 bg-[#fdf8f4] relative overflow-hidden">
            {/* Header */}
            <header className="w-full h-14 flex-shrink-0 flex items-center justify-between px-4 bg-[#fcf9f6]/80 backdrop-blur-sm border-b border-gray-200 shadow-sm z-30">
                {/* Left Section: Menu Toggles and Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Desktop Menu Button - Toggles Collapse */}
                    <ButtonComponent
                        id="desktop-menu-button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleSidebarCollapse} // Use new handler
                        className="hidden md:inline-flex text-gray-600 hover:bg-gray-200"
                    >
                        <Menu className="w-5 h-5" />
                    </ButtonComponent>
                     {/* Mobile Menu Button - Toggles Overlay */}
                    <ButtonComponent
                        id="menu-button" // ID for click outside detection in useSidebarState
                        size="icon"
                        variant="ghost"
                        onClick={toggleMobileSidebar} // Use mobile handler
                        className="md:hidden text-gray-600 hover:bg-gray-200"
                    >
                        <Menu className="w-5 h-5" />
                    </ButtonComponent>
                    <span className="font-bold text-lg tracking-tight">BENTO</span>
                </div>

 {/* Center Section: Search Bar (Flex-grow to take available space) */}
                 <div className="flex-1 min-w-0 mx-4 flex justify-center"> {/* Allow shrinking, center content */}
                    <div className="relative w-full max-w-md"> {/* Max width for search */}
                        <InputComponent
                            className="pl-10 text-sm w-full h-9 rounded-full border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            placeholder="Search your bento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Right Section: Create Button and Action Icons */}
                <div className="flex items-center gap-1 flex-shrink-0"> {/* Prevent shrinking */}
                    {/* --- Updated Create Button --- */}
                    <ButtonComponent
                        id="header-create-button" // ID for click outside detection in useFabMenuState
                        onClick={toggleFabMenu} // Toggle FAB menu on click
                        className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5 rounded-lg h-8 hidden sm:flex items-center" // Changed rounded-md to rounded-lg
                    >
                        <Plus className="w-4 h-4 mr-1" /> Create
                    </ButtonComponent>
                    {/* --- End Updated Create Button --- */}

                    <ButtonComponent variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
                        <Bell className="w-5 h-5" />
                    </ButtonComponent>
                    <ButtonComponent variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
                        <User className="w-5 h-5" />
                    </ButtonComponent>
                    <ButtonComponent variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
                        <MoreVertical className="w-5 h-5" />
                    </ButtonComponent>
                </div>
            </header>

            {/* Flex Container for Sidebar + Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Handles Mobile Overlay and Desktop Collapse */}
                <aside
                    id="sidebar"
                    className={cn(
                        "bg-black border-r border-gray-700 shadow-md z-20 flex-shrink-0",
                        "transition-all duration-300 ease-in-out", // Use transition-all for width and transform
                        // Mobile State (Overlay)
                        "fixed md:static top-14 bottom-0", // Fixed on mobile, static on desktop
                        sidebarOpen ? "translate-x-0" : "-translate-x-full", // Mobile slide in/out
                        // Desktop State (Collapse)
                        "md:translate-x-0", // Ensure visible on desktop
                        isSidebarCollapsed ? "md:w-16" : "md:w-60" // Desktop collapse width
                    )}
                >
                    {/* Sidebar Content */}
                        {/* Pass collapsed state to buttons */}
                        <div className="p-3 space-y-1">
                            <SidebarButton icon={Home} label="Home" isActive={!selectedTag && true} onClick={clearTag} isCollapsed={isSidebarCollapsed} />
                            <SidebarButton icon={Star} label="Favorites" isCollapsed={isSidebarCollapsed}/>
                            <SidebarButton icon={Folder} label="Collections" isCollapsed={isSidebarCollapsed}/>
                            <SidebarButton icon={Share2} label="Shared with me" isCollapsed={isSidebarCollapsed}/>
                        </div>
                        <hr className={cn("my-2 border-gray-700", isSidebarCollapsed ? "mx-1" : "mx-3")} /> {/* Adjust HR margin */}
                        <div className="p-3 space-y-1">
                            <SidebarButton icon={FileText} label="My Bentos" isCollapsed={isSidebarCollapsed}/>
                            <SidebarButton icon={FolderPlus} label="Drafts" isCollapsed={isSidebarCollapsed}/>
                            <SidebarButton icon={Clock} label="Recently Opened" isCollapsed={isSidebarCollapsed}/>
                            <SidebarButton icon={ThumbsUp} label="Liked Items" isCollapsed={isSidebarCollapsed}/>
                            <SidebarButton icon={Trash2} label="Trash" isCollapsed={isSidebarCollapsed}/>
                        </div>
                         <hr className={cn("my-2 border-gray-700", isSidebarCollapsed ? "mx-1" : "mx-3")} /> {/* Adjust HR margin */}
                        <div className="p-3 space-y-1">
                            <SidebarButton icon={Settings} label="Settings" isCollapsed={isSidebarCollapsed}/>
                        </div>
                </aside>

                {/* Main Area (Tag Bar + Content) */}
                <div className="flex-1 flex flex-col overflow-hidden">
                     {/* Tag Filter Bar */}
                     {/* Assuming tagBarRef is defined in BentoPage */}
                        ref={tagBarRef}
                        className="flex-shrink-0 flex gap-2 px-4 py-2 bg-[#f4f1ed]/80 backdrop-blur-sm border-b border-gray-200 items-center overflow-x-auto whitespace-nowrap sticky top-0 z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" // Added sticky, scrollbar styling
                     >
                        <Tag className="w-4 h-4 text-gray-500 flex-shrink-0 mr-1" />
                        {INITIAL_TAGS.map((tag) => (
                            <TagButton
                                key={tag}
                                tag={tag}
                                isSelected={selectedTag === tag}
                                onClick={() => selectTag(tag)}
                            />
                        ))}
                    {/* End Tag Filter Bar */}

                    {/* Main Content Grid Area */}
                    {/* Assuming mainContentRef is defined in BentoPage */}
                    <main
                        className="flex-1 overflow-y-auto relative bg-[#fdf8f4]" // Main scrolling area
                        ref={mainContentRef}
                    >
                        {/* Multi-Select Toolbar */}
                        <AnimatePresence>
                            {selectedItems.length > 0 && (
                                <MultiSelectToolbar
                                    selectedCount={selectedItems.length}
                                    onDeselect={clearSelection}
                                    onExport={() => console.log("Export:", selectedItems)}
                                    onMove={() => console.log("Move:", selectedItems)}
                                    onDeleteSelected={deleteSelectedItems}
                                />
                            )}
                        </AnimatePresence>
                        {/* Bento Grid */}
                        {/* Assuming dragItemNode, dragOverItemNode are defined in BentoPage */}
                        <BentoGrid
                            items={filteredItems} // Pass filtered items
                            selectedItems={selectedItems}
                            onSelectItem={handleSelectItem}
                            onDeleteItem={deleteBentoItem} // Pass the renamed handler
                            onStarItem={handleStarItem} // Pass the renamed handler
                            onShareItem={handleShareItem} // Pass the renamed handler
                            draggedItemId={draggedItemId} // Passed for drag and drop
                            setDraggedItemId={setDraggedItemId} // Passed for drag and drop
                            dragItemNode={dragItemNode} // Passed for drag and drop
                            dragOverItemNode={dragOverItemNode}
                            setBentoItems={setBentoItems} // Pass the state setter for reordering
                        />
                    </main> {/* End Main Content Grid Area */}
                </div> {/* End Main Area */}


                {/* Floating Action Button (FAB) */}
                <div className="fixed bottom-6 right-6 z-40">
                    <div className="relative flex flex-col items-center">
                        {/* FAB Menu Items */}
                        <AnimatePresence>
                            {fabOpen && (
                                <motion.div
                                    id="fab-menu"
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }} // Spring animation
                                    className="absolute bottom-16 right-0 flex flex-col items-end gap-3 z-50" // Positioning and layout
                                >
                                    {FAB_ITEMS.map((item) => (
                                        // Each item container uses flex and justify-end
                                        <div key={item.type} className="flex items-center justify-end gap-2 group w-full cursor-pointer">
                                            {/* Tooltip */}
                                            <span className="bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap order-1"> {/* Order tooltip first visually */}
                                                {item.label}
                                            </span>
                                            {/* Button */}
                                            <ButtonComponent
                                                size="icon"
                                                className="bg-white rounded-full shadow-lg w-10 h-10 border hover:bg-gray-100 hover:scale-110 transition-transform order-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" // Styling and focus
                                                onClick={() => handleCreateBento(item)} // Trigger create bento handler from hook
                                            >
                                                <item.icon className="w-5 h-5 text-gray-700" />
                                            </ButtonComponent>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main FAB Button */}
                        <ButtonComponent
                            id="fab-button"
                            size="icon"
                            className="rounded-full w-14 h-14 bg-black text-white shadow-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            onClick={toggleFabMenu} // Use toggle handler
                        >
                            <motion.div
                                animate={{ rotate: fabOpen ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Plus className="w-6 h-6" />
                            </motion.div>
                        </ButtonComponent>
                    </div>
                </div>

                {/* Create New Bento Item Modal */}
                {/* Modal is now controlled by useCreateBento hook */}
                {/* Pass necessary props to the modal component */}
                <CreateBentoModal
                    isOpen={isCreating && !!newBentoType} // Only show if isCreating and newBentoType is set
                    onClose={cancelCreateBento}
                    itemType={newBentoType as FABItem | null} // Cast to FABItem or null
                    content={newBentoContent}
                    url={newBentoUrl} // Pass newBentoUrl to modal
                    setContent={setNewBentoContent} // Pass setter to modal
                    setUrl={setNewBentoUrl} // Pass setter to modal
                    onAddItem={addBentoItem} // Pass add item handler to modal
                />


            </div> {/* End Flex Container */}
        </div> // End Full App Container
    );
};

export default BentoPage;