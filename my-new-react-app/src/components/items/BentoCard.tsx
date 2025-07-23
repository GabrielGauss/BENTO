import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 as TrashIcon, Star as StarIcon, Lock, Unlock } from "lucide-react";
import { cn } from "../../utils/cn";
import type { BentoItem } from "../../types/bento";
import Card from "../ui/Card";
import { PLACEHOLDER_ID } from "../../hooks/useDragAndDrop";

// Utility functions to lighten/darken a hex color and convert to rgba
function lighten(hex: string, percent: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const num = parseInt(c, 16);
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00FF) + Math.round(2.55 * percent);
  let b = (num & 0x0000FF) + Math.round(2.55 * percent);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function darken(hex: string, percent: number) {
  return lighten(hex, -percent);
}
function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const BentoCard = ({
    item,
    isSelected,
    onSelect,
    onDelete,
    onStar,
    onEdit,
    rotation,
    style,
    onTogglePrivate,
}: {
    item: BentoItem;
    isSelected: boolean;
    onSelect: (id: string, shiftKey: boolean) => void;
    onDelete: (id: string) => void;
    onStar: (id: string) => void;
    onEdit: (item: BentoItem) => void;
    rotation?: number;
    style?: React.CSSProperties;
    onTogglePrivate?: (id: string) => void;
}) => {
    const scale = item.scale || 1.7;
    // Map scale to col-span and row-span for a 6-column grid
    let colSpanClass = '';
    let rowSpanClass = '';
    if (scale === 1) { colSpanClass = 'col-span-1'; rowSpanClass = 'row-span-1'; }
    else if (scale === 1.5) { colSpanClass = 'col-span-2'; rowSpanClass = 'row-span-2'; }
    else if (scale === 2) { colSpanClass = 'col-span-3'; rowSpanClass = 'row-span-3'; }
    else if (scale === 2.5) { colSpanClass = 'col-span-4'; rowSpanClass = 'row-span-4'; }
    else if (scale === 3) { colSpanClass = 'col-span-6'; rowSpanClass = 'row-span-6'; }

    // Remove scale from the card itself
    // const cappedScale = Math.min(scale, 2.5);

    const isPrivate = !!item.private;

    if (item.id === PLACEHOLDER_ID) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 0.5, scale: 1.05 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative h-full border-2 border-dashed border-gray-400 bg-gray-100/60 rounded-xl flex items-center justify-center"
                style={{ minHeight: 80 }}
            >
                <span className="text-xs text-gray-400">Drop here</span>
            </motion.div>
        );
    }

    // Add a drag handle overlay for YouTube cards
    const renderContent = () => {
        const mediaScale = item.scale || 1.0;
        if (item.type === 'text' && typeof item.content === 'string') {
            return <p className="whitespace-pre-wrap break-words">{item.content}</p>;
        }
        if (item.type === 'youtube') {
            let url = '';
            if (typeof item.url === 'string') {
                const match = item.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                const videoId = match ? match[1] : '';
                url = videoId ? `https://www.youtube.com/embed/${videoId}` : item.url;
            }
            return (
                <div className="relative w-full" style={{ aspectRatio: '16/9', transform: `scale(${mediaScale})` }}>
                    <iframe
                        src={url}
                        title="YouTube Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full rounded-lg block"
                    />
                </div>
            );
        }
        if (item.type === 'image' && typeof item.url === 'string') {
            return (
                <div className="w-full aspect-[16/9] bg-white rounded-t-lg overflow-hidden flex flex-col items-center justify-center" style={{ transform: `scale(${mediaScale})` }}>
                    <img
                        src={item.url}
                        alt={item.title || 'Bento Image'}
                        className="object-cover w-full h-full"
                    />
                    {item.title && <div className="text-center text-xs py-2 font-medium">{item.title}</div>}
                </div>
            );
        }
        if (item.type === 'audio' && typeof item.url === 'string') {
            return (
                <div className="w-full aspect-[4/1] flex items-center justify-center" style={{ transform: `scale(${mediaScale})` }}>
                    <audio controls className="w-full h-10">
                        <source src={item.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            );
        }
        if (item.type === 'video' && typeof item.url === 'string') {
            return (
                <div className="relative w-full" style={{ aspectRatio: '16/9', transform: `scale(${mediaScale})` }}>
                    <video controls className="absolute top-0 left-0 w-full h-full rounded-lg block">
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }
        if (item.type === 'link' && typeof item.url === 'string') {
            return (
                <div className="flex items-center gap-3">
                    <div>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all font-semibold">
                            {item.title || item.url}
                        </a>
                        <div className="text-xs text-gray-500">{item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                    </div>
                </div>
            );
        }
        return item.content;
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
        className={`relative group min-w-[180px] max-w-[320px] overflow-visible transition-[grid-column,grid-row] duration-300 ${colSpanClass} ${rowSpanClass} ${scale > 1 ? 'z-20' : ''}`}
        style={{
          ...(style || {}),
          transform: `rotate(${rotation}deg)` ,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 #e5e7eb',
          borderRadius: 18,
          background: item.color || '#fffbe6',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <Card
          onClick={(e: React.MouseEvent) => onSelect(item.id, e.shiftKey)}
          className={cn(
            item.className,
            'p-3 rounded-xl shadow text-sm cursor-pointer relative transition-all duration-200 ease-in-out pb-12 min-h-[120px] flex flex-col',
            isSelected
              ? 'ring-2 ring-offset-0 ring-black ring-offset-transparent shadow-md scale-[1.02] border'
              : 'hover:shadow-lg hover:scale-[1.01] hover:border hover:border-gray-300',
            'box-border',
            item.type === 'image' && 'p-0',
            item.type === 'youtube' && 'p-0',
            item.type === 'audio' && 'p-4'
          )}
        >
          {/* Inline Action Bar (show on hover/focus or always for now) */}
          <div className="absolute top-1.5 right-1.5 flex gap-1 z-10 bg-white/80 backdrop-blur-sm rounded-full px-1 py-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity items-center">
            <button title="Edit" className="text-gray-500 hover:text-green-500 w-6 h-6" onClick={e => { e.stopPropagation(); onEdit(item); }}><Edit className="w-4 h-4" /></button>
            <button title="Delete" className="text-gray-500 hover:text-red-500 w-6 h-6" onClick={e => { e.stopPropagation(); onDelete(item.id); }}><TrashIcon className="w-4 h-4" /></button>
            <button title={item.starred ? 'Unfavorite' : 'Favorite'} className="text-gray-500 hover:text-yellow-500 w-6 h-6" onClick={e => { e.stopPropagation(); onStar(item.id); }}><StarIcon className={`w-4 h-4 ${item.starred ? 'text-yellow-400' : ''}`} /></button>
            <div className="relative group/lock">
              <button
                aria-label={isPrivate ? 'Make public' : 'Make private'}
                title={isPrivate ? 'Make public' : 'Make private'}
                className={`w-6 h-6 flex items-center justify-center transition-colors
                  ${isPrivate ? 'text-red-600' : 'text-green-600'}
                  group-hover/lock:text-blue-700
                `}
                onClick={e => {
                  e.stopPropagation();
                  if (typeof onTogglePrivate === 'function') onTogglePrivate(item.id);
                }}
                onMouseEnter={e => e.currentTarget.classList.add('text-blue-700')}
                onMouseLeave={e => e.currentTarget.classList.remove('text-blue-700')}
              >
                {isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 top-8 z-50 bg-black text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover/lock:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {isPrivate ? 'Private (locked)' : 'Public (unlocked)'}
              </span>
            </div>
          </div>
          {/* Card Title */}
          {item.title && <div className="font-bold text-base mb-3 px-3 pt-2 truncate" title={item.title}>{item.title}</div>}
          {/* Content Area */}
          <div className="grow overflow-hidden" style={{ position: 'relative' }}>
            {renderContent()}
          </div>
          {/* Card Comment (for non-text types) */}
          {item.comment && item.type !== 'text' && (
            <div className="mt-3 mb-6 text-xs text-gray-600 italic break-words px-3">{item.comment}</div>
          )}
          {/* Center audio player for audio cards */}
          {item.type === 'audio' && (
            <div className="flex justify-center items-center w-full mt-2 mb-2">
              {item.content}
            </div>
          )}
        </Card>
        {/* Tags Footer - visually integrated, not a sub-card */}
        {item.tags && item.tags.length > 0 && item.showTags !== false && (
          <div className="flex flex-wrap gap-2 px-3 pt-6 pb-1 text-xs font-medium mt-auto">
            {item.tags.map(tag => {
              const base = item.color || '#f4f1ed';
              // bg: 80% opacity of lighter card color
              const bg = hexToRgba(lighten(base, 24), 0.8);
              // font: darker version of tag bg
              const fontColor = darken(lighten(base, 24), 32);
              return (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1"
                  style={{ background: bg, color: fontColor }}
                >
                  #{tag}
                </span>
              );
            })}
          </div>
        )}
      </motion.div>
    );
};

export default BentoCard;