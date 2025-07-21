import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Share2, Trash2 } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";
import type { BentoItem } from "../../types/bento";
import Card from "../ui/Card";


const BentoCard = ({
    item,
    isSelected,
    onSelect,
    onDelete,
    onStar,
    onShare,
}: {
    item: BentoItem; // Use imported interface
    isSelected: boolean;
    onSelect: (id: string, shiftKey: boolean) => void; // Pass shiftKey for multi-select
    onDelete: (id: string) => void;
    onStar: (id: string) => void;
    onShare: (id: string) => void;
}) => {
    const [localHover, setLocalHover] = useState(false);

    // Simple content rendering - adjust as needed for complex types
    const renderContent = () => {
        // For text, maybe render markdown or handle line breaks
        if (item.type === 'text' && typeof item.content === 'string') {
            return <p className="whitespace-pre-wrap break-words">{item.content}</p>;
        }
        // For other types, the content is likely already a ReactNode
        return item.content;
    };

    return (
        // Use motion.div for layout animations if grid items reorder
        <motion.div
            layout // Animate layout changes
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group h-full" // Ensure div takes full height for layout
            onMouseEnter={() => setLocalHover(true)}
            onMouseLeave={() => setLocalHover(false)}
        >
            <Card
                // Use onClick with event to check for shift key
                onClick={(e: React.MouseEvent) => onSelect(item.id, e.shiftKey)}
                className={cn(
                    item.className, // Base styling from item data
                    "p-3 rounded-xl shadow text-sm cursor-pointer relative transition-all duration-200 ease-in-out h-full flex flex-col", // Ensure card takes full height and allows flex content
                    "border", // Add subtle border
                    isSelected
                        ? "ring-2 ring-offset-1 ring-black shadow-md scale-[1.02]" // Enhanced selected state
                        : "hover:shadow-lg hover:scale-[1.01] hover:border-gray-300", // Hover state
                    // Add specific padding/styles based on type if needed
                    item.type === 'image' && 'p-0', // No padding for image container
                    item.type === 'youtube' && 'p-0', // No padding for video container
                    item.type === 'audio' && 'p-2'
                )}
            >
                {/* Content Area */}
                <div className="grow overflow-hidden"> {/* Allow content to grow */}
                  {renderContent()}
                </div>

                {/* Actions Overlay - visible on hover or if selected */}
                 {(localHover || isSelected) && (
                    <div className="absolute top-1.5 right-1.5 flex gap-1 z-10 bg-white/80 backdrop-blur-sm rounded-full px-1 py-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "text-gray-500 hover:text-yellow-500 hover:bg-yellow-100 w-6 h-6",
                                item.starred && "text-yellow-400 fill-yellow-400"
                            )}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card selection
                                onStar(item.id);
                            }}
                        >
                            <Star className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-blue-500 hover:bg-blue-100 w-6 h-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(item.id);
                            }}
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-red-500 hover:bg-red-100 w-6 h-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )}
                {/* Selection Indicator */}
                {isSelected && (
                    <div className="absolute inset-0 border-2 border-black rounded-xl pointer-events-none"></div>
                    // <CheckCircle className="absolute top-2 left-2 text-white bg-black rounded-full w-5 h-5 p-0.5 z-10" />
                )}
            </Card>
        </motion.div>
    );
};

export default BentoCard;