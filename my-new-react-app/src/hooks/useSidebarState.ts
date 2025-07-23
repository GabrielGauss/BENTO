import { useState } from "react";

export const useSidebarState = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for desktop collapse

    // Toggle mobile sidebar visibility
    const toggleMobileSidebar = () => setSidebarOpen(!sidebarOpen);
    // Toggle desktop sidebar collapse
    const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

    return {
        sidebarOpen,
        isSidebarCollapsed,
        toggleMobileSidebar,
        toggleSidebarCollapse,
    };
};

export default useSidebarState;