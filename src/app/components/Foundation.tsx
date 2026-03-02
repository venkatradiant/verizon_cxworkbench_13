import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'neutral';
  label: string;
  className?: string;
}

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const styles = {
    success: 'bg-[var(--status-success-bg)] text-[var(--status-success-text)] border-emerald-100/50',
    warning: 'bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border-amber-100/50',
    error: 'bg-[var(--status-error-bg)] text-[var(--status-error-text)] border-rose-100/50',
    neutral: 'bg-[var(--surface-secondary)] text-[var(--text-tertiary)] border-[var(--border-subtle)]/50',
  };

  return (
    <span className={clsx(
      "px-2.5 py-1 rounded-[var(--radius-badge)] text-[9px] font-bold uppercase tracking-wider border",
      styles[status],
      className
    )}>
      {label}
    </span>
  );
};

export const ConceptualLabel = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 text-[var(--text-tertiary)] rounded-full text-[10px] font-bold tracking-wide border border-[var(--border-subtle)] shadow-sm">
    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    Strategic Prototype View
  </div>
);

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const CardContainer = ({ children, className, hoverable = false }: CardContainerProps) => (
  <div 
    className={clsx(
      "bg-white border border-[var(--border-subtle)] rounded-[var(--radius-card)] p-[var(--spacing-card)] transition-all duration-300",
      hoverable && "hover:border-[var(--accent-primary)] hover:shadow-xl hover:shadow-red-900/5 cursor-pointer",
      className
    )}
  >
    {children}
  </div>
);

export const PageSection = ({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-1.5">
      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">{title}</h3>
      {description && <p className="text-[13px] text-[var(--text-tertiary)] font-normal">{description}</p>}
    </div>
    {children}
  </div>
);
