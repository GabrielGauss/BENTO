import React from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Menu, Search, Plus, Bell, User, MoreVertical } from "lucide-react";

interface HeaderProps {
    toggleMobileSidebar: () => void;
    toggleSidebarCollapse: () => void;
    toggleFabMenu: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const HEADER_BG = "bg-[#fcf9f6]";
const HEADER_HOVER_BG = "hover:bg-[#f3ede7]";
const HEADER_BORDER = "border-[#e5ded6]";

const Header: React.FC<HeaderProps> = ({
    toggleMobileSidebar,
    toggleSidebarCollapse,
    toggleFabMenu,
    searchTerm,
    setSearchTerm,
}) => {
    return (
        <header className={`sticky top-0 z-30 w-full h-24 flex items-center justify-between px-16 py-4 ${HEADER_BG} border-b ${HEADER_BORDER}`}> {/* px-16, py-4, h-24 for generous padding */}
            <div className="flex items-center gap-x-16 flex-shrink-0"> {/* gap-x-16 for main section spacing */}
                <div className="flex items-center gap-4">
                    <Button
                        id="desktop-menu-button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleSidebarCollapse}
                        className={`hidden md:inline-flex text-gray-400 ${HEADER_BG} ${HEADER_HOVER_BG} rounded-full px-4 py-3 border-none`}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <Button
                        id="menu-button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleMobileSidebar}
                        className={`md:hidden text-gray-400 ${HEADER_BG} ${HEADER_HOVER_BG} rounded-full px-4 py-3 border-none`}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <span className="font-extrabold text-2xl tracking-tight ml-2">BENTO</span>
                </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 flex justify-center min-w-0 items-center">
                <div className="relative w-full max-w-2xl flex items-center">
                    <Input
                        className={`pl-14 pr-8 text-lg w-full h-16 rounded-full ${HEADER_BG} placeholder-gray-400 focus:ring-0 border ${HEADER_BORDER} shadow-none`}
                        placeholder="Search your bento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ backgroundColor: '#fcf9f6' }}
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 pointer-events-none" />
                </div>
            </div>

            {/* Right: Create + Icons */}
            <div className="flex items-center gap-x-16 flex-shrink-0"> {/* gap-x-16 for main section spacing */}
                <Button
                    id="header-create-button"
                    onClick={toggleFabMenu}
                    className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-4 rounded-full h-16 flex items-center font-bold border-none"
                >
                    <Plus className="w-6 h-6 mr-2" /> Create
                </Button>
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" className={`text-gray-400 ${HEADER_BG} ${HEADER_HOVER_BG} rounded-full px-4 py-3 border-none`}>
                        <Bell className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className={`text-gray-400 ${HEADER_BG} ${HEADER_HOVER_BG} rounded-full px-4 py-3 border-none`}>
                        <User className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className={`text-gray-400 ${HEADER_BG} ${HEADER_HOVER_BG} rounded-full px-4 py-3 border-none`}>
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;