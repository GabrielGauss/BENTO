import React from "react";
import { PenTool, Image, Music, Video, Link as LinkIcon, Brush, Youtube } from "lucide-react";
import { BentoItem, FABItem } from "@/types/bento";

const FAB_ITEMS: FABItem[] = [
    { icon: PenTool, label: "Text", type: 'text' },
    { icon: Image, label: "Image", type: 'image' },
    { icon: Music, label: "Audio", type: 'audio' },
    { icon: Video, label: "Video", type: 'video' },
    { icon: LinkIcon, label: "Link", type: 'link' },
    { icon: Brush, label: "Drawing", type: 'drawing' },
    { icon: Youtube, label: "YouTube", type: 'youtube' },
];

const INITIAL_TAGS = ["Inspo", "Work", "Play", "Quotes", "Ideas", "Travel", "Recipes", "Links"];

const INITIAL_BENTO_ITEMS: BentoItem[] = [
    {
        id: '1',
        content: "Don’t forget meeting at 3 PM",
        className: "bg-yellow-100",
        type: 'text',
        starred: false
    },
    {
        id: '2',
        content: (
            <>
                <strong className="block mb-1">Morning Dump</strong>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                    <li>Feeling kinda blah</li>
                    <li>Need to get some fresh air</li>
                    <li>Work on project</li>
                </ul>
            </>
        ),
        className: "bg-pink-100",
        type: 'text',
        starred: false
    },
    {
        id: '3',
        content: (
            <>
                Suggestions<br />
                <span className="text-xs text-gray-600">Add to your journal?</span>
            </>
        ),
        className: "bg-orange-100",
        type: 'text',
        starred: false
    },
    {
        id: '4',
        content: (
            <>
                <img
                    src="https://placehold.co/200x300/E0E0E0/BDBDBD?text=Image"
                    alt="Placeholder image"
                    className="w-full h-32 object-cover rounded-t-lg"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x300/CCCCCC/999999?text=Error')}
                />
                <div className="text-center text-xs py-2 font-medium">Today</div>
            </>
        ),
        url: "https://placehold.co/200x300",
        className: "bg-white overflow-hidden",
        type: 'image',
        starred: false
    },
    {
        id: '5',
        content: (
            <>
                <strong className="block mb-1">Project Brainstorm</strong>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                    <li>Initial Ideas</li>
                    <li>Research</li>
                    <li>Sketches</li>
                </ul>
            </>
        ),
        className: "bg-blue-100",
        type: 'text',
        starred: false
    },
    {
        id: '6',
        content: (
            <iframe
                width="100%"
                height="200"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg block"
            />
        ),
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        className: "bg-gray-900 p-1 rounded-lg",
        type: 'youtube',
        starred: false
    },
    {
        id: '7',
        content: (
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                React Documentation
            </a>
        ),
        url: "https://react.dev",
        className: "bg-green-100 p-4 rounded-lg",
        type: 'link',
        starred: false
    },
    {
        id: '8',
        content: (
            <audio controls className="w-full h-10">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        ),
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        className: "bg-purple-100 p-2 rounded-lg",
        type: 'audio',
        starred: false
    },
];

export { FAB_ITEMS, INITIAL_TAGS, INITIAL_BENTO_ITEMS };