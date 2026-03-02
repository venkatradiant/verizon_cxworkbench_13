import React, { useState } from 'react';
import { Brain, Filter, Download, Search, ChevronDown, CheckCircle2, Clock, AlertCircle, MessageSquare, X, Send, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { useChat } from '@/app/context/ChatContext';
import { toast } from 'sonner';

interface FeedbackLogEntry {
  id: string;
  journeyId: string;
  journeyName: string;
  recommendationType: 'User Interaction' | 'System Event' | 'Data Layer Variable';
  recommendationName: string;
  rejectionReason: string;
  rejectionReasonLabel: string;
  additionalContext: string;
  appliedScope: 'local' | 'global';
  status: 'training_applied' | 'pending' | 'processed';
  date: string;
  baName: string;
}

const mockFeedbackLog: FeedbackLogEntry[] = [
  {
    id: '1',
    journeyId: 'VZW-5G-001',
    journeyName: '5G UW Upgrade Flow',
    recommendationType: 'User Interaction',
    recommendationName: 'Continue Button Click',
    rejectionReason: 'incorrect_business_rule',
    rejectionReasonLabel: 'Incorrect business rule applied',
    additionalContext: 'This should be tagged as confirmation CTA, not navigation',
    appliedScope: 'global',
    status: 'training_applied',
    date: '2026-02-12 14:23',
    baName: 'Sarah Chen'
  },
  {
    id: '2',
    journeyId: 'VZW-CART-045',
    journeyName: 'Shopping Cart Checkout',
    recommendationType: 'Data Layer Variable',
    recommendationName: 'cart_abandon_reason',
    rejectionReason: 'not_relevant',
    rejectionReasonLabel: 'Not relevant to this journey',
    additionalContext: 'We don\'t track abandonment reasons in checkout flow',
    appliedScope: 'local',
    status: 'training_applied',
    date: '2026-02-11 09:15',
    baName: 'Marcus Johnson'
  },
  {
    id: '3',
    journeyId: 'VZW-AUTH-012',
    journeyName: 'Account Login Flow',
    recommendationType: 'System Event',
    recommendationName: 'Form Validation Error',
    rejectionReason: 'duplicate_tracking',
    rejectionReasonLabel: 'Duplicate tracking',
    additionalContext: 'Already tracked at form level, no need for field-level',
    appliedScope: 'global',
    status: 'processed',
    date: '2026-02-10 16:42',
    baName: 'Sarah Chen'
  },
  {
    id: '4',
    journeyId: 'VZW-5G-001',
    journeyName: '5G UW Upgrade Flow',
    recommendationType: 'User Interaction',
    recommendationName: 'Trade-in Modal Open',
    rejectionReason: 'misinterpreted_figma',
    rejectionReasonLabel: 'Misinterpreted Figma mockup',
    additionalContext: 'This is a tooltip, not a modal dialog',
    appliedScope: 'local',
    status: 'pending',
    date: '2026-02-12 11:08',
    baName: 'David Kim'
  },
  {
    id: '5',
    journeyId: 'VZW-BILL-089',
    journeyName: 'Bill Payment Journey',
    recommendationType: 'Data Layer Variable',
    recommendationName: 'payment_processor_code',
    rejectionReason: 'incorrect_format',
    rejectionReasonLabel: 'Incorrect key/value format',
    additionalContext: 'Should use snake_case not camelCase',
    appliedScope: 'global',
    status: 'training_applied',
    date: '2026-02-09 13:27',
    baName: 'Marcus Johnson'
  }
];

export const AIFeedbackLog = () => {
  const { openPanel } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [feedbackModalEntry, setFeedbackModalEntry] = useState<FeedbackLogEntry | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleGiveFeedback = (entry: FeedbackLogEntry) => {
    setFeedbackModalEntry(entry);
    setFeedbackText('');
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackModalEntry(null);
    setFeedbackText('');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackModalEntry || !feedbackText.trim()) return;

    // Open chat with context
    openPanel();
    
    // Simulate sending context to chatbot
    const contextMessage = `Regarding log entry: ${feedbackModalEntry.journeyName} - ${feedbackModalEntry.recommendationName}. ${feedbackText}`;
    
    toast.success('Feedback sent to AI', {
      description: 'Your correction has been logged and will be used for training'
    });

    handleCloseFeedbackModal();
  };

  const filteredLog = mockFeedbackLog.filter(entry => {
    const matchesSearch = searchQuery === '' ||
      entry.journeyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.recommendationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.rejectionReasonLabel.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesScope = scopeFilter === 'all' || entry.appliedScope === scopeFilter;
    const matchesType = typeFilter === 'all' || entry.recommendationType === typeFilter;

    return matchesSearch && matchesStatus && matchesScope && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'training_applied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={10} />
            Training Applied
          </span>
        );
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={10} />
            Processed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            <Clock size={10} />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getScopeBadge = (scope: string) => {
    return scope === 'global' ? (
      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded text-[9px] font-bold uppercase tracking-wider">
        Global
      </span>
    ) : (
      <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded text-[9px] font-bold uppercase tracking-wider">
        Local
      </span>
    );
  };

  const stats = {
    total: mockFeedbackLog.length,
    trainingApplied: mockFeedbackLog.filter(e => e.status === 'training_applied').length,
    pending: mockFeedbackLog.filter(e => e.status === 'pending').length,
    global: mockFeedbackLog.filter(e => e.appliedScope === 'global').length
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Brain size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-[24px] font-bold text-foreground">AI Feedback Log</h2>
            <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
              Track rejected recommendations and AI learning signals for governance and transparency
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-card border-2 border-border rounded-xl">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Feedback</div>
          <div className="text-[28px] font-bold text-foreground">{stats.total}</div>
        </div>
        <div className="p-4 bg-card border-2 border-emerald-200 dark:border-emerald-800 rounded-xl">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Training Applied</div>
          <div className="text-[28px] font-bold text-emerald-600 dark:text-emerald-400">{stats.trainingApplied}</div>
        </div>
        <div className="p-4 bg-card border-2 border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Pending</div>
          <div className="text-[28px] font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
        </div>
        <div className="p-4 bg-card border-2 border-purple-200 dark:border-purple-800 rounded-xl">
          <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Global Patterns</div>
          <div className="text-[28px] font-bold text-purple-600 dark:text-purple-400">{stats.global}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by journey, recommendation, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-xl text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          />
        </div>

        {/* Type Filter */}
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 bg-surface-secondary border border-border rounded-lg text-[12px] font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Types</option>
          <option value="User Interaction">User Interaction</option>
          <option value="System Event">System Event</option>
          <option value="Data Layer Variable">Data Layer Variable</option>
        </select>

        {/* Status Filter */}
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-surface-secondary border border-border rounded-lg text-[12px] font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Status</option>
          <option value="training_applied">Training Applied</option>
          <option value="processed">Processed</option>
          <option value="pending">Pending</option>
        </select>

        {/* Scope Filter */}
        <select 
          value={scopeFilter}
          onChange={(e) => setScopeFilter(e.target.value)}
          className="px-3 py-2.5 bg-surface-secondary border border-border rounded-lg text-[12px] font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Scopes</option>
          <option value="local">Local Only</option>
          <option value="global">Global</option>
        </select>

        <button className="px-4 py-2.5 bg-card border-2 border-border hover:border-accent rounded-xl text-[12px] font-bold text-foreground transition-all flex items-center gap-2">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-primary border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Journey</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Recommendation</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Rejection Reason</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Scope</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">BA</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLog.map((entry) => (
                <tr key={entry.id} className="hover:bg-surface-secondary transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-foreground">{entry.journeyName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{entry.journeyId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-medium text-foreground">{entry.recommendationName}</span>
                      <span className="text-[11px] text-muted-foreground">{entry.recommendationType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-bold text-foreground">{entry.rejectionReasonLabel}</span>
                      {entry.additionalContext && (
                        <span className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {entry.additionalContext}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getScopeBadge(entry.appliedScope)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(entry.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] text-muted-foreground">{entry.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-medium text-foreground">{entry.baName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleGiveFeedback(entry)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg text-[11px] font-bold flex items-center gap-1.5"
                      title="Give feedback on this decision"
                    >
                      <MessageSquare size={12} />
                      Give Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl">
        <Brain size={16} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-bold text-purple-900 dark:text-purple-300">AI Learning Transparency</span>
          <p className="text-[12px] text-purple-700 dark:text-purple-400 leading-relaxed">
            This log provides full visibility into how AI learns from Business Analyst feedback. Global scope patterns influence future recommendations across all journeys.
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModalEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border-2 border-border rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-border bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-foreground">Give AI Feedback</h3>
                  <p className="text-[12px] text-muted-foreground">Help improve future recommendations</p>
                </div>
              </div>
              <button 
                className="w-8 h-8 rounded-lg hover:bg-surface-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground" 
                onClick={handleCloseFeedbackModal}
              >
                <X size={18} />
              </button>
            </div>

            {/* Context Display */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-surface-secondary border border-border rounded-xl">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Log Entry Context</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Journey</div>
                    <div className="text-[13px] font-bold text-foreground">{feedbackModalEntry.journeyName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{feedbackModalEntry.journeyId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Recommendation</div>
                    <div className="text-[13px] font-bold text-foreground">{feedbackModalEntry.recommendationName}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{feedbackModalEntry.recommendationType}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Original Rejection Reason</div>
                  <div className="text-[12px] font-medium text-foreground">{feedbackModalEntry.rejectionReasonLabel}</div>
                  {feedbackModalEntry.additionalContext && (
                    <div className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed italic">
                      "{feedbackModalEntry.additionalContext}"
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Input */}
              <div>
                <label className="text-[12px] font-bold text-foreground mb-2 block">
                  What would you like AI to learn from this?
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Example: 'Wrong rule applied - this should use Checkout Flow Rule instead' or 'The AI misinterpreted the button placement'"
                  className="w-full h-32 px-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-muted-foreground">
                    This feedback will be used to improve AI accuracy
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {feedbackText.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-border bg-surface-secondary">
              <button 
                className="px-5 py-2.5 bg-card border-2 border-border hover:border-foreground rounded-xl text-[13px] font-bold text-foreground transition-all" 
                onClick={handleCloseFeedbackModal}
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim()}
              >
                <Send size={14} />
                Submit to AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};