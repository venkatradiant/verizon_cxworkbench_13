import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  X, 
  ChevronRight, 
  FileText, 
  Database, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Info, 
  Layout, 
  Search, 
  Code, 
  Activity,
  PanelLeft,
  PanelRight,
  Maximize2,
  GripHorizontal,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Settings,
  ArrowRight,
  Layers,
  Terminal,
  FileCode,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Resizable } from 're-resizable';
import { useChat } from '@/app/context/ChatContext';
import { useParams, useNavigate, useLocation } from 'react-router';
import { mockJourneys, Journey, JourneyStep } from '@/app/data/mockJourneys';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';


interface Message {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'journey-list' | 'stage-list' | 'code-snippet' | 'tag-triage' | 'rule-correction' | 'analysis-running';
  data?: any;
  suggestions?: string[];
  isSystemConfirmation?: boolean;
}

export const AIPanel: React.FC = () => {
  const { isPanelOpen, closePanel, dockMode, setDockMode, contextData } = useChat();
  const { journeyId } = useParams<{ journeyId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [inputValue, setInputValue] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [contextJourney, setContextJourney] = useState<Journey | null>(null);
  const [acceptedTagsCount, setAcceptedTagsCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Floating & Resizing state
  const [floatingSize, setFloatingSize] = useState({ width: 400, height: 600 });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get current journey first (needed by other hooks)
  const currentJourney = useMemo(() => {
    return mockJourneys.find(j => j.journeyId === journeyId);
  }, [journeyId]);

  // Context awareness - determine if we're on an analysis/recommendation screen
  const isAnalysisContext = useMemo(() => {
    return location.pathname.includes('/journey/') && 
           (location.pathname.includes('/overview') || 
            location.pathname.includes('/validation'));
  }, [location.pathname]);

  // Get active step from URL or context
  const activeStepIndex = useMemo(() => {
    // You can extract this from URL params or context data if available
    return contextData?.activeStep || null;
  }, [contextData]);

  // Context header text
  const contextHeader = useMemo(() => {
    if (!isAnalysisContext || !currentJourney) return null;
    
    let stepInfo = '';
    if (activeStepIndex !== null && currentJourney.steps?.[activeStepIndex]) {
      const step = currentJourney.steps[activeStepIndex];
      stepInfo = ` – ${step.stepName}`;
    }
    
    return `Editing: ${currentJourney.journeyName}${stepInfo}`;
  }, [isAnalysisContext, currentJourney, activeStepIndex]);

  const handleReset = () => {
    setMessages([]);
    setHasStarted(false);
    setInputValue('');
    toast.info('Conversation history cleared');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isPanelOpen) {
      scrollToBottom();
    }
  }, [messages, isPanelOpen, isTyping]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Snippet copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAction = (action: string, params?: any) => {
    if (action === 'navigate') {
      navigate(params.path);
      toast.info(`Navigating to ${params.name}`);
    } else if (action === 'generate-code') {
      const journey = params.journey || contextJourney;
      if (acceptedTagsCount < 5) {
        handleSend(`Try to generate bundle for ${journey?.journeyName || 'this journey'}`);
      } else {
        handleSend(`Generate artifacts for ${journey?.journeyName || 'this journey'}`);
      }
    } else if (action === 'list-stages') {
      handleSend(`Show stages for ${params.journeyName}`);
    } else if (action === 'review-tags') {
      handleSend(`Review pending tags for ${params.journeyName}`);
    } else if (action === 'accept-tag') {
      setAcceptedTagsCount(prev => prev + 1);
      toast.success(`Tag accepted: ${params.tagId}`);
    } else if (action === 'decline-tag') {
      toast.error(`Tag declined: ${params.tagId}`);
    }
  };

  const generateAIResponse = (query: string, history: Message[]): Message => {
    const q = query.toLowerCase();
    const activeJ = contextJourney || currentJourney;
    
    // 1. Contextual "Accept All" or "Review" after list/stages
    if ((q.includes('accept all') || q.includes('approve all')) && activeJ) {
      setAcceptedTagsCount(12); // Simulate full approval
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Excellent. I've batch-approved all **12 recommendations** for **${activeJ.journeyName}** using the VSDS v4.2 standard. \n\nThe schema is now 100% validated. You can now generate the measurement artifacts or run a validation simulation.`,
        timestamp: new Date(),
        suggestions: ["Generate measurement bundle", "Run validation simulation", "Check system health"]
      };
    }

    // 2. Review Tags (Triage) - Fix: Ensure this hits for "Review pending tags"
    if (q.includes('review') || q.includes('triage') || q.includes('pending') || (q.includes('approve') && !q.includes('all'))) {
      const target = mockJourneys.find(j => q.includes(j.journeyName.toLowerCase())) || activeJ || mockJourneys[0];
      
      setContextJourney(target);
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've found **12 pending recommendations** for **${target.journeyName}**. \n\nBefore we can generate the measurement bundle or run validation, you must review and approve these tags to ensure they meet VSDS v4.2 standards.`,
        timestamp: new Date(),
        type: 'tag-triage',
        data: { 
          journey: target, 
          tags: target.steps[0].components?.slice(0, 3).map(c => ({
            id: c.aiRecommendedTag,
            label: c.componentLabel,
            event: c.eventType,
            confidence: 98,
            reason: c.recommendationReason,
            value: c.businessValue
          })) 
        },
        suggestions: ["Accept all recommendations", "Audit naming sequence", "Registry Health"]
      };
    }

    // 3. List Journeys
    if (q.includes('list journeys') || q.includes('all journeys') || q.includes('browse journeys') || q.includes('show journeys') || q.includes('browse registry')) {
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've pulled the full Verizon CX Registry. There are **41 active journeys** currently being monitored. \n\nI recommend starting with **Add a line** as it has 12 pending VSDS schema recommendations.",
        timestamp: new Date(),
        type: 'journey-list',
        data: mockJourneys.slice(0, 10), 
        suggestions: ["Audit Add a line", "Review pending tags", "System health check"]
      };
    }

    // 4. Show Stages / Audit
    if (q.includes('stages') || q.includes('steps') || q.includes('audit') || q.includes('sequence')) {
      const targetJourney = mockJourneys.find(j => q.includes(j.journeyName.toLowerCase())) || activeJ || mockJourneys[0];
      
      setContextJourney(targetJourney);
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Auditing sequence for **${targetJourney.journeyName}**. \n\n**Key Metrics:**\n• **Status:** ${targetJourney.governanceStatus}\n• **Total Tags:** ${targetJourney.tagRecommendationCount}\n• **Last Audit:** 2 hours ago\n\nI've identified **${targetJourney.steps.length} critical interaction points**. The next logical step is to review the pending tag recommendations.`,
        timestamp: new Date(),
        type: 'stage-list',
        data: { journey: targetJourney, stages: targetJourney.steps },
        suggestions: [`Review 12 pending tags for ${targetJourney.journeyName}`, "Export Developer Package", "Back to registry"]
      };
    }

    // 5. Generate Code / Artifacts (With Prerequisites)
    if (q.includes('code') || q.includes('artifact') || q.includes('json') || q.includes('bundle') || q.includes('export')) {
      const targetJourney = mockJourneys.find(j => q.includes(j.journeyName.toLowerCase())) || activeJ;
      if (targetJourney) {
        setContextJourney(targetJourney);
        
        if (acceptedTagsCount < 3 && !q.includes('force')) {
          return {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I cannot prepare the developer package for **${targetJourney.journeyName}** yet. \n\n**Prerequisite Failed:** There are still **${12 - acceptedTagsCount} pending tags** that require manual approval. Developer packages can only be generated from validated specifications.`,
            timestamp: new Date(),
            suggestions: [`Review 12 pending tags for ${targetJourney.journeyName}`, "Accept all recommendations", "Help me approve tags"]
          };
        }

        const snippet = JSON.stringify({
          journeyId: targetJourney.journeyId,
          namespace: "vzw.cx",
          version: "4.2",
          environment: "production",
          tags: targetJourney.steps.slice(0, 3).flatMap(s => s.components?.map(c => ({
            id: c.aiRecommendedTag,
            element: c.componentLabel,
            trigger: c.eventType,
            standard: "VSDS v4.2"
          })))
        }, null, 2);

        return {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `The \`measurement-bundle.json\` for **${targetJourney.journeyName}** is ready. This artifact encodes all naming standards and trigger logic required for the CX SDK.`,
          timestamp: new Date(),
          type: 'code-snippet',
          data: { title: 'measurement-bundle.json', code: snippet, language: 'json' },
          suggestions: ["Run validation simulation", "Audit naming standards", "Browse all journeys"]
        };
      }
    }

    // 6. Validation / Simulation
    if (q.includes('validate') || q.includes('simulation') || q.includes('test')) {
      const target = activeJ || mockJourneys[0];
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Initializing validation simulation for **${target.journeyName}**... \n\n• Checking schema integrity... **PASSED**\n• Verifying production environment parity... **STABLE**\n• Testing 42 interaction triggers... **SUCCESS**\n\nTelemetry for this journey is ready for production deployment.`,
        timestamp: new Date(),
        suggestions: ["Generate measurement bundle", "Check system health", "Registry Overview"]
      };
    }

    // 7. System Health
    if (q.includes('health') || q.includes('status') || q.includes('operational')) {
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "The **CX Fabric** is currently operating at **99.9% telemetry accuracy**. I'm monitoring 41 journeys with no critical schema drift detected in the last 24 hours. Production environment is stable.",
        timestamp: new Date(),
        suggestions: ["Show recent activity", "List all journeys", "Active Alerts"]
      };
    }

    // 8. Manual Tagging Support
    if (q.includes('add tag') || q.includes('tag this') || q.includes('create tag') || q.includes('manual tag')) {
      // Extract tag name from query
      const tagMatch = q.match(/(?:add tag|tag this|create tag|manual tag)(?:\s+(?:to|as|for))?\s+(.+)/i);
      const suggestedName = tagMatch ? tagMatch[1].trim() : '';
      
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I can help you add a manual tag${suggestedName ? ` for **${suggestedName}**` : ''}. \\n\\n**To add a manual tag:**\\n1. Click anywhere on the preview screen where you want to add the tag\\n2. Select "Add Tag" from the context menu\\n3. Enter the tag details\\n\\nManual tags help me learn and improve future AI recommendations. Your feedback is valuable!`,
        timestamp: new Date(),
        suggestions: ["How do I remove a manual tag?", "Show tag management", "Review current tags"]
      };
    }

    // 9. AI Correction - Wrong Rule Used
    if (q.includes('wrong rule') || q.includes('incorrect rule') || q.includes('wrong business rule')) {
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you'd like to correct a business rule. Which rule should I apply instead?\\n\\nYou can specify the rule by name or number, for example:\\n• "Use Upgrade Eligibility Rule"\\n• "Apply rule ABC-123"\\n• "This should match Account Management Rule"`,
        timestamp: new Date(),
        suggestions: ["Use Upgrade Eligibility Rule", "Apply Account Management Rule", "Show all available rules"]
      };
    }

    // 10. AI Correction - Use Specific Rule
    if ((q.includes('use rule') || q.includes('apply rule') || q.includes('should match rule') || (q.includes('use') && q.includes('rule'))) && !q.includes('wrong')) {
      // Extract rule name
      const ruleMatch = q.match(/(?:use|apply|match)\s+(?:rule\s+)?(.+?)(?:\s+instead|\s+rule|$)/i);
      const ruleName = ruleMatch ? ruleMatch[1].trim() : 'specified rule';
      
      // Add system confirmation message
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: `✓ Business rule updated to **${ruleName}**`,
          timestamp: new Date(),
          isSystemConfirmation: true
        }]);
      }, 500);

      toast.success('Business rule updated', {
        description: `Now using: ${ruleName}`,
        duration: 4000,
      });

      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Perfect! I've updated the analysis to use **${ruleName}**.\\n\\nWould you like me to re-run the analysis with this new rule?`,
        timestamp: new Date(),
        type: 'rule-correction',
        data: { ruleName },
        suggestions: ["Re-run analysis", "Show rule details", "Undo change"]
      };
    }

    // 11. Re-run Analysis Command
    if (q.includes('re-run') || q.includes('rerun') || q.includes('redo analysis') || q.includes('run again') || q.includes('analyze again')) {
      const targetJourney = activeJ || currentJourney;
      
      if (!targetJourney) {
        return {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I need to know which journey to analyze. Please specify a journey or navigate to one first.`,
          timestamp: new Date(),
          suggestions: ["Browse all journeys", "Show active journeys"]
        };
      }

      // Show analysis running state
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `✅ Analysis complete for **${targetJourney.journeyName}**!\\n\\n**Results:**\\n• **12 interactions** detected\\n• **8 user actions** tagged\\n• **4 system events** identified\\n• **100%** coverage achieved\\n\\nAll recommendations have been updated based on the latest business rules.`,
          timestamp: new Date(),
          suggestions: ["Review updated tags", "Generate artifacts", "Export results"]
        }]);
      }, 3000);

      toast.info('Running analysis...', {
        description: `Analyzing ${targetJourney.journeyName}`,
        duration: 2000,
      });

      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🔄 Re-running analysis for **${targetJourney.journeyName}**...\\n\\nThis will take a few seconds. I'm:\\n• Scanning UI components\\n• Matching business rules\\n• Generating tag recommendations\\n• Validating VSDS standards`,
        timestamp: new Date(),
        type: 'analysis-running',
        data: { journey: targetJourney }
      };
    }

    // 12. Show Available Rules
    if (q.includes('show rules') || q.includes('list rules') || q.includes('available rules') || q.includes('what rules')) {
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Here are the **business rules** currently available in the system:\\n\\n**Account & Eligibility:**\\n• Upgrade Eligibility Rule\\n• Account Management Rule\\n• Credit Check Rule\\n\\n**E-commerce & Cart:**\\n• Add to Cart Rule\\n• Checkout Flow Rule\\n• Payment Processing Rule\\n\\n**Support & Service:**\\n• Troubleshooting Rule\\n• Chat Engagement Rule\\n• Callback Request Rule\\n\\nYou can apply any of these by saying "Use [Rule Name]"`,
        timestamp: new Date(),
        suggestions: ["Use Upgrade Eligibility Rule", "Apply Add to Cart Rule", "Back to analysis"]
      };
    }

    // Default
    return {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "I'm monitoring the Verizon CX Fabric metadata. To get started with a measurement workflow, I recommend auditing a journey or reviewing pending VSDS schema recommendations.",
      timestamp: new Date(),
      suggestions: ["Browse Registry (41 journeys)", "Audit Add a line", "Check System Health"]
    };
  };

  const handleSend = (overrideValue?: string) => {
    const text = overrideValue || inputValue;
    if (!text.trim()) return;

    if (!hasStarted) setHasStarted(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text, [...messages, userMsg]);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const suggestions = useMemo(() => {
    if (currentJourney) {
      return [
        { title: "Audit Stages", desc: `View all stages for ${currentJourney.journeyName}`, icon: Layers, color: "text-blue-500", action: () => handleAction('list-stages', { journeyName: currentJourney.journeyName }) },
        { title: "Export Package", desc: `Generate developer package`, icon: Code, color: "text-purple-500", action: () => handleAction('generate-code', { journeyName: currentJourney.journeyName}) },
        { title: "Validation Hub", desc: "Check telemetry health", icon: ShieldCheck, color: "text-green-500", action: () => handleAction('navigate', { path: `/playground/journey/${currentJourney.journeyId}/validation`, name: 'Validation' }) },
        { title: "Back to List", desc: "Browse all journeys", icon: Search, color: "text-orange-500", action: () => handleAction('navigate', { path: '/journeys', name: 'Journeys' }) },
      ];
    }
    return [
      { title: "Browse Registry", desc: "Explore all 41 CX journeys", icon: Database, color: "text-blue-500", action: () => handleSend("Browse Registry") },
      { title: "Export Package", desc: "Generate developer packages", icon: Code, color: "text-purple-500", action: () => handleSend("Export developer package") },
      { title: "Fabric Status", desc: "Operational telemetry health", icon: Activity, color: "text-orange-500", action: () => handleSend("Show system health status") },
      { title: "Recent Activity", desc: "Review latest fabric updates", icon: Layers, color: "text-blue-600", action: () => handleSend("Show recent activity") },
    ];
  }, [currentJourney]);

  const isFloating = dockMode === 'float';

  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'tag-triage') {
      return (
        <div className="mt-4 space-y-3">
          {msg.data.tags.map((t: any) => (
            <div key={t.id} className="p-4 rounded-xl border border-border bg-card shadow-sm group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">AI Recommendation</span>
                </div>
                <div className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {t.confidence}% match
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <div className="text-[13px] font-bold text-foreground">{t.label}</div>
                <div className="text-[11px] font-mono text-accent bg-accent/5 px-2 py-1 rounded inline-block">
                  {t.id}
                </div>
                {t.reason && (
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed italic">
                    "{t.reason}"
                  </p>
                )}
                <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-2">
                   <span>Trigger: <strong>{t.event}</strong></span>
                   {t.value && (
                     <>
                       <span className="w-1 h-1 rounded-full bg-border" />
                       <span className="text-emerald-600 font-bold">{t.value}</span>
                     </>
                   )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAction('accept-tag', { tagId: t.id })}
                  className="py-2 rounded-lg bg-green-500/10 text-green-600 text-[11px] font-bold hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={14} /> Accept
                </button>
                <button 
                  onClick={() => handleAction('decline-tag', { tagId: t.id })}
                  className="py-2 rounded-lg bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <X size={14} /> Decline
                </button>
              </div>
            </div>
          ))}
          {acceptedTagsCount >= 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center"
            >
              <div className="text-[11px] font-bold text-accent mb-1">Threshold Reached!</div>
              <div className="text-[10px] text-muted-foreground mb-2">You have approved enough tags to unlock the measurement bundle.</div>
              <button 
                onClick={() => handleAction('generate-code', { journey: msg.data.journey })}
                className="w-full py-2 bg-accent text-white rounded-lg text-[11px] font-bold shadow-lg shadow-accent/20"
              >
                Generate Measurement Bundle
              </button>
            </motion.div>
          )}
        </div>
      );
    }

    if (msg.type === 'journey-list') {
      return (
        <div className="mt-4 space-y-2">
          {msg.data.map((j: Journey) => (
            <button
              key={j.journeyId}
              onClick={() => handleAction('navigate', { path: `/playground/journey/${j.journeyId}/overview`, name: j.journeyName })}
              className="w-full p-3 rounded-xl border border-border bg-card hover:border-accent/40 hover:bg-surface-secondary transition-all text-left flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <j.icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-foreground truncate">{j.journeyName}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-zinc-500 uppercase tracking-tight">{j.category}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{j.tagRecommendationCount} tags</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-tight line-clamp-2 opacity-80 italic">
                    {j.autoGeneratedGoal}
                  </p>
                </div>
              </div>
              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 ml-2" />
            </button>
          ))}
          <button 
            onClick={() => navigate('/journeys')}
            className="w-full py-2 text-[11px] font-bold text-accent hover:underline flex items-center justify-center gap-1"
          >
            View all 41 journeys <ChevronRight size={12} />
          </button>
        </div>
      );
    }

    if (msg.type === 'stage-list') {
      const { journey, stages } = msg.data;
      return (
        <div className="mt-4 space-y-2">
          {stages.slice(0, 5).map((s: JourneyStep, idx: number) => (
            <div key={s.stepId} className="p-3 rounded-xl border border-border/50 bg-background/50 flex items-center justify-between group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center border border-accent/20 shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-foreground">{s.stepName}</div>
                  <div className="text-[10px] text-muted-foreground mb-1">{s.screenTemplate} template • {s.components?.length || 0} tags</div>
                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2 italic opacity-80">
                    {s.description}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleAction('navigate', { path: `/playground/journey/${journey.journeyId}/overview`, name: s.stepName })}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0 ml-2"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          ))}
          {stages.length > 5 && (
            <div className="text-center py-1">
              <span className="text-[10px] text-muted-foreground italic">+ {stages.length - 5} more stages detected</span>
            </div>
          )}
        </div>
      );
    }

    if (msg.type === 'code-snippet') {
      const { title, code, language } = msg.data;
      return (
        <div className="mt-4 rounded-xl border border-border overflow-hidden bg-zinc-950 shadow-inner group/code">
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-white/5">
            <div className="flex items-center gap-2">
              <FileCode size={12} className="text-blue-400" />
              <span className="text-[10px] font-medium text-zinc-400 font-mono">{title}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(code, msg.id)}
              className="p-1 rounded hover:bg-white/10 text-zinc-400 transition-colors"
            >
              {copiedId === msg.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <pre className="p-4 text-[11px] font-mono text-zinc-300 overflow-x-auto scrollbar-hide">
            {code}
          </pre>
        </div>
      );
    }

    // System confirmation messages
    if (msg.role === 'system' || msg.isSystemConfirmation) {
      return (
        <div className="flex items-center justify-center w-full">
          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[12px] font-bold flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={14} />
            {msg.content}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all ${
          msg.role === 'user' 
            ? 'bg-accent rounded-tr-none font-medium' 
            : 'bg-surface-secondary border border-border/50 text-foreground rounded-tl-none'
        }`}
        style={msg.role === 'user' ? { color: '#FFFFFF' } : {}}
      >
        {msg.content.split('\\n').map((line, i) => (
          <p key={i} className={`${i > 0 ? 'mt-2' : ''} ${msg.role === 'user' ? 'text-white' : ''}`} style={msg.role === 'user' ? { color: '#FFFFFF' } : {}}>{line}</p>
        ))}
      </div>
    );
  };

  const panelContent = (
    <div className="w-full h-full flex flex-col relative bg-background">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 pb-4 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-[0_0_15px_rgba(238,0,0,0.2)]">
                <Bot size={22} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background shadow-sm" />
            </div>
            <div>
              <h2 className="text-md font-bold text-foreground leading-tight tracking-tight">CX Workbench AI</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] text-accent font-bold uppercase tracking-[0.1em]">Intelligence Engine</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {hasStarted && (
              <button 
                onClick={handleReset}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg text-muted-foreground transition-all duration-200 active:scale-95 mr-1"
                title="Reset Conversation"
              >
                <RotateCcw size={16} />
              </button>
            )}

            <div className="flex p-0.5 bg-surface-secondary rounded-lg border border-border/50 mr-1">
              <button 
                onClick={() => setDockMode('left')}
                className={`p-1.5 rounded-md transition-all ${dockMode === 'left' ? 'bg-background shadow-sm text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                title="Dock Left"
              >
                <PanelLeft size={14} />
              </button>
              <button 
                onClick={() => setDockMode('float')}
                className={`p-1.5 rounded-md transition-all ${dockMode === 'float' ? 'bg-background shadow-sm text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                title="Floating Mode"
              >
                <Maximize2 size={14} />
              </button>
              <button 
                onClick={() => setDockMode('right')}
                className={`p-1.5 rounded-md transition-all ${dockMode === 'right' ? 'bg-background shadow-sm text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                title="Dock Right"
              >
                <PanelRight size={14} />
              </button>
            </div>

            {isFloating && (
              <div className="h-8 px-2 rounded bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1 cursor-grab active:cursor-grabbing mr-1">
                <GripHorizontal size={10} />
              </div>
            )}
            
            <button 
              onClick={closePanel}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg text-muted-foreground transition-all duration-200 active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-secondary border border-border/50 transition-all duration-300">
          {currentJourney ? (
            <>
              <div className="w-4 h-4 rounded bg-accent/10 flex items-center justify-center text-accent">
                <currentJourney.icon size={10} />
              </div>
              <span className="text-[11px] text-foreground font-medium truncate">
                Context: <strong>{currentJourney.journeyName}</strong>
              </span>
            </>
          ) : (
            <>
              <Activity size={14} className="text-accent shrink-0" />
              <span className="text-[11px] text-muted-foreground leading-snug">
                Connected to <strong>Registry Live</strong> • System Active
              </span>
            </>
          )}
        </div>
      </div>

      {/* Chat Content or Welcome Screen */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mb-6 sm:mb-8 shadow-inner ring-1 ring-accent/20">
                <Sparkles size={32} className="animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3 tracking-tight">
                {currentJourney ? `Hi Abhinav,` : `Hi Abhinav,`}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-muted-foreground mb-8 sm:mb-12">
                {currentJourney 
                  ? <span>You're looking at <span className="text-foreground font-bold">{currentJourney.journeyName}</span>.<br/>How can I help?</span>
                  : "How can I help you today?"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
                {suggestions.map((item, i) => (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className="group p-3 sm:p-4 rounded-2xl border border-border bg-card hover:border-accent/40 hover:bg-surface-secondary transition-all duration-300 text-left flex flex-col gap-2 sm:gap-3 shadow-sm hover:shadow-md"
                  >
                    <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                    <div>
                      <div className="text-[12px] sm:text-[13px] font-bold text-foreground mb-0.5">{item.title}</div>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug line-clamp-2">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* AI Correction Commands Reference - Only show in analysis context */}
              {isAnalysisContext && (
                <div className="mt-6 w-full max-w-sm">
                  <div className="p-4 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal size={16} className="text-purple-600" />
                      <h3 className="text-[13px] font-bold text-purple-900 dark:text-purple-200">AI Correction Commands</h3>
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => handleSend("Wrong rule used")}
                        className="w-full text-left px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-purple-100 dark:border-purple-700 hover:border-purple-300 transition-all group"
                      >
                        <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-100">"Wrong rule used"</code>
                      </button>
                      <button
                        onClick={() => handleSend("Use Upgrade Eligibility Rule")}
                        className="w-full text-left px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-purple-100 dark:border-purple-700 hover:border-purple-300 transition-all group"
                      >
                        <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-100">"Use Upgrade Eligibility Rule"</code>
                      </button>
                      <button
                        onClick={() => handleSend("Re-run analysis")}
                        className="w-full text-left px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-purple-100 dark:border-purple-700 hover:border-purple-300 transition-all group"
                      >
                        <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-100">"Re-run analysis"</code>
                      </button>
                      <button
                        onClick={() => handleSend("Show all available rules")}
                        className="w-full text-left px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-purple-100 dark:border-purple-700 hover:border-purple-300 transition-all group"
                      >
                        <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-100">"Show all available rules"</code>
                      </button>
                      <button
                        onClick={() => handleSend("Apply Account Management Rule")}
                        className="w-full text-left px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-purple-100 dark:border-purple-700 hover:border-purple-300 transition-all group"
                      >
                        <code className="text-[11px] font-mono text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-100">"Apply Account Management Rule"</code>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-8 space-y-8"
            >
              {/* Context Header - Show when in analysis context */}
              {isAnalysisContext && contextHeader && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 -mt-4 mb-2">
                  <Info size={14} className="text-blue-600 shrink-0" />
                  <span className="text-[12px] font-medium text-blue-900 dark:text-blue-200">
                    {contextHeader}
                  </span>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className={`flex flex-col ${msg.role === 'system' ? 'items-center' : msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.role === 'system' || msg.isSystemConfirmation ? (
                    <div className="w-full">
                      {renderMessageContent(msg)}
                    </div>
                  ) : (
                    <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden mt-1 shadow-md ${
                        msg.role === 'user' 
                          ? 'bg-muted border border-border' 
                          : 'bg-black text-white dark:bg-accent flex items-center justify-center'
                      }`}>
                        {msg.role === 'user' ? (
                          <ImageWithFallback 
                            src={profileImg} 
                            alt="Abhinav Saxena"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Bot size={14} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {renderMessageContent(msg)}
                      
                        {/* Suggested Actions */}
                        {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, idx) => (
                              <motion.button
                                key={`${msg.id}-sug-${idx}`}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.05) }}
                                onClick={() => handleSend(suggestion)}
                                className="px-3 py-1.5 rounded-full border border-border bg-background hover:border-accent/40 hover:bg-accent/5 text-[11px] font-medium text-muted-foreground hover:text-accent transition-all shadow-xs flex items-center gap-1.5 group"
                              >
                                <MessageSquare size={10} className="group-hover:scale-110 transition-transform" />
                                {suggestion}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {msg.role !== 'system' && !msg.isSystemConfirmation && (
                    <span className={`text-[10px] text-muted-foreground/50 mt-1.5 ${msg.role === 'user' ? 'mr-11' : 'ml-11'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-accent flex items-center justify-center mt-1 shadow-md">
                    <Bot size={14} />
                  </div>
                  <div className="p-4 bg-surface-secondary border border-border/50 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className={`p-6 border-t border-border/40 bg-background/50 backdrop-blur-md relative z-10 transition-all duration-500 ${!hasStarted ? 'pb-10' : ''}`}>
        <div className="relative group">
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={currentJourney ? `Ask about ${currentJourney.journeyName}...` : "Ask CX Workbench AI..."}
            className="w-full bg-surface-secondary border border-border/50 rounded-xl px-4 py-3.5 pr-14 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/50 focus:bg-background transition-all resize-none min-h-[52px] max-h-32 shadow-sm"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent text-white disabled:bg-muted disabled:text-muted-foreground hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20 active:scale-90"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.aside
      drag={isFloating}
      dragMomentum={false}
      dragListener={isFloating}
      initial={false}
      animate={{ 
        width: isFloating ? floatingSize.width : (isPanelOpen ? 400 : 0),
        height: isFloating ? floatingSize.height : (isPanelOpen ? '100%' : '100%'),
        opacity: isPanelOpen ? 1 : 0,
        x: isFloating ? undefined : 0,
        y: isFloating ? undefined : 0,
        borderRadius: isFloating ? 16 : 0,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`
        bg-background overflow-hidden z-50 shadow-2xl
        ${isFloating 
          ? 'fixed top-10 right-10 border border-border ring-1 ring-black/5' 
          : `relative border-border ${dockMode === 'left' ? 'border-r' : 'border-l'}`
        }
      `}
      style={{
        zIndex: 100,
        position: isFloating ? 'fixed' : 'relative',
        maxHeight: isFloating ? '90vh' : 'none',
        maxWidth: isFloating ? '90vw' : 'none',
      }}
    >
      {isFloating ? (
        <Resizable
          size={{ width: floatingSize.width, height: floatingSize.height }}
          onResizeStop={(e, direction, ref, d) => {
            setFloatingSize({
              width: floatingSize.width + d.width,
              height: floatingSize.height + d.height,
            });
          }}
          minWidth={320}
          minHeight={400}
          maxWidth="90vw"
          maxHeight="90vh"
          className="flex flex-col"
          handleClasses={{
            bottomRight: "cursor-nwse-resize w-4 h-4 bottom-0 right-0 z-20",
            bottom: "cursor-ns-resize h-1 bottom-0 z-20",
            right: "cursor-ew-resize w-1 right-0 z-20",
            left: "cursor-ew-resize w-1 left-0 z-20",
            top: "cursor-ns-resize h-1 top-0 z-20"
          }}
        >
          {panelContent}
          {/* Custom resize indicator at bottom-right */}
          <div className="absolute bottom-1 right-1 pointer-events-none opacity-20">
             <svg width="10" height="10" viewBox="0 0 10 10">
               <path d="M10 0 L10 10 L0 10 Z" fill="currentColor" />
             </svg>
          </div>
        </Resizable>
      ) : (
        <div className="w-[400px] h-full flex flex-col overflow-hidden">
          {panelContent}
        </div>
      )}
    </motion.aside>
  );
};
