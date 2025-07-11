import React from "react";

interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: BentoItem['type'];
}

interface BentoItem {
    id: string;
    content: React.ReactNode;
    className: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'link' | 'drawing' | 'youtube';
    starred?: boolean;
    url?: string;
}