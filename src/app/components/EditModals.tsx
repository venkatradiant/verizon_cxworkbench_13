import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const Motion = motion;

interface BusinessRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: any) => void;
  rule?: {
    id: string;
    name: string;
    description: string;
    status: 'Active' | 'Inactive';
    source: 'System' | 'User-defined';
    lastModified: string;
  } | null;
  mode: 'add' | 'edit';
}

export const BusinessRuleModal: React.FC<BusinessRuleModalProps> = ({ isOpen, onClose, onSave, rule, mode }) => {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [status, setStatus] = useState<'Active' | 'Inactive'>(rule?.status || 'Active');
  const [source, setSource] = useState<'System' | 'User-defined'>(rule?.source || 'User-defined');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  // Reset form when modal opens/closes or rule changes
  React.useEffect(() => {
    if (isOpen) {
      setName(rule?.name || '');
      setDescription(rule?.description || '');
      setStatus(rule?.status || 'Active');
      setSource(rule?.source || 'User-defined');
      setErrors({});
    }
  }, [isOpen, rule]);

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Rule name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const ruleData = {
      id: rule?.id || Math.random().toString(36).substr(2, 9),
      name,
      description,
      status,
      source,
      lastModified: new Date().toISOString().split('T')[0],
    };
    
    onSave(ruleData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-surface-secondary">
            <div>
              <h2 className="text-[20px] font-black text-foreground">
                {mode === 'add' ? 'Add New Business Rule' : 'Edit Business Rule'}
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1">
                {mode === 'add' 
                  ? 'Define a new rule to guide AI telemetry recommendations' 
                  : 'Update rule configuration and behavior'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-primary transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-6">
              {/* Rule Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Rule Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={clsx(
                    "w-full px-4 py-3 bg-surface-primary border rounded-xl text-[14px] font-medium text-foreground outline-none transition-all",
                    errors.name
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  )}
                  placeholder="e.g., Button Click Priority"
                />
                {errors.name && (
                  <div className="flex items-center gap-2 text-[12px] text-red-600 dark:text-red-400">
                    <AlertCircle size={12} />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={clsx(
                    "w-full px-4 py-3 bg-surface-primary border rounded-xl text-[14px] font-medium text-foreground outline-none transition-all resize-none",
                    errors.description
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  )}
                  placeholder="Describe what this rule does and when it applies..."
                />
                <div className="flex items-center justify-between">
                  {errors.description && (
                    <div className="flex items-center gap-2 text-[12px] text-red-600 dark:text-red-400">
                      <AlertCircle size={12} />
                      {errors.description}
                    </div>
                  )}
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    {description.length} characters
                  </span>
                </div>
              </div>

              {/* Source */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">Source</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSource('System')}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold text-[14px]",
                      source === 'System'
                        ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300"
                        : "bg-surface-primary border-border text-muted-foreground hover:border-muted-foreground"
                    )}
                  >
                    System
                  </button>
                  <button
                    onClick={() => setSource('User-defined')}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold text-[14px]",
                      source === 'User-defined'
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300"
                        : "bg-surface-primary border-border text-muted-foreground hover:border-muted-foreground"
                    )}
                  >
                    User-defined
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">Status</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStatus('Active')}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold text-[14px]",
                      status === 'Active'
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                        : "bg-surface-primary border-border text-muted-foreground hover:border-muted-foreground"
                    )}
                  >
                    <div className={clsx("w-3 h-3 rounded-full", status === 'Active' ? "bg-emerald-500" : "bg-muted-foreground")} />
                    Active
                  </button>
                  <button
                    onClick={() => setStatus('Inactive')}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold text-[14px]",
                      status === 'Inactive'
                        ? "bg-zinc-100 dark:bg-zinc-900/20 border-zinc-400 text-zinc-700 dark:text-zinc-300"
                        : "bg-surface-primary border-border text-muted-foreground hover:border-muted-foreground"
                    )}
                  >
                    <div className={clsx("w-3 h-3 rounded-full", status === 'Inactive' ? "bg-zinc-400" : "bg-muted-foreground")} />
                    Inactive
                  </button>
                </div>
              </div>

              {/* Metadata (only in edit mode) */}
              {mode === 'edit' && rule && (
                <div className="flex flex-col gap-2 p-4 bg-surface-secondary rounded-xl border border-border">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Rule ID:</span>
                    <span className="font-mono text-foreground">{rule.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Last Modified:</span>
                    <span className="font-bold text-foreground">{rule.lastModified}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-surface-secondary">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-card border border-border hover:border-foreground rounded-xl text-[13px] font-bold text-foreground transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-[13px] font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save size={16} />
              {mode === 'add' ? 'Add Rule' : 'Save Changes'}
            </button>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};

interface EditDataLayerVariableModalProps {
  variable: {
    id: string;
    variableName: string;
    description: string;
    acceptableValues: string;
    type: string;
    scope: string;
    required: boolean;
    source: 'AI-suggested' | 'User-added';
  };
  onClose: () => void;
  onSave: (updatedVariable: any) => void;
}

export const EditDataLayerVariableModal: React.FC<EditDataLayerVariableModalProps> = ({ variable, onClose, onSave }) => {
  const [variableName, setVariableName] = useState(variable.variableName);
  const [description, setDescription] = useState(variable.description);
  const [acceptableValues, setAcceptableValues] = useState(variable.acceptableValues);
  const [type, setType] = useState(variable.type);
  const [scope, setScope] = useState(variable.scope);
  const [required, setRequired] = useState(variable.required);
  const [errors, setErrors] = useState<{ variableName?: string; description?: string; acceptableValues?: string }>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!variableName.trim()) {
      newErrors.variableName = 'Variable name is required';
    } else if (!/^[a-z_][a-z0-9_]*$/.test(variableName)) {
      newErrors.variableName = 'Must be snake_case (lowercase with underscores)';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!acceptableValues.trim()) {
      newErrors.acceptableValues = 'Acceptable values are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    onSave({
      ...variable,
      variableName,
      description,
      acceptableValues,
      type,
      scope,
      required,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-surface-secondary">
            <div>
              <h2 className="text-[20px] font-black text-foreground">Edit Data Layer Variable</h2>
              <p className="text-[13px] text-muted-foreground mt-1">
                Update variable definition and constraints
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-primary transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-6">
              {/* Variable Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Variable Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  className={clsx(
                    "w-full px-4 py-3 bg-surface-primary border rounded-xl text-[14px] font-mono font-medium text-foreground outline-none transition-all",
                    errors.variableName
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  )}
                  placeholder="e.g., page_category"
                />
                {errors.variableName && (
                  <div className="flex items-center gap-2 text-[12px] text-red-600 dark:text-red-400">
                    <AlertCircle size={12} />
                    {errors.variableName}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={clsx(
                    "w-full px-4 py-3 bg-surface-primary border rounded-xl text-[14px] font-medium text-foreground outline-none transition-all resize-none",
                    errors.description
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  )}
                  placeholder="Describe what this variable captures..."
                />
                {errors.description && (
                  <div className="flex items-center gap-2 text-[12px] text-red-600 dark:text-red-400">
                    <AlertCircle size={12} />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Acceptable Values */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Acceptable Values <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={acceptableValues}
                  onChange={(e) => setAcceptableValues(e.target.value)}
                  className={clsx(
                    "w-full px-4 py-3 bg-surface-primary border rounded-xl text-[14px] font-mono font-medium text-foreground outline-none transition-all",
                    errors.acceptableValues
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                  )}
                  placeholder="e.g., retail | support | account"
                />
                {errors.acceptableValues && (
                  <div className="flex items-center gap-2 text-[12px] text-red-600 dark:text-red-400">
                    <AlertCircle size={12} />
                    {errors.acceptableValues}
                  </div>
                )}
              </div>

              {/* Type and Scope */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-foreground">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-primary border border-border rounded-xl text-[14px] font-medium text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="string">string</option>
                    <option value="enum">enum</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="object">object</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-foreground">Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-primary border border-border rounded-xl text-[14px] font-medium text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="page">page</option>
                    <option value="session">session</option>
                    <option value="user">user</option>
                    <option value="event">event</option>
                  </select>
                </div>
              </div>

              {/* Required Toggle */}
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl border border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-bold text-foreground">Required Variable</span>
                  <span className="text-[12px] text-muted-foreground">Must be present in all tracking implementations</span>
                </div>
                <button
                  onClick={() => setRequired(!required)}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-all relative",
                    required ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  )}
                >
                  <div className={clsx(
                    "w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-all",
                    required ? "right-0.5" : "left-0.5"
                  )} />
                </button>
              </div>

              {/* Metadata */}
              <div className="flex flex-col gap-2 p-4 bg-surface-secondary rounded-xl border border-border">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Source:</span>
                  <span className={clsx(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    variable.source === 'AI-suggested'
                      ? "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                      : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                  )}>
                    {variable.source}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Variable ID:</span>
                  <span className="font-mono text-foreground">{variable.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-surface-secondary">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-card border border-border hover:border-foreground rounded-xl text-[13px] font-bold text-foreground transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-[13px] font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};