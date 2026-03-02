import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  Search, 
  Activity, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Info,
  Clock,
  Layout,
  MousePointer2,
  Terminal,
  Fingerprint,
  RefreshCcw,
  Check,
  AlertTriangle,
  Zap,
  Target,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Database,
  ExternalLink,
  PlusCircle,
  MinusCircle,
  Braces,
  Globe,
  Monitor,
  Smartphone,
  CheckCircle,
  Eye,
  ArrowLeft,
  ArrowUpRight,
  MinusCircle as MinusCircleIcon,
  PlusCircle as PlusCircleIcon,
  Cpu,
  FileCode,
  Sparkles,
  Download,
  ClipboardCheck,
  PanelRight
} from 'lucide-react';
import { mockJourneys, Journey, JourneyStep, TagComponent } from '@/app/data/mockJourneys';
import { StatusBadge, CardContainer } from '@/app/components/Foundation';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
const Motion = motion;
import { LottieLoader } from "../components/LottieLoader";

type ValidationStatus = 'pass' | 'warning' | 'fail';
type Environment = 'Dev' | 'QA' | 'Stage';

interface ValidationAgent {
  id: string;
  name: string;
  description: string;
  status: ValidationStatus;
  icon: any;
}

const AGENTS: ValidationAgent[] = [
  { 
    id: 'presence', 
    name: 'Tag Presence Agent', 
    description: 'DOM element verification.', 
    status: 'pass',
    icon: Search
  },
  { 
    id: 'consistency', 
    name: 'Event Consistency Agent', 
    description: 'Schema name matching.', 
    status: 'warning',
    icon: Activity
  },
  { 
    id: 'drift', 
    name: 'Environment Drift Agent', 
    description: 'Code difference tracking.', 
    status: 'pass',
    icon: Layers
  },
  { 
    id: 'coverage', 
    name: 'Journey Coverage Agent', 
    description: 'Critical path conversion.', 
    status: 'pass',
    icon: ShieldCheck
  }
];

const LoadingScreen = ({ loadingStep, loadingMessages }: { loadingStep: number, loadingMessages: string[] }) => (
  <div className="flex-1 flex flex-col items-center justify-center bg-white h-full">
    <div className="flex flex-col items-center gap-10">
      <LottieLoader variant="SCAN" size={180} />
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <Motion.p 
            key={loadingStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[20px] font-black text-zinc-900 tracking-tight"
          >
            {loadingMessages[loadingStep]}
          </Motion.p>
        </AnimatePresence>
        <div className="flex gap-2">
          {loadingMessages.map((_, i) => (
            <div 
              key={i} 
              className={clsx(
                "w-2 h-2 rounded-full transition-all duration-500",
                i <= loadingStep ? "bg-zinc-900 w-6 shadow-[0_0_10px_rgba(0,0,0,0.1)]" : "bg-zinc-100"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const JourneyValidation = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  
  const isExisting = journeyId?.startsWith('ext-');

  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('vzw-seen-validation');
    }
    return true;
  });
  const [loadingStep, setLoadingStep] = useState(0);
  
  const [journey, setJourney] = useState<Journey | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasBeenOpened = sessionStorage.getItem('vzw-context-opened-validity');
      if (!hasBeenOpened) {
        sessionStorage.setItem('vzw-context-opened-validity', 'true');
        return true;
      }
    }
    return false;
  });
  const [activeEnv, setActiveEnv] = useState<Environment>('Stage');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const loadingMessages = [
    "Spinning up validation agents...",
    "Inspecting environment telemetry...",
    "Comparing implementation drift...",
    "Finalizing validation report..."
  ];

  useEffect(() => {
    const found = mockJourneys.find(j => j.journeyId === journeyId) || mockJourneys[0];
    setJourney(found);
  }, [journeyId]);

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < loadingMessages.length - 1) return prev + 1;
          clearInterval(timer);
          setTimeout(() => {
            sessionStorage.setItem('vzw-seen-validation', 'true');
            setLoading(false);
          }, 800);
          return prev;
        });
      }, 800);
      return () => clearInterval(timer);
    }
  }, [loading, journeyId]);

  const isStepComplete = (step: JourneyStep) => {
    if (!step.components || step.components.length === 0) return true;
    return step.components.every(c => c.approvalState !== 'Proposed');
  };

  const getMismatchCount = (step: JourneyStep, idx: number) => {
    // For existing journeys (Completed), we show high health/low mismatches
    if (isExisting || journey?.status === 'Completed') {
      return 0;
    }
    
    // For journeys being reviewed/in-progress, we simulate some drift
    if (idx === 1) return 1; // Mocked mismatch for second stage
    if (idx === 3) return Math.min(step.components?.length || 0, 2); // Some missing for later stage
    return 0;
  };

  const getConfidenceScore = () => {
    if (isExisting || journey?.status === 'Completed') return 100;
    const totalSteps = journey?.steps.length || 1;
    const mismatches = journey?.steps.reduce((acc, step, idx) => acc + getMismatchCount(step, idx), 0) || 0;
    if (mismatches === 0) return 98;
    return Math.max(65, 90 - (mismatches * 5));
  };

  const activeStep = journey?.steps[activeStepIdx];
  const totalTagsCount = journey?.tagRecommendationCount || 0;
  const confidenceScore = getConfidenceScore();
  const registryPath = `vzw.cx.${journey?.journeyName.toLowerCase().replace(/[^a-z0-9]/g, '.')}`;

  if (loading) return <LoadingScreen loadingStep={loadingStep} loadingMessages={loadingMessages} />;
  if (!journey) return null;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-white">
      
      {/* 1. Validation Telemetry Context (Header Strip with metadata) */}
      <div className="bg-white border-b border-zinc-100 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-10 py-4 bg-zinc-50/30">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3 text-zinc-400">
                <ShieldCheck size={18} className="text-zinc-500" />
                <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">
                  Validation Telemetry Context
                </span>
             </div>
             {!isDetailsExpanded && (
                <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                   <div className="flex items-center gap-3">
                      <span className="text-[14px] font-black text-zinc-900 line-clamp-1 max-w-[450px]">
                        {journey.journeyName}
                      </span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="h-4 w-[1px] bg-zinc-200" />
                      <div className="flex items-center gap-2">
                        <StatusBadge 
                          status={confidenceScore > 90 ? "success" : "warning"} 
                          label={confidenceScore > 90 ? "Healthy" : "Partial Match"} 
                        />
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock size={14} />
                        <span className="text-[12px] font-bold">Checked {isExisting ? '4m ago' : '22m ago'}</span>
                      </div>
                   </div>
                </div>
             )}
          </div>
          <button 
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="flex items-center gap-2.5 px-4 py-2 bg-white border border-zinc-200 hover:border-zinc-900 rounded-[var(--radius-button)] text-[12px] font-black text-zinc-900 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {isDetailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isDetailsExpanded ? 'Hide Metadata' : 'Show Metadata'}
          </button>
        </div>

        <AnimatePresence>
          {isDetailsExpanded && (
            <Motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-zinc-100"
            >
              <div className="px-10 py-10 grid grid-cols-12 gap-12 bg-white">
                {/* A. Summary Metadata */}
                <div className="col-span-4 flex flex-col gap-6">
                   <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-zinc-400">
                         <Info size={16} />
                         <span className="text-[11px] font-black uppercase tracking-widest">Journey Summary</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-[18px] font-black text-zinc-900 leading-tight">{journey.journeyName}</h4>
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1">
                             {['Dev', 'QA', 'Stage'].map(env => (
                               <span key={env} className={clsx(
                                 "text-[9px] px-1.5 py-0.5 rounded-[4px] font-bold border uppercase",
                                 env === activeEnv ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 text-zinc-400 border-zinc-100"
                               )}>
                                 {env}
                               </span>
                             ))}
                           </div>
                           <div className="w-1 h-1 rounded-full bg-zinc-300" />
                           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">VSDS v4.2 Baseline</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4 py-5 border-y border-zinc-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Overall Status</span>
                        <div className={clsx(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border",
                          confidenceScore > 90 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        )}>
                          {confidenceScore > 90 ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {confidenceScore > 90 ? "Healthy" : "Warnings Detected"}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tracking Focus</span>
                        <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-[13px]">
                          <Target size={12} className="text-zinc-400" />
                          {journey.trackingFocus}
                        </div>
                      </div>
                   </div>
                </div>

                {/* B. Technical Metadata */}
                <div className="col-span-4 border-l border-zinc-100 pl-12 flex flex-col gap-8">
                   <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <Monitor size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Environment</span>
                         </div>
                         <span className="text-[16px] font-black text-zinc-900">{journey.platform} / {activeEnv}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <Zap size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">SDK Version</span>
                         </div>
                         <span className="text-[16px] font-black text-zinc-900">{journey.platform === 'Mobile' ? 'v2.8.4-native' : 'v4.1.0-web'}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <Layers size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Registry Path</span>
                         </div>
                         <span className="text-[16px] font-black text-zinc-900 truncate">{registryPath}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <Globe size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Collection URL</span>
                         </div>
                         <div className="flex items-center gap-1 group cursor-pointer">
                            <span className="text-[14px] font-black text-zinc-900 truncate max-w-[120px]">
                              {journey.environmentLink.includes('https') ? journey.environmentLink.replace('https://', '').split('/')[0] : 'collect.vzw.com'}
                            </span>
                            <ExternalLink size={12} className="text-zinc-400 group-hover:text-zinc-900" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* C. Validation Agents Metadata */}
                <div className="col-span-4 border-l border-zinc-100 pl-12 flex flex-col gap-5">
                   <div className="flex items-center gap-2 text-zinc-400">
                      <Zap size={18} className="text-zinc-900" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Active Validation Agents</span>
                   </div>
                   <div className="flex flex-col gap-3">
                      {AGENTS.map(agent => {
                        const isCompromised = (agent.id === 'consistency' && !isExisting && activeStepIdx === 1) || (agent.id === 'coverage' && !isExisting && activeStepIdx === 3);
                        const status = isCompromised ? (agent.id === 'coverage' ? 'fail' : 'warning') : 'pass';
                        
                        return (
                          <div key={agent.id} className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl group hover:bg-white hover:border-zinc-200 transition-all cursor-default shadow-sm hover:shadow-md">
                            <div className={clsx(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                              status === 'pass' ? "bg-emerald-500 text-white" : 
                              status === 'warning' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                            )}>
                              <agent.icon size={18} />
                            </div>
                            <div className="flex-1 flex flex-col min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[13px] font-black text-zinc-900 truncate tracking-tight">{agent.name}</span>
                                <div className={clsx(
                                  "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shrink-0",
                                  status === 'pass' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                  status === 'warning' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                )}>
                                  {status}
                                </div>
                              </div>
                              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5 truncate group-hover:text-zinc-500 transition-colors">
                                {agent.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Main Three-Column Layout (Stages | Results | Checklist) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Column 1: Journey Stages (Collapsible) */}
        <Motion.div 
          initial={false}
          animate={{ width: isLeftPanelCollapsed ? 80 : 340 }}
          className="border-r border-zinc-100 bg-white flex flex-col shrink-0 overflow-hidden"
        >
           <div className="p-6 bg-white border-b border-zinc-100 flex items-center justify-between h-[80px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] sticky top-0 z-20">
              {!isLeftPanelCollapsed && (
                <Motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-3 text-zinc-400"
                >
                   <Layout size={18} className="text-zinc-500" />
                   <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">Journey Stages</span>
                </Motion.div>
              )}
              <button 
                onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
                className={clsx(
                  "p-2.5 rounded-[var(--radius-button)] transition-all cursor-pointer hover:bg-zinc-100 text-zinc-500",
                  isLeftPanelCollapsed ? "mx-auto" : ""
                )}
              >
                {isLeftPanelCollapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
              </button>
           </div>
           <div className={clsx(
             "flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3",
             isLeftPanelCollapsed ? "p-4 items-center" : "p-6"
           )}>
              {journey.steps.map((step, idx) => {
                const stepDone = isStepComplete(step);
                const isActive = activeStepIdx === idx;
                return (
                  <button 
                    key={step.stepId}
                    onClick={() => {
                      setActiveStepIdx(idx);
                      setExpandedRow(null);
                    }}
                    className={clsx(
                      "flex transition-all text-left group cursor-pointer active:scale-[0.98] shrink-0",
                      isLeftPanelCollapsed 
                        ? "w-12 h-12 rounded-full items-center justify-center border-2" 
                        : "items-start gap-4 p-5 rounded-[var(--radius-card)] border",
                      isActive 
                        ? "bg-zinc-900 border-zinc-900 shadow-2xl text-white" 
                        : "bg-white border-zinc-100 hover:border-zinc-300 shadow-sm"
                    )}
                  >
                    <div className={clsx(
                      "rounded-full flex items-center justify-center text-[12px] font-black shrink-0 transition-all",
                      isLeftPanelCollapsed ? "w-full h-full" : "w-8 h-8",
                      isActive 
                        ? "bg-white/20 text-white" 
                        : (stepDone ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200")
                    )}>
                      {stepDone ? <Check size={isLeftPanelCollapsed ? 20 : 16} strokeWidth={4} /> : idx + 1}
                    </div>
                    {!isLeftPanelCollapsed && (
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={clsx(
                          "text-[15px] font-black truncate transition-colors",
                          isActive ? "text-white" : "text-zinc-900"
                        )}>{step.stepName}</span>
                        <div className="flex flex-col">
                          <span className={clsx(
                            "text-[11px] font-bold truncate opacity-60",
                            isActive ? "text-zinc-300" : "text-zinc-500"
                          )}>{step.screenTemplate || step.screenType} template</span>
                          
                          <div className="flex items-center gap-1.5 mt-2">
                             <div className={clsx(
                               "w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
                               getMismatchCount(step, idx) > 0 
                                 ? (idx === 3 ? "bg-rose-500 shadow-rose-500/50" : "bg-amber-500 shadow-amber-500/50")
                                 : "bg-emerald-500 shadow-emerald-500/50"
                             )} />
                             <span className={clsx(
                               "text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                               isActive ? "text-white" : (getMismatchCount(step, idx) > 0 ? (idx === 3 ? "text-rose-500" : "text-amber-600") : "text-zinc-400")
                             )}>
                               {getMismatchCount(step, idx)} Mismatches Detected
                             </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
           </div>
        </Motion.div>

        {/* Column 2: Validation Results (Main Focus) */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-zinc-50/50 flex flex-col p-10 gap-10">
          <section className="flex flex-col gap-6">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-[28px] font-black text-zinc-900 tracking-tight leading-none">Validation Results</h3>
              </div>
              <div className="flex p-1 bg-zinc-200/50 rounded-xl border border-zinc-200">
                {(['Dev', 'QA', 'Stage'] as Environment[]).map(env => (
                  <button key={env} onClick={() => setActiveEnv(env)} className={clsx("px-5 py-2 rounded-lg text-[11px] font-black transition-all uppercase", activeEnv === env ? "bg-white text-zinc-900 shadow-md" : "text-zinc-400 hover:text-zinc-600")}>
                    {env}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col border border-zinc-200 rounded-[32px] bg-white overflow-hidden shadow-xl">
              <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <div className="col-span-5">Implementation Tag</div>
                <div className="col-span-2 text-center">Approved</div>
                <div className="col-span-2 text-center">Detected</div>
                <div className="col-span-3 text-right">Status</div>
              </div>
              
              <div className="flex flex-col">
                {activeStep?.components?.map((comp, cIdx) => {
                  const isExpanded = expandedRow === comp.componentId;
                  const hasWarning = !isExisting && activeStepIdx === 1 && cIdx === 0;
                  const isMissing = !isExisting && activeStepIdx === 3;
                  
                  return (
                    <div key={comp.componentId} className="flex flex-col border-b border-zinc-50 last:border-0">
                      <button onClick={() => setExpandedRow(isExpanded ? null : comp.componentId)} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-zinc-50/30 transition-colors text-left cursor-pointer group">
                        <div className="col-span-5 flex items-center gap-5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 shadow-inner">
                            <Target size={18} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[15px] font-black text-zinc-900 truncate">{comp.aiRecommendedTag}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">{comp.eventType}</span>
                               <span className="w-1 h-1 rounded-full bg-zinc-200 shrink-0" />
                               <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">{comp.level}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-center"><span className="text-[14px] font-black text-zinc-900 font-mono">1</span></div>
                        <div className="col-span-2 text-center"><span className={clsx("text-[14px] font-black font-mono", isMissing ? "text-rose-500" : hasWarning ? "text-amber-500" : "text-emerald-500")}>{isMissing ? 0 : 1}</span></div>
                        <div className="col-span-3 flex items-center justify-end gap-4">
                          <div className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm shrink-0", isMissing ? "bg-rose-50 text-rose-700 border-rose-100" : hasWarning ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100")}>
                            {isMissing ? 'Missing' : hasWarning ? 'Mismatched' : 'Matched'}
                          </div>
                          <div className="w-6 h-6 flex items-center justify-center">
                            {isExpanded ? <ChevronUp size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" /> : <ChevronDown size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />}
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-4 duration-300">
                           <div className="bg-zinc-50/50 rounded-[24px] border border-zinc-100 p-6 flex flex-col gap-6">
                              <div className="grid grid-cols-2 gap-6">
                                 {/* Expected Payload */}
                                 <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col gap-3 shadow-2xl relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <ArrowUpRight size={12} className="text-zinc-600" /> Expected Payload
                                      </span>
                                      <div className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-tighter">Schema v4.2</div>
                                    </div>
                                    <div className="flex flex-col font-mono text-[12px] leading-relaxed">
                                      <div className="text-zinc-400">{"{"}</div>
                                      <div className="pl-4 text-emerald-400">
                                        <span className="text-zinc-300">"event":</span> "{comp.aiRecommendedTag}",
                                      </div>
                                      <div className="pl-4 text-emerald-400">
                                        <span className="text-zinc-300">"type":</span> "{comp.eventType}",
                                      </div>
                                      <div className="pl-4 text-emerald-400">
                                        <span className="text-zinc-300">"level":</span> "{comp.level}"
                                      </div>
                                      <div className="text-zinc-400">{"}"}</div>
                                    </div>
                                 </div>

                                 {/* Detected Payload */}
                                 <div className={clsx(
                                   "p-5 rounded-2xl border flex flex-col gap-3 shadow-2xl relative overflow-hidden transition-all",
                                   isMissing ? "bg-rose-950/20 border-rose-900/30" : "bg-zinc-950 border-zinc-800"
                                 )}>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <Eye size={12} className="text-zinc-600" /> Detected Payload
                                      </span>
                                      {!isMissing && (
                                        <div className={clsx(
                                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                                          hasWarning ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                                        )}>
                                          {hasWarning ? 'Drift Detected' : 'Verified'}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {isMissing ? (
                                       <div className="flex flex-col items-center justify-center flex-1 text-rose-500/60 gap-1.5 py-4">
                                          <XCircle size={24} />
                                          <span className="text-[11px] font-black italic uppercase tracking-tighter">No telemetry detected</span>
                                       </div>
                                    ) : (
                                      <div className="flex flex-col font-mono text-[12px] leading-relaxed relative">
                                        <div className="text-zinc-400">{"{"}</div>
                                        
                                        {/* Row with potential highlight */}
                                        <div className={clsx(
                                          "pl-4 flex items-center gap-2 transition-all",
                                          hasWarning ? "bg-amber-500/10 border-l-2 border-amber-500 -ml-4 pl-[14px] py-1" : "text-emerald-400"
                                        )}>
                                          <span className="text-zinc-300">"event":</span> 
                                          <span className={clsx(hasWarning ? "text-amber-400 font-black underline decoration-amber-500/30 underline-offset-4" : "text-emerald-400")}>
                                            "{hasWarning ? 'click.legacy.cta' : comp.aiRecommendedTag}",
                                          </span>
                                          {hasWarning && (
                                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-tighter ml-auto">Mismatch</span>
                                          )}
                                        </div>

                                        <div className="pl-4 text-emerald-400">
                                          <span className="text-zinc-300">"type":</span> "{comp.eventType}",
                                        </div>
                                        <div className="pl-4 text-emerald-400">
                                          <span className="text-zinc-300">"level":</span> "{comp.level}"
                                        </div>
                                        <div className="text-zinc-400">{"}"}</div>
                                      </div>
                                    )}
                                 </div>
                              </div>
                              {(hasWarning || isMissing) && (
                                <div className={clsx("p-5 rounded-2xl border flex flex-col gap-4 shadow-xl", isMissing ? "bg-rose-50 border-rose-100" : "bg-amber-50 border-amber-100")}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <AlertTriangle size={18} className={isMissing ? "text-rose-600" : "text-amber-600"} />
                                      <span className={clsx("text-[16px] font-black", isMissing ? "text-rose-900" : "text-amber-900")}>{isMissing ? "Critical Interaction Gap" : "Naming Convention Deviation"}</span>
                                    </div>
                                    <button className="px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-[10px] font-black uppercase transition-all shadow-sm">Fix Implementation</button>
                                  </div>
                                  <p className={clsx("text-[13px] font-bold leading-relaxed", isMissing ? "text-rose-700/70" : "text-amber-700/70")}>
                                    {isMissing ? "Automated agents detected a drop in the interaction funnel. Component interaction is firing but the CX Tag is not present in the DOM hierarchy." : "The tracking event has been renamed in the source code without updating the Measurement Fabric schema."}
                                  </p>
                                </div>
                              )}
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Column 3: Production Readiness Checklist (Collapsible) */}
        <Motion.div 
          initial={false}
          animate={{ width: isRightPanelCollapsed ? 80 : 380 }}
          className="border-l border-zinc-100 bg-white flex flex-col shrink-0 overflow-hidden shadow-[ -10px_0_40px_-20px_rgba(0,0,0,0.1) ]"
        >
           <div className="p-6 bg-white border-b border-zinc-100 flex items-center justify-between h-[80px] shrink-0">
              {!isRightPanelCollapsed && (
                <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-zinc-400">
                   <ClipboardCheck size={18} className="text-zinc-500" />
                   <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">Overall Readiness Checklist</span>
                </Motion.div>
              )}
              <button 
                onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)} 
                className={clsx(
                  "p-2.5 rounded-[var(--radius-button)] hover:bg-zinc-100 text-zinc-500",
                  isRightPanelCollapsed ? "mx-auto" : ""
                )}
              >
                {isRightPanelCollapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
              </button>
           </div>

           <div className={clsx("flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6", isRightPanelCollapsed ? "p-4 items-center" : "p-8")}>
              {!isRightPanelCollapsed && (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Confidence Score</span>
                    <div className="flex items-end gap-3">
                       <span className="text-[40px] font-black text-zinc-900 leading-none">{confidenceScore}<span className="text-[20px] text-zinc-400">%</span></span>
                       <div className="h-6 w-[2px] bg-zinc-100 mb-1" />
                       <span className={clsx(
                         "text-[12px] font-bold mb-1",
                         confidenceScore > 90 ? "text-emerald-600" : "text-amber-600"
                       )}>
                         {confidenceScore > 90 ? 'Production Ready' : 'Needs Polish'}
                       </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: "Signals SDK initialization", status: "pass", desc: "Global handshake verified." },
                      { label: "Namespace resolution", status: "pass", desc: "CX fabric paths active." },
                      { label: "Step telemetry capture", status: (isExisting || activeStepIdx !== 3) ? "pass" : "fail", desc: "Active step tracking." },
                      { label: "Data Layer schema", status: (isExisting || activeStepIdx !== 1) ? "pass" : "warning", desc: "VSDS v4.2 alignment." },
                      { label: "Registry sync check", status: "pass", desc: "Governance cloud lock." }
                    ].map((item, i) => (
                      <div key={i} className="group p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-3.5 hover:bg-white hover:border-zinc-900 hover:shadow-lg transition-all">
                        <div className={clsx(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm", 
                          item.status === 'pass' ? "bg-emerald-500 text-white" : item.status === 'warning' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                        )}>
                          {item.status === 'pass' ? <Check size={14} strokeWidth={4} /> : item.status === 'warning' ? <AlertTriangle size={14} strokeWidth={4} /> : <XCircle size={14} strokeWidth={4} />}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                          <span className="text-[13px] font-black text-zinc-900 truncate">{item.label}</span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight truncate leading-none">{item.desc}</span>
                        </div>
                        <div className={clsx(
                          "px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase border shrink-0", 
                          item.status === 'pass' ? "text-emerald-500 border-emerald-100 bg-emerald-50" : item.status === 'warning' ? "text-amber-500 border-amber-100 bg-amber-50" : "text-rose-500 border-rose-100 bg-rose-50"
                        )}>
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-5 bg-zinc-900 text-white rounded-3xl text-[14px] font-black shadow-xl shadow-zinc-900/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
                    <RefreshCcw size={18} /> Re-validate Environment
                  </button>
                </div>
              )}
           </div>
        </Motion.div>
      </div>
    </div>
  );
};
