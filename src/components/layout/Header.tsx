import React from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Menu, Search, Bell, User, MoreVertical } from "lucide-react";

interface HeaderProps {
    toggleMobileSidebar: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onCreateBento?: () => void;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    toggleMobileSidebar,
    searchTerm,
    setSearchTerm,
    onCreateBento,
    className = "",
}) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <header
            className={`w-full h-14 flex items-center justify-between px-4 bg-[#fcf9f6]/95 backdrop-blur-sm border-b border-gray-200 shadow-md z-30 ${className}`}
            role="banner"
        >
            {/* Left Section: Menu and Board Name */}
            <div className="flex items-center gap-4">
                {/* Hamburger Menu Button - Controls Sidebar */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileSidebar}
                    className="text-gray-600 hover:text-gray-700"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Board Name */}
                <span className="font-bold text-lg tracking-tight">BENTO</span>
            </div>

            {/* Center Section: Search Bar */}
            <div className="flex-1 min-w-0 mx-4 flex justify-center">
                <div className="relative w-full max-w-md">
                    <label htmlFor="search-input" className="sr-only">
                        Search your bento
                    </label>
                    <Input
                        id="search-input"
                        className="pl-10 text-sm w-full h-9 rounded-full border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        placeholder="Search your bento..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        aria-label="Search"
                    />
                    <Search 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* Right Section: Create Button and Action Icons */}
            <div className="flex items-center gap-2">
                {/* Create Bento Button */}
                <Button
                    variant="default"
                    size="sm"
                    onClick={onCreateBento}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                    aria-label="Create new bento board"
                >
                    +BENTO
                </Button>
                
                {/* User avatar and notifications */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-600 hover:bg-gray-200"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" aria-hidden="true" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-600 hover:bg-gray-200"
                    aria-label="User profile"
                >
                    <User className="w-5 h-5" aria-hidden="true" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600 hover:bg-gray-200 group ml-1"
                    aria-label="More header options"
                >
                    <MoreVertical className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-50">More</span>
                </Button>
            </div>
        </header>
    );
};

export default React.memo(Header);