import React, { useState } from 'react';
import { 
  Eye, 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingDown, 
  TrendingUp,
  Download,
  Share2,
  Info,
  Shield,
  Activity,
  Brain,
  FileText,
  MessageSquare,
  Calendar,
  Figma,
  Slack,
  Mail,
  Mic,
  Settings,
  Target,
  Sparkles,
  AlertCircle,
  Clock,
  X,
  Send,
  Bot
} from 'lucide-react';
import { clsx } from 'clsx';
import { useChat } from '@/app/context/ChatContext';
import { toast } from 'sonner';

interface AnalysisDetail {
  id: string;
  journeyName: string;
  journeyId: string;
  timestamp: string;
  modelVersion: string;
  ruleVersion: string;
  schemaVersion: string;
  status: 'completed' | 'partial' | 'failed';
  
  // Context sources
  contextSources: {
    name: string;
    type: 'figma' | 'slack' | 'email' | 'meeting' | 'jira';
    status: 'available' | 'missing';
    excerpt?: string;
    icon: any;
  }[];
  
  // Logic path
  logicSteps: {
    stage: string;
    description: string;
    status: 'completed' | 'warning' | 'error';
    details: string;
  }[];
  
  // Business rules
  rulesApplied: {
    ruleName: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'applied' | 'conflict' | 'skipped';
  }[];
  
  // Recommendations
  recommendations: {
    element: string;
    rule: string;
    contextEvidence: string;
    confidence: number;
    explanation: string;
    status: 'accepted' | 'rejected' | 'pending';
    rejectionReason?: string;
  }[];
  
  // Stability indicators
  metrics: {
    rejectionRate: number;
    avgConfidence: number;
    ruleConflicts: number;
    contextGaps: number;
  };
}

const mockAnalysisData: AnalysisDetail[] = [
  {
    id: 'ANLYS-2026-001',
    journeyName: '5G UW Upgrade Flow',
    journeyId: 'VZW-5G-001',
    timestamp: '2026-02-13T09:15:00Z',
    modelVersion: 'v2.4.1',
    ruleVersion: 'r1.8.3',
    schemaVersion: 's3.2.0',
    status: 'completed',
    contextSources: [
      {
        name: 'Figma Design Frame',
        type: 'figma',
        status: 'available',
        excerpt: 'Primary CTA: "Continue to Plan Selection" button identified at frame 3, layer: checkout-flow-primary',
        icon: Figma
      },
      {
        name: 'Slack Discussion',
        type: 'slack',
        status: 'available',
        excerpt: 'BA Sarah: "Make sure we track the 5G upgrade funnel differently than standard plan changes"',
        icon: MessageSquare
      },
      {
        name: 'Jira Requirements',
        type: 'jira',
        status: 'available',
        excerpt: 'VZW-2891: Track each step of 5G upgrade with unique step identifiers for drop-off analysis',
        icon: FileText
      },
      {
        name: 'Meeting Transcript',
        type: 'meeting',
        status: 'missing',
        icon: Mic
      }
    ],
    logicSteps: [
      {
        stage: 'Context Ingestion',
        description: 'Loaded and validated input sources',
        status: 'completed',
        details: 'Successfully ingested 3 of 4 configured sources. Meeting transcript unavailable but not critical for this analysis.'
      },
      {
        stage: 'Signal Extraction',
        description: 'Identified key interaction patterns',
        status: 'completed',
        details: 'Extracted 12 interactive elements from Figma, cross-referenced with 4 Slack mentions and 2 Jira requirements.'
      },
      {
        stage: 'Rule Matching',
        description: 'Applied telemetry business rules',
        status: 'completed',
        details: 'Matched 5 business rules including "Primary CTA Priority", "Funnel Step Tracking", and "Mobile-First Interaction".'
      },
      {
        stage: 'Pattern Detection',
        description: 'Analyzed historical patterns',
        status: 'warning',
        details: 'Similar journey found (VZW-PLAN-089) with 73% pattern overlap. Applied learned preferences.'
      },
      {
        stage: 'Recommendation Generation',
        description: 'Generated telemetry suggestions',
        status: 'completed',
        details: 'Produced 12 recommendations with average confidence 89%. Flagged 2 low-confidence suggestions for review.'
      }
    ],
    rulesApplied: [
      {
        ruleName: 'Primary CTA Priority',
        description: 'Prioritize tracking primary CTAs over secondary navigation',
        priority: 'High',
        status: 'applied'
      },
      {
        ruleName: 'Funnel Step Tracking',
        description: 'Track each step with unique identifiers for drop-off analysis',
        priority: 'High',
        status: 'applied'
      },
      {
        ruleName: 'Mobile-First Interaction',
        description: 'Apply mobile-specific tracking patterns for mobile flows',
        priority: 'Medium',
        status: 'applied'
      },
      {
        ruleName: 'Commerce Event Sequencing',
        description: 'Track product impressions before click events',
        priority: 'Medium',
        status: 'conflict'
      }
    ],
    recommendations: [
      {
        element: 'Continue to Plan Selection (Button)',
        rule: 'Primary CTA Priority',
        contextEvidence: 'Figma frame 3, layer: checkout-flow-primary',
        confidence: 94,
        explanation: 'Primary checkout CTA identified from Figma design. Rule "Primary CTA Priority" applied. High confidence based on clear visual hierarchy and Slack discussion confirmation.',
        status: 'accepted'
      },
      {
        element: 'Trade-in Value Modal',
        rule: 'Modal Interaction Tracking',
        contextEvidence: 'Figma frame 5, Jira requirement VZW-2891',
        confidence: 67,
        explanation: 'Modal identified in Figma but unclear if it\'s tooltip or full modal. Applied rule "Modal Interaction Tracking" with medium-low confidence.',
        status: 'rejected',
        rejectionReason: 'incorrect_format'
      }
    ],
    metrics: {
      rejectionRate: 8.3,
      avgConfidence: 87,
      ruleConflicts: 1,
      contextGaps: 1
    }
  }
];

export const Observability = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisDetail | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [feedbackModal, setFeedbackModal] = useState<{ analysis: AnalysisDetail; recommendation: any } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const { openPanel } = useChat();

  const handleGiveFeedback = (analysis: AnalysisDetail, recommendation: any) => {
    setFeedbackModal({ analysis, recommendation });
    setFeedbackText('');
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackModal(null);
    setFeedbackText('');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackModal || !feedbackText.trim()) return;

    // Open AI Panel with context
    openPanel();
    
    // Show success message
    toast.success('Feedback sent to AI', {
      description: 'Your correction has been logged and will be used for training'
    });

    handleCloseFeedbackModal();
  };

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'applied':
      case 'available':
      case 'accepted':
        return <CheckCircle2 size={14} className="text-emerald-600" />;
      case 'warning':
      case 'conflict':
      case 'partial':
        return <AlertTriangle size={14} className="text-amber-600" />;
      case 'error':
      case 'missing':
      case 'rejected':
      case 'failed':
        return <XCircle size={14} className="text-red-600" />;
      default:
        return <Clock size={14} className="text-blue-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-emerald-600 bg-emerald-100 border-emerald-300';
    if (confidence >= 70) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (confidence >= 50) return 'text-amber-600 bg-amber-100 border-amber-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const handleDebug = (analysis: AnalysisDetail) => {
    const debugMessage = `Debugging analysis ${analysis.id} for journey ${analysis.journeyName} (${analysis.journeyId})`;
    openPanel(debugMessage);
    toast.success('Debug message sent to AI');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Eye size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-[24px] font-bold text-foreground">Observability</h2>
            <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
              Full AI decision chain transparency and root cause analysis for production diagnostics
            </p>
          </div>
        </div>
      </div>

      {/* AI Stability Indicators */}
      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Activity size={20} className="text-purple-600" />
          <h3 className="text-[16px] font-bold text-foreground">AI Stability Indicators</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-surface-secondary border border-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Rejection Rate</span>
              <TrendingDown size={14} className="text-emerald-600" />
            </div>
            <div className="text-[28px] font-bold text-foreground">8.3%</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">↓ 2.1% vs last week</div>
          </div>
          <div className="p-4 bg-surface-secondary border border-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Avg Confidence</span>
              <TrendingUp size={14} className="text-emerald-600" />
            </div>
            <div className="text-[28px] font-bold text-foreground">87%</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">↑ 3.2% vs last week</div>
          </div>
          <div className="p-4 bg-surface-secondary border border-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Rule Conflicts</span>
              <AlertTriangle size={14} className="text-amber-600" />
            </div>
            <div className="text-[28px] font-bold text-foreground">4</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Requires review</div>
          </div>
          <div className="p-4 bg-surface-secondary border border-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Context Gaps</span>
              <Info size={14} className="text-blue-600" />
            </div>
            <div className="text-[28px] font-bold text-foreground">12</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">Non-critical</div>
          </div>
        </div>
      </div>

      {/* Analysis List */}
      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-border bg-surface-primary">
          <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider">Recent AI Analyses</h3>
        </div>
        <div className="divide-y divide-border">
          {mockAnalysisData.map((analysis) => (
            <div key={analysis.id} className="p-6 hover:bg-surface-secondary transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-[16px] font-bold text-foreground">{analysis.journeyName}</h4>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                      {analysis.journeyId}
                    </span>
                    {getStatusIcon(analysis.status)}
                  </div>
                  <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                    <span>Analysis ID: {analysis.id}</span>
                    <span>•</span>
                    <span>{new Date(analysis.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAnalysis(selectedAnalysis?.id === analysis.id ? null : analysis)}
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl text-[12px] font-bold transition-all flex items-center gap-2"
                >
                  <Eye size={14} />
                  {selectedAnalysis?.id === analysis.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded Details */}
              {selectedAnalysis?.id === analysis.id && (
                <div className="mt-6 space-y-6">
                  {/* Governance Metadata */}
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-5 gap-6 flex-1">
                        <div>
                          <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Model Version</div>
                          <div className="text-[13px] font-bold text-foreground">{analysis.modelVersion}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Rule Version</div>
                          <div className="text-[13px] font-bold text-foreground">{analysis.ruleVersion}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Schema Version</div>
                          <div className="text-[13px] font-bold text-foreground">{analysis.schemaVersion}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Timestamp</div>
                          <div className="text-[13px] font-bold text-foreground">{new Date(analysis.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Status</div>
                          <div className="text-[13px] font-bold text-emerald-600 capitalize">{analysis.status}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-2 bg-white dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 rounded-lg text-[11px] font-bold text-indigo-900 dark:text-indigo-200 transition-all flex items-center gap-1.5">
                          <Download size={12} />
                          Download Report
                        </button>
                        <button
                          onClick={() => handleDebug(analysis)}
                          className="px-3 py-2 bg-white dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 rounded-lg text-[11px] font-bold text-indigo-900 dark:text-indigo-200 transition-all flex items-center gap-1.5"
                        >
                          <Share2 size={12} />
                          Share Debug
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* A. Context Used */}
                  <div className="bg-surface-secondary border-2 border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('context')}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-blue-600" />
                        <span className="text-[14px] font-bold text-foreground">A. Context Used</span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold">
                          {analysis.contextSources.filter(s => s.status === 'available').length} of {analysis.contextSources.length} sources
                        </span>
                      </div>
                      {expandedSections.has('context') ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    {expandedSections.has('context') && (
                      <div className="px-5 py-4 border-t-2 border-border space-y-3">
                        {analysis.contextSources.map((source, idx) => (
                          <div key={idx} className={clsx(
                            "p-4 rounded-xl border-2",
                            source.status === 'available' 
                              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                              : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                          )}>
                            <div className="flex items-start gap-3">
                              <source.icon size={18} className={source.status === 'available' ? "text-emerald-600" : "text-red-600"} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[13px] font-bold text-foreground">{source.name}</span>
                                  {getStatusIcon(source.status)}
                                </div>
                                {source.excerpt ? (
                                  <p className="text-[12px] text-muted-foreground leading-relaxed italic">
                                    "{source.excerpt}"
                                  </p>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle size={12} className="text-red-600" />
                                    <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Missing Context</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* B. Logic Path */}
                  <div className="bg-surface-secondary border-2 border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('logic')}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Brain size={18} className="text-purple-600" />
                        <span className="text-[14px] font-bold text-foreground">B. Logic Path</span>
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px] font-bold">
                          {analysis.logicSteps.length} stages
                        </span>
                      </div>
                      {expandedSections.has('logic') ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    {expandedSections.has('logic') && (
                      <div className="px-5 py-4 border-t-2 border-border">
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-[15px] top-8 bottom-8 w-0.5 bg-border" />
                          
                          <div className="space-y-4">
                            {analysis.logicSteps.map((step, idx) => (
                              <div key={idx} className="relative pl-10">
                                <div className={clsx(
                                  "absolute left-0 top-1 w-[30px] h-[30px] rounded-full border-4 border-card flex items-center justify-center",
                                  step.status === 'completed' && "bg-emerald-500",
                                  step.status === 'warning' && "bg-amber-500",
                                  step.status === 'error' && "bg-red-500"
                                )}>
                                  <span className="text-[11px] font-bold text-white">{idx + 1}</span>
                                </div>
                                <div className="p-4 bg-card border border-border rounded-xl">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[13px] font-bold text-foreground">{step.stage}</span>
                                    {getStatusIcon(step.status)}
                                  </div>
                                  <p className="text-[12px] text-muted-foreground mb-2">{step.description}</p>
                                  <div className="p-3 bg-surface-secondary rounded-lg border border-border">
                                    <p className="text-[11px] text-foreground leading-relaxed">{step.details}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* C. Business Rules Applied */}
                  <div className="bg-surface-secondary border-2 border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('rules')}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Settings size={18} className="text-amber-600" />
                        <span className="text-[14px] font-bold text-foreground">C. Business Rules Applied</span>
                        {analysis.rulesApplied.some(r => r.status === 'conflict') && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-[10px] font-bold flex items-center gap-1">
                            <Shield size={10} />
                            Conflict Detected
                          </span>
                        )}
                      </div>
                      {expandedSections.has('rules') ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    {expandedSections.has('rules') && (
                      <div className="px-5 py-4 border-t-2 border-border space-y-2">
                        {analysis.rulesApplied.map((rule, idx) => (
                          <div key={idx} className={clsx(
                            "p-4 rounded-xl border",
                            rule.status === 'applied' && "bg-card border-border",
                            rule.status === 'conflict' && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                            rule.status === 'skipped' && "bg-zinc-50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 opacity-60"
                          )}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[13px] font-bold text-foreground">{rule.ruleName}</span>
                                  <span className={clsx(
                                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                                    rule.priority === 'High' && "bg-red-100 text-red-700 border border-red-300",
                                    rule.priority === 'Medium' && "bg-amber-100 text-amber-700 border border-amber-300",
                                    rule.priority === 'Low' && "bg-blue-100 text-blue-700 border border-blue-300"
                                  )}>
                                    {rule.priority}
                                  </span>
                                  {getStatusIcon(rule.status)}
                                </div>
                                <p className="text-[12px] text-muted-foreground">{rule.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* D. Why Recommendation Was Made */}
                  <div className="bg-surface-secondary border-2 border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('recommendations')}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Target size={18} className="text-emerald-600" />
                        <span className="text-[14px] font-bold text-foreground">D. Why Recommendation Was Made</span>
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-bold">
                          {analysis.recommendations.length} suggestions
                        </span>
                      </div>
                      {expandedSections.has('recommendations') ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    {expandedSections.has('recommendations') && (
                      <div className="px-5 py-4 border-t-2 border-border space-y-4">
                        {analysis.recommendations.map((rec, idx) => (
                          <div key={idx} className="p-4 bg-card border-2 border-border rounded-xl">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles size={14} className="text-accent" />
                                  <span className="text-[14px] font-bold text-foreground">{rec.element}</span>
                                  {getStatusIcon(rec.status)}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider min-w-[100px]">Rule:</span>
                                    <span className="text-[12px] text-foreground">{rec.rule}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider min-w-[100px]">Evidence:</span>
                                    <span className="text-[12px] text-foreground italic">{rec.contextEvidence}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider min-w-[100px]">Confidence:</span>
                                    <span className={clsx("px-2 py-0.5 rounded text-[11px] font-bold border", getConfidenceColor(rec.confidence))}>
                                      {rec.confidence}% - {rec.confidence >= 85 ? 'High' : rec.confidence >= 70 ? 'Medium' : 'Low'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleGiveFeedback(analysis, rec)}
                                className="px-3 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-[11px] font-bold transition-all"
                              >
                                Give Feedback
                              </button>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Explanation</div>
                              <p className="text-[12px] text-blue-900 dark:text-blue-300 leading-relaxed">{rec.explanation}</p>
                            </div>

                            {/* Root Cause Analysis for Rejected */}
                            {rec.status === 'rejected' && rec.rejectionReason && (
                              <div className="mt-3 p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-800 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                  <AlertCircle size={16} className="text-red-600" />
                                  <span className="text-[12px] font-bold text-red-900 dark:text-red-300 uppercase tracking-wider">Root Cause Analysis</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-red-700 dark:text-red-300">Rejection Reason:</span>
                                    <span className="px-2 py-0.5 bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-200 rounded text-[10px] font-bold uppercase tracking-wider">
                                      {rec.rejectionReason.replace(/_/g, ' ')}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-2 py-1 bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-200 border border-red-400 dark:border-red-700 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                      <AlertTriangle size={10} />
                                      Low Confidence
                                    </span>
                                    <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-400 dark:border-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                      <Info size={10} />
                                      Incomplete Context
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
        <Shield size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-bold text-indigo-900 dark:text-indigo-300">Enterprise AI Governance</span>
          <p className="text-[12px] text-indigo-700 dark:text-indigo-400 leading-relaxed">
            This observability layer enables production diagnosis: what AI looked at, what rules it used, how it reasoned, and where it went wrong. Full transparency for enterprise accountability.
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-card border-2 border-border rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-border bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-foreground">Provide AI Feedback</h3>
                  <p className="text-[12px] text-muted-foreground">Help improve recommendation accuracy</p>
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
              {/* Analysis Context */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl">
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Analysis Context</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Journey</div>
                    <div className="text-[13px] font-bold text-foreground">{feedbackModal.analysis.journeyName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{feedbackModal.analysis.journeyId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Analysis ID</div>
                    <div className="text-[13px] font-bold text-foreground">{feedbackModal.analysis.id}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{new Date(feedbackModal.analysis.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Model Version</div>
                    <div className="text-[12px] font-mono font-bold text-foreground">{feedbackModal.analysis.modelVersion}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Rule Version</div>
                    <div className="text-[12px] font-mono font-bold text-foreground">{feedbackModal.analysis.ruleVersion}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Schema Version</div>
                    <div className="text-[12px] font-mono font-bold text-foreground">{feedbackModal.analysis.schemaVersion}</div>
                  </div>
                </div>
              </div>

              {/* Recommendation Details */}
              <div className="p-4 bg-surface-secondary border-2 border-border rounded-xl">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Recommendation Details</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-accent shrink-0" />
                    <span className="text-[14px] font-bold text-foreground">{feedbackModal.recommendation.element}</span>
                    {getStatusIcon(feedbackModal.recommendation.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider min-w-[100px]">Rule Used:</span>
                      <span className="text-[12px] font-bold text-foreground">{feedbackModal.recommendation.rule}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider min-w-[100px]">Evidence:</span>
                      <span className="text-[12px] text-foreground italic">{feedbackModal.recommendation.contextEvidence}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider min-w-[100px]">Confidence:</span>
                      <span className={clsx("px-2 py-0.5 rounded text-[11px] font-bold border", getConfidenceColor(feedbackModal.recommendation.confidence))}>
                        {feedbackModal.recommendation.confidence}% - {feedbackModal.recommendation.confidence >= 85 ? 'High' : feedbackModal.recommendation.confidence >= 70 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg mt-3">
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">AI Explanation</div>
                    <p className="text-[12px] text-blue-900 dark:text-blue-300 leading-relaxed">{feedbackModal.recommendation.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Feedback Input */}
              <div>
                <label className="text-[12px] font-bold text-foreground mb-2 block">
                  What correction or insight would you like to provide?
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Example: 'Wrong rule applied - this should use Checkout Flow Rule instead' or 'The AI misinterpreted the tooltip as a modal'"
                  maxLength={500}
                  className="w-full h-32 px-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-muted-foreground">
                    This feedback will help AI learn and improve future recommendations
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