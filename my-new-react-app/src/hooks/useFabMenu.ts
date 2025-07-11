import { useState, useEffect, useRef } from "react";

const useFabMenuState = () => {
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null); // Ref for the FAB container

  const toggleFabMenu = () => {
    setFabOpen(!fabOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Use the ref to check if the click was outside the FAB container
      if (fabOpen && fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setFabOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fabOpen, fabRef]); // Include fabRef in dependencies

  return { fabOpen, toggleFabMenu, fabRef }; // Return fabRef as well
};

export default useFabMenuState;