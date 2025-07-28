import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Image, Music, Video, Link, StickyNote, Plus, Star, Eye, EyeOff, Palette } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/textarea';
import type { BentoItem } from '../../types/bento';

interface CreateBentoModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (item: Partial<BentoItem>) => void;
  editingItem?: BentoItem | null;
}

const CreateBentoModal: React.FC<CreateBentoModalProps> = ({
  isOpen,
  onCancel,
  onSave,
  editingItem
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    url: '',
    type: 'text',
    color: '#fffbe6',
    tags: [] as string[],
    starred: false,
    private: false,
  });
  const [newTag, setNewTag] = useState('');

  const colorOptions = [
    { name: 'Yellow', value: '#fffbe6', label: 'Warm' },
    { name: 'Pink', value: '#ffe6f7', label: 'Soft' },
    { name: 'Blue', value: '#e6f7ff', label: 'Cool' },
    { name: 'Green', value: '#e6ffe6', label: 'Fresh' },
    { name: 'Purple', value: '#f3e6ff', label: 'Creative' },
    { name: 'Orange', value: '#fff3e6', label: 'Energetic' },
  ];

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        content: typeof editingItem.content === 'string' ? editingItem.content : '',
        url: editingItem.url || '',
        type: editingItem.type || 'text',
        color: editingItem.color || '#fffbe6',
        tags: editingItem.tags || [],
        starred: editingItem.starred || false,
        private: editingItem.private || false,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        url: '',
        type: 'text',
        color: '#fffbe6',
        tags: [],
        starred: false,
        private: false,
      });
    }
  }, [editingItem, isOpen]);

  const handleSave = () => {
    const itemData: Partial<BentoItem> = {
      id: editingItem?.id || `item-${Date.now()}`,
      title: formData.title,
      content: formData.content as React.ReactNode,
      url: formData.url,
      type: formData.type as BentoItem['type'],
      color: formData.color,
      tags: formData.tags,
      starred: formData.starred,
      private: formData.private,
    };
    onSave(itemData);
    onCancel();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const contentTypes = [
    { id: 'text', label: 'Text Note', icon: Type, color: '#fffbe6' },
    { id: 'sticky', label: 'Sticky Note', icon: StickyNote, color: '#ffe6f7' },
    { id: 'image', label: 'Image', icon: Image, color: '#e6f7ff' },
    { id: 'audio', label: 'Audio', icon: Music, color: '#f3e6ff' },
    { id: 'video', label: 'Video', icon: Video, color: '#e6ffe6' },
    { id: 'link', label: 'Link', icon: Link, color: '#fff3e6' },
  ];

  const renderContentForm = () => {
    switch (formData.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your text note here..."
                className="w-full h-32 resize-none"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>
        );

      case 'sticky':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sticky Note</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your sticky note here..."
                className="w-full h-32 resize-none border-yellow-200"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <Input
                type="text"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Description of the image"
                className="w-full"
              />
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audio URL</label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/audio.mp3"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                type="text"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Audio title"
                className="w-full"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                type="text"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Video title"
                className="w-full"
              />
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Input
                type="text"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Link description"
                className="w-full"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ borderLeft: `4px solid ${formData.color}` }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingItem ? 'Edit Item' : 'Create New Item'}
                    </h3>
                    <p className="text-sm text-gray-500">Add content to your board</p>
                  </div>
                </div>
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Content Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          type: type.id,
                          color: type.color 
                        }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                          formData.type === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title..."
                  className="w-full"
                />
              </div>

              {/* Content Form */}
              {renderContentForm()}

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Card Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.color === color.value
                          ? 'border-gray-800 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      <div className="text-xs font-medium text-gray-700">
                        {color.name}
                      </div>
                      <div className="text-xs text-gray-500">{color.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Options with Switch Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Starred</span>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, starred: !prev.starred }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.starred ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.starred ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {formData.private ? <EyeOff className="w-4 h-4 text-red-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    <span className="text-sm font-medium">Private</span>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, private: !prev.private }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.private ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.private ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={onCancel}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={!formData.title.trim()}
                style={{ backgroundColor: formData.color, color: '#000' }}
              >
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBentoModal;