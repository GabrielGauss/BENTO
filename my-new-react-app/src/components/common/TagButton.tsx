import { cn } from "../../utils/cn";
import Button from "../ui/Button";

interface TagButtonProps {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
}

const TagButton = ({ tag, isSelected, onClick }) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
            "text-xs px-3 py-1 h-auto rounded-full border transition-colors duration-150",
            isSelected
                ? "bg-black text-white border-black hover:bg-gray-800"
                : "text-gray-600 bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400"
        )}
    >
        #{tag}
    </Button>
);

export default TagButton;