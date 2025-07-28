import { cn } from "../../utils/cn";
import Button from "../ui/Button";
import { getTagColor } from "../../constants/bento";

interface TagButtonProps {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
    existingTags?: string[];
}

const TagButton = ({ tag, isSelected, onClick, existingTags = [] }: TagButtonProps) => {
    const tagColor = getTagColor(tag, existingTags);
    
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={cn(
                "text-xs px-3 py-1 h-auto rounded-full border transition-colors duration-150",
                isSelected
                    ? "border-black hover:bg-gray-800"
                    : "hover:bg-gray-100 hover:border-gray-400"
            )}
            style={{
                backgroundColor: isSelected ? '#000' : tagColor.bg,
                color: isSelected ? '#fff' : tagColor.text,
                borderColor: isSelected ? '#000' : tagColor.border,
            }}
        >
            #{tag}
        </Button>
    );
};

export default TagButton;