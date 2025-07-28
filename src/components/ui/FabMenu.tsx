import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from "./Button";

interface FABItem {
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Define a proper type for FABItem icon
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: string;
}

interface FabMenuProps {
    isOpen: boolean;
    onSelectFabItem: (item: FABItem) => void;
    items: FABItem[];
}

const FabMenu: React.FC<FabMenuProps> = ({ isOpen, onSelectFabItem, items }) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id="fab-menu"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute bottom-16 right-0 flex flex-col items-end gap-3" // Use items-end for alignment
                >
                    {items.map((item: FABItem) => (
                        // Each item container uses flex and justify-end
                        <div key={item.label} className="flex items-center justify-end gap-2 group w-full">
                            {/* Tooltip */}
                            <span className="bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap order-1"> {/* Order tooltip first visually */}
                                {item.label === 'Text' ? 'Stickynote' : item.label}
                            </span>
                            {/* Button */}
                            <Button
                                size="icon"
                                className="bg-white rounded-full shadow-lg w-10 h-10 border hover:bg-gray-100 hover:scale-110 transition-transform order-2" // Order button second
                                onClick={() => onSelectFabItem(item)}
                            >
                                <item.icon className="w-5 h-5 text-gray-700" />
                            </Button>
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FabMenu;