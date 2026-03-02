import React from 'react';
import { clsx } from 'clsx';
import { Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

type StatusType = 'New' | 'Needs Context' | 'Ready for Analysis' | 'Processing' | 'Ready for Review' | 'Reviewed' | 'In Review' | 'Analyzing';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'New':
        return {
          label: 'New',
          icon: FileText,
          bgClass: 'bg-blue-100 dark:bg-blue-900/20',
          borderClass: 'border-blue-300 dark:border-blue-700',
          textClass: 'text-blue-700 dark:text-blue-300',
        };
      case 'Needs Context':
        return {
          label: 'Needs Context',
          icon: AlertCircle,
          bgClass: 'bg-amber-100 dark:bg-amber-900/20',
          borderClass: 'border-amber-300 dark:border-amber-700',
          textClass: 'text-amber-700 dark:text-amber-300',
        };
      case 'Ready for Analysis':
        return {
          label: 'Ready for Analysis',
          icon: CheckCircle2,
          bgClass: 'bg-emerald-100 dark:bg-emerald-900/20',
          borderClass: 'border-emerald-300 dark:border-emerald-700',
          textClass: 'text-emerald-700 dark:text-emerald-300',
        };
      case 'Processing':
      case 'Analyzing':
        return {
          label: 'Processing',
          icon: Loader2,
          bgClass: 'bg-indigo-100 dark:bg-indigo-900/20',
          borderClass: 'border-indigo-300 dark:border-indigo-700',
          textClass: 'text-indigo-700 dark:text-indigo-300',
          animate: true,
        };
      case 'Ready for Review':
        return {
          label: 'Ready for Review',
          icon: CheckCircle2,
          bgClass: 'bg-purple-100 dark:bg-purple-900/20',
          borderClass: 'border-purple-300 dark:border-purple-700',
          textClass: 'text-purple-700 dark:text-purple-300',
        };
      case 'Reviewed':
      case 'In Review':
        return {
          label: 'Reviewed',
          icon: CheckCircle2,
          bgClass: 'bg-green-100 dark:bg-green-900/20',
          borderClass: 'border-green-300 dark:border-green-700',
          textClass: 'text-green-700 dark:text-green-300',
        };
      default:
        return {
          label: status,
          icon: FileText,
          bgClass: 'bg-zinc-100 dark:bg-zinc-800',
          borderClass: 'border-zinc-300 dark:border-zinc-700',
          textClass: 'text-zinc-700 dark:text-zinc-300',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-[12px]',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <div className={clsx(
      'inline-flex items-center gap-1.5 rounded-md border font-bold uppercase tracking-widest',
      config.bgClass,
      config.borderClass,
      config.textClass,
      sizeClasses[size]
    )}>
      {showIcon && (
        <Icon 
          size={iconSizes[size]} 
          className={clsx(config.animate && 'animate-spin')} 
        />
      )}
      <span>{config.label}</span>
    </div>
  );
};
