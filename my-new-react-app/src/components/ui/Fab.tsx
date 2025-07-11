import React from 'react';
import { motion } from 'framer-motion';
import { ButtonComponent } from '@/components/ui/Button'; // Assuming ButtonComponent is in this path

interface FabProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Fab: React.FC<FabProps> = ({ isOpen, onToggle }) => {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <div className="relative flex flex-col items-center">
                {/* Main FAB Button */}
                <ButtonComponent
                    id="fab-button"
                    size="icon"
                    className="rounded-full w-14 h-14 bg-black text-white shadow-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    onClick={onToggle}
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus w-6 h-6"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
</motion.div>
                </ButtonComponent>
            </div>
        </div>
    );
};

export default Fab;