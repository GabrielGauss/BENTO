import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/textarea';
import Button from '../ui/Button';
import { BentoItem } from '../../types/bento'; // Import BentoItem


interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: BentoItem['type']; // Use the imported BentoItem type
}

interface CreateBentoModalProps {
    isOpen: boolean;
    bentoType: FABItem | null;
    content: string;
    url: string;
    onCancel: () => void;
    onAddItem: () => void;
    onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateBentoModal: React.FC<CreateBentoModalProps> = ({
    isOpen,
    bentoType,
    content,
    url,
    onCancel,
    onAddItem,
    onContentChange,
    onUrlChange,
}) => {
    return (
        <AnimatePresence>
            {isOpen && bentoType && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <bentoType.icon className="w-5 h-5 mr-2 text-gray-600" />
                                <h3 className="text-lg font-semibold">New {bentoType.label} Item</h3>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-400 hover:bg-gray-100 w-7 h-7">
                                <XCircle className="w-5 h-5" />
                            </Button>
                        </div>

                        {bentoType.type === 'text' ? (
                            <Textarea
                                placeholder="Enter your text here..."
                                value={content}
                                onChange={onContentChange}
                                className="w-full min-h-[100px] mb-4 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                autoFocus
                            />
                        ) : bentoType.type === 'drawing' ? (
                             <div className="text-center text-gray-500 p-4 border rounded-lg mb-4">
                                Drawing canvas not implemented yet.
                            </div>
                        ) : (
                            <Input
                                type="url"
                                placeholder={`Enter URL for ${bentoType.label}... (e.g., https://...)`}
                                value={url}
                                onChange={onUrlChange}
                                className="w-full mb-4 h-10 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                autoFocus
                            />
                        )}

                        <div className="flex justify-end gap-3 mt-2">
                            <Button
                                variant="ghost"
                                onClick={onCancel}
                                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onAddItem}
                                className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md"
                                disabled={bentoType.type === 'drawing' || (bentoType.type === 'text' && !content) || (bentoType.type !== 'text' && bentoType.type !== 'drawing' && !url) }
                            >
                                Add Item
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateBentoModal;