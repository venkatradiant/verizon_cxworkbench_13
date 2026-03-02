import React from 'react';
import { clsx } from 'clsx';
import { MousePointer2, Type, ExternalLink, Layers, Zap } from 'lucide-react';

interface MockScreenVisualizationProps {
  stepName: string;
  screenType: string;
  selectedElementId?: string;
}

export const MockScreenVisualization = ({ stepName, screenType, selectedElementId }: MockScreenVisualizationProps) => {
  return (
    <div className="w-full h-full bg-white border border-[var(--border-subtle)] rounded-[32px] overflow-hidden flex flex-col shadow-sm relative group">
      {/* Browser Bar Placeholder */}
      <div className="h-10 border-b border-[var(--border-subtle)]/40 bg-[var(--surface-secondary)]/30 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--border-subtle)]/60" />
          <div className="w-2 h-2 rounded-full bg-[var(--border-subtle)]/60" />
          <div className="w-2 h-2 rounded-full bg-[var(--border-subtle)]/60" />
        </div>
        <div className="flex-1 max-w-[400px] h-6 bg-white border border-[var(--border-subtle)]/30 rounded-full mx-auto" />
      </div>

      {/* Screen Content - Wireframe Style */}
      <div className="flex-1 p-8 flex flex-col gap-8 items-center bg-zinc-50/50">
        
        {/* Mock Navigation */}
        <div className="w-full h-8 border-b border-zinc-200/50 flex items-center justify-between px-2 mb-4">
          <div className="w-24 h-4 bg-zinc-200 rounded" />
          <div className="flex gap-4">
            <div className="w-12 h-2 bg-zinc-200 rounded" />
            <div className="w-12 h-2 bg-zinc-200 rounded" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full max-w-md flex flex-col gap-4 text-center items-center">
          <div className="w-16 h-2 bg-zinc-300 rounded-full" />
          <div className="w-3/4 h-8 bg-zinc-300 rounded-xl" />
          <div className="w-full h-4 bg-zinc-200 rounded-full" />
        </div>

        {/* Content Area */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-4 mt-4">
          {/* Card 1 */}
          <div className={clsx(
            "p-6 bg-white border border-zinc-200 rounded-2xl flex flex-col gap-4 relative",
            selectedElementId === 'c1' && "ring-4 ring-red-500/20 border-red-500/50"
          )}>
            <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
            <div className="w-full h-4 bg-zinc-200 rounded" />
            <div className="w-1/2 h-4 bg-zinc-100 rounded" />
            {/* Button Component c1 */}
            <div className={clsx(
              "mt-2 w-full h-10 rounded-xl bg-zinc-900 flex items-center justify-center relative",
              selectedElementId === 'c1' && "ring-2 ring-red-500 ring-offset-2"
            )}>
               <div className="w-1/3 h-2 bg-white/40 rounded-full" />
               {selectedElementId === 'c1' && (
                 <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce duration-[2000ms]">
                   <Sparkles size={14} fill="currentColor" />
                 </div>
               )}
            </div>
          </div>

          {/* Card 2 / Link c2 */}
          <div className={clsx(
            "p-6 bg-white border border-zinc-200 rounded-2xl flex flex-col gap-4 justify-between relative",
            selectedElementId === 'c2' && "ring-4 ring-red-500/20 border-red-500/50"
          )}>
            <div>
              <div className="w-1/2 h-3 bg-zinc-200 rounded mb-2" />
              <div className="w-full h-4 bg-zinc-100 rounded" />
            </div>
            {/* Link element c2 */}
            <div className={clsx(
              "flex items-center gap-2 text-zinc-400 relative",
              selectedElementId === 'c2' && "text-red-600"
            )}>
              <div className={clsx("w-16 h-2 rounded-full", selectedElementId === 'c2' ? "bg-red-200" : "bg-zinc-200")} />
              <ExternalLink size={12} />
              {selectedElementId === 'c2' && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce duration-[2000ms]">
                  <Sparkles size={14} fill="currentColor" />
                </div>
              )}
            </div>
          </div>

          {/* Form Area / ZIP c5 */}
          <div className={clsx(
            "col-span-2 p-8 bg-white border border-zinc-200 rounded-2xl flex flex-col gap-6 relative",
            selectedElementId === 'c5' && "ring-4 ring-red-500/20 border-red-500/50"
          )}>
            <div className="w-1/4 h-3 bg-zinc-300 rounded" />
            <div className={clsx(
              "w-full h-12 border border-zinc-200 rounded-xl flex items-center px-4 relative",
              selectedElementId === 'c5' && "border-red-500/50 bg-red-50/10"
            )}>
              <div className="w-20 h-2 bg-zinc-200 rounded-full" />
              {selectedElementId === 'c5' && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce duration-[2000ms]">
                  <Sparkles size={14} fill="currentColor" />
                </div>
              )}
            </div>
            
            {/* CTA Continue c6 */}
            <div className={clsx(
              "w-1/2 h-12 rounded-full bg-zinc-900 mx-auto flex items-center justify-center relative",
              selectedElementId === 'c6' && "ring-2 ring-red-500 ring-offset-2"
            )}>
              <div className="w-1/4 h-2 bg-white/40 rounded-full" />
              {selectedElementId === 'c6' && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce duration-[2000ms]">
                  <Sparkles size={14} fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Filler */}
        <div className="w-full mt-auto pt-8 border-t border-zinc-100 flex justify-between px-4 opacity-30">
          <div className="w-20 h-2 bg-zinc-200 rounded" />
          <div className="flex gap-4">
            <div className="w-8 h-2 bg-zinc-200 rounded" />
            <div className="w-8 h-2 bg-zinc-200 rounded" />
          </div>
        </div>
      </div>

      {/* Screen Narrative Tag */}
      <div className="absolute bottom-6 left-6 px-4 py-2 bg-zinc-900 text-white text-[11px] font-bold rounded-full border border-white/20 shadow-2xl backdrop-blur-xl">
        {stepName} • {screenType}
      </div>
    </div>
  );
};
