import { useState } from "react";

export const useSidebarState = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for desktop collapse

    // Toggle mobile sidebar visibility
    const toggleMobileSidebar = () => setSidebarOpen(!sidebarOpen);

    return {
        sidebarOpen,
        isSidebarCollapsed,
        toggleMobileSidebar,
    };
};

export default useSidebarState;