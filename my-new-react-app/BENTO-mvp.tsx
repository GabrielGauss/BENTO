import React, { useState, useEffect, useRef } from "react";
// Assuming these components exist in the specified paths
// You might need to install/create them:
// npm install lucide-react framer-motion clsx tailwind-merge
// Create components in @/components/ui/ (Input, Button, Card, Textarea)
// Create cn utility in @/lib/utils
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Search,
    User,
    Video,
    Bell,
    Menu,
    Mic, // Mic icon imported but not used in the provided snippet
    PenTool,
    Image,
    Music,
    Youtube,
    Brush,
    Link as LinkIcon,
    Home,
    Clock,
    Download,
    ListVideo, // ListVideo icon imported but not used
    GraduationCap, // GraduationCap icon imported but not used
    ThumbsUp,
    History, // History icon imported but not used
    BadgeInfo, // BadgeInfo icon imported but not used
    Star,
    Folder,
    Share2,
    FileText,
    FolderPlus,
    Trash2,
    Settings,
    Tag,
    CheckCircle,
    XCircle,
    GripVertical, // GripVertical icon imported but not used
    MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx"; // Using clsx directly
import { twMerge } from "tailwind-merge"; // Using tailwind-merge directly

// ===============================
// Utility Function (cn)
// ===============================
// Define the 'cn' utility function if not imported
// You can place this in a separate file (e.g., lib/utils.ts)
// and import it, or define it directly in the component file.
import { type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// ===============================
// Types & Interfaces
// ===============================

interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: BentoItem['type']; // Add type to FAB item
}

interface BentoItem {
    id: string;
    content: React.ReactNode;
    className: string;
    // Define specific types
    type: 'text' | 'image' | 'video' | 'audio' | 'link' | 'drawing' | 'youtube';
    starred?: boolean;
    // Add optional properties that might be needed for specific types
    url?: string; // For image, video, audio, link, youtube
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
// Helper Components (Assuming they exist or are defined elsewhere)
// ===============================

// Mock implementations if not available
// Use standard elements if imports fail
const MockInput = (props: any) => <input {...props} className={cn("border rounded px-2 py-1", props.className)} />;
const MockTextarea = (props: any) => <textarea {...props} className={cn("border rounded px-2 py-1", props.className)} />;
const MockButton = React.forwardRef(({ variant, size, className, children, ...props }: any, ref: any) => (
  <button
    ref={ref}
    {...props}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" : "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      size === "icon" ? "h-9 w-9" : "h-9 px-4 py-2",
      className
    )}
  >
    {children}
  </button>
));
const MockCard = ({ className, children, ...props }: any) => <div {...props} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>{children}</div>;

// Use mocks if originals are not found (basic check)
const InputComponent = typeof Input === 'undefined' ? MockInput : Input;
const TextareaComponent = typeof Textarea === 'undefined' ? MockTextarea : Textarea;
const ButtonComponent = typeof Button === 'undefined' ? MockButton : Button;
const CardComponent = typeof Card === 'undefined' ? MockCard : Card;


// Sidebar Button updated to handle collapsed state
const SidebarButton = ({
    icon: Icon,
    label,
    onClick,
    isActive,
    isCollapsed // New prop
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
    isCollapsed?: boolean; // Added prop type
}) => (
    <ButtonComponent
        variant="ghost"
        onClick={onClick}
        className={cn(
            "w-full text-sm font-medium transition-all duration-200", // Base styles
            // Colors for black sidebar
            "text-gray-300 hover:text-white hover:bg-gray-700",
            isActive && "bg-gray-700 text-white", // Active state for black sidebar
            // Handle collapsed state
            isCollapsed ? "justify-center px-0 h-10" : "justify-start px-3 h-9" // Adjust padding and height when collapsed
        )}
        title={isCollapsed ? label : undefined} // Show tooltip when collapsed
    >
        <Icon className={cn("w-4 h-4 flex-shrink-0", !isCollapsed && "mr-2")} /> {/* Remove margin when collapsed */}
        {!isCollapsed && <span className="truncate">{label}</span>} {/* Hide label when collapsed */}
    </ButtonComponent>
);


// Updated TagButton for better contrast and style consistency
const TagButton = ({
    tag,
    isSelected,
    onClick
}: {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
}) => (
    <ButtonComponent
        variant="ghost" // Use ghost variant for base styling
        onClick={onClick}
        className={cn(
            "text-xs px-3 py-1 h-auto rounded-full border transition-colors duration-150", // Base styles
            isSelected
                ? "bg-black text-white border-black hover:bg-gray-800" // Selected state
                : "text-gray-600 bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400" // Default state
        )}
    >
        #{tag}
    </ButtonComponent>
);


const MultiSelectToolbar = ({
    selectedCount,
    onDeselect,
    onExport,
    onMove,
    onDeleteSelected // Add delete functionality
}: {
    selectedCount: number;
    onDeselect: () => void;
    onExport: () => void;
    onMove: () => void;
    onDeleteSelected: () => void; // Add prop
}) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        // Position below the tag bar (top-14 + tag bar height approx top-24/28)
        className="fixed top-28 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-3 py-1.5 z-20 flex gap-2 items-center border" // Adjusted z-index and top position
    >
        <span className="text-sm font-medium px-2">{selectedCount} selected</span>
        <ButtonComponent
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50 h-7 px-2" // Adjusted styling
            onClick={onMove}
        >
            <Folder className="w-4 h-4 mr-1" /> Move
        </ButtonComponent>
        <ButtonComponent
            variant="ghost"
            size="sm"
            className="text-green-600 hover:bg-green-50 h-7 px-2" // Adjusted styling
            onClick={onExport}
        >
            <Download className="w-4 h-4 mr-1" /> Export
        </ButtonComponent>
        <ButtonComponent
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 h-7 px-2" // Adjusted styling
            onClick={onDeleteSelected} // Call delete function
        >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
        </ButtonComponent>
        <ButtonComponent
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-100 h-7 w-7 ml-1" // Smaller close button
            onClick={onDeselect}
        >
            <XCircle className="w-4 h-4" />
        </ButtonComponent>
    </motion.div>
);

const BentoCard = ({
    item,
    isSelected,
    onSelect,
    isHovered, // This prop seems unused, hover effects are CSS driven
    onDelete,
    onStar,
    onShare,
}: {
    item: BentoItem;
    isSelected: boolean;
    onSelect: (id: string, shiftKey: boolean) => void; // Pass shiftKey for multi-select
    isHovered: boolean; // Keep if needed for JS logic, otherwise remove
    onDelete: (id: string) => void;
    onStar: (id: string) => void;
    onShare: (id: string) => void;
}) => {
    const [localHover, setLocalHover] = useState(false);

    // Simple content rendering - adjust as needed for complex types
    const renderContent = () => {
        // For text, maybe render markdown or handle line breaks
        if (item.type === 'text' && typeof item.content === 'string') {
            return <p className="whitespace-pre-wrap break-words">{item.content}</p>;
        }
        // For other types, the content is likely already a ReactNode
        return item.content;
    };

    return (
        // Use motion.div for layout animations if grid items reorder
        <motion.div
            layout // Animate layout changes
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group h-full" // Ensure div takes full height for layout
            onMouseEnter={() => setLocalHover(true)}
            onMouseLeave={() => setLocalHover(false)}
        >
            <CardComponent
                // Use onClick with event to check for shift key
                onClick={(e: React.MouseEvent) => onSelect(item.id, e.shiftKey)}
                className={cn(
                    item.className, // Base styling from item data
                    "p-3 rounded-xl shadow text-sm cursor-pointer relative transition-all duration-200 ease-in-out h-full flex flex-col", // Ensure card takes full height and allows flex content
                    "border", // Add subtle border
                    isSelected
                        ? "ring-2 ring-offset-1 ring-black shadow-md scale-[1.02]" // Enhanced selected state
                        : "hover:shadow-lg hover:scale-[1.01] hover:border-gray-300", // Hover state
                    // Add specific padding/styles based on type if needed
                    item.type === 'image' && 'p-0', // No padding for image container
                    item.type === 'youtube' && 'p-0', // No padding for video container
                    item.type === 'audio' && 'p-2'
                )}
            >
                {/* Content Area */}
                <div className="flex-grow overflow-hidden"> {/* Allow content to grow */}
                  {renderContent()}
                </div>

                {/* Actions Overlay - visible on hover or if selected */}
                 {(localHover || isSelected) && (
                    <div className="absolute top-1.5 right-1.5 flex gap-1 z-10 bg-white/80 backdrop-blur-sm rounded-full px-1 py-0.5">
                        <ButtonComponent
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "text-gray-500 hover:text-yellow-500 hover:bg-yellow-100 w-6 h-6",
                                item.starred && "text-yellow-400 fill-yellow-400"
                            )}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card selection
                                onStar(item.id);
                            }}
                        >
                            <Star className="w-3.5 h-3.5" />
                        </ButtonComponent>
                        <ButtonComponent
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-blue-500 hover:bg-blue-100 w-6 h-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(item.id);
                            }}
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </ButtonComponent>
                        <ButtonComponent
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-red-500 hover:bg-red-100 w-6 h-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </ButtonComponent>
                    </div>
                )}
                {/* Selection Indicator */}
                {isSelected && (
                    <div className="absolute inset-0 border-2 border-black rounded-xl pointer-events-none"></div>
                    // <CheckCircle className="absolute top-2 left-2 text-white bg-black rounded-full w-5 h-5 p-0.5 z-10" />
                )}
            </CardComponent>
        </motion.div>
    );
};


// ===============================
// Main Component
// ===============================

const BentoApp = () => {
    // ===============================
    // State
    // ===============================

    const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for desktop collapse
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    // const [hoveredCardId, setHoveredCardId] = useState<string | null>(null); // Removed, using local hover state in BentoCard
    const [fabOpen, setFabOpen] = useState(false);
    const [bentoItems, setBentoItems] = useState<BentoItem[]>(INITIAL_BENTO_ITEMS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newBentoType, setNewBentoType] = useState<FABItem | null>(null);
    const [newBentoContent, setNewBentoContent] = useState(''); // For text area
    const [newBentoUrl, setNewBentoUrl] = useState(''); // For URLs (image, video, link, etc.)

    // Drag & Drop State
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const dragItemNode = useRef<HTMLDivElement | null>(null);
    const dragOverItemNode = useRef<HTMLDivElement | null>(null);


    // ===============================
    // Refs
    // ===============================
    const mainContentRef = useRef<HTMLDivElement>(null);
    const tagBarRef = useRef<HTMLDivElement>(null); // Ref for tag bar

    // ===============================
    // Effects
    // ===============================

    // Close FAB when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const fabButton = document.getElementById("fab-button");
            const fabMenu = document.getElementById("fab-menu");
            // Add check for the new header create button
            const headerCreateButton = document.getElementById("header-create-button");

            if (
                fabOpen &&
                event.target instanceof Node &&
                !fabButton?.contains(event.target) &&
                !fabMenu?.contains(event.target) &&
                !headerCreateButton?.contains(event.target) // Ensure clicking header create doesn't close menu if open
            ) {
                setFabOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [fabOpen]);

    // Close Sidebar on mobile when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById("sidebar");
            const menuButton = document.getElementById("menu-button"); // Mobile menu button

             if (
                sidebarOpen && // Only if mobile sidebar is open
                window.innerWidth < 768 && // Only on mobile
                event.target instanceof Node &&
                !sidebar?.contains(event.target) &&
                !menuButton?.contains(event.target)
            ) {
                setSidebarOpen(false); // Close mobile sidebar
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]) // Depend only on sidebarOpen for mobile

    // ===============================
    // Handlers
    // ===============================

    // Toggle mobile sidebar visibility
    const toggleMobileSidebar = () => setSidebarOpen(!sidebarOpen);
    // Toggle desktop sidebar collapse state
    const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

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


    // Handle item selection with Shift key for range selection
    const handleSelectItem = (id: string, shiftKey: boolean) => {
        setSelectedItems(prevSelected => {
            const lastSelected = prevSelected[prevSelected.length - 1];
            // Ensure filteredItems is used for indexing, as bentoItems might have a different order
            // Recalculate currentFilteredItems based on current state (search/tags)
            const currentFilteredItems = bentoItems.filter(item => {
                // Tag Filter (Placeholder - NEEDS ACTUAL IMPLEMENTATION if tags are stored on items)
                const matchesTag = !selectedTag || true; // Replace 'true' with actual tag checking logic

                // Search Filter
                const searchTermLower = searchTerm.toLowerCase();
                let contentString = '';
                if (typeof item.content === 'string') {
                    contentString = item.content.toLowerCase();
                } else if (item.url) {
                    contentString += item.url.toLowerCase();
                }
                // Add rudimentary search within simple React node structures
                try {
                    if (React.isValidElement(item.content)) {
                         React.Children.forEach(item.content.props.children, child => {
                             if (typeof child === 'string') {
                                 contentString += child.toLowerCase();
                             } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
                                  contentString += child.props.children.toLowerCase();
                             }
                         });
                    }
                } catch (e) { /* Ignore errors */ }
                const matchesSearch = !searchTerm || contentString.includes(searchTermLower);

                return matchesTag && matchesSearch;
            });


            const currentIndex = currentFilteredItems.findIndex(item => item.id === id);
            if (currentIndex === -1) return prevSelected; // Item not in current filter

            if (shiftKey && lastSelected && prevSelected.length > 0) {
                const lastIndex = currentFilteredItems.findIndex(item => item.id === lastSelected);
                if (lastIndex === -1) { // Last selected not in current view, treat as single select
                     return prevSelected.includes(id) ? prevSelected.filter(i => i !== id) : [...prevSelected, id];
                }

                const start = Math.min(currentIndex, lastIndex);
                const end = Math.max(currentIndex, lastIndex);
                const rangeIds = currentFilteredItems.slice(start, end + 1).map(item => item.id);
                // Combine previous selection with the new range, removing duplicates
                return [...new Set([...prevSelected, ...rangeIds])];
            } else {
                // Toggle single item selection
                return prevSelected.includes(id)
                    ? prevSelected.filter(i => i !== id)
                    : [...prevSelected, id];
            }
        });
    };


    const clearSelection = () => setSelectedItems([]);

    const handleCreateBento = (fabItem: FABItem) => {
        setNewBentoType(fabItem);
        setIsCreating(true);
        setFabOpen(false); // Close FAB menu
        setNewBentoContent(''); // Reset content fields
        setNewBentoUrl('');
    };

    // Handler to toggle the FAB menu (used by header button and main FAB)
    const toggleFabMenu = () => {
        setFabOpen(!fabOpen);
    }

    const cancelCreateBento = () => {
        setIsCreating(false);
        setNewBentoType(null);
        setNewBentoContent('');
        setNewBentoUrl('');
    };

    const addBentoItem = () => {
        if (!newBentoType) return;

        let content: React.ReactNode;
        let className = "bg-white"; // Default background
        let type = newBentoType.type;
        let url = newBentoUrl || undefined; // Use url state
        let starred = false;

        // Basic validation
        if (['image', 'audio', 'video', 'link', 'youtube'].includes(type) && !newBentoUrl) {
            // Use a non-blocking notification instead of alert if possible
            console.warn(`Please enter a valid URL for the ${newBentoType.label}.`);
            // Optionally show a user-friendly message in the UI
            return;
        }
         if (type === 'text' && !newBentoContent) {
            console.warn(`Please enter some text content.`);
             // Optionally show a user-friendly message in the UI
            return;
        }

        // Create content based on type
        switch (type) {
            case 'text':
                content = <p className="whitespace-pre-wrap break-words">{newBentoContent}</p>;
                // Assign random pastel background
                const colors = ['bg-yellow-100', 'bg-pink-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'];
                className = colors[Math.floor(Math.random() * colors.length)];
                url = undefined; // Text doesn't have a primary URL in this model
                break;
            case 'image':
                content = (
                    <>
                        <img src={newBentoUrl} alt="User uploaded" className="w-full h-40 object-cover rounded-t-lg" onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x300/CCCCCC/999999?text=Invalid+URL')}/>
                        {/* Optionally add a caption input later */}
                    </>
                );
                className = "bg-gray-200 overflow-hidden"; // Background for image container
                break;
            case 'youtube':
                 // Extract video ID from various YouTube URL formats
                let videoId = '';
                try {
                    const urlObj = new URL(newBentoUrl);
                     // Handles youtube.com/watch?v=VIDEO_ID, youtu.be/VIDEO_ID, youtube.com/embed/VIDEO_ID
                    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname === 'youtu.be') {
                         videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop() || '';
                         // Remove potential extra params from ID if path was used
                         videoId = videoId.split('&')[0];
                    }
                } catch (e) {
                    console.error("Error parsing YouTube URL:", e);
                 }

                if (!videoId) {
                     console.warn("Could not extract YouTube video ID. Please use a valid YouTube video URL.");
                     // Optionally show a user-friendly message in the UI
                     return;
                }

                content = (
                    <iframe
                        width="100%"
                        height="200" // Adjust height as needed
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="rounded-lg block" // Added block
                    />
                );
                className = "bg-black p-1 rounded-lg"; // Dark background for video
                break;
             case 'video': // Generic video - could be improved
                content = (
                     <video controls width="100%" className="rounded-lg block" src={newBentoUrl}>
                        Your browser does not support the video tag.
                    </video>
                );
                className = "bg-black p-1 rounded-lg";
                break;
            case 'audio':
                content = (
                    <audio controls className="w-full h-10" src={newBentoUrl}>
                        Your browser does not support the audio element.
                    </audio>
                );
                className = "bg-gray-100 p-2 rounded-lg";
                break;
            case 'link':
                 let linkText = newBentoUrl; // Default to URL
                 try {
                     linkText = new URL(newBentoUrl).hostname; // Try to get hostname
                 } catch { /* Ignore invalid URL for text generation */ }
                content = (
                    <a href={newBentoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all font-medium">
                        {linkText}
                    </a>
                );
                className = "bg-blue-50 p-4 rounded-lg";
                break;
            case 'drawing':
                // Placeholder for drawing - requires canvas implementation
                content = <p className="text-center text-gray-500">[Drawing Canvas Placeholder]</p>;
                className = "bg-gray-50 border-dashed border-2 border-gray-300";
                url = undefined;
                break;
            default:
                content = <p>Unsupported type</p>;
        }

        const newItem: BentoItem = {
            id: crypto.randomUUID(),
            content,
            className: `${className} p-3`, // Add default padding here
            type,
            starred,
            url // Store the URL
        };

        // Add to the beginning of the list
        setBentoItems((prev) => [newItem, ...prev]);
        cancelCreateBento(); // Close modal and reset state
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

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
         // console.log('Drag Start:', id);
         setDraggedItemId(id);
         dragItemNode.current = e.currentTarget; // Store the node being dragged
         e.dataTransfer.effectAllowed = 'move';
         e.dataTransfer.setData('text/plain', id); // Set data for transfer
         // Add dragging style class immediately
         e.currentTarget.classList.add('opacity-50', 'scale-95', 'cursor-grabbing');
         // Use setTimeout only if direct class manipulation isn't working reliably
         // setTimeout(() => {
         //     e.currentTarget.classList.add('opacity-50', 'scale-95');
         // }, 0);
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


    // ===============================
    // Filtered Items (Memoize if performance becomes an issue)
    // ===============================
    // This calculation should ideally be memoized using useMemo if it becomes complex or slow
    const filteredItems = bentoItems.filter(item => {
        // Tag Filter (Placeholder - NEEDS ACTUAL IMPLEMENTATION if tags are stored on items)
        // This currently filters based on the *selectedTag* state, but the items themselves don't have tags yet.
        // You would need to add a `tags: string[]` property to BentoItem and check against that.
        const matchesTag = !selectedTag || true; // Replace 'true' with actual tag checking logic e.g., item.tags?.includes(selectedTag)

        // Search Filter
        const searchTermLower = searchTerm.toLowerCase();
        let contentString = '';
        if (typeof item.content === 'string') {
            contentString = item.content.toLowerCase();
        } else if (item.url) {
            // Include URL in search
            contentString += item.url.toLowerCase();
        }
        // Add rudimentary search within simple React node structures (e.g., text in <p>, <strong>)
        try {
            if (React.isValidElement(item.content)) {
                 React.Children.forEach(item.content.props.children, child => {
                     if (typeof child === 'string') {
                         contentString += child.toLowerCase();
                     } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
                          contentString += child.props.children.toLowerCase();
                     }
                 });
            }
        } catch (e) { /* Ignore errors during simple search */ }

        const matchesSearch = !searchTerm || contentString.includes(searchTermLower);

        return matchesTag && matchesSearch;
    });

    // ===============================
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
                        id="menu-button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleMobileSidebar} // Use mobile handler
                        className="md:hidden text-gray-600 hover:bg-gray-200"
                    >
                        <Menu className="w-5 h-5" />
                    </ButtonComponent>
                    <span className="font-bold text-lg tracking-tight">BENTO</span>
                </div>

                {/* Center Section: Search Bar */}
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
                        id="header-create-button"
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
                    <div className="h-full overflow-y-auto overflow-x-hidden pb-4"> {/* Hide horizontal overflow */}
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
                    </div>
                </aside>

                {/* Main Area (Tag Bar + Content) */}
                {/* REMOVED conditional margin classes */}
                <div className="flex-1 flex flex-col overflow-hidden">
                     {/* Tag Filter Bar */}
                     <div
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
                     </div>
                    {/* End Tag Filter Bar */}

                    {/* Main Content Grid Area */}
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
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4 md:p-6"
                            onDragOver={handleDragOver} // Add DragOver handler to the container
                        >
                            {/* AnimatePresence for add/delete animations */}
                            <AnimatePresence>
                                {filteredItems.map((item) => (
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
                                            onSelect={handleSelectItem}
                                            isHovered={false} // Hover state managed internally
                                            onDelete={deleteBentoItem}
                                            onStar={handleStarItem}
                                            onShare={handleShareItem}
                                        />
                                    </div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </main> {/* End Main Content Grid Area */}
                </div> {/* End Main Area */}


                {/* Floating Action Button (FAB) */}
                <div className="fixed bottom-6 right-6 z-40">
                    <div className="relative flex flex-col items-center">
                        {/* FAB Menu Items - Adjusted Alignment */}
                        <AnimatePresence>
                            {fabOpen && (
                                <motion.div
                                    id="fab-menu"
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="absolute bottom-16 right-0 flex flex-col items-end gap-3" // Use items-end for alignment
                                >
                                    {FAB_ITEMS.map((item) => (
                                        // Each item container uses flex and justify-end
                                        <div key={item.label} className="flex items-center justify-end gap-2 group w-full">
                                            {/* Tooltip */}
                                            <span className="bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap order-1"> {/* Order tooltip first visually */}
                                                {item.label}
                                            </span>
                                            {/* Button */}
                                            <ButtonComponent
                                                size="icon"
                                                className="bg-white rounded-full shadow-lg w-10 h-10 border hover:bg-gray-100 hover:scale-110 transition-transform order-2" // Order button second
                                                onClick={() => handleCreateBento(item)}
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
                <AnimatePresence>
                    {isCreating && newBentoType && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" // Darker backdrop
                            onClick={cancelCreateBento} // Click outside to cancel
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <newBentoType.icon className="w-5 h-5 mr-2 text-gray-600" />
                                        <h3 className="text-lg font-semibold">New {newBentoType.label} Item</h3>
                                    </div>
                                    <ButtonComponent variant="ghost" size="icon" onClick={cancelCreateBento} className="text-gray-400 hover:bg-gray-100 w-7 h-7">
                                         <XCircle className="w-5 h-5" />
                                    </ButtonComponent>
                                </div>


                                {/* Input fields based on type */}
                                {newBentoType.type === 'text' ? (
                                    <TextareaComponent
                                        placeholder="Enter your text here..."
                                        value={newBentoContent}
                                        onChange={(e) => setNewBentoContent(e.target.value)}
                                        className="w-full min-h-[100px] mb-4 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        autoFocus
                                    />
                                ) : newBentoType.type === 'drawing' ? (
                                     <div className="text-center text-gray-500 p-4 border rounded-lg mb-4">
                                        Drawing canvas not implemented yet.
                                    </div>
                                ) : (
                                    <InputComponent
                                        type="url"
                                        placeholder={`Enter URL for ${newBentoType.label}... (e.g., https://...)`}
                                        value={newBentoUrl}
                                        onChange={(e) => setNewBentoUrl(e.target.value)}
                                        className="w-full mb-4 h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        autoFocus
                                    />
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 mt-2"> {/* Added margin top */}
                                    <ButtonComponent
                                        variant="ghost"
                                        onClick={cancelCreateBento}
                                        className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </ButtonComponent>
                                    <ButtonComponent
                                        onClick={addBentoItem}
                                        className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md"
                                        disabled={newBentoType.type === 'drawing' || (newBentoType.type === 'text' && !newBentoContent) || (newBentoType.type !== 'text' && newBentoType.type !== 'drawing' && !newBentoUrl) } // Disable if required field empty
                                    >
                                        Add Item
                                    </ButtonComponent>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div> {/* End Flex Container */}
        </div> // End Full App Container
    );
};

export default BentoApp; // Add the default export
