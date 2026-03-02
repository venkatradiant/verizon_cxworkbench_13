import React from 'react';
import { useLocation } from 'react-router';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, label: 'Analyze', path: '/playground/journey-definition' },
  { id: 2, label: 'Developer Package', path: '/playground/developer-package' },
  { id: 3, label: 'Validate', path: '/playground/validation-agents' },
];

interface StepProgressionProps {
  activeStep?: number;
}

export const StepProgression = ({ activeStep }: StepProgressionProps) => {
  const location = useLocation();
  
  // Try to find index by path, or use the prop
  const pathIndex = steps.findIndex(step => location.pathname.startsWith(step.path));
  const currentStepIndex = activeStep !== undefined ? activeStep - 1 : (pathIndex !== -1 ? pathIndex : 0);

  return (
    <div className="flex items-center justify-between w-full py-4 px-4 max-w-[1200px] mx-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        
        return (
          <div key={step.id} className="contents">
            {/* Step Item */}
            <div className={clsx(
              "flex items-center gap-3 group transition-all shrink-0 relative z-10",
              isActive ? "opacity-100" : isCompleted ? "opacity-100" : "opacity-40"
            )}>
              {/* Circle Indicator */}
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all border shadow-sm shrink-0",
                isActive 
                  ? 'bg-[var(--brand-black)] text-white border-[var(--brand-black)] ring-4 ring-black/5' 
                  : isCompleted 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.3)]' 
                    : 'bg-white text-[var(--text-tertiary)] border-[var(--border-subtle)]'
              )}>
                {isCompleted ? <Check size={16} strokeWidth={4} /> : step.id}
              </div>
              
              {/* Label Content */}
              <div className="flex flex-col">
                <span className={clsx(
                  "tracking-tight leading-none transition-all whitespace-nowrap",
                  isActive 
                    ? 'text-[var(--text-primary)] text-[14px] font-bold' 
                    : 'text-[var(--text-tertiary)] text-[12px] font-semibold'
                )}>
                  {step.label}
                </span>
              </div>
            </div>

            {/* Line Connector */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[1px] mx-4 bg-[var(--border-subtle)]/40 rounded-full overflow-hidden min-w-[20px] relative">
                <div 
                  className={clsx(
                    "h-full bg-emerald-500 transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(16,185,129,0.2)]",
                    isCompleted ? 'w-full' : 'w-0'
                  )} 
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};