import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Star, Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/textarea';
import Button from '../ui/Button';
import type { BentoItem } from '../../types/bento';

const CARD_TYPES = [
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'link', label: 'Link' },
  { type: 'youtube', label: 'YouTube' },
  { type: 'audio', label: 'Audio' },
];

// Pastel color palette
const PASTEL_COLORS = [
  '#fffbe6', // yellow
  '#ffe6f7', // pink
  '#e6f7ff', // blue
  '#e6ffe6', // green
  '#f3e6ff', // purple
  '#fff0e6', // orange
  '#f9e6ff', // magenta
];

interface CreateEditBentoModalProps {
  isOpen: boolean;
  editingItem?: BentoItem | null;
  onSave: (item: Partial<BentoItem>, editingId?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultType?: string;
  existingTags?: string[];
}

const CreateEditBentoModal: React.FC<CreateEditBentoModalProps> = ({
  isOpen,
  editingItem = null,
  onSave,
  onCancel,
  isLoading = false,
  defaultType,
  existingTags = [],
}) => {
  // State for all fields
  const [type, setType] = useState<BentoItem['type']>('text');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagVisible, setTagVisible] = useState(true);
  const [starred, setStarred] = useState(false);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(PASTEL_COLORS[0]);
  const [comment, setComment] = useState('');
  const [showTags, setShowTags] = useState(true);
  const [scale, setScale] = useState(1);

  // Pre-fill fields if editing
  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type);
      setContent(
        typeof editingItem.content === 'string'
          ? editingItem.content
          : (editingItem.url || '')
      );
      setUrl(editingItem.url || '');
      setTags(editingItem.tags || []);
      setTagVisible(editingItem.tagVisible !== false);
      setStarred(!!editingItem.starred);
      setTitle(editingItem.title || '');
      setColor(editingItem.color || PASTEL_COLORS[0]);
      setComment(editingItem.comment || '');
      setShowTags(editingItem.showTags !== false);
      setScale(editingItem.scale || 1);
    } else {
      setType(defaultType || 'text');
      setContent('');
      setUrl('');
      setTags([]);
      setTagVisible(true);
      setStarred(false);
      setTitle('');
      setColor(PASTEL_COLORS[0]);
      setComment('');
      setShowTags(true);
      setScale(defaultType === 'youtube' || defaultType === 'image' ? 1.7 : 1.2);
    }
  }, [editingItem, isOpen, defaultType]);

  // Validation
  const isSubmitDisabled =
    (type === 'text' && !content.trim()) ||
    (type !== 'text' && !url.trim());

  // Tag add/remove with autocomplete
  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };
  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  // Tag suggestions: most used tags (by frequency in cards)
  const tagFrequency = existingTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostUsedTags = [...existingTags].sort((a, b) => (tagFrequency[b] || 0) - (tagFrequency[a] || 0)).filter(t => !tags.includes(t));
  const filteredTagSuggestions = tagInput
    ? mostUsedTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()))
    : mostUsedTags.slice(0, 5);

  // Save handler
  const handleSave = () => {
    const item: Partial<BentoItem> = {
      type,
      title,
      color,
      comment: type !== 'text' ? comment : undefined,
      content: type === 'text' ? content : url,
      url: type !== 'text' ? url : undefined,
      tags,
      tagVisible,
      starred,
      showTags,
      scale,
    };
    onSave(item, editingItem?.id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'
        )}
        onClick={onCancel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] flex flex-col gap-4 font-[Inter,sans-serif]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%23fdf8f4\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1.5\' fill=\'%23e2e8f0\' fill-opacity=\'0.12\'/%3E%3C/svg%3E")', boxShadow: '0 8px 32px 0 rgba(60, 40, 20, 0.18)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 id="modal-title" className="text-lg font-semibold">
              {editingItem ? 'Edit Card' : 'Create New Card'}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-gray-400 hover:bg-gray-100 w-7 h-7"
              aria-label="Close modal"
            >
              <XCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Type Selector */}
          <div className="flex gap-2 mb-4">
            {CARD_TYPES.map(t => (
              <Button
                key={t.type}
                variant={type === t.type ? 'default' : 'ghost'}
                className="px-2 py-1 text-xs"
                onClick={() => setType(t.type as BentoItem['type'])}
              >
                {t.label}
              </Button>
            ))}
          </div>

          {/* Title Input */}
          <Input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full mb-3 h-9 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            aria-label="Title"
          />

          {/* Color Picker */}
          <div className="flex gap-2 mb-4 items-center">
            <span className="text-xs text-gray-500">Color:</span>
            {PASTEL_COLORS.map(c => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-black' : 'border-transparent'}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>

          {/* Content Input */}
          {type === 'text' ? (
            <Textarea
              placeholder="Enter your text here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full min-h-[100px] mb-4 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
              aria-label="Text content"
            />
          ) : (
            <Input
              type="url"
              placeholder={`Enter URL for ${type}... (e.g., https://...)`}
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full mb-4 h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
              aria-label="URL"
            />
          )}

          {/* Tags */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1 relative">
              <Input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
                className="w-32 h-7 text-xs"
                autoComplete="off"
              />
              <Button size="sm" onClick={handleAddTag} className="px-2 py-1 text-xs">Add</Button>
              {filteredTagSuggestions.length > 0 && (
                <div className="absolute left-0 top-8 bg-white border rounded shadow-lg z-30 w-32 max-h-32 overflow-auto">
                  {filteredTagSuggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      className="block w-full text-left px-2 py-1 text-xs hover:bg-blue-100"
                      onClick={() => { setTags([...tags, suggestion]); setTagInput(''); }}
                    >
                      #{suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <span key={tag} className="bg-gray-200 text-xs rounded-full px-2 py-0.5 flex items-center gap-1">
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* Show/Hide Tags Toggle */}
          <div className="flex items-center gap-2 mb-2 mt-2">
            <button
              type="button"
              className="rounded-full bg-white/80 border border-gray-300 px-2 py-1 text-xs flex items-center gap-1 hover:bg-gray-100 transition"
              title={showTags ? 'Hide tags on card' : 'Show tags on card'}
              onClick={() => setShowTags(v => !v)}
            >
              {showTags ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showTags ? 'Hide tags on card' : 'Show tags on card'}</span>
            </button>
          </div>

          {/* Starred Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={starred ? 'default' : 'ghost'}
              size="icon"
              className={starred ? 'text-yellow-500' : 'text-gray-400'}
              onClick={() => setStarred(v => !v)}
              title={starred ? 'Unfavorite' : 'Favorite'}
            >
              <Star className="w-4 h-4" />
            </Button>
            <span className="text-xs">{starred ? 'Favorited' : 'Not favorited'}</span>
          </div>

          {/* Comment for non-text types */}
          {type !== 'text' && (
            <Textarea
              placeholder="Add a comment or note..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full min-h-[60px] mb-4 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              aria-label="Comment"
            />
          )}

          {/* Save/Cancel */}
          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md"
              disabled={isSubmitDisabled || isLoading}
              aria-label={editingItem ? 'Save changes' : 'Add card'}
            >
              {editingItem ? 'Save' : 'Add Card'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default React.memo(CreateEditBentoModal);