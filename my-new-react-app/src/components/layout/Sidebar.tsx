import React from "react";
import {
    Home,
    Star,
    Folder,
    Share2,
    FileText,
    FolderPlus,
    Clock,
    ThumbsUp,
    Trash2,
    Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ButtonComponent } from "@/components/ui/Button"; // Assuming ButtonComponent is exported
import { SidebarButton } from "@/components/common/SidebarButton"; // Assuming SidebarButton is in common

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean; // Added isCollapsed prop
    selectedTag: string | null; // Assuming tag selection affects sidebar
    clearTag: () => void; // Assuming clear tag affects sidebar
    // Add other prop types for navigation handlers if needed
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    isCollapsed,
    selectedTag,
    clearTag,
}) => {
    // Use useEffect here if you need to handle closing on mobile resize or similar effects

    return (
        <aside
            id="sidebar"
            className={cn(
                "bg-black border-r border-gray-700 shadow-md z-20 flex-shrink-0",
                "transition-all duration-300 ease-in-out", // Use transition-all for width and transform
                // Mobile State (Overlay)
                "fixed md:static top-14 bottom-0", // Fixed on mobile, static on desktop
                isOpen ? "translate-x-0" : "-translate-x-full", // Mobile slide in/out
                // Desktop State (Collapse)
                "md:translate-x-0", // Ensure visible on desktop
                isCollapsed ? "md:w-16" : "md:w-60" // Desktop collapse width
            )}
        >
            {/* Sidebar Content */}
            <div className="h-full overflow-y-auto overflow-x-hidden pb-4">
                {" "}
                {/* Hide horizontal overflow */}
                {/* Pass collapsed state to buttons */}
                <div className="p-3 space-y-1">
                    <SidebarButton
                        icon={Home}
                        label="Home"
                        isActive={!selectedTag} // Simplified active state logic
                        onClick={clearTag}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarButton icon={Star} label="Favorites" isCollapsed={isCollapsed} />
                    <SidebarButton icon={Folder} label="Collections" isCollapsed={isCollapsed} />
                    <SidebarButton icon={Share2} label="Shared with me" isCollapsed={isCollapsed} />
                </div>
                <hr
                    className={cn("my-2 border-gray-700", isCollapsed ? "mx-1" : "mx-3")}
                />{" "}
                {/* Adjust HR margin */}icons Clock for "Recently Opened", ThumbsUp for "Liked Items", Trash2 for "Trash", and Settings for "Settings".
                <div className="p-3 space-y-1">
                    <SidebarButton icon={Clock} label="Recently Opened" isCollapsed={isCollapsed} />
                    <SidebarButton icon={FolderPlus} label="Drafts" isCollapsed={isCollapsed} />
                    <SidebarButton icon={Clock} label="Recently Opened" isCollapsed={isCollapsed} />
                    <SidebarButton icon={ThumbsUp} label="Liked Items" isCollapsed={isCollapsed} />
                    <SidebarButton icon={Trash2} label="Trash" isCollapsed={isCollapsed} />
                </div>
                <hr
                    className={cn("my-2 border-gray-700", isCollapsed ? "mx-1" : "mx-3")}
                />{" "}
                {/* Adjust HR margin */}
                <div className="p-3 space-y-1">
                    <SidebarButton icon={Settings} label="Settings" isCollapsed={isCollapsed} />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;