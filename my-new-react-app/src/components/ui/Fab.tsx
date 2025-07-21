import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { Plus } from "lucide-react";

// FABItem type for menu items
export interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: string;
}

interface FabProps {
    fabOpen: boolean;
    toggleFabMenu: () => void;
    handleCreateBento: (item: FABItem) => void;
    fabItems: FABItem[];
}

const Fab: React.FC<FabProps> = ({
    fabOpen,
    toggleFabMenu,
    handleCreateBento,
    fabItems,
}) => {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <div className="relative flex flex-col items-center">
                {/* FAB Menu Items */}
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
                            {fabItems.map((item) => (
                                <div key={item.label} className="flex items-center justify-end gap-2 group w-full">
                                    <span className="bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap order-1">
                                        {item.label}
                                    </span>
                                    <Button
                                        size="icon"
                                        className="bg-white rounded-full shadow-lg w-10 h-10 border hover:bg-gray-100 hover:scale-110 transition-transform order-2"
                                        onClick={() => handleCreateBento(item)}
                                    >
                                        <item.icon className="w-5 h-5 text-gray-700" />
                                    </Button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main FAB Button */}
                <Button
                    id="fab-button"
                    size="icon"
                    className="rounded-full w-14 h-14 bg-black text-white shadow-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    onClick={toggleFabMenu}
                >
                    <motion.div
                        animate={{ rotate: fabOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Plus className="w-6 h-6" />
                    </motion.div>
                </Button>
            </div>
        </div>
    );
};

export default Fab;