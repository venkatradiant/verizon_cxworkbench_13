import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface PageLoaderProps {
  children: React.ReactNode;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start loading on location change
    setIsLoading(true);
    
    // Set a timeout to finish loading after 1.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Update displayChildren only when NOT loading to avoid content jumping
  useEffect(() => {
    if (!isLoading) {
      setDisplayChildren(children);
    }
  }, [children, isLoading]);

  return (
    <div className="relative w-full h-full min-h-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="shimmer-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[100] bg-background flex flex-col p-8 gap-10 overflow-hidden"
          >
            {/* Shimmer Header Area */}
            <div className="flex flex-col gap-6 max-w-3xl relative">
              <div className="h-4 w-32 rounded-full bg-surface-tertiary/60 animate-pulse" />
              <div className="h-12 w-2/3 rounded-xl bg-surface-tertiary animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded-md bg-surface-tertiary/40 animate-pulse" />
                <div className="h-4 w-5/6 rounded-md bg-surface-tertiary/40 animate-pulse" />
              </div>
              <div className="absolute inset-y-0 -left-20 w-40 bg-linear-to-r from-transparent via-white/15 dark:via-white/5 to-transparent skew-x-12 animate-[shimmer_1.5s_infinite_linear]" />
            </div>

            {/* Shimmer Stats/Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-surface-secondary/40 border border-border/40 p-5 flex flex-col gap-4 relative overflow-hidden">
                  <div className="h-4 w-1/2 rounded bg-surface-tertiary/60 animate-pulse" />
                  <div className="h-8 w-2/3 rounded bg-surface-tertiary animate-pulse" />
                  <div className="absolute inset-y-0 -left-20 w-40 bg-linear-to-r from-transparent via-white/10 dark:via-white/5 to-transparent skew-x-12 animate-[shimmer_2s_infinite_linear]" />
                </div>
              ))}
            </div>

            {/* Shimmer Main Visual/Table Area */}
            <div className="flex-1 rounded-[32px] bg-surface-secondary/20 border border-border/30 p-8 flex flex-col gap-8 relative overflow-hidden">
               <div className="flex justify-between items-center pb-6 border-b border-border/10">
                  <div className="h-8 w-64 rounded-xl bg-surface-tertiary/60 animate-pulse" />
                  <div className="flex gap-3">
                    <div className="h-10 w-32 rounded-full bg-surface-tertiary/40 animate-pulse" />
                    <div className="h-10 w-10 rounded-full bg-surface-tertiary/40 animate-pulse" />
                  </div>
               </div>
               
               <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-6 items-center opacity-60">
                      <div className="w-14 h-14 rounded-2xl bg-surface-tertiary/40 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-1/3 rounded bg-surface-tertiary/40 animate-pulse" />
                        <div className="h-4 w-1/2 rounded bg-surface-tertiary/30 animate-pulse" />
                      </div>
                      <div className="w-24 h-8 rounded-lg bg-surface-tertiary/40 animate-pulse" />
                    </div>
                  ))}
               </div>
               
               <div className="absolute inset-y-0 -left-40 w-80 bg-linear-to-r from-transparent via-white/10 dark:via-white/5 to-transparent skew-x-12 animate-[shimmer_2.5s_infinite_linear]" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="page-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            {displayChildren}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(450%) skewX(-12deg); }
        }
      `}} />
    </div>
  );
};
