import React from "react";
import {
    Home,
    Star,
    Folder,
    Share2,
    FolderPlus,
    Clock,
    ThumbsUp,
    Trash2,
    Settings,
} from "lucide-react";
import { cn } from "../../utils/cn";
import SidebarButton from "../common/SidebarButton";

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    selectedTag: string | null;
    clearTag: () => void;
    className?: string;
    onNavigate?: (destination: string) => void; // Optional navigation handler
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    isCollapsed,
    selectedTag,
    clearTag,
    onNavigate = () => {},
}) => {
    // Define sidebar sections with their items
    const sidebarSections = [
        {
            items: [
                {
                    icon: Home,
                    label: "Home",
                    isActive: !selectedTag,
                    onClick: clearTag,
                },
                {
                    icon: Star,
                    label: "Favorites",
                    onClick: () => onNavigate("favorites"),
                },
                {
                    icon: Folder,
                    label: "Collections",
                    onClick: () => onNavigate("collections"),
                },
                {
                    icon: Share2,
                    label: "Shared with me",
                    onClick: () => onNavigate("shared"),
                },
            ],
        },
        {
            items: [
                {
                    icon: Clock,
                    label: "Recently Opened",
                    onClick: () => onNavigate("recent"),
                },
                {
                    icon: FolderPlus,
                    label: "Drafts",
                    onClick: () => onNavigate("drafts"),
                },
                {
                    icon: ThumbsUp,
                    label: "Liked Items",
                    onClick: () => onNavigate("liked"),
                },
                {
                    icon: Trash2,
                    label: "Trash",
                    onClick: () => onNavigate("trash"),
                },
            ],
        },
        {
            items: [
                {
                    icon: Settings,
                    label: "Settings",
                    onClick: () => onNavigate("settings"),
                },
            ],
        },
    ];

    return (
        <aside
            id="sidebar"
            className={cn(
                "bg-[#23272f] border-r border-gray-700 shadow-lg z-20 shrink-0 rounded-r-2xl font-[Inter,sans-serif]",
                "transition-all duration-300 ease-in-out",
                "fixed md:static top-14 bottom-0",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "md:translate-x-0",
                isCollapsed ? "md:w-16" : "md:w-60"
            )}
            aria-label="Main navigation"
        >
            <nav className="h-full overflow-y-auto overflow-x-hidden pb-4">
                {sidebarSections.map((section, sectionIndex) => (
                    <React.Fragment key={`section-${sectionIndex}`}>
                        <div className="p-3 space-y-1">
                            {section.items.map((item) => (
                                <SidebarButton
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={!!item.isActive}
                                    onClick={item.onClick}
                                    isCollapsed={isCollapsed}
                                    aria-current={item.isActive ? "page" : undefined}
                                />
                            ))}
                        </div>
                        {sectionIndex < sidebarSections.length - 1 && (
                            <hr
                                className={cn(
                                    "my-2 border-gray-700",
                                    isCollapsed ? "mx-1" : "mx-3"
                                )}
                                aria-hidden="true"
                            />
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </aside>
    );
};

export default React.memo(Sidebar);