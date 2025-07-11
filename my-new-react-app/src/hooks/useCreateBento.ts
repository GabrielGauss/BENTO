import React, { useState } from "react";
import { type ClassValue } from "clsx";

import { BentoItem, FABItem } from "@/types";


const useCreateBento = (
    bentoItems: BentoItem[],
    toggleFabMenu?: () => void // Optional toggleFabMenu
    setBentoItems: React.Dispatch<React.SetStateAction<BentoItem[]>>
) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newBentoType, setNewBentoType] = useState<FABItem | null>(null);
    const [newBentoContent, setNewBentoContent] = useState('');
    const [newBentoUrl, setNewBentoUrl] = useState('');

    const handleCreateBento = (fabItem: FABItem) => {
        setNewBentoType(fabItem);
        setIsCreating(true);
        if (toggleFabMenu) {
            toggleFabMenu(); // Close the FAB menu when creating a new item
        }
        setNewBentoContent(''); // Reset content fields
        setNewBentoUrl('');
    };

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
            console.warn(`Please enter a valid URL for the ${newBentoType.label}.`);
            return;
        }
         if (type === 'text' && !newBentoContent) {
            console.warn(`Please enter some text content.`);
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
                        Your browser does not support the video tag.\r
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

    return {
        isCreating,
        newBentoType,
        newBentoContent,
        newBentoUrl,
        handleCreateBento,
        cancelCreateBento,
        addBentoItem,
        setNewBentoContent, // Return setters so parent can bind input values
        setNewBentoUrl,
    };
};

export default useCreateBento;