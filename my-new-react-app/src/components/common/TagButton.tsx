import { cn } from "@/utils/cn";
import { ButtonComponent } from "@/components/ui/Button"; // Assuming this path based on previous steps

interface TagButtonProps {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({
    tag,
    isSelected,
    onClick
}) => (
    <ButtonComponent
        variant="ghost" // Use ghost variant for base styling
        onClick={onClick}
        className={cn(
            "text-xs px-3 py-1 h-auto rounded-full border transition-colors duration-150", // Base styles
            isSelected
                ? "bg-black text-white border-black hover:bg-gray-800" // Selected state
                : "text-gray-600 bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400" // Default state
        )}
    >
        #{tag}
    </ButtonComponent>
);

export default TagButton;
import { cn } from "@/utils/cn";
import { ButtonComponent } from "@/components/ui/Button"; // Assuming this path based on previous steps

interface TagButtonProps {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({
    tag,
    isSelected,
    onClick
}) => (
    <ButtonComponent
        variant="ghost" // Use ghost variant for base styling
        onClick={onClick}
        className={cn(
            "text-xs px-3 py-1 h-auto rounded-full border transition-colors duration-150", // Base styles
            isSelected
                ? "bg-black text-white border-black hover:bg-gray-800" // Selected state
                : "text-gray-600 bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400" // Default state
        )}
    >
        #{tag}
    </ButtonComponent>
);

export default TagButton;