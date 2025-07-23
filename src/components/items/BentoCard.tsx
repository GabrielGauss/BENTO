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
    dragging = false,
    resizing = false,
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
    dragging?: boolean;
    resizing?: boolean;
}) => {
    // Runtime guard: log and skip rendering if any prop is a React element (object)
    const suspectProps: (keyof BentoItem)[] = ['content', 'title', 'className', 'comment'];
    for (const key of suspectProps) {
        const value = item[key];
        if (typeof value === 'object' && value !== null) {
            console.error('BentoCard: Skipping render due to object prop:', key, value, item);
            return null;
        }
    }
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
        // Defensive: log the type of content
        if (Array.isArray(item.content)) {
            for (const el of item.content) {
                if (Array.isArray(el)) {
                    console.error('BentoCard: Nested array found in content, skipping render', el, item);
                    return null;
                }
                if (
                    typeof el !== 'string' &&
                    !React.isValidElement(el)
                ) {
                    console.error('BentoCard: Invalid array element in content, skipping render', el, item);
                    return null;
                }
            }
        } else if (
            typeof item.content !== 'string' &&
            !React.isValidElement(item.content) &&
            item.content !== null &&
            item.content !== undefined
        ) {
            console.error('BentoCard: Invalid non-array content, skipping render', item.content, item);
            return null;
        }
        // Log what will be rendered
        console.log('BentoCard: Rendering content of type', Array.isArray(item.content) ? 'array' : typeof item.content, item.content, item);
        // --- TEXT CARD ---
        if (item.type === 'text') {
            if (typeof item.content === 'string') {
                return <p className="whitespace-pre-wrap break-words">{item.content}</p>;
            }
            if (Array.isArray(item.content)) {
                return <>{item.content.map((el, i) =>
                    typeof el === 'string' ? <p key={i} className="whitespace-pre-wrap break-words">{el}</p> : React.isValidElement(el) ? React.cloneElement(el, { key: i }) : null
                )}</>;
            }
            if (React.isValidElement(item.content)) {
                return item.content;
            }
            if (item.content != null) {
                console.warn('BentoCard: Unsupported content type for text card', item.content);
            }
            return null;
        }
        // --- YOUTUBE CARD ---
        if (item.type === 'youtube') {
            if (Array.isArray(item.content)) {
                return <>{item.content.map((el, i) => React.isValidElement(el) ? React.cloneElement(el, { key: i }) : null)}</>;
            }
            if (React.isValidElement(item.content)) {
                return item.content;
            }
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
        // --- IMAGE CARD ---
        if (item.type === 'image') {
            if (Array.isArray(item.content)) {
                return <>{item.content.map((el, i) => React.isValidElement(el) ? React.cloneElement(el, { key: i }) : null)}</>;
            }
            if (React.isValidElement(item.content)) {
                return item.content;
            }
            if (typeof item.url === 'string') {
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
            return null;
        }
        // --- AUDIO CARD ---
        if (item.type === 'audio') {
            if (Array.isArray(item.content)) {
                return <>{item.content.map((el, i) => React.isValidElement(el) ? React.cloneElement(el, { key: i }) : null)}</>;
            }
            if (React.isValidElement(item.content)) {
                return item.content;
            }
            if (typeof item.url === 'string') {
                return (
                    <div className="w-full aspect-[4/1] flex items-center justify-center" style={{ transform: `scale(${mediaScale})` }}>
                        <audio controls className="w-full h-10">
                            <source src={item.url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                );
            }
            return null;
        }
        // --- VIDEO CARD ---
        if (item.type === 'video') {
            if (Array.isArray(item.content)) {
                return <>{item.content.map((el, i) => React.isValidElement(el) ? React.cloneElement(el, { key: i }) : null)}</>;
            }
            if (React.isValidElement(item.content)) {
                return item.content;
            }
            if (typeof item.url === 'string') {
                return (
                    <div className="relative w-full" style={{ aspectRatio: '16/9', transform: `scale(${mediaScale})` }}>
                        <video controls className="absolute top-0 left-0 w-full h-full rounded-lg block">
                            <source src={item.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );
            }
            return null;
        }
        // --- LINK CARD ---
        if (item.type === 'link') {
            if (Array.isArray(item.content)) {
                return <>{item.content.map((el, i) => React.isValidElement(el) ? React.cloneElement(el, { key: i }) : null)}</>;
            }
            if (React.isValidElement(item.content)) {
                return item.content;
            }
            if (typeof item.url === 'string') {
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
            return null;
        }
        // --- FALLBACK ---
        if (Array.isArray(item.content)) {
            return <>{item.content.map((el, i) =>
                typeof el === 'string' ? <span key={i}>{el}</span> : React.isValidElement(el) ? React.cloneElement(el, { key: i }) : null
            )}</>;
        }
        if (React.isValidElement(item.content)) {
            return item.content;
        }
        if (typeof item.content === 'string') {
            return <span>{item.content}</span>;
        }
        if (item.content != null) {
            console.warn('BentoCard: Unsupported content type', item.content);
        }
        return null;
    };

    return (
      <div
        className={`relative group min-w-[180px] max-w-[420px] overflow-visible transition-[grid-column,grid-row] duration-300 flex flex-col ${scale > 1 ? 'z-20' : ''}`}
        style={{
          ...(style || {}),
          minWidth: 180,
          minHeight: 120,
          maxWidth: 420,
          maxHeight: 600,
          transform: `rotate(${rotation}deg)` ,
          borderRadius: 18,
          background: 'transparent',
          fontFamily: 'Inter, Arial, sans-serif',
          boxShadow: 'none',
        }}
      >
        <motion.div
          layout
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            scale: dragging || resizing ? 1.04 : 1,
            opacity: 1,
            boxShadow: dragging
              ? '0 12px 36px 0 rgba(60, 40, 20, 0.22), 0 8px 24px 0 #e5e7eb'
              : resizing
              ? '0 6px 18px 0 rgba(60, 40, 20, 0.14), 0 3px 8px 0 #e5e7eb'
              : '0 2px 8px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 #e5e7eb',
            borderRadius: 18,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 32,
            mass: 1.1,
            bounce: 0.22,
          }}
          style={{
            borderRadius: 18,
            background: item.color || '#fffbe6',
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 180,
            minHeight: 120,
            maxWidth: 420,
            maxHeight: 600,
            overflow: 'hidden',
            transition: 'box-shadow 0.2s, border-radius 0.2s',
          }}
        >
          <Card
            onClick={(e: React.MouseEvent) => onSelect(item.id, e.shiftKey)}
            className={cn(
              item.className,
              'p-3 rounded-xl shadow text-sm cursor-pointer relative transition-all duration-200 ease-in-out pb-3 min-h-[120px] flex flex-col',
              isSelected
                ? 'ring-2 ring-offset-0 ring-black ring-offset-transparent shadow-md scale-[1.02] border'
                : 'hover:shadow-lg hover:scale-[1.01] hover:border hover:border-gray-300',
              'box-border',
              item.type === 'image' && 'p-0',
              item.type === 'youtube' && 'p-0',
              item.type === 'audio' && 'p-4'
            )}
            style={{ background: 'transparent', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}
          >
            {/* Inline Action Bar (show on hover/focus or always for now) */}
            <div className="absolute top-1.5 right-1.5 flex gap-1 z-10 bg-white/80 backdrop-blur-sm rounded-full px-1 py-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity items-center pointer-events-auto">
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
            <div className="grow overflow-hidden flex flex-col" style={{ position: 'relative', minWidth: 0, minHeight: 0 }}>
              {/* Image and media content: always fit, no scrollbars */}
              {item.type === 'image' && item.url && (
                <img
                  src={item.url}
                  alt={item.title || 'Bento Image'}
                  className="object-cover w-full h-full rounded-t-lg"
                  style={{ maxHeight: 180, minHeight: 60, borderRadius: 12 }}
                />
              )}
              {item.type === 'audio' && item.url && (
                <audio controls className="w-full h-10 mt-2">
                  <source src={item.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {/* For all other content, use ellipsis and clamp for text */}
              {item.type !== 'image' && item.type !== 'audio' && (
                <div className="w-full" style={{ minHeight: 0, minWidth: 0 }}>
                  <div className="truncate text-ellipsis" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {renderContent()}
                  </div>
                </div>
              )}
            </div>
            {/* Card Comment (for non-text types) */}
            {item.comment && item.type !== 'text' && (
              <div className="mt-3 mb-6 text-xs text-gray-600 italic break-words px-3">{item.comment}</div>
            )}
            {/* Tags Row - always flush with the bottom of the main card */}
            {item.tags && item.tags.length > 0 && item.showTags !== false && (
              <div className="flex flex-wrap gap-2 px-3 pt-3 pb-2 text-xs font-medium mt-auto border-t border-gray-200">
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
          </Card>
        </motion.div>
      </div>
    );
};

export default BentoCard;