import { useState, useEffect } from "react";

const useFabMenuState = () => {
    const [fabOpen, setFabOpen] = useState(false);

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

    const toggleFabMenu = () => {
        setFabOpen(!fabOpen);
    };

    return {
        fabOpen,
        toggleFabMenu,
    };
};

export default useFabMenuState;