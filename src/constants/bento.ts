import { PenTool, Image, Music, Video, Link as LinkIcon, Brush, Youtube } from "lucide-react";
import type { BentoItem, FABItem } from "../types/bento";

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
        content: "Don't forget meeting at 3 PM",
        className: "bg-yellow-100",
        type: 'text',
        starred: false
    },
    {
        id: '2',
        content: "Morning Dump\n• Feeling kinda blah\n• Need to get some fresh air\n• Work on project",
        className: "bg-pink-100",
        type: 'text',
        starred: false
    },
    {
        id: '3',
        content: "Suggestions\nAdd to your journal?",
        className: "bg-orange-100",
        type: 'text',
        starred: false
    },
    {
        id: '4',
        content: "Image placeholder",
        url: "https://placehold.co/200x300",
        className: "bg-white overflow-hidden",
        type: 'image',
        starred: false
    },
    {
        id: '5',
        content: "Project Brainstorm\n• Initial Ideas\n• Research\n• Sketches",
        className: "bg-blue-100",
        type: 'text',
        starred: false
    },
    {
        id: '6',
        content: "YouTube Video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        className: "bg-gray-900 p-1 rounded-lg",
        type: 'youtube',
        starred: false
    },
    {
        id: '7',
        content: "React Documentation",
        url: "https://react.dev",
        className: "bg-green-100 p-4 rounded-lg",
        type: 'link',
        starred: false
    },
    {
        id: '8',
        content: "Audio File",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        className: "bg-purple-100 p-2 rounded-lg",
        type: 'audio',
        starred: false
    },
];

// Tag color system
export const TAG_COLORS = [
  { name: 'blue', bg: '#e6f3ff', text: '#1e40af', border: '#3b82f6' },
  { name: 'green', bg: '#e6ffe6', text: '#166534', border: '#22c55e' },
  { name: 'purple', bg: '#f3e6ff', text: '#7c3aed', border: '#a855f7' },
  { name: 'orange', bg: '#fff0e6', text: '#ea580c', border: '#f97316' },
  { name: 'pink', bg: '#ffe6f7', text: '#be185d', border: '#ec4899' },
  { name: 'yellow', bg: '#fffbe6', text: '#a16207', border: '#eab308' },
  { name: 'red', bg: '#ffe6e6', text: '#dc2626', border: '#ef4444' },
  { name: 'teal', bg: '#e6fffa', text: '#0f766e', border: '#14b8a6' },
];

// Function to assign colors to tags based on content patterns
export function getTagColor(tag: string, existingTags?: string[]): { name: string; bg: string; text: string; border: string } {
  const tagLower = tag.toLowerCase();
  
  // Pattern-based color assignment
  if (tagLower.includes('work') || tagLower.includes('job') || tagLower.includes('career')) {
    return TAG_COLORS[0]; // blue
  }
  if (tagLower.includes('personal') || tagLower.includes('life') || tagLower.includes('family')) {
    return TAG_COLORS[1]; // green
  }
  if (tagLower.includes('idea') || tagLower.includes('creative') || tagLower.includes('design')) {
    return TAG_COLORS[2]; // purple
  }
  if (tagLower.includes('urgent') || tagLower.includes('important') || tagLower.includes('priority')) {
    return TAG_COLORS[3]; // orange
  }
  if (tagLower.includes('love') || tagLower.includes('heart') || tagLower.includes('romance')) {
    return TAG_COLORS[4]; // pink
  }
  if (tagLower.includes('fun') || tagLower.includes('hobby') || tagLower.includes('game')) {
    return TAG_COLORS[5]; // yellow
  }
  if (tagLower.includes('error') || tagLower.includes('bug') || tagLower.includes('fix')) {
    return TAG_COLORS[6]; // red
  }
  if (tagLower.includes('learn') || tagLower.includes('study') || tagLower.includes('education')) {
    return TAG_COLORS[7]; // teal
  }
  
  // If no pattern match, assign based on existing tags to avoid duplicates
  if (existingTags) {
    const usedColors = new Set(existingTags.map(t => getTagColor(t).name));
    const availableColors = TAG_COLORS.filter(c => !usedColors.has(c.name));
    if (availableColors.length > 0) {
      return availableColors[0];
    }
  }
  
  // Fallback: assign based on tag hash
  const hash = tag.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export { FAB_ITEMS, INITIAL_TAGS, INITIAL_BENTO_ITEMS };