import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';

const REJECTION_REASONS = [
  { value: 'incorrect_business_rule', label: 'Incorrect business rule applied' },
  { value: 'misinterpreted_figma', label: 'Misinterpreted Figma mockup' },
  { value: 'wrong_data_source', label: 'Wrong data source used' },
  { value: 'incorrect_format', label: 'Incorrect key/value format' },
  { value: 'duplicate_tracking', label: 'Duplicate tracking' },
  { value: 'not_relevant', label: 'Not relevant to this journey' },
  { value: 'other', label: 'Other (requires explanation)' }
];

export const REJECTION_REASONS_MAP = REJECTION_REASONS.reduce((acc, r) => ({
  ...acc,
  [r.value]: r.label
}), {} as Record<string, string>);

export interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, additionalContext: string, scope: 'local' | 'global') => void;
  recommendationType: 'User Interaction' | 'System Event' | 'Data Layer Variable';
  recommendationName: string;
}

export const RejectionReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  recommendationType,
  recommendationName
}: RejectionReasonModalProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [scope, setScope] = useState<'local' | 'global'>('local');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validation
    if (!selectedReason) {
      setError('Please select a rejection reason');
      return;
    }

    if (selectedReason === 'other' && !additionalContext.trim()) {
      setError('Please provide additional context for "Other" reason');
      return;
    }

    // Submit the rejection
    onSubmit(selectedReason, additionalContext, scope);
    
    // Show success toast notification
    toast.success('Recommendation rejected successfully', {
      description: `Rejected: ${recommendationName}`,
      duration: 4000,
    });
    
    // Close modal and reset
    handleClose();
  };

  const handleClose = () => {
    setSelectedReason('');
    setAdditionalContext('');
    setScope('local');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const selectedReasonLabel = REJECTION_REASONS.find(r => r.value === selectedReason)?.label || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-border bg-surface-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-foreground">
                Why are you rejecting this recommendation?
              </h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {recommendationType}: <span className="font-bold text-foreground">{recommendationName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            {/* Info Banner */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[13px] text-blue-800 dark:text-blue-300 leading-relaxed">
                Your feedback helps AI improve future recommendations. Please select the primary reason for rejection.
              </p>
            </div>

            {/* Structured Reason (Required) */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[13px] font-bold text-foreground">
                Structured Reason <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {REJECTION_REASONS.map((reason) => (
                  <label
                    key={reason.value}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 border-2 rounded-xl cursor-pointer transition-all",
                      selectedReason === reason.value
                        ? "bg-accent/10 border-accent"
                        : "bg-card border-border hover:border-accent/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="rejection-reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => {
                        setSelectedReason(e.target.value);
                        setError('');
                      }}
                      className="w-4 h-4 text-accent focus:ring-2 focus:ring-accent"
                    />
                    <span className={clsx(
                      "text-[13px] font-medium",
                      selectedReason === reason.value ? "text-foreground font-bold" : "text-muted-foreground"
                    )}>
                      {reason.label}
                    </span>
                  </label>
                ))}
              </div>
              {error && (
                <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Optional Free Text Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground">
                Additional Context <span className="text-[11px] font-normal text-muted-foreground">(Optional)</span>
              </label>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Help AI understand the specific issue to prevent similar mistakes
              </p>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g., This button should track as 'primary_cta' not 'secondary_action'"
                rows={3}
                className="px-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
              />
            </div>

            {/* Apply Scope Option */}
            <div className="flex flex-col gap-2.5 p-3 bg-surface-secondary border-2 border-border rounded-xl">
              <label className="text-[13px] font-bold text-foreground">
                Apply Feedback Scope
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="scope"
                    value="local"
                    checked={scope === 'local'}
                    onChange={(e) => setScope('local')}
                    className="mt-0.5 w-4 h-4 text-accent focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-foreground group-hover:text-accent transition-colors">
                      Apply to this journey only
                    </span>
                    <span className="text-[12px] text-muted-foreground leading-relaxed">
                      Feedback applies only to this specific journey
                    </span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="scope"
                    value="global"
                    checked={scope === 'global'}
                    onChange={(e) => setScope('global')}
                    className="mt-0.5 w-4 h-4 text-accent focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-foreground group-hover:text-accent transition-colors">
                      Apply to similar future journeys
                    </span>
                    <span className="text-[12px] text-muted-foreground leading-relaxed">
                      AI will remember this pattern for future recommendations
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t-2 border-border bg-surface-primary">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 bg-card border-2 border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-surface-secondary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className={clsx(
              "px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center gap-2",
              selectedReason
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-surface-secondary text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            <CheckCircle2 size={16} />
            Submit & Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export { REJECTION_REASONS };