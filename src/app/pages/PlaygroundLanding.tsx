import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'sonner';
import { 
  Plus, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  ChevronLeft,
  Monitor,
  CheckCircle2,
  ChevronDown,
  Activity,
  Zap,
  RefreshCcw,
  Layers,
  Search,
  Globe,
  Smartphone,
  Clipboard,
  FileText,
  AlertCircle,
  CheckSquare,
  LayoutGrid,
  Columns3
} from 'lucide-react';
import { StatusBadge } from '@/app/components/Foundation';
import { JourneyScreenGenerator } from '@/app/components/JourneyScreenGenerator';
import { DemoNoticeModal } from '@/app/components/DemoNoticeModal';
import { mockJourneys, Journey } from '@/app/data/mockJourneys';
import { mockJiraTickets } from '@/app/data/mockJiraTickets';
import { clsx } from 'clsx';

import Slider from "react-slick";

// --- Sub-components (Reusing existing patterns) ---

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={clsx(
        "absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:border-accent transition-all",
        className?.includes('slick-disabled') && "opacity-0 pointer-events-none"
      )}
      onClick={onClick}
    >
      <ChevronRight size={20} className="text-muted-foreground" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={clsx(
        "absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:border-accent transition-all",
        className?.includes('slick-disabled') && "opacity-0 pointer-events-none"
      )}
      onClick={onClick}
    >
      <ChevronLeft size={20} className="text-muted-foreground" />
    </button>
  );
};

const carouselSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 3.2,
      }
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 2.2,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1.2,
      }
    }
  ]
};

const SectionHeader = ({ title, description, onViewAll }: { 
  title: string, 
  description?: string, 
  onViewAll?: () => void
}) => (
  <div className="flex items-center justify-between mb-2">
    <div className="flex flex-col gap-1">
      <h2 className="text-[20px] font-bold text-foreground tracking-tight">{title}</h2>
      {description && <p className="text-[13px] text-muted-foreground font-medium">{description}</p>}
    </div>
    <div className="flex items-center gap-3">
      {onViewAll && (
        <button 
          onClick={onViewAll}
          className="text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 cursor-pointer"
        >
          View all
        </button>
      )}
    </div>
  </div>
);

const MetricCard = ({ label, value, subtext, icon: Icon, trend }: { label: string, value: string, subtext?: string, icon: any, trend?: string }) => (
  <div className="bg-card/80 backdrop-blur-sm border border-border p-5 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-all flex-1 min-w-[200px]">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 rounded-lg bg-surface-primary flex items-center justify-center text-muted-foreground">
        <Icon size={18} />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="text-[24px] font-bold text-foreground tracking-tight">{value}</span>
      {subtext && <span className="text-[12px] text-muted-foreground font-medium">{subtext}</span>}
    </div>
  </div>
);

const JourneyCard = ({ 
  journey, 
  onClick, 
  showSource = false,
  isRecent = false,
  isValidation = false
}: { 
  journey: Journey, 
  onClick: () => void, 
  showSource?: boolean,
  isRecent?: boolean,
  isValidation?: boolean
}) => {
  const Icon = journey.icon;
  const displayTagCount = journey.tagRecommendationCount;
  
  // Status logic mapping
  const statusConfig = {
    'Needs review': { color: 'warning', label: 'Needs review' },
    'In progress': { color: 'neutral', label: 'In progress' },
    'Completed': { color: 'success', label: 'Completed' },
    'Artifact generated': { color: 'success', label: 'Ready' }
  };

  const currentStatus = showSource ? (journey.status as any) : 'Needs review';
  const statusInfo = statusConfig[currentStatus] || { color: 'neutral', label: currentStatus };

  const isReviewCard = !showSource && !isRecent;

  return (
    <div 
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      className="w-full flex flex-col gap-4 p-5 bg-card border border-border rounded-2xl transition-all hover:border-accent hover:shadow-lg cursor-pointer text-left h-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {isReviewCard && (
        <div className="w-full h-40 -mt-5 -mx-5 mb-1 relative border-b border-border bg-surface-secondary overflow-hidden shrink-0" style={{ width: 'calc(100% + 40px)' }}>
           <div className="absolute inset-0 origin-top-left scale-[0.4] w-[250%] h-[250%] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <JourneyScreenGenerator journey={journey} step={journey.steps[0]} />
           </div>
           <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
           <div className={clsx(
             "absolute top-3 right-3 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/20 shadow-lg",
             isValidation ? "bg-emerald-500/90" : "bg-amber-500/90"
           )}>
             {isValidation ? 'Ready to Validate' : 'Needs Review'}
           </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-1">
        <div className="flex flex-col gap-1.5">
           {!isReviewCard && (
             <div className="w-10 h-10 rounded-lg bg-surface-secondary flex items-center justify-center text-muted-foreground group-hover:text-accent transition-all">
                <Icon size={20} strokeWidth={1.5} />
             </div>
           )}
           {showSource && journey.source && (
             <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Source: {journey.source}</span>
             </div>
           )}
        </div>
        {!isReviewCard && (
          <StatusBadge 
            status={statusInfo.color as any} 
            label={statusInfo.label} 
          />
        )}
      </div>
      
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-[16px] font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1 tracking-tight">{journey.journeyName}</h3>
        <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-80">
          {isRecent ? `Updated ${journey.lastUpdated}` : journey.autoGeneratedGoal}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <div className="px-2 py-0.5 bg-surface-secondary rounded-md text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Monitor size={10} />
          {journey.platform}
        </div>
        <div className="px-2 py-0.5 bg-accent-soft rounded-md text-[9px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
          <Layers size={10} />
          {journey.trackingFocus}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Zap size={12} className="text-amber-500" />
            <span className="text-[12px] font-bold text-foreground">{displayTagCount} tags recommended</span>
         </div>
         {!showSource ? (
           <div className={clsx(
             "flex items-center gap-1 text-[11px] font-bold",
             isValidation ? "text-emerald-600" : "text-accent"
           )}>
              {isValidation ? 'Begin validation' : 'Review journey'}
              <ArrowRight size={12} />
           </div>
         ) : (
           <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
         )}
      </div>
    </div>
  );
};

// Jira Ticket Card Component
const JiraTicketCard = ({ 
  ticket, 
  onClick 
}: { 
  ticket: any,
  onClick: () => void 
}) => {
  const statusConfig = {
    'New': { color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', border: 'border-blue-200', label: 'New Assignment' },
    'Needs Context': { color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50', border: 'border-amber-200', label: 'Context Needed' },
    'Ready for Analysis': { color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', border: 'border-emerald-200', label: 'Ready for Analysis' },
    'In Review': { color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', border: 'border-purple-200', label: 'In Review' },
    'Analyzing': { color: 'bg-indigo-500', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50', border: 'border-indigo-200', label: 'AI Analyzing' }
  };

  const priorityConfig = {
    'High': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    'Medium': { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    'Low': { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' }
  };

  const status = statusConfig[ticket.status] || statusConfig['New'];
  const priority = priorityConfig[ticket.priority] || priorityConfig['Medium'];

  return (
    <div 
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      className="w-full flex flex-col gap-4 p-6 bg-card border-2 border-border rounded-2xl transition-all hover:border-accent hover:shadow-xl cursor-pointer text-left h-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Header with Ticket ID */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clipboard size={20} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Jira Ticket</span>
            <span className="text-[16px] font-bold text-foreground">{ticket.ticketId}</span>
          </div>
        </div>
      </div>

      {/* Journey Name */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-[17px] font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1 tracking-tight">{ticket.journeyName}</h3>
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
          {ticket.title}
        </p>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="px-2.5 py-1 bg-surface-secondary border border-border rounded-md text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Monitor size={11} />
          {ticket.platform}
        </div>
        <div className={clsx("px-2.5 py-1 border rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", priority.bg, priority.border, priority.color)}>
          <AlertCircle size={11} />
          {ticket.priority.toUpperCase()} PRIORITY
        </div>
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={11} />
            {ticket.attachments.length}
          </div>
        )}
        <div className={clsx("px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider", status.bgColor, status.border, status.textColor)}>
          {status.label}
        </div>
      </div>

      {/* Footer with Due Date and CTA */}
      <div className="mt-2 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Due Date</span>
          <span className="text-[12px] font-bold text-foreground">{new Date(ticket.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-accent">
          {ticket.status === 'New' || ticket.status === 'Needs Context' ? 'Enrich Context' : ticket.status === 'Ready for Analysis' ? 'Begin Analysis' : 'View Progress'}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

// Kanban Card Components (Compact versions)
const KanbanTicketCard = ({ 
  ticket, 
  onClick 
}: { 
  ticket: any,
  onClick: () => void 
}) => {
  const priorityConfig = {
    'High': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
    'Medium': { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
    'Low': { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-500' }
  };

  const priority = priorityConfig[ticket.priority] || priorityConfig['Medium'];

  return (
    <div 
      onClick={onClick}
      className="w-full flex flex-col gap-3 p-4 bg-card border border-border rounded-xl transition-all hover:border-accent hover:shadow-md cursor-pointer text-left group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={clsx("w-2 h-2 rounded-full shrink-0", priority.dot)} />
          <span className="text-[11px] font-bold text-muted-foreground">{ticket.ticketId}</span>
        </div>
        <div className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Jira
        </div>
      </div>
      
      <h4 className="text-[14px] font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
        {ticket.journeyName}
      </h4>
      
      <div className="flex items-center gap-2">
        <Monitor size={10} className="text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground">{ticket.platform}</span>
      </div>
      
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-[9px] font-bold text-muted-foreground">Due {new Date(ticket.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <ArrowRight size={12} className="text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
    </div>
  );
};

const KanbanJourneyCard = ({ 
  journey, 
  onClick,
  isValidation = false
}: { 
  journey: Journey, 
  onClick: () => void,
  isValidation?: boolean
}) => {
  const Icon = journey.icon;

  return (
    <div 
      onClick={onClick}
      className="w-full flex flex-col gap-3 p-4 bg-card border border-border rounded-xl transition-all hover:border-accent hover:shadow-md cursor-pointer text-left group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-muted-foreground group-hover:text-accent transition-all shrink-0">
          <Icon size={16} strokeWidth={1.5} />
        </div>
        <div className={clsx(
          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
          isValidation 
            ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
            : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
        )}>
          {isValidation ? 'Validate' : 'Review'}
        </div>
      </div>
      
      <h4 className="text-[14px] font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
        {journey.journeyName}
      </h4>
      
      <div className="flex flex-wrap gap-1.5">
        <div className="px-1.5 py-0.5 bg-surface-secondary rounded text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Monitor size={9} />
          {journey.platform}
        </div>
        <div className="px-1.5 py-0.5 bg-accent-soft rounded text-[9px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
          <Layers size={9} />
          {journey.trackingFocus}
        </div>
      </div>
      
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Zap size={10} className="text-amber-500" />
          <span className="text-[10px] font-bold text-foreground">{journey.tagRecommendationCount} tags</span>
        </div>
        <ArrowRight size={12} className="text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
    </div>
  );
};

// View Toggle Component
const ViewToggle = ({ viewMode, onViewChange }: { viewMode: 'grid' | 'kanban', onViewChange: (mode: 'grid' | 'kanban') => void }) => (
  <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border">
    <button
      onClick={() => onViewChange('grid')}
      className={clsx(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all",
        viewMode === 'grid' 
          ? "bg-card text-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <LayoutGrid size={14} />
      <span>Grid View</span>
    </button>
    <button
      onClick={() => onViewChange('kanban')}
      className={clsx(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all",
        viewMode === 'kanban' 
          ? "bg-card text-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Columns3 size={14} />
      <span>Kanban View</span>
    </button>
  </div>
);

// Kanban Column Component
const KanbanColumn = ({ 
  title, 
  count, 
  color, 
  children,
  emptyMessage
}: { 
  title: string, 
  count: number, 
  color: string,
  children: React.ReactNode,
  emptyMessage?: string
}) => (
  <div className="flex flex-col gap-4 flex-1 min-w-[300px]">
    <div className={clsx(
      "flex items-center justify-between p-4 rounded-xl border-2",
      color === 'blue' && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
      color === 'amber' && "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
      color === 'emerald' && "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
      color === 'slate' && "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800"
    )}>
      <h3 className={clsx(
        "text-[14px] font-black uppercase tracking-wider",
        color === 'blue' && "text-blue-900 dark:text-blue-100",
        color === 'amber' && "text-amber-900 dark:text-amber-100",
        color === 'emerald' && "text-emerald-900 dark:text-emerald-100",
        color === 'slate' && "text-slate-900 dark:text-slate-100"
      )}>
        {title}
      </h3>
      <div className={clsx(
        "px-2.5 py-1 rounded-lg text-[12px] font-black",
        color === 'blue' && "bg-blue-600 text-white",
        color === 'amber' && "bg-amber-600 text-white",
        color === 'emerald' && "bg-emerald-600 text-white",
        color === 'slate' && "bg-slate-600 text-white"
      )}>
        {count}
      </div>
    </div>
    
    <div className="flex flex-col gap-3 min-h-[400px]">
      {count === 0 && emptyMessage ? (
        <div className="flex flex-col items-center justify-center gap-2 p-8 bg-surface-secondary/30 border-2 border-dashed border-border rounded-xl">
          <CheckSquare size={24} className="text-muted-foreground opacity-40" />
          <p className="text-[12px] font-medium text-muted-foreground text-center">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </div>
  </div>
);

// --- Main Page Component ---

export const PlaygroundLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');
  
  // State for managing ticket statuses and simulated processing
  const [ticketStatuses, setTicketStatuses] = useState<Record<string, string>>({});
  const [processingTickets, setProcessingTickets] = useState<Set<string>>(new Set());
  const [completedTickets, setCompletedTickets] = useState<Set<string>>(new Set());

  // Handle incoming state from analysis redirect
  useEffect(() => {
    if (location.state?.processingTicketId) {
      const ticketId = location.state.processingTicketId;
      
      // Mark ticket as processing
      setTicketStatuses(prev => ({ ...prev, [ticketId]: 'Processing' }));
      setProcessingTickets(prev => new Set(prev).add(ticketId));
      
      // Simulate AI analysis completion after 5 seconds
      const timer = setTimeout(() => {
        setTicketStatuses(prev => ({ ...prev, [ticketId]: 'Ready for Review' }));
        setProcessingTickets(prev => {
          const newSet = new Set(prev);
          newSet.delete(ticketId);
          return newSet;
        });
        setCompletedTickets(prev => new Set(prev).add(ticketId));
        
        // Show notification toast
        toast.success('AI Analysis Complete', {
          description: `${mockJiraTickets.find(t => t.ticketId === ticketId)?.journeyName} is ready for review.`,
          duration: 5000,
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const platforms = [
    { name: 'All', id: 'All' },
    { name: 'Verizon Consumer', id: 'Web', domain: 'vzw.com' },
    { name: 'Verizon Business', id: 'Business', domain: 'verizon.com/business' },
    { name: 'Visible', id: 'Mobile', domain: 'visible.com' }
  ];

  // Logic: "New journeys to review" (Figma/Jira)
  const newJourneysToReview = useMemo(() => {
    return mockJourneys.filter(j => j.sourceType === 'Figma' || j.sourceType === 'Jira');
  }, []);

  const filteredJourneys = useMemo(() => {
    let base = mockJourneys.filter(j => j.sourceType !== 'Figma' && j.sourceType !== 'Jira');
    if (selectedPlatform !== 'All') {
      base = base.filter(j => 
        selectedPlatform === 'Web' ? j.platform === 'Web' : 
        selectedPlatform === 'Mobile' ? (j.platform === 'Mobile' || j.platform === 'Hybrid') :
        selectedPlatform === 'Business' ? (j.environmentLink.includes('business') || j.category === 'Business') : true
      );
    }
    return base;
  }, [selectedPlatform]);

  const stats = useMemo(() => {
    const total = filteredJourneys.length;
    const inProgress = filteredJourneys.filter(j => j.status === 'In progress').length;
    return { total, inProgress };
  }, [filteredJourneys]);

  const recentItems = useMemo(() => {
    return [...filteredJourneys]
      .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
      .slice(0, 4);
  }, [filteredJourneys]);

  // Journeys Ready for Validation - those with AI-generated recommendations awaiting BA approval
  const readyForValidationJourneys = useMemo(() => {
    return mockJourneys.filter(j => {
      // Check if journey has been analyzed (has recommendations)
      const hasRecommendations = j.steps.some(step => 
        step.components && step.components.length > 0
      );
      // Check if there are any proposed tags that need review
      const hasProposedTags = j.steps.some(step =>
        step.components?.some(tag => tag.approvalState === 'Proposed')
      );
      // Filter by source type: Jira or Figma (analysis complete)
      const isAnalyzed = j.sourceType === 'Jira' || j.sourceType === 'Figma';
      
      return hasRecommendations && hasProposedTags && isAnalyzed;
    }).slice(0, 8); // Show up to 8 journeys
  }, []);

  useEffect(() => {
    const initialPlatform = location.state?.initialPlatform;
    if (initialPlatform) {
      setSelectedPlatform(initialPlatform);
    }
  }, [location.state]);

  return (
    <div className="flex-1 flex flex-col min-h-full px-8 py-10 pb-24 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-10">
        
        {/* 1. Header Row */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
              Welcome back, Abhinav. Your CX Dashboard is ready.
            </h1>
            <p className="text-[13px] text-muted-foreground font-medium">
              Overview of journeys, health, and optimization activity
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm hover:border-accent transition-all cursor-pointer min-w-[160px] justify-between"
              >
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Platform</span>
                  <span className="text-[13px] font-bold text-foreground">
                    {platforms.find(p => p.id === selectedPlatform)?.name || selectedPlatform}
                  </span>
                </div>
                <ChevronDown size={14} className={clsx("text-muted-foreground transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-card border border-border rounded-2xl shadow-xl z-50 py-1 overflow-hidden">
                  {platforms.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPlatform(p.id);
                        setIsDropdownOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-surface-secondary flex flex-col",
                        selectedPlatform === p.id ? "bg-surface-secondary text-accent" : "text-foreground"
                      )}
                    >
                      <span>{p.name}</span>
                      {p.domain && <span className="text-[10px] text-muted-foreground">{p.domain}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-foreground text-background px-6 py-2.5 rounded-2xl text-[14px] font-bold hover:bg-black dark:hover:bg-zinc-800 transition-all shadow-lg active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <Plus size={18} />
              Start new journey
            </button>
          </div>
        </header>

        {/* Demo Notice Modal */}
        <DemoNoticeModal 
          isOpen={isDemoModalOpen} 
          onClose={() => setIsDemoModalOpen(false)} 
        />

        {/* 2. Quick Platform Insights */}
        <section className="flex flex-wrap gap-5">
          <MetricCard 
            label="Active Journeys" 
            value={stats.total.toString()} 
            subtext="Total connected narratives" 
            icon={Layers} 
          />
          <MetricCard 
            label="Journeys In Progress" 
            value={stats.inProgress.toString()} 
            subtext="Currently being optimized" 
            icon={Activity} 
          />
          <MetricCard 
            label="Tracking Coverage" 
            value="94.2%" 
            subtext="Across connected domains" 
            icon={CheckCircle2} 
            trend="+0.4%" 
          />
          <MetricCard 
            label="Recent Activity" 
            value="3" 
            subtext="Updated in last 24 hrs" 
            icon={RefreshCcw} 
          />
        </section>

        {/* Conditional Rendering: Grid View or Kanban View */}
        {viewMode === 'grid' ? (
          <>
            {/* 2a. My Jira Assignments */}
            {mockJiraTickets.length > 0 && (
              <section className="flex flex-col p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clipboard size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[20px] font-bold text-foreground tracking-tight">My Jira Assignments</h2>
                    <p className="text-[13px] text-muted-foreground font-medium">
                      Tickets assigned to you requiring context enrichment and analysis
                    </p>
                  </div>
                  <div className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-xl text-[13px] font-black tracking-wider shadow-md">
                    {mockJiraTickets.length} Active
                  </div>
                </div>

                <div className="mx-[-12px]">
                  <Slider {...carouselSettings} className="!flex !items-stretch">
                    {mockJiraTickets.map((ticket) => (
                      <div key={ticket.ticketId} className="px-3 py-2 !h-auto !flex">
                        <JiraTicketCard 
                          ticket={ticket}
                          onClick={() => navigate(`/jira/${ticket.ticketId}/enrich`)} 
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            )}

            {/* 2b. New Journeys to Review (Figma/Jira) */}
            <section className="flex flex-col">
              <SectionHeader 
                title="New Journeys Ready For Analysis" 
                description="AI-analyzed journeys with tagging recommendations ready for your review and approval."
                onViewAll={() => navigate('/journeys', { state: { initialTab: 'Review' } })}
              />

              <div className="mx-[-12px]">
                <Slider {...carouselSettings}>
                  {newJourneysToReview.map((j) => (
                    <div key={`new-${j.journeyId}`} className="px-3 py-4 h-full">
                      <JourneyCard 
                        journey={j}
                        showSource={false}
                        onClick={() => navigate(`/playground/journey/${j.journeyId}/overview`)} 
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </section>

            {/* 3. Journeys Ready for Validation */}
            {readyForValidationJourneys.length > 0 && (
              <section className="flex flex-col">
                <SectionHeader 
                  title="Implementation Validation Results" 
                  description="Review validation reports and quality checks for deployed tracking implementations"
                  onViewAll={() => navigate('/journeys', { state: { initialTab: 'Validation' } })}
                />

                <div className="mx-[-12px]">
                  <Slider {...carouselSettings}>
                    {readyForValidationJourneys.map((j) => (
                      <div key={`validation-${j.journeyId}`} className="px-3 py-4 h-full">
                        <JourneyCard 
                          journey={j}
                          showSource={false}
                          isValidation={true}
                          onClick={() => navigate(`/playground/journey/${j.journeyId}/validation`)} 
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            )}

            {/* 4. Existing Journeys (Primary Focus) */}
            <section className="flex flex-col">
              <SectionHeader 
                title="Existing journeys" 
                description="System-detected journeys synced from Analytics, Data Layer, and connected platforms."
                onViewAll={() => navigate('/journeys', { state: { initialTab: 'Existing' } })}
              />

              <div className="mx-[-12px]">
                <Slider {...carouselSettings}>
                  {filteredJourneys.map((j) => (
                    <div key={`existing-${j.journeyId}`} className="px-3 py-4 h-full">
                      <JourneyCard 
                        journey={j}
                        showSource={true}
                        onClick={() => navigate(`/playground/journey/${j.journeyId}/overview`)} 
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </section>

            {/* 5. Recently Working On */}
            <section className="flex flex-col pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={18} className="text-muted-foreground" />
                <h2 className="text-[20px] font-bold text-foreground tracking-tight">Recently working on</h2>
              </div>
              
              <div className="mx-[-12px]">
                <Slider {...carouselSettings}>
                  {recentItems.map((j) => (
                    <div key={`recent-${j.journeyId}`} className="px-3 py-4 h-full">
                      <JourneyCard 
                        journey={j} 
                        showSource={true}
                        isRecent={true}
                        onClick={() => navigate(`/playground/journey/${j.journeyId}/overview`)} 
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </section>
          </>
        ) : (
          // Kanban View
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-foreground tracking-tight">Workflow Board</h2>
                <p className="text-[13px] text-muted-foreground font-medium">Track your assignments and journeys through the analytics workflow</p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {/* Column 1: To Do (Jira Assignments) */}
              <KanbanColumn 
                title="To Do" 
                count={mockJiraTickets.length}
                color="blue"
              >
                {mockJiraTickets.map((ticket) => (
                  <KanbanTicketCard 
                    key={ticket.ticketId}
                    ticket={ticket}
                    onClick={() => navigate(`/jira/${ticket.ticketId}/enrich`)} 
                  />
                ))}
              </KanbanColumn>

              {/* Column 2: Ready for Analysis (New Journeys) */}
              <KanbanColumn 
                title="Ready for Analysis" 
                count={newJourneysToReview.length}
                color="amber"
              >
                {newJourneysToReview.map((journey) => (
                  <KanbanJourneyCard 
                    key={journey.journeyId}
                    journey={journey}
                    onClick={() => navigate(`/playground/journey/${journey.journeyId}/overview`)} 
                  />
                ))}
              </KanbanColumn>

              {/* Column 3: Validation (Ready for Validation) */}
              <KanbanColumn 
                title="Validation" 
                count={readyForValidationJourneys.length}
                color="emerald"
              >
                {readyForValidationJourneys.map((journey) => (
                  <KanbanJourneyCard 
                    key={journey.journeyId}
                    journey={journey}
                    isValidation={true}
                    onClick={() => navigate(`/playground/journey/${journey.journeyId}/validation`)} 
                  />
                ))}
              </KanbanColumn>

              {/* Column 4: Completed (Empty for now) */}
              <KanbanColumn 
                title="Completed" 
                count={0}
                color="slate"
                emptyMessage="No completed journeys yet. Items will appear here once work is finished."
              />
            </div>
          </section>
        )}

      </div>
    </div>
  );
};