import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, Unlock, Edit, Trash2, ExternalLink, Play, Music, Image as ImageIcon, Pause, Volume2, VolumeX } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { getTagColor } from '../../constants/bento';
import type { BentoItem } from '../../types/bento';

interface BentoCardProps {
  item: BentoItem;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStar?: () => void;
  onTogglePrivate?: () => void;
  style?: React.CSSProperties;
  scale?: number;
  isTrashItem?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const BentoCard: React.FC<BentoCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleStar,
  onTogglePrivate,
  style,
  scale = 1,
  isTrashItem = false,
  isSelected = false,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Audio/Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  // Media controls
  const handlePlayPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };



  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Determine content type and icon
  const getContentIcon = () => {
    switch (item.type) {
      case 'youtube':
        return <Play className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'link':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Render content based on type
  const renderContent = () => {
    const content = typeof item.content === 'string' ? item.content : item.url || '';
    
    switch (item.type) {
      case 'youtube': {
        const getYouTubeVideoId = (url: string) => {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : null;
        };
        const videoId = getYouTubeVideoId(item.url || '');
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
        
        return (
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt="YouTube thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to medium quality if maxresdefault fails
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            
            {/* Video overlay with controls */}
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
            
            {/* Video controls overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                onClick={() => {
                  if (videoId) {
                    // Create embedded player
                    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    window.open(embedUrl, '_blank', 'width=800,height=600');
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
              >
                <Play className="w-6 h-6 text-white" />
              </motion.button>
            </div>
            
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              YouTube
            </div>
            
            {/* Video info */}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Click to watch
            </div>
          </div>
        );
      }
      
      case 'audio': {
        return (
          <div className="relative w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3">
            {/* Hidden audio element */}
            <audio
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              src={item.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Audio controls */}
            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handlePlayPause}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                  </motion.button>
                  
                  {/* Volume control with hover */}
                  <div className="relative group">
                    <motion.button
                      onClick={handleMuteToggle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </motion.button>
                    
                    {/* Volume slider on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                      <div className="bg-black/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap volume-tooltip">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        );
      }
      
      case 'image':
        return (
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Image
            </div>
          </div>
        );
      
      case 'link': {
        const content = typeof item.content === 'string' ? item.content : item.url || '';
        return (
          <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm truncate">{content}</span>
          </div>
        );
      }
      
      case 'plain-text': {
        const content = typeof item.content === 'string' ? item.content : '';
        return (
          <div className="text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 p-2 rounded border">
            {content}
          </div>
        );
      }
      
      case 'floating-text': {
        const content = typeof item.content === 'string' ? item.content : '';
        return (
          <div className="text-sm text-gray-600 leading-relaxed italic bg-transparent">
            "{content}"
          </div>
        );
      }
      
      case 'magic-note': {
        const content = typeof item.content === 'string' ? item.content : '';
        return (
          <div className="text-sm text-gray-700 leading-relaxed bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded border-l-4 border-purple-400">
            ✨ {content}
          </div>
        );
      }
      
      default:
        return (
          <div className="text-sm text-gray-700 leading-relaxed">
            {content}
          </div>
        );
    }
  };

  const isPrivate = item.private || false;
  

  // If item is private, show locked state but allow toggle
  if (isPrivate) {
    return (
      <motion.div
        ref={setNodeRef}
        className={`relative group min-w-[180px] max-w-[420px] flex flex-col ${scale > 1 ? 'z-10' : ''}`}
        style={{
          ...(style || {}),
          backgroundColor: item.color || '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ 
          duration: 0.3, 
          ease: "easeOut",
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
      >
        {/* Locked overlay with toggle */}
        <div className="absolute inset-0 rounded-lg flex items-center justify-center z-20" style={{ backgroundColor: item.color || '#fff' }}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="text-sm text-gray-600 font-medium">Private</div>
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onTogglePrivate) onTogglePrivate();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
            >
              Unlock
            </motion.button>
          </div>
        </div>

        {/* Card Header */}
        <div className="flex items-start justify-between p-3 pb-2">
          <div className="flex-1 min-w-0">
            {item.title && (
              <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                {item.title}
              </h3>
            )}
            {getContentIcon() && (
              <div className="flex items-center gap-1 text-gray-500">
                {getContentIcon()}
                <span className="text-xs capitalize">{item.type}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="px-3 pb-3 flex-1">
          {renderContent()}
        </div>

        {/* Card Footer */}
        <div className="px-3 pb-3">
          {/* Tags - Only show if not private */}
          {!item.private && item.showTags !== false && item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tags.slice(0, 3).map((tag) => {
                const tagColor = getTagColor(tag, item.tags);
                return (
                  <span
                    key={tag}
                    className="text-xs rounded-full px-2 py-0.5 border opacity-50"
                    style={{
                      backgroundColor: tagColor.bg,
                      color: tagColor.text,
                      borderColor: tagColor.border,
                    }}
                  >
                    #{tag}
                  </span>
                );
              })}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-500 px-1">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Privacy indicator for private items */}
          {item.private && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <Lock className="w-3 h-3" />
              <span>Private</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      className={`relative group min-w-[180px] max-w-[420px] flex flex-col ${scale > 1 ? 'z-10' : ''}`}
      style={{
        ...(style || {}),
        transform: isDragging ? 'rotate(5deg) scale(1.05)' : isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Drag handle overlay - covers entire card */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing rounded-lg"
        style={{ 
          pointerEvents: isHovered ? 'none' : 'auto',
        }}
      />
      
      {/* Main Card Content */}
      <motion.div
        className={`relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          backgroundColor: item.color || '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: isDragging ? '0 20px 40px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
          minHeight: scale >= 1.5 ? '200px' : '150px',
          maxHeight: scale >= 2 ? '300px' : '200px',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ 
          duration: 0.3, 
          ease: "easeOut",
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        onClick={isTrashItem ? onSelect : undefined}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between p-3 pb-2">
          <div className="flex-1 min-w-0">
            {item.title && (
              <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                {item.title}
              </h3>
            )}
            {getContentIcon() && (
              <div className="flex items-center gap-1 text-gray-500">
                {getContentIcon()}
                <span className="text-xs capitalize">{item.type}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          {/* Star Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
            className="p-1.5 bg-white/95 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <Star className={`w-4 h-4 ${item.starred ? 'text-yellow-500 fill-current' : 'text-gray-500'}`} />
          </button>

          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 bg-white/95 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <Edit className="w-4 h-4 text-blue-500" />
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 bg-white/95 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* Card Content */}
        <div className="px-3 pb-3 flex-1">
          {renderContent()}
        </div>

        {/* Card Footer */}
        <div className="px-3 pb-3">
          {/* Tags */}
          {item.showTags !== false && item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tags.slice(0, 3).map((tag) => {
                const tagColor = getTagColor(tag, item.tags);
                return (
                  <motion.span
                    key={tag}
                    className="text-xs rounded-full px-2 py-0.5 border transition-all duration-150 hover:scale-105"
                    style={{
                      backgroundColor: tagColor.bg,
                      color: tagColor.text,
                      borderColor: tagColor.border,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    #{tag}
                  </motion.span>
                );
              })}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-500 px-1">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Privacy indicator */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 text-xs transition-colors relative group"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onTogglePrivate) onTogglePrivate();
              }}
              title={isPrivate ? 'Make public' : 'Make private'}
              style={{
                color: isPrivate ? '#dc2626' : '#6b7280'
              }}
            >
              {isPrivate ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {isPrivate ? 'Make Public' : 'Make Private'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Comment */}
        {item.comment && (
          <div className="px-3 pb-3 pt-0">
            <div className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
              {item.comment}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BentoCard;