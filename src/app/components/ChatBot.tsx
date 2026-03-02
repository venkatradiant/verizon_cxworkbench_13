import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useChat } from '@/app/context/ChatContext';

export const ChatBot: React.FC = () => {
  const { isPanelOpen, togglePanel } = useChat();

  return (
    <AnimatePresence>
      {!isPanelOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-[100] flex flex-col items-end"
        >
          {/* Toggle Button */}
          <motion.button
            layoutId="fabric-ai-trigger"
            onClick={togglePanel}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group bg-accent text-white"
          >
            <div className="relative">
              <MessageCircle size={28} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Sparkles size={10} className="text-accent" />
              </div>
            </div>
            
            <div className="absolute right-16 px-3 py-2 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              Ask CX Workbench AI
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};