import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface DataLayerVariable {
  id: string;
  variableName: string;
  description: string;
  acceptableValues: string;
  type: string;
  scope: string;
  required: boolean;
  source: 'AI-suggested' | 'User-added';
}

interface DataLayerVariableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variable: DataLayerVariable | Omit<DataLayerVariable, 'id'>) => void;
  variable?: DataLayerVariable | null;
  mode: 'add' | 'edit';
}

export const DataLayerVariableModal = ({ isOpen, onClose, onSave, variable, mode }: DataLayerVariableModalProps) => {
  const [formData, setFormData] = useState({
    variableName: '',
    description: '',
    acceptableValues: '',
    type: 'string',
    scope: 'page',
    required: false,
    source: 'User-added' as 'AI-suggested' | 'User-added'
  });

  useEffect(() => {
    if (variable && mode === 'edit') {
      setFormData({
        variableName: variable.variableName,
        description: variable.description,
        acceptableValues: variable.acceptableValues,
        type: variable.type,
        scope: variable.scope,
        required: variable.required,
        source: variable.source
      });
    } else {
      setFormData({
        variableName: '',
        description: '',
        acceptableValues: '',
        type: 'string',
        scope: 'page',
        required: false,
        source: 'User-added'
      });
    }
  }, [variable, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'edit' && variable) {
      onSave({ ...variable, ...formData });
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-primary">
          <div>
            <h2 className="text-[20px] font-bold text-foreground">
              {mode === 'add' ? 'Add New Variable' : 'Edit Variable'}
            </h2>
            <p className="text-[13px] text-muted-foreground mt-1">
              {mode === 'add' ? 'Define a new data layer variable' : 'Update variable configuration'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            {/* Variable Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground">
                Variable Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.variableName}
                onChange={(e) => setFormData({ ...formData, variableName: e.target.value })}
                placeholder="e.g., page_name, user_id"
                className="px-4 py-2.5 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this variable represents"
                rows={3}
                className="px-4 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
              />
            </div>

            {/* Acceptable Values */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-foreground">
                Acceptable Values <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.acceptableValues}
                onChange={(e) => setFormData({ ...formData, acceptableValues: e.target.value })}
                placeholder="e.g., String | retail | support | account"
                className="px-4 py-2.5 bg-background border border-border rounded-lg text-[13px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            {/* Type & Scope Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="px-4 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                >
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="boolean">Boolean</option>
                  <option value="array">Array</option>
                  <option value="enum">Enum</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Scope <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="px-4 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                >
                  <option value="page">Page</option>
                  <option value="session">Session</option>
                  <option value="event">Event</option>
                  <option value="global">Global</option>
                </select>
              </div>
            </div>

            {/* Required & Source Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">Required</label>
                <label className="flex items-center gap-3 px-4 py-2.5 bg-surface-secondary border border-border rounded-lg cursor-pointer hover:bg-surface-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-2 focus:ring-accent"
                  />
                  <span className="text-[13px] text-foreground">Mark as required field</span>
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as 'AI-suggested' | 'User-added' })}
                  className="px-4 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                >
                  <option value="AI-suggested">AI-suggested</option>
                  <option value="User-added">User-added</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-primary">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-card border border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-surface-secondary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm"
          >
            {mode === 'add' ? 'Add Variable' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
