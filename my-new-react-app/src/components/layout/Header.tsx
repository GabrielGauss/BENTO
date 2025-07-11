import React from "react";
import { Menu, Search, Bell, User, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn is in src/lib/utils

// Assuming these components will be created in @/components/ui/
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Use mocks if originals are not found
// This pattern is kept for now, assuming components might be mocks
const InputComponent = typeof Input === 'undefined' ? MockInput : Input;
const ButtonComponent = typeof Button === 'undefined' ? MockButton : Button;


interface HeaderProps {
    toggleMobileSidebar: () => void;
    toggleSidebarCollapse: () => void;
    toggleFabMenu: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    toggleMobileSidebar,
    toggleSidebarCollapse,
    toggleFabMenu,
    searchTerm,
    setSearchTerm,
}) => {
    return (
        <header className="w-full h-14 flex-shrink-0 flex items-center justify-between px-4 bg-[#fcf9f6]/80 backdrop-blur-sm border-b border-gray-200 shadow-sm z-30">
            {/* Left Section: Menu Toggles and Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop Menu Button - Toggles Collapse */}
                <ButtonComponent
                    id="desktop-menu-button"
                    size="icon"
                    variant="ghost"
                    onClick={toggleSidebarCollapse}
                    className="hidden md:inline-flex text-gray-600 hover:bg-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </ButtonComponent>
                 {/* Mobile Menu Button - Toggles Overlay */}
                <ButtonComponent
                    id="menu-button"
                    size="icon"
                    variant="ghost"
                    onClick={toggleMobileSidebar}
                    className="md:hidden text-gray-600 hover:bg-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </ButtonComponent>
                <span className="font-bold text-lg tracking-tight">BENTO</span>
            </div>

            {/* Center Section: Search Bar */}
             <div className="flex-1 min-w-0 mx-4 flex justify-center">
                <div className="relative w-full max-w-md">
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
            <div className="flex items-center gap-1 flex-shrink-0">
                {/* Create Button */}
                <ButtonComponent
                    id="header-create-button"
                    onClick={toggleFabMenu}
                    className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5 rounded-lg h-8 hidden sm:flex items-center"
                >
                    <Plus className="w-4 h-4 mr-1" /> Create
                </ButtonComponent>

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
    );
};

export default Header;
import React from "react";
import { Menu, Search, Bell, User, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn is in src/lib/utils

// Assuming these components will be created in @/components/ui/
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Use mocks if originals are not found
// This pattern is kept for now, assuming components might be mocks
const InputComponent = typeof Input === 'undefined' ? MockInput : Input;
const ButtonComponent = typeof Button === 'undefined' ? MockButton : Button;


interface HeaderProps {
    toggleMobileSidebar: () => void;
    toggleSidebarCollapse: () => void;
    toggleFabMenu: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    toggleMobileSidebar,
    toggleSidebarCollapse,
    toggleFabMenu,
    searchTerm,
    setSearchTerm,
}) => {
    return (
        <header className="w-full h-14 flex-shrink-0 flex items-center justify-between px-4 bg-[#fcf9f6]/80 backdrop-blur-sm border-b border-gray-200 shadow-sm z-30">
            {/* Left Section: Menu Toggles and Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop Menu Button - Toggles Collapse */}
                <ButtonComponent
                    id="desktop-menu-button"
                    size="icon"
                    variant="ghost"
                    onClick={toggleSidebarCollapse}
                    className="hidden md:inline-flex text-gray-600 hover:bg-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </ButtonComponent>
                 {/* Mobile Menu Button - Toggles Overlay */}
                <ButtonComponent
                    id="menu-button"
                    size="icon"
                    variant="ghost"
                    onClick={toggleMobileSidebar}
                    className="md:hidden text-gray-600 hover:bg-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </ButtonComponent>
                <span className="font-bold text-lg tracking-tight">BENTO</span>
            </div>

            {/* Center Section: Search Bar */}
             <div className="flex-1 min-w-0 mx-4 flex justify-center">
                <div className="relative w-full max-w-md">
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
            <div className="flex items-center gap-1 flex-shrink-0">
                {/* Create Button */}
                <ButtonComponent
                    id="header-create-button"
                    onClick={toggleFabMenu}
                    className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5 rounded-lg h-8 hidden sm:flex items-center"
                >
                    <Plus className="w-4 h-4 mr-1" /> Create
                </ButtonComponent>

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
    );
};

export default Header;