import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { mockJiraTickets } from '@/app/data/mockJiraTickets';

// Import Figma screenshot assets
import supportLandingScreen from "../../assets/1.png";
import inquiryCategoryScreen from "../../assets/2.png";
import accountAccessScreen from "../../assets/6.png";
import agentInteractionScreen from "../../assets/4.png";
import resolutionSummaryScreen from "../../assets/5.png";
import customerSurveyScreen from "../../assets/3.png";

import { 
  ArrowLeft, 
  Clipboard, 
  FileText, 
  Upload, 
  Link2, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Mail,
  Video,
  Eye,
  X,
  Slack,
  FileType,
  Users,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  Clock,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { LottieLoader } from '@/app/components/LottieLoader';

const Motion = motion;

// AI-detected source type
interface AISource {
  id: string;
  icon: 'Slack' | 'Mail' | 'Figma' | 'Video' | 'Document' | 'Jira';
  badge: 'AUTO' | 'MANUAL';
  type: string;
  title: string;
  summary: string;
  addedBy: string;
  dateDetected: string;
  enabled: boolean;
  previewContent?: string;
  // Enhanced fields
  metadata?: {
    fileName?: string;
    lastUpdated?: string;
    owner?: string;
    subject?: string;
    sender?: string;
    date?: string;
    duration?: string;
    attendees?: string[];
  };
  fullContent?: string;
  transcript?: Array<{ time: string; speaker: string; text: string }>;
  figmaFrames?: Array<{ id: string; name: string; thumbnail?: string }>;
}

export const JiraContextEnrichment = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const ticket = mockJiraTickets.find(t => t.ticketId === ticketId);

  // AI-detected sources with toggle state
  const [aiSources, setAiSources] = useState<AISource[]>([
    {
      id: 'source-1',
      icon: 'Figma',
      badge: 'AUTO',
      type: 'Designer Figma File',
      title: 'Premium Upgrade Flow v3.2',
      summary: 'Complete user flow showing device selection, trade-in evaluation, and checkout process with premium tier upsell touchpoints.',
      addedBy: 'System',
      dateDetected: 'Feb 8, 2026',
      enabled: true,
      previewContent: 'Figma file contains 5 screens: Home, Device Selection, Trade-in Calculator, Cart, Checkout',
      metadata: {
        fileName: 'verizon-premium-upgrade-flow-v3.2.fig',
        lastUpdated: 'Feb 8, 2026 at 3:42 PM',
        owner: 'Sarah Chen'
      },
      figmaFrames: [
        { id: 'frame-1', name: 'Home - Premium Banner', thumbnail: 'Available' },
        { id: 'frame-2', name: 'Device Selection Grid', thumbnail: 'Available' },
        { id: 'frame-3', name: 'Trade-in Calculator', thumbnail: 'Available' },
        { id: 'frame-4', name: 'Cart Summary', thumbnail: 'Available' },
        { id: 'frame-5', name: 'Checkout Flow', thumbnail: 'Available' }
      ]
    },
    {
      id: 'source-2',
      icon: 'Video',
      badge: 'AUTO',
      type: 'Meeting Transcript',
      title: 'GTS Planning Session - Premium Features',
      summary: 'Stakeholder discussion on conversion goals, legacy browser support requirements, and integration with existing trade-in systems.',
      addedBy: 'System',
      dateDetected: 'Feb 3, 2026',
      enabled: true,
      previewContent: 'AI-generated summary of key discussion points and decisions from the 42-minute planning session with 8 participants.',
      metadata: {
        duration: '42 minutes',
        date: 'Feb 3, 2026 at 2:00 PM',
        attendees: ['Sarah Chen', 'Mike Rodriguez', 'Abhinav Saxena', 'Lisa Park', 'David Kim', 'Emma Watson', 'Carlos Martinez', 'Priya Sharma']
      },
      transcript: [
        { time: '00:02:14', speaker: 'Sarah Chen', text: 'We need to ensure the upgrade flow doesn\'t disrupt existing cart behavior. The data layer should capture device type and trade-in eligibility at entry.' },
        { time: '00:05:32', speaker: 'Mike Rodriguez', text: 'Agreed. Let\'s also track cart timer events - we lost 8% conversion last quarter due to session expiry.' },
        { time: '00:08:45', speaker: 'Abhinav Saxena', text: 'I\'ll document all interaction points for the tagging spec. We should align on naming conventions before dev handoff.' },
        { time: '00:12:18', speaker: 'Lisa Park', text: 'From a design perspective, we\'re adding a comparison modal. That needs its own event tracking.' },
        { time: '00:18:50', speaker: 'David Kim', text: 'The trade-in API can be slow. We should track when users abandon during that loading state.' },
        { time: '00:24:33', speaker: 'Emma Watson', text: 'Legal requires explicit consent tracking for trade-in valuations. Make sure that\'s in the data layer.' }
      ]
    },
    {
      id: 'source-3',
      icon: 'Slack',
      badge: 'MANUAL',
      type: 'Slack Thread',
      title: '#cx-analytics - Trade-in Flow Discussion',
      summary: 'Team alignment on trade-in eligibility tracking, partial completion events, and funnel visibility requirements for analytics.',
      addedBy: 'Abhinav Saxena',
      dateDetected: 'Feb 4, 2026',
      enabled: true,
      previewContent: '@sarah.chen: The trade-in eligibility check needs to fire before cart addition\n@mike.rodriguez: Should we track partial completions?\n@abhinav.saxena: Yes - let\'s add a "trade_in_started" event\n@analytics-team: +1, we need funnel visibility',
      metadata: {
        sender: 'Multiple participants',
        date: 'Feb 4, 2026'
      },
      fullContent: '@sarah.chen (2:34 PM): The trade-in eligibility check needs to fire before cart addition. Otherwise we can\'t differentiate between eligible vs. non-eligible users in the funnel.\n\n@mike.rodriguez (2:36 PM): Should we track partial completions? Like when someone starts the trade-in but doesn\'t finish?\n\n@abhinav.saxena (2:40 PM): Yes - let\'s add a "trade_in_started" event. We can use that to measure drop-off rates at each step.\n\n@analytics-team (2:45 PM): +1, we need funnel visibility. Can we also capture the estimated trade-in value in the data layer? Would help with segmentation.\n\n@sarah.chen (2:50 PM): Good call. Let\'s make sure device_model, trade_in_value_estimate, and condition_rating are all captured.\n\n@david.kim (3:02 PM): API team here - we can surface those values on the frontend. Just need to know the exact variable names.\n\n@abhinav.saxena (3:10 PM): I\'ll document everything in the Jira ticket and share the schema tomorrow.'
    },
    {
      id: 'source-4',
      icon: 'Mail',
      badge: 'AUTO',
      type: 'Email Thread',
      title: 'RE: Premium Tier Analytics Requirements',
      summary: 'Product team confirmation of KPIs: 15% reduction in checkout abandonment, real-time conversion tracking, Safari compatibility.',
      addedBy: 'System',
      dateDetected: 'Feb 5, 2026',
      enabled: true,
      previewContent: 'From: Sarah Chen\nTo: Analytics Team\nSubject: RE: Premium Tier Analytics Requirements\n\nTeam - confirming our Q1 targets:\n- 15% reduction in checkout abandonment\n- Real-time conversion tracking via GA4\n- Must support Safari 14+\n- Trade-in integration with legacy systems',
      metadata: {
        subject: 'RE: Premium Tier Analytics Requirements',
        sender: 'Sarah Chen',
        date: 'Feb 5, 2026 at 9:14 AM'
      },
      fullContent: 'From: Sarah Chen <sarah.chen@verizon.com>\nTo: Analytics Team <analytics@verizon.com>\nDate: Feb 5, 2026 at 9:14 AM\nSubject: RE: Premium Tier Analytics Requirements\n\nHi Team,\n\nThanks for the initial draft. After reviewing with stakeholders, here are our confirmed Q1 targets for the premium upgrade flow:\n\n✓ 15% reduction in checkout abandonment (baseline: 32% current rate)\n✓ Real-time conversion tracking via GA4 and Adobe Analytics\n✓ Must support Safari 14+ and Chrome 90+ (covers 94% of our user base)\n✓ Trade-in integration with legacy ValuationAPI v2.1\n✓ Cross-device journey tracking (mobile → desktop continuation)\n\nCritical Requirements:\n- All telemetry must fire within 500ms of user action\n- Data layer must support A/B test variant tracking\n- Privacy compliance: no PII in analytics tags\n\nLet\'s sync Thursday to review the technical spec.\n\nBest,\nSarah'
    },
    {
      id: 'source-5',
      icon: 'Document',
      badge: 'MANUAL',
      type: 'Google Drive Document',
      title: 'Product Requirements Document v3.2',
      summary: 'Comprehensive PRD covering user stories, edge cases, business rules, and technical constraints for premium device upgrade journey.',
      addedBy: 'Abhinav Saxena',
      dateDetected: 'Feb 3, 2026',
      enabled: false,
      previewContent: null, // External link
      metadata: {
        fileName: 'Premium_Upgrade_PRD_v3.2.docx',
        lastUpdated: 'Feb 3, 2026',
        owner: 'Product Team'
      }
    }
  ]);

  const [baNotes, setBaNotes] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<AISource | null>(null);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    { label: 'Gathering context signals', icon: '📡' },
    { label: 'Analyzing journey patterns', icon: '🔍' },
    { label: 'Mapping user flows', icon: '🗺️' },
    { label: 'Generating recommendations', icon: '✨' },
  ];

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Ticket Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested Jira ticket could not be found.</p>
          <button 
            onClick={() => navigate('/playground')}
            className="px-6 py-2 bg-foreground text-background rounded-xl font-bold hover:bg-black transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const toggleSource = (id: string) => {
    setAiSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const removeSource = (id: string) => {
    setAiSources(prev => prev.filter(s => s.id !== id));
    toast.success('Source removed from analysis');
  };

  const toggleExpanded = (id: string) => {
    setExpandedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBeginAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep(0);
    
    // Show toast notification
    toast.success('AI Analysis Started', {
      description: 'You\'ll be notified when it\'s ready for review.'
    });

    // Simulate progress animation for longer duration to let users see the analysis
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500); // Slower step transitions

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2; // Slower progress
      });
    }, 100);

    // Redirect back to dashboard after 6 seconds to let users see the completion
    setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      
      // Navigate back to dashboard - the journey will show as "Processing"
      navigate('/playground', { 
        state: { 
          processingTicketId: ticketId,
          showProcessingNotification: true 
        } 
      });
    }, 6000);
  };

  const enabledSourcesCount = aiSources.filter(s => s.enabled).length;
  const isReadyForAnalysis = enabledSourcesCount > 0;

  const getSourceIcon = (icon: AISource['icon']) => {
    switch (icon) {
      case 'Slack': return MessageSquare;
      case 'Mail': return Mail;
      case 'Figma': return Layers;
      case 'Video': return Video;
      case 'Document': return FileType;
      case 'Jira': return Clipboard;
      default: return FileText;
    }
  };

  const getSourceIconColor = (icon: AISource['icon']) => {
    switch (icon) {
      case 'Slack': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700';
      case 'Mail': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700';
      case 'Figma': return 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700';
      case 'Video': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700';
      case 'Document': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700';
      case 'Jira': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700';
    }
  };

  // Processing State Screen
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center gap-10 p-6">
        {/* Lottie Animation with Logo */}
        <div className="relative">
          <LottieLoader variant="TECHNICAL" size={180} />
          
          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-zinc-950 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-zinc-900/20 border-2 border-white dark:border-zinc-700">
              <Zap size={32} fill="currentColor" className="text-white" />
            </div>
          </div>
          
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-48 h-48 rounded-full border-2 border-indigo-500"
            />
          </div>
        </div>

        {/* Title and Description */}
        <div className="flex flex-col items-center gap-3 max-w-[500px]">
          <h2 className="text-[28px] font-black text-foreground tracking-tight text-center">
            AI Analysis in Progress
          </h2>
          <p className="text-[14px] text-muted-foreground text-center leading-relaxed">
            Processing context and generating journey recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[500px] flex flex-col gap-4">
          <div className="relative w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
            <Motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
              style={{ width: `${analysisProgress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${analysisProgress}%` }}
              transition={{ duration: 0.1 }}
            />
            {/* Shimmer effect */}
            <Motion.div
              className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '400%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Progress Percentage */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-muted-foreground">
              {Math.round(analysisProgress)}% Complete
            </span>
            <span className="text-[12px] font-mono text-muted-foreground">
              Step {currentStep + 1} of {analysisSteps.length}
            </span>
          </div>
        </div>

        {/* Animated Steps */}
        <div className="w-full max-w-[500px] flex flex-col gap-3">
          <AnimatePresence>
            {analysisSteps.map((step, index) => {
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <Motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isActive ? 1 : isComplete ? 0.6 : 0.3,
                    x: 0,
                    scale: isActive ? 1.02 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className={clsx(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                    isActive && "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500",
                    isComplete && "bg-surface-secondary border-emerald-500",
                    !isActive && !isComplete && "bg-surface-secondary border-border"
                  )}
                >
                  {/* Icon/Emoji */}
                  <div className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-[20px] shrink-0 transition-all",
                    isActive && "bg-indigo-500/20 ring-2 ring-indigo-500",
                    isComplete && "bg-emerald-500/20 ring-2 ring-emerald-500",
                    !isActive && !isComplete && "bg-zinc-200 dark:bg-zinc-800"
                  )}>
                    {isComplete ? '✓' : step.icon}
                  </div>

                  {/* Step Label */}
                  <div className="flex-1">
                    <p className={clsx(
                      "text-[14px] font-bold transition-colors",
                      isActive && "text-indigo-700 dark:text-indigo-300",
                      isComplete && "text-emerald-700 dark:text-emerald-300",
                      !isActive && !isComplete && "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  {isActive && (
                    <Motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full shrink-0"
                    />
                  )}
                  {isComplete && (
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                  )}
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-full px-4 md:px-8 py-10 pb-24 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/playground')}
            className="w-10 h-10 rounded-xl border-2 border-border hover:border-accent flex items-center justify-center transition-all group"
          >
            <ArrowLeft size={18} className="text-muted-foreground group-hover:text-accent" />
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verizon CX Workbench</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Context Preparation</span>
            </div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-foreground tracking-tight leading-tight">
              Enrich Context
            </h1>
            <p className="text-[13px] text-muted-foreground font-medium">
              Review and validate AI-aggregated sources before analysis
            </p>
          </div>
        </div>

        {/* Status Card - Neutral */}
        <div className="p-4 md:p-6 bg-card border-2 border-border rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900/20 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400 md:w-6 md:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] md:text-[16px] font-black text-foreground uppercase tracking-wide mb-1">
                Ready for AI Analysis
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed font-medium">
                AI will analyze approved sources and generate tagging recommendations for this journey.
              </p>
            </div>
            {!isReadyForAnalysis && (
              <div className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg shrink-0">
                <p className="text-[10px] md:text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  No sources enabled
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column: AI-Aggregated Context */}
          <div className="flex flex-col gap-6">
            
            {/* AI-Detected Context Sources */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-black text-foreground tracking-tight">
                  AI-Detected Context Sources
                </h2>
                <p className="text-[13px] text-muted-foreground font-medium">
                  We've automatically gathered related context from Jira, collaboration tools, and design artifacts. Review and confirm before starting AI analysis.
                </p>
              </div>

              {/* Alert if no sources enabled */}
              {!isReadyForAnalysis && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl">
                  <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                    At least one source must be included before starting analysis.
                  </p>
                </div>
              )}

              {/* AI Source Cards */}
              <div className="flex flex-col gap-3">
                {aiSources.map((source) => {
                  const IconComponent = getSourceIcon(source.icon);
                  const iconColorClasses = getSourceIconColor(source.icon);
                  const isExpanded = expandedSources.has(source.id);
                  
                  return (
                    <div 
                      key={source.id}
                      className={clsx(
                        "p-4 md:p-5 bg-card border-2 rounded-xl transition-all",
                        source.enabled 
                          ? "border-border hover:border-accent/50" 
                          : "border-border opacity-60"
                      )}
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        {/* Source Icon */}
                        <div className={clsx(
                          "w-10 h-10 rounded-lg flex items-center justify-center border-2 shrink-0",
                          iconColorClasses
                        )}>
                          <IconComponent size={20} />
                        </div>

                        {/* Source Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header Row */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                {source.type}
                              </span>
                              <div className={clsx(
                                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1",
                                source.badge === 'AUTO'
                                  ? "bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                                  : "bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                              )}>
                                {source.badge === 'AUTO' ? (
                                  <>
                                    <Sparkles size={9} />
                                    Auto
                                  </>
                                ) : (
                                  <>
                                    <Users size={9} />
                                    Manual
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleSource(source.id)}
                              className={clsx(
                                "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shrink-0",
                                source.enabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                              )}
                              role="switch"
                              aria-checked={source.enabled}
                            >
                              <span
                                className={clsx(
                                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                                  source.enabled ? "translate-x-5" : "translate-x-0"
                                )}
                              />
                            </button>
                          </div>

                          {/* Title */}
                          <h4 className="text-[14px] font-bold text-foreground mb-1.5 leading-tight">
                            {source.title}
                          </h4>

                          {/* AI Summary */}
                          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                            {source.summary}
                          </p>

                          {/* Metadata Row */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3 md:gap-4 text-[11px] text-muted-foreground">
                              <span className="whitespace-nowrap">Added by {source.addedBy}</span>
                              <span className="text-muted-foreground/40">•</span>
                              <span className="whitespace-nowrap">{source.dateDetected}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {/* Expand/Collapse Button */}
                              <button
                                onClick={() => toggleExpanded(source.id)}
                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-lg text-[11px] font-bold text-indigo-700 dark:text-indigo-300 transition-all flex items-center gap-1.5"
                              >
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                {isExpanded ? 'Collapse' : 'Expand'}
                              </button>
                              <button
                                onClick={() => removeSource(source.id)}
                                className="px-3 py-1.5 bg-surface-secondary border border-border hover:border-red-500 hover:text-red-600 rounded-lg text-[11px] font-bold text-muted-foreground transition-all flex items-center gap-1.5"
                              >
                                <X size={12} />
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Inline Preview (Expanded) */}
                          <AnimatePresence>
                            {isExpanded && (
                              <Motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                {/* Figma Preview */}
                                {source.icon === 'Figma' && source.figmaFrames && source.metadata && (
                                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-3 text-[12px]">
                                      <div>
                                        <span className="text-muted-foreground">File Name:</span>
                                        <p className="font-mono text-foreground text-[11px] mt-0.5">{source.metadata.fileName}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Owner:</span>
                                        <p className="font-bold text-foreground mt-0.5">{source.metadata.owner}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <span className="text-muted-foreground">Last Updated:</span>
                                        <p className="font-bold text-foreground mt-0.5">{source.metadata.lastUpdated}</p>
                                      </div>
                                    </div>

                                    {/* Frame Thumbnails */}
                                    <div>
                                      <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                        Frames ({source.figmaFrames.length})
                                      </h5>
                                      <div className="grid grid-cols-2 gap-3">
                                        {source.figmaFrames.map((frame, frameIdx) => {
                                          // Map frame names to Figma screenshot assets
                                          const imageMap: Record<number, string> = {
                                            0: supportLandingScreen, // Support Landing Screen
                                            1: inquiryCategoryScreen, // Inquiry Category Selection
                                            2: accountAccessScreen, // Account Access Verification
                                            3: agentInteractionScreen, // Agent Interaction Flow
                                            4: resolutionSummaryScreen, // Resolution Summary
                                            5: customerSurveyScreen, // Customer Survey
                                          };
                                          
                                          return (
                                          <div 
                                            key={frame.id}
                                            className="bg-surface-secondary border border-border rounded-lg p-3 hover:border-accent transition-all cursor-pointer group"
                                          >
                                            <div className="w-full aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 overflow-hidden">
                                              <img 
                                                src={imageMap[frameIdx] || imageMap[0]} 
                                                alt={frame.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                              />
                                            </div>
                                            <p className="text-[11px] font-bold text-foreground truncate">{frame.name}</p>
                                          </div>
                                        )})}
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2">
                                      <button className="flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
                                        <ExternalLink size={14} />
                                        Open Full File
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Meeting/Video Preview */}
                                {source.icon === 'Video' && source.transcript && source.metadata && (
                                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-3 text-[12px]">
                                      <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-muted-foreground" />
                                        <div>
                                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Duration</span>
                                          <p className="font-bold text-foreground">{source.metadata.duration}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Users size={14} className="text-muted-foreground" />
                                        <div>
                                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Attendees</span>
                                          <p className="font-bold text-foreground">{source.metadata.attendees?.length || 0}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Attendees List */}
                                    {source.metadata.attendees && source.metadata.attendees.length > 0 && (
                                      <div>
                                        <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                          Participants
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                          {source.metadata.attendees.map((attendee, idx) => (
                                            <span 
                                              key={idx}
                                              className="px-2 py-1 bg-surface-secondary border border-border rounded text-[11px] font-medium text-foreground"
                                            >
                                              {attendee}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Transcript Preview */}
                                    <div>
                                      <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                        Transcript Preview
                                      </h5>
                                      <div className="bg-surface-secondary border border-border rounded-lg p-4 max-h-[300px] overflow-y-auto flex flex-col gap-3">
                                        {source.transcript.slice(0, 6).map((entry, idx) => (
                                          <div key={idx} className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                              <button className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                                                {entry.time}
                                              </button>
                                              <span className="text-[11px] font-bold text-foreground">{entry.speaker}</span>
                                            </div>
                                            <p className="text-[12px] text-muted-foreground leading-relaxed pl-0 md:pl-16">
                                              {entry.text}
                                            </p>
                                          </div>
                                        ))}
                                        {source.transcript.length > 6 && (
                                          <p className="text-[11px] text-muted-foreground italic text-center pt-2 border-t border-border">
                                            + {source.transcript.length - 6} more entries
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row items-center gap-2">
                                      <button className="w-full sm:flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
                                        <Play size={14} />
                                        Watch Recording
                                      </button>
                                      <button className="w-full sm:flex-1 px-3 py-2 bg-surface-secondary border border-border hover:border-accent rounded-lg text-[12px] font-bold text-foreground transition-all flex items-center justify-center gap-2">
                                        <FileText size={14} />
                                        View Full Transcript
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Slack/Email Preview */}
                                {(source.icon === 'Slack' || source.icon === 'Mail') && source.fullContent && source.metadata && (
                                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
                                    {/* Metadata */}
                                    <div className="grid grid-cols-1 gap-2 text-[12px]">
                                      {source.icon === 'Mail' && source.metadata.subject && (
                                        <div>
                                          <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Subject</span>
                                          <p className="font-bold text-foreground">{source.metadata.subject}</p>
                                        </div>
                                      )}
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">
                                            {source.icon === 'Mail' ? 'From' : 'Participants'}
                                          </span>
                                          <p className="font-bold text-foreground">{source.metadata.sender}</p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Date</span>
                                          <p className="font-bold text-foreground">{source.metadata.date}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Body Preview */}
                                    <div>
                                      <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                        {source.icon === 'Mail' ? 'Email Body' : 'Thread Content'}
                                      </h5>
                                      <div className="bg-surface-secondary border border-border rounded-lg p-4 max-h-[300px] overflow-y-auto">
                                        <pre className="text-[12px] text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                                          {source.fullContent}
                                        </pre>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                      <button className="flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
                                        <ExternalLink size={14} />
                                        Open Original Source
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Document Preview */}
                                {source.icon === 'Document' && source.metadata && (
                                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-3 text-[12px]">
                                      <div className="col-span-2">
                                        <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">File Name</span>
                                        <p className="font-mono text-foreground text-[11px]">{source.metadata.fileName}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Owner</span>
                                        <p className="font-bold text-foreground">{source.metadata.owner}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Last Updated</span>
                                        <p className="font-bold text-foreground">{source.metadata.lastUpdated}</p>
                                      </div>
                                    </div>

                                    {/* Note about external link */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                      <p className="text-[12px] text-blue-800 dark:text-blue-300">
                                        This document is stored externally. Click below to open in Google Drive.
                                      </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                      <button className="flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
                                        <ExternalLink size={14} />
                                        Open in Google Drive
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Additional Context - Secondary */}
            <div className="flex flex-col gap-4 pt-4 border-t-2 border-border">
              <div className="flex flex-col gap-1">
                <h3 className="text-[16px] font-bold text-foreground">
                  Add Additional Context <span className="text-[12px] font-medium text-muted-foreground">(Optional)</span>
                </h3>
              </div>

              {/* BA Notes - Compact */}
              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                  BA Notes
                </label>
                <textarea
                  value={baNotes}
                  onChange={(e) => setBaNotes(e.target.value)}
                  placeholder="Add any additional context, clarifications, or considerations..."
                  className="w-full min-h-[100px] p-3 bg-background border border-border rounded-lg text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                {baNotes.length > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    {baNotes.length} characters
                  </span>
                )}
              </div>

              {/* Compact Upload Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button className="px-3 py-2 border border-dashed border-border hover:border-accent rounded-lg transition-all flex items-center justify-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-accent">
                  <Upload size={14} />
                  <span className="hidden sm:inline">Upload File</span>
                  <span className="sm:hidden">Upload</span>
                </button>
                <button className="px-3 py-2 border border-dashed border-border hover:border-accent rounded-lg transition-all flex items-center justify-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-accent">
                  <Link2 size={14} />
                  <span className="hidden sm:inline">Add Link</span>
                  <span className="sm:hidden">Link</span>
                </button>
                <button className="px-3 py-2 border border-dashed border-border hover:border-accent rounded-lg transition-all flex items-center justify-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-accent">
                  <Video size={14} />
                  <span className="hidden sm:inline">Recording</span>
                  <span className="sm:hidden">Video</span>
                </button>
              </div>
            </div>

            {/* Begin AI Analysis CTA */}
            <div className="pt-4">
              <button 
                onClick={handleBeginAnalysis}
                disabled={!isReadyForAnalysis}
                className={clsx(
                  "w-full px-6 py-4 rounded-xl text-[14px] md:text-[15px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg",
                  isReadyForAnalysis
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed"
                )}
              >
                <Sparkles size={20} />
                Begin AI Analysis
                <ChevronRight size={20} />
              </button>
              <p className="text-[11px] text-center text-muted-foreground mt-2">
                AI will analyze only the enabled sources.
              </p>
            </div>
          </div>

          {/* Right Column: Jira Reference */}
          <div className="flex flex-col gap-6">
            <div className="bg-card border-2 border-border rounded-2xl p-4 md:p-6 flex flex-col gap-5 sticky top-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg flex items-center justify-center">
                  <Clipboard size={18} className="text-blue-600 dark:text-blue-400 md:w-5 md:h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Jira Reference</span>
                  <span className="text-[14px] md:text-[16px] font-bold text-foreground">{ticket.ticketId}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Journey Name</h4>
                <p className="text-[14px] md:text-[16px] font-bold text-foreground">{ticket.journeyName}</p>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Title</h4>
                <p className="text-[13px] md:text-[14px] text-foreground leading-relaxed">{ticket.title}</p>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                <p className="text-[12px] md:text-[13px] text-muted-foreground leading-relaxed">{ticket.description}</p>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Acceptance Criteria</h4>
                <ul className="flex flex-col gap-2">
                  {ticket.acceptanceCriteria.map((criteria, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[12px] md:text-[13px] text-muted-foreground">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div>
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Platform</h4>
                  <p className="text-[12px] md:text-[13px] font-bold text-foreground">{ticket.platform}</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Priority</h4>
                  <p className="text-[12px] md:text-[13px] font-bold text-foreground">{ticket.priority}</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Assigned To</h4>
                  <p className="text-[12px] md:text-[13px] font-bold text-foreground">{ticket.assignedTo}</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Due Date</h4>
                  <p className="text-[12px] md:text-[13px] font-bold text-foreground">
                    {new Date(ticket.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
