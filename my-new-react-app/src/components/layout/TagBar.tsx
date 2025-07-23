import React, { useRef, useState } from "react";
import { Tag as TagIcon } from "lucide-react";
import { createPortal } from "react-dom";

function TagModal({ open, mode, initialValue, onConfirm, onCancel }: { open: boolean; mode: 'create' | 'edit'; initialValue: string; onConfirm: (tag: string) => void; onCancel: () => void; }) {
  const [value, setValue] = useState(initialValue || "");
  React.useEffect(() => { setValue(initialValue || ""); }, [initialValue, open]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[320px] flex flex-col gap-4 items-center font-sans">
        <div className="font-bold text-xl mb-2 text-gray-800">{mode === 'create' ? 'Create a New Tag' : 'Edit Tag'}</div>
        <input
          className="border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full text-center bg-white"
          placeholder="Tag name"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex gap-3 justify-center mt-2 w-full">
          <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-base font-semibold transition" onClick={() => onConfirm(value.trim())} disabled={!value.trim()}>{mode === 'create' ? 'Create Tag' : 'Save Tag'}</button>
          <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-base font-semibold transition" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function DeleteTagModal({ open, tag, onConfirm, onCancel }: { open: boolean; tag: string; onConfirm: () => void; onCancel: () => void; }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[260px] flex flex-col gap-3">
        <div className="font-semibold text-base mb-2">Delete Tag</div>
        <div className="text-sm mb-2">Are you sure you want to delete the tag <span className="font-bold">{tag}</span>?</div>
        <div className="flex gap-2 justify-end mt-2">
          <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-sm" onClick={onConfirm}>Delete</button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface TagBarProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string) => void;
    onClearTag: () => void;
    onCreateTag?: (tag: string) => void;
    onEditTag?: (tag: string) => void;
    onDeleteTag?: (tag: string) => void;
}

const TagButton = ({ tag, isSelected, onClick, onDelete }: { tag: string; isSelected: boolean; onClick: () => void; onDelete?: () => void }) => (
  <span className="relative group">
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1 h-7 rounded-full border transition-colors duration-150
        ${isSelected
          ? 'bg-black text-white border-black hover:bg-gray-800'
          : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400'}
      `}
    >
      #{tag}
    </button>
    {onDelete && (
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 ml-1 bg-white rounded-full p-0.5 text-xs text-red-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity border border-red-200 hover:bg-red-100 z-10"
        onClick={e => { e.stopPropagation(); onDelete(); }}
        aria-label={`Delete tag ${tag}`}
        tabIndex={-1}
      >
        &times;
      </button>
    )}
  </span>
);

TagButton.displayName = 'TagButton';

export const TagBar: React.FC<TagBarProps> = ({ 
    tags, 
    selectedTag, 
    onSelectTag, 
    onClearTag,
    onCreateTag,
    onEditTag,
    onDeleteTag,
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    return (
      <div
        className="sticky top-0 w-full bg-[#fcf9f6] border-b border-gray-200 pl-4 pr-4 py-2 z-20 flex items-center gap-2 overflow-x-auto whitespace-nowrap"
        role="toolbar"
        aria-label="Tag filter toolbar"
      >
        {/* Tag icon at the start of the TagBar */}
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 mr-1">
          <TagIcon className="w-5 h-5" aria-hidden="true" />
        </span>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm hover:bg-blue-100 focus:bg-blue-100 border border-blue-200 shadow-sm ml-2"
          onClick={() => setShowCreateModal(true)}
          aria-label="Create Tag"
          type="button"
        >
          <span className="text-lg font-bold">+</span>
          <span>Create Tag</span>
        </button>
        {showCreateModal && (
          <TagModal
            open={showCreateModal}
            mode="create"
            initialValue={''}
            onConfirm={tag => { if (onCreateTag) onCreateTag(tag); setShowCreateModal(false); }}
            onCancel={() => setShowCreateModal(false)}
          />
        )}
        <TagButton
          key="all"
          tag="All"
          isSelected={selectedTag === null}
          onClick={onClearTag}
        />
        {tags.map((tag: string) => (
          <TagButton
            key={tag}
            tag={tag}
            isSelected={selectedTag === tag}
            onClick={() => onSelectTag(tag)}
            onDelete={onDeleteTag ? () => onDeleteTag(tag) : undefined}
          />
        ))}
      </div>
    );
};