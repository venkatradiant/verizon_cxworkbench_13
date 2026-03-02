import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface WorkflowActionBarProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextSublabel?: string;
  statusTitle: string;
  statusSubtitle: string;
  isValid?: boolean;
  isProcessing?: boolean;
  className?: string;
  secondaryAction?: React.ReactNode;
}

export const WorkflowActionBar: React.FC<WorkflowActionBarProps> = ({
  onBack,
  onNext,
  nextLabel,
  nextSublabel,
  statusTitle,
  statusSubtitle,
  isValid = true,
  isProcessing = false,
  className,
  secondaryAction
}) => {
  return (
    <div className={clsx(
      "w-full bg-white/95 backdrop-blur-xl border-t border-zinc-200 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] px-10 py-5 shrink-0",
      className
    )}>
      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-3 items-center">
        
        {/* Left Zone: Navigation */}
        <div className="flex justify-start items-center">
          <button 
            onClick={onBack}
            className="px-6 py-3 text-[14px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        {/* Center Zone: Status & Validation Feedback */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-1">
            <div className="relative">
              <div className={clsx(
                "w-2.5 h-2.5 rounded-full",
                isValid ? "bg-emerald-500" : "bg-amber-500"
              )} />
              {isValid && (
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-30" />
              )}
            </div>
            <span className="text-[14px] font-bold text-zinc-900 leading-none">
              {statusTitle}
            </span>
          </div>
          <span className="text-[12px] text-zinc-500 font-medium tracking-tight">
            {statusSubtitle}
          </span>
        </div>

        {/* Right Zone: Primary CTA & Secondary */}
        <div className="flex items-center justify-end gap-6">
          {secondaryAction}
          <div className="flex flex-col items-end">
            <button 
              onClick={onNext}
              disabled={isProcessing}
              className={clsx(
                "px-10 py-3.5 bg-zinc-900 text-white rounded-full text-[15px] font-bold flex items-center gap-3 transition-all shadow-lg hover:shadow-black/10 cursor-pointer group active:scale-[0.98]",
                isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] hover:bg-black"
              )}
            >
              {nextLabel}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            {nextSublabel && (
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2 mr-4">
                {nextSublabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
