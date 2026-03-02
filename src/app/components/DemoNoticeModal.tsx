import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
const Motion = motion;
import { X, Sparkles } from 'lucide-react';

interface DemoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export const DemoNoticeModal = ({ isOpen, onClose, featureName = "Journey Creator" }: DemoNoticeModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-zinc-100"
          >
            {/* Header / Top Accent */}
            <div className="h-20 bg-linear-to-br from-[#EE0000] to-[#990000] flex items-center justify-center relative">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
               <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#EE0000] -mb-16 z-10">
                  <Sparkles size={28} className="animate-pulse" />
               </div>
            </div>

            {/* Content */}
            <div className="px-10 pt-14 pb-10 flex flex-col items-center text-center">
              <h3 className="text-[22px] font-black text-zinc-900 tracking-tight leading-tight mb-3">
                Thanks for your curiosity!
              </h3>
              
              <p className="text-[15px] text-zinc-600 font-medium leading-relaxed mb-8">
                While the <span className="text-zinc-900 font-bold">{featureName}</span> is part of the core vision, it's currently taking a breather for this demo.
              </p>

              <button
                onClick={onClose}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[15px] font-bold hover:bg-black transition-all shadow-lg shadow-zinc-900/10 active:scale-[0.98] cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer z-20"
            >
              <X size={18} />
            </button>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
