import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Zap, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Code2,
  FileJson,
  Map,
  ClipboardCheck,
  Download,
  Copy,
  Layers,
  Target,
  Clock,
  Info,
  ArrowRight,
  MousePointer2,
  Layout,
  Sparkles,
  Search,
  ChevronRight,
  AlertCircle,
  Box,
  Cpu,
  RefreshCcw,
  X,
  Plus,
  ShieldCheck,
  Globe,
  Monitor,
  Smartphone,
  CheckCircle,
  Eye,
  ArrowLeft,
  ArrowUpRight,
  MinusCircle,
  PlusCircle,
  AlertTriangle,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Database,
  Link2,
  ExternalLink,
  ClipboardList,
  CheckCircle2,
  Edit3,
  FileCode,
  Braces,
  RotateCcw,
  Github,
  GitBranch,
  GitCommit,
  History,
  GitPullRequest,
  Send,
  Package
} from 'lucide-react';
import { mockJourneys, Journey, JourneyStep, TagComponent } from '@/app/data/mockJourneys';
import { StatusBadge, CardContainer } from '@/app/components/Foundation';
import { JourneyStepper } from '@/app/components/JourneyStepper';
import { JourneyScreenGenerator } from '@/app/components/JourneyScreenGenerator';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
const Motion = motion;
import { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
} from "../components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { LottieLoader } from "../components/LottieLoader";

// --- Types & Interfaces for Incremental Changes ---

interface IncrementalChange {
  id: string;
  type: 'Add' | 'Modify' | 'Remove';
  element: string;
  field?: string;
  before?: string;
  after?: string;
  snippet: string;
  reason: string;
  componentId: string;
}

// --- Sub-components ---

const ArtifactCard = ({ 
  title, 
  icon: Icon, 
  children, 
  isExpanded, 
  onToggle, 
  actions,
  badge
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  isExpanded: boolean; 
  onToggle: () => void;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}) => (
  <div className={clsx(
    "flex flex-col border transition-all duration-500 overflow-hidden rounded-[var(--radius-card)]",
    isExpanded ? "bg-white border-zinc-900 shadow-2xl ring-4 ring-zinc-900/5" : "bg-white border-zinc-100 hover:border-zinc-300 shadow-sm"
  )}>
    <div 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
    >
      <div className="flex items-center gap-3.5">
        <div className={clsx(
          "w-9 h-9 rounded-[var(--radius-card)] flex items-center justify-center transition-all duration-500",
          isExpanded ? "bg-zinc-900 text-white shadow-lg" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
        )}>
          <Icon size={16} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={clsx("text-[14px] font-black transition-colors", isExpanded ? "text-zinc-900" : "text-zinc-500")}>
              {title}
            </span>
            {badge}
          </div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            {isExpanded ? 'Stage Specific' : 'Click to expand'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {actions && !isExpanded && <div className="hidden group-hover:block" onClick={(e) => e.stopPropagation()}>{actions}</div>}
        {isExpanded ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
      </div>
    </div>
    <AnimatePresence>
      {isExpanded && (
        <Motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-6 pt-1 border-t border-zinc-50">
            {children}
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  </div>
);

const CodeBlock = ({ code, language, isActive }: { code: string; language: string; isActive?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Snippet copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard access denied, falling back to manual selection', err);
      toast.error('Clipboard access restricted. Please select and copy manually.');
    }
  };

  return (
    <div className="relative group mt-2">
      <div className="absolute top-3 right-3 z-10">
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-[var(--radius-badge)] text-[10px] font-black text-white transition-all"
        >
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={clsx(
        "rounded-[var(--radius-card)] p-6 pt-10 overflow-x-auto text-[12px] font-mono leading-relaxed transition-all duration-500 border shadow-inner",
        isActive 
          ? "bg-zinc-800 text-white border-zinc-700 ring-2 ring-zinc-800" 
          : "bg-zinc-900 text-zinc-300 border-zinc-800"
      )}>
        <code className={clsx(isActive && "text-emerald-400")}>{code}</code>
      </pre>
    </div>
  );
};

const IncrementalChangeCard = ({ change, isActive, onClick }: { change: IncrementalChange, isActive: boolean, onClick: () => void }) => {
  const typeColors = {
    Add: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Modify: 'bg-amber-50 text-amber-700 border-amber-100',
    Remove: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  const typeIcons = {
    Add: PlusCircle,
    Modify: RefreshCcw,
    Remove: MinusCircle
  };

  const Icon = typeIcons[change.type];

  return (
    <div 
      id={`change-${change.componentId}`}
      onClick={onClick}
      className={clsx(
        "flex flex-col p-5 rounded-[var(--radius-card)] border transition-all duration-300 cursor-pointer group",
        isActive 
          ? "bg-white border-zinc-900 shadow-xl ring-4 ring-zinc-900/5" 
          : "bg-white border-zinc-100 hover:border-zinc-300 shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx("px-2.5 py-1 rounded-[var(--radius-badge)] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border", typeColors[change.type])}>
            <Icon size={12} />
            {change.type}
          </div>
          <span className="text-[13px] font-black text-zinc-900">{change.element}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
           <Check size={14} className="hover:text-emerald-600 transition-colors" />
           <X size={14} className="hover:text-rose-600 transition-colors" />
        </div>
      </div>

      {change.type === 'Modify' && change.before && (
        <div className="flex flex-col gap-2 mb-4 p-3 bg-zinc-50 rounded-[var(--radius-card)] border border-zinc-100">
           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span>Before</span>
              <ArrowUpRight size={10} />
              <span>After</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex-1 p-2 bg-rose-50/50 rounded-[var(--radius-badge)] border border-rose-100/50 text-[11px] font-mono text-rose-700 line-through truncate">
                 {change.before}
              </div>
              <div className="flex-1 p-2 bg-emerald-50/50 rounded-[var(--radius-badge)] border border-emerald-100/50 text-[11px] font-mono text-emerald-700 truncate">
                 {change.after}
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5 mb-4">
         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Implementation Snippet</span>
         <CodeBlock code={change.snippet} language="javascript" isActive={isActive} />
      </div>

      <div className="flex items-start gap-3 p-3 bg-zinc-50/50 rounded-[var(--radius-card)] border border-zinc-100">
         <Sparkles size={14} className="text-zinc-900 mt-0.5" />
         <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">AI Reason</span>
            <p className="text-[11px] text-zinc-600 font-medium leading-relaxed italic">{change.reason}</p>
         </div>
      </div>
    </div>
  );
};

const CodeActions = ({ onCopy, onReset, label }: { onCopy: () => void, onReset: () => void, label: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute top-8 right-8 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onReset}
                className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all active:scale-90"
              >
                <RotateCcw size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-zinc-900 border-zinc-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
              Reset {label}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleCopy}
                className={clsx(
                  "p-2 rounded-lg transition-all active:scale-90",
                  copied ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-400 hover:text-white hover:bg-white/10"
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-zinc-900 border-zinc-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
              {copied ? 'Copied!' : `Copy ${label}`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Preparing developer package...",
    "Validating Data Layer Manager schema...",
    "Compiling interaction definitions...",
    "Finalizing package summary..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) return prev + 1;
        clearInterval(timer);
        setTimeout(onComplete, 800);
        return prev;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white h-full">
      <div className="flex flex-col items-center gap-10">
        <LottieLoader variant="TECHNICAL" size={180} />
        
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
};

const GithubPushModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const [step, setStep] = useState<'config' | 'pushing' | 'success'>('config');
  const [repoType, setRepoType] = useState<'existing' | 'new'>('existing');
  
  // Mock Data for existing repos
  const mockRepos = [
    { name: 'verizon-cx-core', branches: ['main', 'develop', 'feature/cx-fabric-v4'] },
    { name: 'vzw-measurement-fabric', branches: ['main', 'prod-release', 'uat'] },
    { name: 'retail-journey-artifacts', branches: ['master', 'hotfix/schema-update'] }
  ];

  const [repoName, setRepoName] = useState(mockRepos[0].name);
  const [branch, setBranch] = useState(mockRepos[0].branches[0]);
  const [commitMsg, setCommitMsg] = useState('feat: updated developer package for retail journey');
  
  // Update branch when repo changes for existing type
  useEffect(() => {
    if (repoType === 'existing') {
      const selected = mockRepos.find(r => r.name === repoName);
      if (selected) {
        setBranch(selected.branches[0]);
      }
    }
  }, [repoName, repoType]);

  const handlePush = () => {
    setStep('pushing');
    setTimeout(() => {
      setStep('success');
      toast.success('Code pushed to GitHub successfully');
    }, 2500);
  };

  const handleReset = () => {
    setStep('config');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-3xl overflow-hidden border border-zinc-200"
          >
            {step === 'config' && (
              <div className="flex flex-col">
                <div className="px-10 py-8 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xl shadow-zinc-900/20">
                      <Github size={24} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[20px] font-black text-zinc-900 leading-tight tracking-tight">Push to GitHub</h3>
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Sync artifacts with repository</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-10 flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Target Repository</span>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setRepoType('existing')}
                        className={clsx(
                          "p-5 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left",
                          repoType === 'existing' ? "border-zinc-900 bg-zinc-900 text-white shadow-xl" : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200"
                        )}
                      >
                        <History size={18} />
                        <span className="text-[14px] font-black">Choose Existing</span>
                      </button>
                      <button 
                        onClick={() => setRepoType('new')}
                        className={clsx(
                          "p-5 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left",
                          repoType === 'new' ? "border-zinc-900 bg-zinc-900 text-white shadow-xl" : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200"
                        )}
                      >
                        <Plus size={18} />
                        <span className="text-[14px] font-black">Create New</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                       <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Repository Name</span>
                          <span className="text-[10px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">github.com/verizon-enterprise/</span>
                       </div>
                       {repoType === 'existing' ? (
                         <div className="relative group">
                            <select 
                              value={repoName}
                              onChange={(e) => setRepoName(e.target.value)}
                              className="w-full p-4 pr-10 bg-zinc-50 border border-zinc-200 rounded-2xl text-[14px] font-bold focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all appearance-none cursor-pointer"
                            >
                              {mockRepos.map(r => (
                                <option key={r.name} value={r.name}>{r.name}</option>
                              ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                         </div>
                       ) : (
                         <input 
                          type="text"
                          value={repoName}
                          onChange={(e) => setRepoName(e.target.value)}
                          placeholder="enter-new-repo-name"
                          className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-[14px] font-bold focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all"
                         />
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Branch</span>
                      <div className="relative group">
                        <GitBranch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        {repoType === 'existing' ? (
                          <>
                            <select 
                              value={branch}
                              onChange={(e) => setBranch(e.target.value)}
                              className="w-full pl-12 pr-10 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-[14px] font-bold focus:outline-none focus:border-zinc-900 appearance-none cursor-pointer transition-all"
                            >
                              {mockRepos.find(r => r.name === repoName)?.branches.map(b => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                          </>
                        ) : (
                          <input 
                            type="text" 
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-[14px] font-bold focus:outline-none focus:border-zinc-900 transition-all"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Codebase</span>
                      <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex items-center justify-between">
                         <span className="text-[13px] font-bold text-zinc-600 truncate">VZW Fabric v4.2</span>
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Commit Message</span>
                    <textarea 
                      value={commitMsg}
                      onChange={(e) => setCommitMsg(e.target.value)}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-[13px] font-medium min-h-[100px] resize-none focus:outline-none focus:border-zinc-900 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button 
                      onClick={onClose}
                      className="flex-1 py-5 text-[14px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handlePush}
                      className="flex-[2] py-5 bg-zinc-900 hover:bg-black text-white rounded-3xl text-[14px] font-black transition-all shadow-2xl shadow-zinc-900/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <GitCommit size={18} />
                      PUSH TO REPOSITORY
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'pushing' && (
              <div className="flex flex-col items-center justify-center py-24 gap-8 px-10 text-center">
                <LottieLoader variant="SCAN" size={120} />
                <div className="flex flex-col gap-3">
                  <h3 className="text-[24px] font-black text-zinc-900 tracking-tight">Syncing with GitHub...</h3>
                  <p className="text-[14px] text-zinc-500 font-bold uppercase tracking-widest">Initializing git environment & authenticating</p>
                </div>
                <div className="w-full max-sm bg-zinc-50 p-6 rounded-2xl border border-zinc-100 font-mono text-[11px] text-zinc-400 text-left overflow-hidden">
                   <div className="flex flex-col gap-1 animate-pulse">
                      <span>&gt; git init</span>
                      <span>&gt; git remote add origin verizon/cx-signals</span>
                      <span>&gt; git add data-layer.json interactions.json system-events.json</span>
                      <span>&gt; git commit -m "feat: updated developer package"</span>
                      <span className="text-zinc-900 font-bold">&gt; git push origin {branch}</span>
                   </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col">
                <div className="p-12 flex flex-col items-center text-center gap-8">
                  <div className="w-24 h-24 rounded-[40px] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 scale-110">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[28px] font-black text-zinc-900 tracking-tight">Push Successful</h3>
                    <p className="text-[15px] text-zinc-500 font-medium max-w-sm leading-relaxed">
                      Your developer package has been pushed to 
                      <span className="text-zinc-900 font-black px-1.5 underline underline-offset-4 decoration-emerald-500">
                        {repoName}/{branch}
                      </span> 
                      and are ready for deployment.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                     <div className="p-5 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col gap-1 items-start text-left">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Repository</span>
                        <span className="text-[14px] font-black text-zinc-900">{repoName}</span>
                     </div>
                     <div className="p-5 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col gap-1 items-start text-left">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Branch</span>
                        <span className="text-[14px] font-black text-zinc-900">{branch}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 w-full">
                    <button 
                      onClick={handleReset}
                      className="flex-1 py-5 bg-zinc-900 hover:bg-black text-white rounded-3xl text-[14px] font-black transition-all shadow-xl active:scale-95"
                    >
                      DONE
                    </button>
                    <button 
                      onClick={() => window.open(`https://github.com/verizon-enterprise/${repoName}/tree/${branch}`, '_blank')}
                      className="flex-1 py-5 border border-zinc-200 hover:border-zinc-900 text-zinc-900 rounded-3xl text-[14px] font-black transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      VIEW REPO <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ValidationModal = ({ 
  isOpen, 
  onClose, 
  isValidating, 
  results 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  isValidating: boolean; 
  results: any; 
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <Motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
        />
        <Motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-3xl overflow-hidden border border-zinc-200"
        >
          <div className="p-10 flex flex-col gap-8">
            {isValidating ? (
              <div className="flex flex-col items-center py-10 gap-8 text-center">
                <LottieLoader variant="SCAN" size={100} />
                <div className="flex flex-col gap-3">
                  <h3 className="text-[24px] font-black text-zinc-900 tracking-tight">Validating Sync Integrity...</h3>
                  <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest">Checking schema compliance & JSON syntax</p>
                </div>
              </div>
            ) : results ? (
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-5">
                  <div className={clsx(
                    "w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl",
                    results.status === 'success' ? "bg-emerald-500 shadow-emerald-500/30" : "bg-amber-500 shadow-amber-500/30"
                  )}>
                    {results.status === 'success' ? <ShieldCheck size={32} /> : <AlertTriangle size={32} />}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-[20px] font-black text-zinc-900 leading-none">
                      {results.status === 'success' ? 'Validation Passed' : 'Sync Warning'}
                    </h3>
                    <p className="text-[12px] text-zinc-400 font-bold mt-1 uppercase tracking-widest">
                      {results.status === 'success' ? 'Local environment is fully compliant' : 'Minor schema deviations detected'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {results.checks.map((check: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className={clsx(
                        "mt-1 rounded-full p-0.5",
                        check.status === 'pass' ? "text-emerald-500" : check.status === 'fail' ? "text-rose-500" : "text-amber-500"
                      )}>
                        {check.status === 'pass' ? <Check size={14} /> : check.status === 'warn' ? <AlertCircle size={14} /> : <X size={14} />}
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="text-[12px] font-black text-zinc-900 uppercase tracking-tight">{check.label}</span>
                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{check.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-2xl text-[13px] font-black transition-all active:scale-95"
                  >
                    DISMISS
                  </button>
                  <button 
                    onClick={() => {
                      toast.success('Local sync completed successfully');
                      onClose();
                    }}
                    className="flex-1 py-4 bg-zinc-900 hover:bg-black text-white rounded-2xl text-[13px] font-black transition-all shadow-lg active:scale-95"
                  >
                    PROCEED WITH SYNC
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </Motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Main Page Component ---

export const DeveloperArtifacts = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  
  const isExisting = journeyId?.startsWith('ext-');
  const isReview = journeyId?.startsWith('rev-');

  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('vzw-seen-artifacts');
    }
    return true;
  });

  const [journey, setJourney] = useState<Journey | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('json');
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    status: 'success' | 'warning' | 'error';
    checks: { label: string; status: 'pass' | 'fail' | 'warn'; detail: string }[];
  } | null>(null);
  
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'json': true,
    'mapping': true,
    'schema': false,
    'sdk': false,
    'summary': true
  });

  const activeStep = journey?.steps[activeStepIdx];
  const approvedTagsCount = journey?.steps.reduce((acc, s) => acc + (s.components?.filter(c => c.approvalState === 'Approved').length || 0), 0) || 0;
  const totalTagsCount = journey?.tagRecommendationCount || 0;

  // Mock Incremental Changes for Existing Journeys
  const incrementalChanges = useMemo(() => {
    if (!activeStep?.components) return [];
    return activeStep.components.map((tag, i) => {
      const types: ('Add' | 'Modify' | 'Remove')[] = ['Add', 'Modify', 'Remove'];
      const type = types[i % 3];
      const reasons = [
        "Gap identified in conversion funnel tracking.",
        "Update needed to align with VSDS v4.2 schema naming conventions.",
        "Redundant tracking detected; consolidating interactions for performance.",
        "Missing business-critical attribution signal for marketing optimization."
      ];
      
      return {
        id: `inc-${tag.componentId}`,
        type: type,
        element: tag.componentLabel,
        componentId: tag.componentId,
        field: type === 'Modify' ? 'eventType' : undefined,
        before: type === 'Modify' ? 'interaction' : undefined,
        after: type === 'Modify' ? tag.eventType : undefined,
        snippet: type === 'Remove' ? `// Remove listener from ${tag.componentLabel}` : `cx.track('${tag.aiRecommendedTag}', {\n  event: '${tag.eventType}',\n  level: '${tag.level}'\n});`,
        reason: reasons[i % reasons.length]
      };
    });
  }, [activeStep]);

  const stats = useMemo(() => {
    const add = incrementalChanges.filter(c => c.type === 'Add').length;
    const mod = incrementalChanges.filter(c => c.type === 'Modify').length;
    const rem = incrementalChanges.filter(c => c.type === 'Remove').length;
    return { add, mod, rem };
  }, [incrementalChanges]);

  // --- Editable Code Snippets ---
  const [editableJson, setEditableJson] = useState('');
  const [editableMapping, setEditableMapping] = useState('');
  const [editableSchema, setEditableSchema] = useState('');
  const [editableSdk, setEditableSdk] = useState('');
  const [editableTestScript, setEditableTestScript] = useState('');

  const jsonRef = useRef<HTMLTextAreaElement>(null);
  const mappingRef = useRef<HTMLTextAreaElement>(null);
  const schemaRef = useRef<HTMLTextAreaElement>(null);
  const sdkRef = useRef<HTMLTextAreaElement>(null);
  const testScriptRef = useRef<HTMLTextAreaElement>(null);

  // --- Helper Functions for Snippet Generation ---
  const generateJSON = (tags: TagComponent[]) => {
    return JSON.stringify({
      stage: activeStep?.stepName,
      namespace: "vzw.cx",
      tags: tags.map(t => ({
        id: t.componentId,
        name: t.aiRecommendedTag,
        element: t.componentLabel,
        type: t.eventType,
        level: t.level
      }))
    }, null, 2);
  };

  const generateEventMapping = (tags: TagComponent[]) => {
    return JSON.stringify(tags.map(t => ({
      event: t.aiRecommendedTag,
      trigger: t.eventType,
      element: t.componentLabel,
      selector: `[data-analytics-id="${t.componentId}"]`,
      data: {
        interaction_type: t.level,
        component_name: t.componentLabel,
        business_value: t.businessValue
      }
    })), null, 2);
  };

  const generateTestScript = (tags: TagComponent[]) => {
    return `// Automated Test Script for ${activeStep?.stepName}
// Generated: ${new Date().toLocaleDateString()}

describe('${activeStep?.stepName} Measurement Validation', () => {
  beforeEach(() => {
    cy.visit('${journey?.mockUrl || '/'}');
    cy.window().then((win) => {
      win.signalsCX.reset();
    });
  });

  ${tags.map(t => `
  it('should track ${t.aiRecommendedTag} on ${t.eventType}', () => {
    cy.get('[data-analytics-id="${t.componentId}"]').trigger('${t.eventType}');
    cy.window().then((win) => {
      const events = win.signalsCX.getEvents();
      expect(events).to.deep.include({
        event: '${t.aiRecommendedTag}',
        interaction_type: '${t.level}'
      });
    });
  });`).join('\n')}
});`;
  };

  const sdkSnippet = `import { SignalsCX } from '@vzw/signals-cx-sdk';

const cx = new SignalsCX({
  journeyId: "${journey?.journeyId}",
  environment: "staging",
  dataSchema: "v4.2"
});

cx.initializeTags();`;

  const dataLayerSchema = `{
  "vzw": {
    "cx": {
      "journey": {
        "id": "${journey?.journeyId}",
        "step": "${activeStep?.stepName}"
      }
    }
  }
}`;

  // --- Highlighting Logic ---
  useEffect(() => {
    if (!activeTagId || isRightPanelCollapsed || !activeStep) return;

    if (isExisting) {
      const element = document.getElementById(`change-${activeTagId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      const findAndHighlight = (text: string, textarea: HTMLTextAreaElement | null, tagId: string) => {
        if (!textarea) return;
        
        // Use a more robust search for the object containing the ID
        const searchTerm = `"id": "${tagId}"`;
        const idIndex = text.indexOf(searchTerm);
        
        if (idIndex !== -1) {
          // Find the start of the object { that contains this ID
          let startIndex = idIndex;
          let braceCount = 0;
          
          // Search backwards for the opening brace of this object
          while (startIndex > 0) {
            if (text[startIndex] === '}') braceCount++;
            if (text[startIndex] === '{') {
              if (braceCount === 0) break;
              braceCount--;
            }
            startIndex--;
          }
          
          // Find the end of the object }
          let endIndex = idIndex;
          braceCount = 0;
          while (endIndex < text.length) {
            if (text[endIndex] === '{') braceCount++;
            if (text[endIndex] === '}') {
              if (braceCount === 0) {
                endIndex++; // Include the closing brace
                break;
              }
              braceCount--;
            }
            endIndex++;
          }

          textarea.focus();
          textarea.setSelectionRange(startIndex, endIndex);
          
          // Scroll to the selection
          const linesBefore = text.substring(0, startIndex).split('\n').length;
          const lineHeight = 20; 
          textarea.scrollTop = (linesBefore - 3) * lineHeight;
        }
      };

      if (activeTab === 'json' && activeTagId) {
        findAndHighlight(editableJson, jsonRef.current, activeTagId);
      }
      if (activeTab === 'mapping' && activeTagId) {
        findAndHighlight(editableMapping, mappingRef.current, activeTagId);
      }
    }
  }, [activeTagId, activeTab, isRightPanelCollapsed, editableJson, editableMapping, isExisting, activeStep]);

  // Update editable states when active step changes
  useEffect(() => {
    if (activeStep) {
      setEditableJson(generateJSON(activeStep.components || []));
      setEditableMapping(generateEventMapping(activeStep.components || []));
      setEditableSchema(dataLayerSchema);
      setEditableSdk(sdkSnippet);
      setEditableTestScript(generateTestScript(activeStep.components || []));
    }
  }, [activeStepIdx, journey]);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const found = mockJourneys.find(j => j.journeyId === journeyId);
    if (found) {
      setJourney(found);
    }
  }, [journeyId]);

  // Dynamic scaling logic
  useEffect(() => {
    const updateScale = () => {
      if (!canvasContainerRef.current || !journey) return;
      const containerWidth = canvasContainerRef.current.clientWidth;
      const padding = 100;
      const availableWidth = containerWidth - padding;
      const baseWidth = 1440;
      setScale(Math.max(0.1, availableWidth / baseWidth));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, [journey, isDetailsExpanded, isRightPanelCollapsed, isLeftPanelCollapsed]);

  const isStepComplete = (step: JourneyStep) => {
    if (!step.components || step.components.length === 0) return true;
    return step.components.every(c => c.approvalState !== 'Proposed');
  };

  const getComponentPosition = (tag: TagComponent, index: number, total: number, template: string, platform: string) => {
    const mappings: Record<string, {top: number, left: number}[]> = {
      'landing': [{top:15,left:35},{top:35,left:65},{top:55,left:35},{top:75,left:65},{top:88,left:35}],
      'config': [{top:18,left:25},{top:18,left:50},{top:18,left:75},{top:48,left:35},{top:48,left:65},{top:75,left:50}],
      'form': [{top:15,left:25},{top:15,left:75},{top:40,left:50},{top:65,left:25},{top:65,left:75}],
      'review': [{top:20,left:50},{top:45,left:20},{top:45,left:80},{top:78,left:50}],
      'success': [{top:22,left:50},{top:50,left:50},{top:85,left:50}]
    };
    const set = mappings[template] || mappings['landing'];
    return set[index % set.length];
  };

  const handleSaveSync = () => {
    setIsValidationModalOpen(true);
    setIsValidating(true);
    setValidationResults(null);

    // Mock validation process
    setTimeout(() => {
      setIsValidating(false);
      setValidationResults({
        status: Math.random() > 0.3 ? 'success' : 'warning',
        checks: [
          { 
            label: "Schema Compliance", 
            status: "pass", 
            detail: "Artifacts match VSDS v4.2 baseline structure." 
          },
          { 
            label: "JSON Integrity", 
            status: Math.random() > 0.2 ? "pass" : "warn", 
            detail: "All custom manual edits contain valid JSON syntax." 
          },
          { 
            label: "Local Connectivity", 
            status: "pass", 
            detail: "Development server connection is active and stable." 
          }
        ]
      });
    }, 2000);
  };

  if (loading) return (
    <LoadingScreen 
      onComplete={() => {
        sessionStorage.setItem('vzw-seen-artifacts', 'true');
        setLoading(false);
      }} 
    />
  );
  if (!journey) return null;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-white">
      
      {/* 1. Journey Details Strip */}
      <div className="bg-white border-b border-zinc-100 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-10 py-4 bg-zinc-50/30">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3 text-zinc-400">
                <Braces size={18} className="text-zinc-500" />
                <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">
                  {isExisting ? 'Live Site Context' : 'Design Blueprint Context'}
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
                          status={isExisting ? 'success' : 'neutral'} 
                          label={isExisting ? 'Live Production' : 'Figma Prototype'} 
                        />
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        {isExisting ? <Globe size={14} /> : <Layout size={14} />}
                        <span className="text-[12px] font-bold">
                          {isExisting ? 'Production Sync Active' : 'Proposed Measurement Fabric'}
                        </span>
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
            {isDetailsExpanded ? 'Hide Design Reference' : 'Show Design Reference'}
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
                <div className="col-span-4 flex flex-col gap-6">
                   <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-zinc-400">
                         <Cpu size={16} />
                         <span className="text-[11px] font-black uppercase tracking-widest">
                           {isExisting ? 'Active Tech Stack' : 'Target Architecture'}
                         </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {(isExisting 
                           ? ['Production React', 'Data Layer v2.4', 'Signals SDK v2.4', 'Adobe Analytics'] 
                           : ['React Next.js', 'FSDS Tokens', 'Signals SDK v3.0 (Target)', 'VSDS v4.2']
                         ).map(tech => (
                           <div key={tech} className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-[var(--radius-card)] text-[13px] font-bold text-zinc-700">
                             {tech}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-zinc-400">
                         <ShieldCheck size={16} />
                         <span className="text-[11px] font-black uppercase tracking-widest">
                           {isExisting ? 'Production Integrity' : 'Blueprint Validation'}
                         </span>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[24px] font-black text-zinc-900 leading-none">
                              {isExisting ? '98.4%' : '100%'}
                            </span>
                            <span className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-tight">
                              {isExisting ? 'Data Uptime' : 'Schema Match'}
                            </span>
                         </div>
                         <div className="h-10 w-[1px] bg-zinc-100" />
                         <div className="flex flex-col">
                            <span className={clsx(
                              "text-[24px] font-black leading-none",
                              isExisting ? "text-emerald-600" : "text-amber-600"
                            )}>
                              {isExisting ? 'Active' : 'Draft'}
                            </span>
                            <span className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-tight">
                              {isExisting ? 'Prod Status' : 'Build Status'}
                            </span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="col-span-4 border-l border-zinc-100 pl-12 flex flex-col gap-8">
                   <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <Monitor size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Environment</span>
                         </div>
                         <span className="text-[16px] font-black text-zinc-900">
                           {isExisting ? 'Live Production' : 'Figma Prototype'}
                         </span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <Zap size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">SDK Endpoint</span>
                         </div>
                         <span className="text-[16px] font-black text-zinc-900">
                           {isExisting ? 'v2.4.1 (Stable)' : 'v3.0.0-beta.2'}
                         </span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <FileCode size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Registry Path</span>
                         </div>
                         <span className="text-[16px] font-black text-zinc-900">
                           {isExisting ? 'vzw.cx.prod' : 'vzw.cx.proposal'}
                         </span>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <Globe size={16} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Collection URL</span>
                         </div>
                         <div className="flex items-center gap-2 group cursor-pointer">
                            <span className="text-[14px] font-black text-zinc-900 truncate max-w-[120px]">
                              {isExisting ? 'collect.vzw.com' : 'staging-api.cx.vzw'}
                            </span>
                            <ExternalLink size={14} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="col-span-4 border-l border-zinc-100 pl-12 flex flex-col gap-5">
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-zinc-400">
                         <Layers size={18} />
                         <span className="text-[11px] font-black uppercase tracking-widest">
                           {isExisting ? 'Operational Footprint' : 'Measurement Plan'}
                         </span>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="text-[16px] font-black text-zinc-900 leading-tight">
                            {isExisting ? 'Delta Analysis' : 'Implementation Blueprint'}
                         </h3>
                         <p className="text-[13px] font-bold text-zinc-500 mt-1">
                            {isExisting 
                              ? `${totalTagsCount} existing tags mapped to production.` 
                              : `Design-to-code mapping for ${totalTagsCount} new points.`}
                         </p>
                      </div>
                   </div>
                   
                   <div className={clsx(
                     "flex items-center gap-3 p-5 rounded-[var(--radius-card)] border shadow-xl",
                     isExisting 
                      ? "bg-zinc-900 border-zinc-900 text-white" 
                      : "bg-white border-zinc-100 text-zinc-900"
                   )}>
                      {isExisting ? (
                        <CheckCircle2 size={24} className="text-emerald-400" />
                      ) : (
                        <Sparkles size={24} className="text-amber-500" />
                      )}
                      <div className="flex-1 flex flex-col">
                         <span className="text-[15px] font-black">
                           {isExisting ? 'Incremental Sync Ready' : 'Artifacts Ready for Review'}
                         </span>
                         <span className={clsx(
                           "text-[12px] font-bold",
                           isExisting ? "text-zinc-400" : "text-zinc-500"
                         )}>
                           {isExisting ? 'Last production sync: 2h ago' : 'Generated from Figma Design'}
                         </span>
                      </div>
                      <Download size={20} className="hover:text-emerald-400 transition-colors cursor-pointer" />
                   </div>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Main Three-Column Interaction Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Column 1: Journey Stages */}
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
                      setActiveTagId(null);
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
                        <span className={clsx(
                          "text-[11px] font-bold truncate opacity-60",
                          isActive ? "text-zinc-300" : "text-zinc-500"
                        )}>{step.screenTemplate} template</span>
                      </div>
                    )}
                  </button>
                );
              })}
           </div>
        </Motion.div>

        {/* Column 2: Analysis Canvas */}
        <div className="flex-1 bg-zinc-100 relative overflow-hidden flex flex-col" ref={canvasContainerRef}>
           <div className="flex-1 relative overflow-auto custom-scrollbar scroll-smooth p-16 px-[0px] py-[48px]">
              <div className={clsx(
                "relative w-full min-h-full flex items-start justify-center",
                journey.platform === 'Mobile' ? "items-center" : "pt-0"
              )}>
                <div className={clsx(
                  "relative bg-white transition-all duration-500 border border-zinc-200/50",
                  journey.platform === 'Mobile' 
                    ? "aspect-[9/19.5] h-[820px] rounded-[60px] border-[12px] border-zinc-900 overflow-hidden ring-1 ring-white/10 shadow-2xl" 
                    : "w-[1440px] min-h-[1600px] shadow-2xl origin-top"
                )}
                style={journey.platform !== 'Mobile' ? { 
                  transform: `scale(${scale})`, 
                  marginBottom: `-${1600 * (1 - scale)}px` 
                } : {}}
                >
                  <JourneyScreenGenerator 
                    journey={journey}
                    step={activeStep!}
                  />
                  <div className="absolute inset-0 z-[50]">
                    {activeStep?.components?.map((tag, i) => {
                      const isActive = activeTagId === tag.componentId;
                      const isChanged = isExisting && incrementalChanges.some(c => c.componentId === tag.componentId);
                      if (isExisting && !isChanged) return null;
                      
                      // Simplified position mapping for artifacts view
                      const pos = getComponentPosition(tag, i, activeStep.components?.length || 0, activeStep.screenTemplate, journey.platform);
                      
                      return (
                        <div 
                          key={`artifact-marker-${tag.componentId}`} 
                          className="absolute pointer-events-none"
                          style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                        >
                          <div className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const isNewActive = !isActive;
                                setActiveTagId(isNewActive ? tag.componentId : null);
                                if (isNewActive) {
                                   setExpandedCards({ 'json': true, 'mapping': true, 'schema': false, 'sdk': false, 'summary': true });
                                   if (!isExisting) setActiveTab('json');
                                }
                              }}
                              className={clsx(
                                "w-11 h-11 rounded-full border-4 transition-all duration-300 flex items-center justify-center font-black text-[15px] shadow-2xl relative cursor-pointer",
                                tag.approvalState === 'Approved' ? "bg-emerald-500 border-white text-white" : "bg-zinc-900 border-white text-white",
                                isActive ? "scale-125 z-50 ring-[16px] ring-zinc-900/15" : "hover:scale-110",
                                isExisting && "ring-2 ring-white"
                              )}
                            >
                              {i + 1}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Column 3: Developer Artifacts */}
        <Motion.div 
          initial={false}
          animate={{ width: isRightPanelCollapsed ? 80 : 520 }}
          className="border-l border-zinc-100 bg-zinc-50/50 flex flex-col shrink-0 overflow-hidden"
        >
           <div className="p-6 bg-white border-b border-zinc-100 flex flex-col gap-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] sticky top-0 z-20">
              <div className="flex items-center justify-between">
                {!isRightPanelCollapsed && (
                  <Motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col gap-1"
                  >
                     <div className="flex items-center gap-3">
                        <Package size={18} className="text-zinc-900" />
                        <span className="text-[14px] font-black uppercase tracking-widest text-zinc-900">
                          Developer Package Summary
                        </span>
                     </div>
                     <p className="text-[11px] text-zinc-500 font-medium pl-[30px]">
                       Final BA review before handoff
                     </p>
                  </Motion.div>
                )}
                <div className="flex items-center gap-1.5">
                {!isRightPanelCollapsed && (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => setIsGithubModalOpen(true)}
                          className="p-2.5 rounded-[var(--radius-button)] transition-all cursor-pointer hover:bg-zinc-100 text-zinc-900 border border-transparent hover:border-zinc-200 hover:shadow-sm active:scale-[0.98]"
                        >
                          <Github size={22} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom" 
                        align="end" 
                        className="bg-zinc-900 border-zinc-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 text-white"
                      >
                        Push to GitHub
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="p-2.5 rounded-[var(--radius-button)] transition-all cursor-pointer hover:bg-zinc-100 text-zinc-900 border border-transparent hover:border-zinc-200 hover:shadow-sm active:scale-[0.98]"
                        >
                          <Download size={22} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom" 
                        align="end" 
                        className="p-4 bg-zinc-900 border-zinc-800 text-white min-w-[240px] shadow-2xl z-[100]"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Package Contents</span>
                            <span className="text-[13px] font-bold">Artifacts Bundle (.zip)</span>
                          </div>
                          <div className="grid gap-1.5">
                            {[
                              { icon: FileJson, label: "data-layer.json", ext: "12.4 KB" },
                              { icon: Map, label: "interactions.json", ext: "8.7 KB" },
                              { icon: Braces, label: "system-events.json", ext: "5.2 KB" },
                              { icon: FileCode, label: "ba-notes.txt", ext: "2.1 KB" }
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px] bg-zinc-800/40 p-2 rounded-md border border-white/5">
                                <div className="flex items-center gap-2">
                                  <item.icon size={12} className="text-zinc-400" />
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{item.ext}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <button 
                  onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
                  className={clsx(
                    "p-2.5 rounded-[var(--radius-button)] transition-all cursor-pointer hover:bg-zinc-100 text-zinc-500",
                    isRightPanelCollapsed ? "mx-auto" : ""
                  )}
                  title={isRightPanelCollapsed ? "Expand Panel" : "Collapse Panel"}
                >
                  {isRightPanelCollapsed ? <PanelRightOpen size={22} /> : <PanelRightClose size={22} />}
                </button>
              </div>
              </div>
           </div>
           
           {!isRightPanelCollapsed && (
             <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                   <CheckCircle2 size={20} className="text-white" />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-[11px] font-black text-blue-900 uppercase tracking-wide mb-1">
                     Ready for Handoff
                   </h3>
                   <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                     Review package contents below. This is your final approval before sending to the development team.
                   </p>
                 </div>
               </div>
             </div>
           )}

           <div className={clsx(
             "flex-1 overflow-hidden flex flex-col",
             isRightPanelCollapsed ? "p-4 items-center" : ""
           )}>
             {!isRightPanelCollapsed && (
               <>
                 {isExisting ? (
                    <div className="p-8 flex flex-col gap-6 overflow-y-auto h-full no-scrollbar">
                       <ArtifactCard 
                        title="Incremental Summary" 
                        icon={Layers} 
                        isExpanded={expandedCards.summary}
                        onToggle={() => setExpandedCards(prev => ({ ...prev, summary: !prev.summary }))}
                        badge={
                           <div className="flex items-center gap-1 ml-2">
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-[var(--radius-badge)] text-[8px] font-black border border-emerald-100">+{stats.add}</span>
                              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-[var(--radius-badge)] text-[8px] font-black border border-amber-100">Δ{stats.mod}</span>
                              <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded-[var(--radius-badge)] text-[8px] font-black border border-rose-100">-{stats.rem}</span>
                           </div>
                        }
                      >
                        <div className="flex flex-col gap-4 pt-2">
                           <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                              Measurement deltas for the <span className="text-zinc-900 font-bold">{activeStep?.stepName}</span> stage.
                           </p>
                           <div className="grid grid-cols-3 gap-3">
                              <div className="p-4 bg-zinc-50 rounded-[var(--radius-card)] border border-zinc-100 text-center">
                                 <div className="text-[18px] font-black text-zinc-900">{stats.add}</div>
                                 <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Added</div>
                              </div>
                              <div className="p-4 bg-zinc-50 rounded-[var(--radius-card)] border border-zinc-100 text-center">
                                 <div className="text-[18px] font-black text-zinc-900">{stats.mod}</div>
                                 <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Modified</div>
                              </div>
                              <div className="p-4 bg-zinc-50 rounded-[var(--radius-card)] border border-zinc-100 text-center">
                                 <div className="text-[18px] font-black text-zinc-900">{stats.rem}</div>
                                 <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Removed</div>
                              </div>
                           </div>
                        </div>
                      </ArtifactCard>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recommended Changes</span>
                           <StatusBadge status="neutral" label={`${incrementalChanges.length} Total`} />
                        </div>
                        {incrementalChanges.map((change) => (
                           <IncrementalChangeCard 
                             key={change.id}
                             change={change}
                             isActive={activeTagId === change.componentId}
                             onClick={() => setActiveTagId(change.componentId)}
                           />
                        ))}
                      </div>
                    </div>
                 ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                      <div className="sticky top-0 z-30 bg-zinc-50/95 backdrop-blur-sm border-b border-zinc-100 p-[8px]">
                        <TabsList className="bg-zinc-200/50 p-1 h-11 rounded-xl w-full">
                          <TabsTrigger value="json" className="flex-1 text-[10px] font-black h-9 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-2 transition-all uppercase tracking-tight">Data Layer</TabsTrigger>
                          <TabsTrigger value="mapping" className="flex-1 text-[10px] font-black h-9 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-2 transition-all uppercase tracking-tight">Interactions</TabsTrigger>
                          <TabsTrigger value="schema" className="flex-1 text-[10px] font-black h-9 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-2 transition-all uppercase tracking-tight">System Events</TabsTrigger>
                          <TabsTrigger value="sdk" className="flex-1 text-[10px] font-black h-9 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-2 transition-all uppercase tracking-tight">SDK Init</TabsTrigger>
                          <TabsTrigger value="test" className="flex-1 text-[10px] font-black h-9 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-2 transition-all uppercase tracking-tight">Test Script</TabsTrigger>
                        </TabsList>
                      </div>

                      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
                        <TabsContent value="json" className="flex-1 m-0 flex flex-col focus-visible:outline-none">
                          <div className="px-[16px] py-[8px] bg-white border-b border-zinc-50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">data-layer.json</span>
                            </div>
                          </div>
                          <div className="flex-1 p-6 bg-zinc-950 relative group">
                             <CodeActions 
                               label="JSON"
                               onReset={() => {
                                 if (activeStep) {
                                   setEditableJson(generateJSON(activeStep.components || []));
                                   toast.success('JSON reset to baseline');
                                 }
                               }}
                               onCopy={() => {
                                 navigator.clipboard.writeText(editableJson);
                                 toast.success('JSON copied');
                               }}
                             />
                             <Textarea 
                               ref={jsonRef}
                               value={editableJson}
                               onChange={(e) => setEditableJson(e.target.value)}
                               className="w-full h-full min-h-[500px] p-6 font-mono text-[13px] leading-relaxed resize-none border border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 bg-zinc-900 text-zinc-300 rounded-xl shadow-inner scroll-smooth"
                               spellCheck={false}
                             />
                          </div>
                        </TabsContent>

                        <TabsContent value="mapping" className="flex-1 m-0 flex flex-col focus-visible:outline-none">
                          <div className="px-8 py-2 bg-white border-b border-zinc-50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-blue-500" />
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">interactions.json</span>
                            </div>
                          </div>
                          <div className="flex-1 p-6 bg-zinc-950 relative group">
                             <CodeActions 
                               label="Mapping"
                               onReset={() => {
                                 if (activeStep) {
                                   setEditableMapping(generateEventMapping(activeStep.components || []));
                                   toast.success('Mapping reset to baseline');
                                 }
                               }}
                               onCopy={() => {
                                 navigator.clipboard.writeText(editableMapping);
                                 toast.success('Mapping copied');
                               }}
                             />
                             <Textarea 
                               ref={mappingRef}
                               value={editableMapping}
                               onChange={(e) => setEditableMapping(e.target.value)}
                               className="w-full h-full min-h-[500px] p-6 font-mono text-[13px] leading-relaxed resize-none border border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 bg-zinc-900 text-zinc-300 rounded-xl shadow-inner scroll-smooth"
                               spellCheck={false}
                             />
                          </div>
                        </TabsContent>

                        <TabsContent value="schema" className="flex-1 m-0 flex flex-col focus-visible:outline-none">
                          <div className="px-8 py-2 bg-white border-b border-zinc-50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-purple-500" />
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">system-events.json</span>
                            </div>
                          </div>
                          <div className="flex-1 p-6 bg-zinc-950 relative group">
                             <CodeActions 
                               label="Schema"
                               onReset={() => {
                                 setEditableSchema(dataLayerSchema);
                                 toast.success('Schema reset to baseline');
                               }}
                               onCopy={() => {
                                 navigator.clipboard.writeText(editableSchema);
                                 toast.success('Schema copied');
                               }}
                             />
                             <Textarea 
                               ref={schemaRef}
                               value={editableSchema}
                               onChange={(e) => setEditableSchema(e.target.value)}
                               className="w-full h-full min-h-[500px] p-6 font-mono text-[13px] leading-relaxed resize-none border border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 bg-zinc-900 text-zinc-300 rounded-xl shadow-inner scroll-smooth"
                               spellCheck={false}
                             />
                          </div>
                        </TabsContent>

                        <TabsContent value="sdk" className="flex-1 m-0 flex flex-col focus-visible:outline-none">
                          <div className="px-8 py-2 bg-white border-b border-zinc-50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">sdk-init.js</span>
                            </div>
                          </div>
                          <div className="flex-1 p-6 bg-zinc-950 relative group">
                             <CodeActions 
                               label="SDK"
                               onReset={() => {
                                 setEditableSdk(sdkSnippet);
                                 toast.success('SDK reset to baseline');
                               }}
                               onCopy={() => {
                                 navigator.clipboard.writeText(editableSdk);
                                 toast.success('SDK copied');
                               }}
                             />
                             <Textarea 
                               ref={sdkRef}
                               value={editableSdk}
                               onChange={(e) => setEditableSdk(e.target.value)}
                               className="w-full h-full min-h-[500px] p-6 font-mono text-[13px] leading-relaxed resize-none border border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 bg-zinc-900 text-zinc-300 rounded-xl shadow-inner scroll-smooth"
                               spellCheck={false}
                             />
                          </div>
                        </TabsContent>

                        <TabsContent value="test" className="flex-1 m-0 flex flex-col focus-visible:outline-none">
                          <div className="px-8 py-2 bg-white border-b border-zinc-50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-rose-500" />
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">cypress-test.js</span>
                            </div>
                          </div>
                          <div className="flex-1 p-6 bg-zinc-950 relative group">
                             <CodeActions 
                               label="Test Script"
                               onReset={() => {
                                 if (activeStep) {
                                   setEditableTestScript(generateTestScript(activeStep.components || []));
                                   toast.success('Test Script reset to baseline');
                                 }
                               }}
                               onCopy={() => {
                                 navigator.clipboard.writeText(editableTestScript);
                                 toast.success('Test Script copied');
                               }}
                             />
                             <Textarea 
                               ref={testScriptRef}
                               value={editableTestScript}
                               onChange={(e) => setEditableTestScript(e.target.value)}
                               className="w-full h-full min-h-[500px] p-6 font-mono text-[13px] leading-relaxed resize-none border border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 bg-zinc-900 text-zinc-300 rounded-xl shadow-inner scroll-smooth"
                               spellCheck={false}
                             />
                          </div>
                        </TabsContent>
                      </div>
                      
                      <div className="border-t border-zinc-100 bg-white">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">Package Contents</span>
                             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">data-layer.json • interactions.json • system-events.json</span>
                          </div>
                          <button 
                            onClick={handleSaveSync}
                            className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[11px] font-black transition-all border border-zinc-200 active:scale-95 flex items-center gap-2"
                          >
                            <RefreshCcw size={12} className={clsx(isValidating && "animate-spin")} />
                            Save
                          </button>
                        </div>
                        <div className="px-4 pb-4">
                          <button
                            onClick={() => {
                              toast.success('Developer Package Sent', {
                                description: 'Package delivered to development team via IDE integration.'
                              });
                              setTimeout(() => navigate(`/playground/journey/${journeyId}/validation`), 1500);
                            }}
                            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-black uppercase tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                          >
                            <Send size={16} />
                            Send to Development
                          </button>
                        </div>
                      </div>
                    </Tabs>
                 )}
               </>
             )}
           </div>
        </Motion.div>
      </div>
      <ValidationModal 
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        isValidating={isValidating}
        results={validationResults}
      />
      <GithubPushModal 
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
};
