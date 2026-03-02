import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, label: 'Analyze' },
  { id: 2, label: 'Developer Package' },
  { id: 3, label: 'Validate' },
];

interface JourneyStepperProps {
  activeStep: number;
}

export const JourneyStepper = ({ activeStep }: JourneyStepperProps) => {
  const currentStepIndex = activeStep - 1;

  return (
    <div className="flex items-center justify-center gap-16 w-full py-4 px-10 max-w-[1440px] mx-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        
        return (
          <div key={step.id} className="flex items-center gap-6">
            {/* Step Item */}
            <div className={clsx(
              "flex items-center gap-4 group transition-all shrink-0 relative z-10",
              isActive ? "opacity-100" : isCompleted ? "opacity-100" : "opacity-40"
            )}>
              {/* Circle Indicator */}
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold transition-all border shadow-sm shrink-0",
                isActive 
                  ? 'bg-[var(--brand-black)] text-white border-[var(--brand-black)] ring-6 ring-black/5' 
                  : isCompleted 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_2px_12px_-2px_rgba(16,185,129,0.3)]' 
                    : 'bg-white text-[var(--text-tertiary)] border-[var(--border-subtle)]'
              )}>
                {isCompleted ? <Check size={20} strokeWidth={3} /> : step.id}
              </div>
              
              {/* Label Content */}
              <span className={clsx(
                "tracking-tight transition-all whitespace-nowrap",
                isActive 
                  ? 'text-[var(--text-primary)] text-[15px] font-bold' 
                  : 'text-[var(--text-tertiary)] text-[14px] font-semibold'
              )}>
                {step.label}
              </span>
            </div>

            {/* Line Connector */}
            {index < steps.length - 1 && (
              <div className="w-24 h-[1px] bg-[var(--border-subtle)]/30 rounded-full overflow-hidden relative">
                <div 
                  className={clsx(
                    "h-full bg-emerald-500 transition-all duration-700 ease-in-out",
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