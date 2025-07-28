import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Link, Image, Video, Music } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
  autoFocus = false,
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update formatting states based on cursor position
  const updateFormattingStates = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Check if selection is bold (wrapped in **)
    const selectedText = value.substring(start, end);
    
    // Simple markdown-style formatting detection
    setIsBold(selectedText.startsWith('**') && selectedText.endsWith('**'));
    setIsItalic(selectedText.startsWith('*') && selectedText.endsWith('*'));
    setIsList(selectedText.startsWith('- ') || selectedText.startsWith('• '));
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'list' | 'link') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    let newCursorPos = start;
    
    switch (format) {
      case 'bold':
        if (isBold) {
          // Remove bold formatting
          newText = selectedText.replace(/^\*\*|\*\*$/g, '');
          newCursorPos = start + newText.length;
        } else {
          // Add bold formatting
          newText = `**${selectedText}**`;
          newCursorPos = start + newText.length;
        }
        break;
        
      case 'italic':
        if (isItalic) {
          // Remove italic formatting
          newText = selectedText.replace(/^\*|\*$/g, '');
          newCursorPos = start + newText.length;
        } else {
          // Add italic formatting
          newText = `*${selectedText}*`;
          newCursorPos = start + newText.length;
        }
        break;
        
      case 'list':
        if (isList) {
          // Remove list formatting
          newText = selectedText.replace(/^[-•]\s/, '');
          newCursorPos = start + newText.length;
        } else {
          // Add list formatting
          newText = `- ${selectedText}`;
          newCursorPos = start + newText.length;
        }
        break;
        
      case 'link':
        if (showLinkInput) {
          // Apply link
          newText = `[${linkText || selectedText}](${linkUrl})`;
          newCursorPos = start + newText.length;
          setShowLinkInput(false);
          setLinkUrl('');
          setLinkText('');
        } else {
          // Show link input
          setShowLinkInput(true);
          setLinkText(selectedText);
          return;
        }
        break;
    }
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Shift+Enter for new line
      return;
    }
    
    if (e.key === 'Enter') {
      // Check if we're in a list and should continue it
      const cursorPos = e.currentTarget.selectionStart;
      const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
      const currentLine = value.substring(lineStart, cursorPos);
      
      if (currentLine.match(/^[-•]\s/)) {
        e.preventDefault();
        const newValue = value.substring(0, cursorPos) + '\n- ' + value.substring(cursorPos);
        onChange(newValue);
        
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = cursorPos + 3;
            textareaRef.current.setSelectionRange(newPos, newPos);
          }
        }, 0);
      }
    }
  };

  useEffect(() => {
    updateFormattingStates();
  }, [value]);

  return (
    <div className={cn("border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <button
          type="button"
          onClick={() => applyFormatting('bold')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 transition-colors",
            isBold && "bg-blue-100 text-blue-700"
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => applyFormatting('italic')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 transition-colors",
            isItalic && "bg-blue-100 text-blue-700"
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-gray-300 mx-1" />
        
        <button
          type="button"
          onClick={() => applyFormatting('list')}
          className={cn(
            "p-1.5 rounded hover:bg-gray-200 transition-colors",
            isList && "bg-blue-100 text-blue-700"
          )}
          title="List"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => applyFormatting('link')}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Link"
        >
          <Link className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-gray-300 mx-1" />
        
        <button
          type="button"
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Upload Image"
        >
          <Image className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Upload Video"
        >
          <Video className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Upload Audio"
        >
          <Music className="w-4 h-4" />
        </button>
      </div>
      
      {/* Link Input Modal */}
      {showLinkInput && (
        <div className="p-3 bg-blue-50 border-b border-blue-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Link text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="url"
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => applyFormatting('link')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
                setLinkText('');
              }}
              className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Text Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onSelect={updateFormattingStates}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full min-h-[120px] p-3 text-sm border-0 focus:outline-none resize-none"
        style={{ fontFamily: 'inherit' }}
      />
    </div>
  );
};

export default RichTextEditor; 