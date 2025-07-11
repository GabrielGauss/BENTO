import React, { useRef } from "react";
import { Tag as TagIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { TagButton } from "@/components/common/TagButton";

// Note: In a real application, INITIAL_TAGS might come from state or an API.
// For this extraction, we include it here as it was in the original component.

export const TagBar: React.FC<TagBarProps> = ({ tags, selectedTag, onSelectTag, onClearTag }) => {
     const tagBarRef = useRef<HTMLDivElement>(null); // Ref for tag bar

    return (
        <div
            ref={tagBarRef}
            className="flex-shrink-0 flex gap-2 px-4 py-2 bg-[#f4f1ed]/80 backdrop-blur-sm border-b border-gray-200 items-center overflow-x-auto whitespace-nowrap sticky top-0 z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
            <TagIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mr-1" />
            {/* Button for clearing selection, isActive prop would need adjustment if Sidebar handles overall 'Home' active state */}
             <TagButton
                key="all"
                tag="All"
                isSelected={selectedTag === null}
                onClick={onClearTag}
            />
            {tags.map((tag) => (
                <TagButton
                    key={tag}
                    tag={tag}
                    isSelected={selectedTag === tag}
                    onClick={() => onSelectTag(tag)}
                />
            ))}
        </div>
    );
};
import React, { useRef } from "react";
import { Tag as TagIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { TagButton } from "@/components/common/TagButton";

// Note: In a real application, INITIAL_TAGS might come from state or an API.
// For this extraction, we include it here as it was in the original component.

export const TagBar: React.FC<TagBarProps> = ({ tags, selectedTag, onSelectTag, onClearTag }) => {
     const tagBarRef = useRef<HTMLDivElement>(null); // Ref for tag bar

    return (
        <div
            ref={tagBarRef}
            className="flex-shrink-0 flex gap-2 px-4 py-2 bg-[#f4f1ed]/80 backdrop-blur-sm border-b border-gray-200 items-center overflow-x-auto whitespace-nowrap sticky top-0 z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
            <TagIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mr-1" />
            {/* Button for clearing selection, isActive prop would need adjustment if Sidebar handles overall 'Home' active state */}
             <TagButton
                key="all"
                tag="All"
                isSelected={selectedTag === null}
                onClick={onClearTag}
            />
            {tags.map((tag) => (
                <TagButton
                    key={tag}
                    tag={tag}
                    isSelected={selectedTag === tag}
                    onClick={() => onSelectTag(tag)}
                />
            ))}
        </div>
    );
};