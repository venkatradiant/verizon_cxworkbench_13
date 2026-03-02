import React from 'react';
import { CardContainer } from '@/app/components/Foundation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { StepProgression } from '@/app/components/StepProgression';
import { clsx } from 'clsx';

interface PageContainerProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  isPlayground?: boolean;
}

export const PageContainer = ({ title, subtitle, children, isPlayground = false }: PageContainerProps) => {
  return (
    <div className="flex-1 px-8 pt-6 pb-10 flex flex-col gap-8 bg-transparent">
      {/* Header Section */}
      <div className="w-full flex flex-col gap-6">
        {/* Step Progression (Only for Narrative sub-pages) */}
        {!isPlayground && (
          <div className="flex justify-center border-b border-[var(--border-subtle)]/20 pb-6 mb-2">
            <div className="w-full">
              <StepProgression activeStep={1} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {isPlayground && (
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-white/80 border border-[var(--border-subtle)] text-[var(--text-tertiary)] px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} className="text-[var(--accent-primary)]" />
                Active Narrative
              </div>
            </div>
          )}
          <h1 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">{title}</h1>
          <p className="text-[15px] text-[var(--text-secondary)] opacity-70 max-w-3xl leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 flex flex-col gap-12 w-full">
        {children}
      </div>
    </div>
  );
};

export const ComingSoonPlaceholder = ({ description, title = "Playground Narrative" }: { description: string, title?: string }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[520px] bg-white/60 border border-[var(--border-subtle)] rounded-[32px] shadow-sm">
      <div className="text-center max-w-lg px-8">
        <div className="w-20 h-20 bg-[var(--tone-warm-neutral)]/50 rounded-[28px] flex items-center justify-center mx-auto mb-10 border border-[var(--border-subtle)]/50">
          <div className="w-10 h-10 border-2 border-dashed border-[var(--accent-primary)]/30 rounded-xl"></div>
        </div>
        
        <h3 className="text-[20px] font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        <p className="text-[14px] text-[var(--text-secondary)] opacity-70 mb-10 leading-relaxed font-normal">
          {description}
        </p>
        
        <div className="flex flex-col items-center gap-6">
          <button className="flex items-center gap-2 px-8 py-3 bg-[var(--brand-black)] text-white rounded-full text-[14px] font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
            Start exploring
            <ArrowRight size={18} />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 text-[var(--text-tertiary)] rounded-full text-[11px] font-bold border border-[var(--border-subtle)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Blueprint Draft – Human governed, AI assisted
          </div>
        </div>
      </div>
    </div>
  );
};
