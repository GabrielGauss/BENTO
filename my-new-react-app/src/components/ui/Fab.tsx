import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, PenTool, Image, Music, Link as LinkIcon, Youtube } from "lucide-react";

interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: string;
}

const FAB_ITEMS: FABItem[] = [
    { icon: PenTool, label: "Text", type: 'text' },
    { icon: Image, label: "Image", type: 'image' },
    { icon: Music, label: "Audio", type: 'audio' },
    { icon: Youtube, label: "YouTube", type: 'youtube' },
    { icon: LinkIcon, label: "Link", type: 'link' },
];

interface FabProps {
    fabOpen: boolean;
    toggleFabMenu: () => void;
    handleCreateBento: (item: FABItem) => void;
}

const Fab: React.FC<FabProps> = ({
    fabOpen,
    toggleFabMenu,
    handleCreateBento,
}) => {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <div className="relative flex flex-col items-center">
                <AnimatePresence>
                    {fabOpen && (
                        <motion.div
                            id="fab-menu"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute bottom-16 right-0 flex flex-col items-end gap-3"
                        >
                            {FAB_ITEMS.map((item) => (
                                <div key={item.label} className="flex flex-col items-center group w-full">
                                    <button
                                        className="bg-white rounded-full shadow-lg w-10 h-10 hover:bg-gray-100 hover:scale-110 transition-transform flex items-center justify-center outline-none border-none"
                                        onClick={() => { handleCreateBento(item); toggleFabMenu(); }}
                                        tabIndex={0}
                                        aria-label={item.label}
                                        style={{ border: 'none' }}
                                    >
                                        <item.icon className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <span className="mt-2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    id="fab-button"
                    className="rounded-full w-14 h-14 bg-black text-white shadow-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center justify-center"
                    onClick={toggleFabMenu}
                    aria-label="Open create menu"
                >
                    <motion.div
                        animate={{ rotate: fabOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Plus className="w-6 h-6" />
                    </motion.div>
                </button>
            </div>
        </div>
    );
};

export default Fab;