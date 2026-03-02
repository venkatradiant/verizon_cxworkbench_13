import React, { useState, useEffect, useMemo, useRef } from 'react';  
import { useParams, useNavigate } from 'react-router';
import { 
  Sparkles, 
  Target, 
  Edit3, 
  Monitor,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Link2,
  X,
  Info,
  Plus,
  Clock,
  Layout,
  MousePointer2,
  FileText,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  Layers,
  Check,
  ArrowRight,
  Database,
  ExternalLink,
  ClipboardList,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Filter,
  Activity,
  BarChart3,
  Clipboard,
  Eye,
  User,
  Bot,
  Calendar,
  MessageSquare,
  Mic,
  Video,
  FileType,
  Brain,
  Pencil,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { mockJourneys, Journey, JourneyStep, TagComponent } from '@/app/data/mockJourneys';
import { StatusBadge } from '@/app/components/Foundation';
import { JourneyScreenGenerator } from '@/app/components/JourneyScreenGenerator';
import { EnhancedDataLayerTab, EnhancedUserInteractionsInfo, EnhancedSystemEventsInfo } from '@/app/components/EnhancedInspectionTabs';
import { AIContextSourcesPanel } from '@/app/components/AIContextSourcesPanel';
import { RejectionReasonModal, REJECTION_REASONS_MAP } from '@/app/components/RejectionReasonModal';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { LottieLoader } from "../components/LottieLoader";
import { motion, AnimatePresence } from 'motion/react';
const Motion = motion;

// --- Sub-components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const messages = [
    "Gathering journey signals",
    "Generating optimization goal",
    "Mapping journey sequence",
    "Preparing recommendations"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => {
        if (prev < messages.length - 1) return prev + 1;
        clearInterval(timer);
        setTimeout(onComplete, 800);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center gap-10">
      <LottieLoader variant="TECHNICAL" size={180} />
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <Motion.p 
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[20px] font-black text-zinc-900 tracking-tight"
          >
            {messages[step]}
          </Motion.p>
        </AnimatePresence>
        <div className="flex gap-2">
          {messages.map((_, i) => (
            <div 
              key={i} 
              className={clsx(
                "w-2 h-2 rounded-full transition-all duration-500",
                i <= step ? "bg-zinc-900 w-6 shadow-[0_0_10px_rgba(0,0,0,0.1)]" : "bg-zinc-100"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TagTooltip = ({ 
  tag, 
  onClose, 
  onAccept, 
  onDecline, 
  onUpdate,
  side,
  align
}: { 
  tag: TagComponent; 
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onUpdate: (name: string, meta: any) => void;
  side: 'top' | 'bottom';
  align: 'left' | 'right' | 'center';
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    name: tag.aiRecommendedTag,
    event: tag.eventType || 'Click',
    level: tag.level || 'Component',
    context: tag.componentLabel || ''
  });

  const handleSave = () => {
    onUpdate(editFields.name, {
      eventType: editFields.event,
      level: editFields.level,
      componentLabel: editFields.context
    });
    setIsEditing(false);
  };

  const isApproved = tag.approvalState === 'Approved';
  const isRejected = tag.approvalState === 'Rejected';

  return (
    <Motion.div 
      initial={{ opacity: 0, scale: 0.9, y: side === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: side === 'top' ? -20 : 20 }}
      className={clsx(
        "absolute z-[200] pointer-events-auto w-[380px] bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-zinc-100 p-8 flex flex-col gap-6",
        side === 'top' ? "bottom-full mb-8" : "top-full mt-8",
        align === 'right' ? "right-[-40px]" : (align === 'left' ? "left-[-40px]" : "left-1/2 -translate-x-1/2")
      )}
    >
      <div className={clsx(
        "absolute w-6 h-6 bg-white border-zinc-100 rotate-45 z-[-1]",
        side === 'top' ? "bottom-[-12px] border-b border-r" : "top-[-12px] border-t border-l",
        align === 'right' ? "right-[50px]" : (align === 'left' ? "left-[50px]" : "left-1/2 -translate-x-1/2")
      )} />

      {isEditing ? (
         <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
               <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Edit Recommendation</span>
               <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-900"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tag Name</span>
              <textarea 
                value={editFields.name}
                onChange={(e) => setEditFields(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[14px] font-bold outline-none focus:border-zinc-900 transition-all resize-none h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Event</span>
                <input 
                  type="text" 
                  value={editFields.event} 
                  onChange={(e) => setEditFields(prev => ({ ...prev, event: e.target.value }))} 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] font-bold outline-none focus:border-zinc-900" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Level</span>
                <input 
                  type="text" 
                  value={editFields.level} 
                  onChange={(e) => setEditFields(prev => ({ ...prev, level: e.target.value }))} 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] font-bold outline-none focus:border-zinc-900" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Context</span>
              <input 
                type="text" 
                value={editFields.context} 
                onChange={(e) => setEditFields(prev => ({ ...prev, context: e.target.value }))} 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] font-bold outline-none focus:border-zinc-900" 
              />
            </div>
            <button 
              onClick={handleSave}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[14px] font-black hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Save Changes
            </button>
         </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 text-left relative">
            <div className="flex items-center justify-between">
              <div className={clsx("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm", tag.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100")}>
                {tag.priority} Priority
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 bg-zinc-50 rounded-full transition-colors"><X size={18} /></button>
            </div>
            <h4 className="text-[20px] font-black text-zinc-900 tracking-tight leading-tight pt-1 break-words">
              {tag.aiRecommendedTag}
            </h4>
          </div>

          <div className="flex flex-col gap-3">
             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col gap-1.5">
                   <div className="flex items-center gap-1.5 text-zinc-400">
                      <Zap size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Event</span>
                   </div>
                   <span className="text-[13px] font-black text-zinc-700">{tag.eventType || 'Click'}</span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col gap-1.5">
                   <div className="flex items-center gap-1.5 text-zinc-400">
                      <Layers size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Level</span>
                   </div>
                   <span className="text-[13px] font-black text-zinc-700">{tag.level || 'Component'}</span>
                </div>
             </div>
             <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-zinc-400">
                   <MousePointer2 size={12} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Context</span>
                </div>
                <span className="text-[13px] font-black text-zinc-700 line-clamp-2 leading-snug">{tag.componentLabel || 'Interaction'}</span>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onAccept}
              className={clsx("flex-1 py-4 rounded-2xl text-[14px] font-black transition-all flex items-center justify-center gap-2.5 shadow-xl active:scale-95", isApproved ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-zinc-900 text-white shadow-zinc-900/30 hover:bg-black")}
            >
              <Check size={18} strokeWidth={4} /> {isApproved ? 'Approved' : 'Accept'}
            </button>
            <div className="flex flex-1 gap-2">
              <button 
                onClick={onDecline}
                className={clsx("flex-1 py-4 rounded-2xl text-[14px] font-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95", isRejected ? "bg-zinc-400 text-white shadow-zinc-400/20" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200")}
                title="Decline"
              >
                <X size={18} strokeWidth={4} />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 py-4 rounded-2xl text-[14px] font-black bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                title="Edit"
              >
                <Edit3 size={18} strokeWidth={4} />
              </button>
            </div>
          </div>
        </>
      )}
    </Motion.div>
  );
};

const SidebarTagCard = ({ 
  tag, 
  index,
  isActive,
  onToggleApproval, 
  onDecline,
  onUpdateTag,
  onClick,
  cardRef,
  isInitiallyEditing = false
}: { 
  tag: TagComponent; 
  index: number;
  isActive: boolean;
  onToggleApproval: () => void;
  onDecline: () => void;
  onUpdateTag: (name: string, metadata: any) => void;
  onClick: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
  isInitiallyEditing?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(isInitiallyEditing);
  const [editFields, setEditFields] = useState({
    name: tag.aiRecommendedTag,
    event: tag.eventType || 'Click',
    level: tag.level || 'Component',
    context: tag.componentLabel || ''
  });
  const [editableDataLayer, setEditableDataLayer] = useState<Record<string, string>>(tag.dataLayer || {});

  useEffect(() => {
    if (isInitiallyEditing) setIsEditing(true);
    else setIsEditing(false);
  }, [isInitiallyEditing, tag.componentId]);

  const isApproved = tag.approvalState === 'Approved';
  const isRejected = tag.approvalState === 'Rejected';

  const handleSave = () => {
    onUpdateTag(editFields.name, {
      eventType: editFields.event,
      level: editFields.level,
      componentLabel: editFields.context,
      dataLayer: editableDataLayer
    });
    setIsEditing(false);
  };
  
  const handleDataLayerChange = (key: string, value: string) => {
    setEditableDataLayer(prev => ({ ...prev, [key]: value }));
  };

  // Get top 6-8 most relevant keys for display
  const displayKeys = Object.keys(tag.dataLayer || {}).slice(0, 8);

  if (isEditing) {
    return (
      <div className="flex flex-col p-6 bg-white border-2 border-zinc-900 rounded-3xl shadow-xl gap-5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Edit Data Layer</div>
          <div className={clsx("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border", tag.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100")}>
            {tag.priority} Priority
          </div>
        </div>

        {/* Key-Value Table for Editing */}
        <div className="flex flex-col gap-0 border border-zinc-200 rounded-xl overflow-hidden">
          {displayKeys.map((key, idx) => (
            <div key={key} className={clsx("grid grid-cols-[140px_1fr] border-zinc-200", idx !== displayKeys.length - 1 && "border-b")}>
              <div className="px-3 py-2.5 bg-zinc-50 border-r border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-tight flex items-center">
                {key.replace(/_/g, ' ')}
              </div>
              <input 
                type="text" 
                value={editableDataLayer[key] || ''}
                onChange={(e) => handleDataLayerChange(key, e.target.value)}
                className="px-3 py-2.5 bg-white text-[13px] font-medium text-zinc-900 outline-none focus:bg-blue-50/30 transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={() => setIsEditing(false)}
            className="flex-1 py-3 text-[13px] font-black text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 bg-zinc-900 text-white rounded-xl text-[13px] font-black hover:bg-black transition-all shadow-lg shadow-zinc-900/10"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={clsx(
        "flex flex-col p-5 rounded-[var(--radius-card)] border transition-all duration-300 cursor-pointer group shrink-0",
        isActive 
          ? "bg-white border-zinc-900 shadow-2xl ring-4 ring-zinc-900/5 translate-x-1" 
          : "bg-white border-zinc-100 hover:border-zinc-300 shadow-sm",
        isApproved && !isActive && "bg-emerald-50/40 border-emerald-100",
        isRejected && !isActive && "bg-zinc-50 border-zinc-100 opacity-60"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-7 h-7 rounded-full border-2 flex items-center justify-center font-black text-[11px] shrink-0 transition-all shadow-sm",
              isApproved 
                ? "bg-emerald-500 border-white text-white" 
                : (isRejected ? "bg-zinc-400 border-white text-white" : "bg-zinc-900 border-white text-white"),
              isActive ? "scale-110 shadow-lg ring-4 ring-zinc-900/10" : "scale-100"
            )}>
              {isApproved ? <Check size={14} strokeWidth={4} /> : (isRejected ? <X size={14} strokeWidth={4} /> : index + 1)}
            </div>
            <div className={clsx(
              "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shrink-0",
              tag.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"
            )}>
              {tag.priority} Priority
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleApproval(); }}
              className={clsx(
                "p-2 rounded-lg transition-all cursor-pointer active:scale-90",
                isApproved 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
              )}
              title={isApproved ? "Approved" : "Accept"}
            >
              <Check size={16} strokeWidth={4} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDecline(); }}
              className={clsx(
                "p-2 rounded-lg transition-all cursor-pointer active:scale-90",
                isRejected 
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20" 
                  : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
              )}
              title={isRejected ? "Rejected" : "Decline"}
            >
              <X size={16} strokeWidth={4} />
            </button>
            <div className="w-[1px] h-4 bg-zinc-200 mx-1" />
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
              title="Edit Tag"
            >
              <Edit3 size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className={clsx(
            "text-[13px] font-black tracking-tight leading-snug break-words whitespace-normal",
            isRejected ? "text-zinc-400 line-through" : "text-zinc-900"
          )}>
            {tag.componentLabel}
          </h4>

          {/* Rejection Feedback Indicator */}
          {isRejected && (tag as any).rejectionReason && (
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center gap-1.5">
                <Bot size={10} className="text-purple-600 dark:text-purple-400" />
                <span className="text-[9px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Feedback submitted to AI
                </span>
              </div>
              <div className="group relative">
                <Info size={12} className="text-zinc-400 hover:text-zinc-600 cursor-help" />
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-50 w-64 p-3 bg-zinc-900 text-white text-[11px] rounded-lg shadow-xl">
                  <div className="font-bold mb-1">Rejection Reason:</div>
                  <div className="text-zinc-300">{(tag as any).rejectionReasonLabel || (tag as any).rejectionReason}</div>
                  {(tag as any).rejectionContext && (
                    <>
                      <div className="font-bold mt-2 mb-1">Additional Context:</div>
                      <div className="text-zinc-300">{(tag as any).rejectionContext}</div>
                    </>
                  )}
                  {(tag as any).rejectionScope && (
                    <div className="mt-2 pt-2 border-t border-zinc-700 text-[10px] text-zinc-400">
                      Scope: {(tag as any).rejectionScope === 'global' ? 'Future journeys' : 'This journey only'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Key-Value Data Table */}
          <div className="flex flex-col gap-0 border border-zinc-100 rounded-xl overflow-hidden bg-white shadow-sm">
            {displayKeys.map((key, idx) => (
              <div 
                key={key} 
                className={clsx(
                  "grid grid-cols-[120px_1fr] text-left border-zinc-100",
                  idx !== displayKeys.length - 1 && "border-b"
                )}
              >
                <div className="px-3 py-2 bg-zinc-50/80 border-r border-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-tight flex items-center">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="px-3 py-2 bg-white text-[12px] font-medium text-zinc-900 flex items-center truncate">
                  {tag.dataLayer?.[key] || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export const JourneyOverview = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [journey, setJourney] = useState<Journey | null>(null);

  useEffect(() => {
    if (journeyId) {
      const seenKey = `vzw-seen-journey-${journeyId}`;
      const hasSeen = sessionStorage.getItem(seenKey);
      
      if (hasSeen) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [journeyId]);

  const handleLoadingComplete = () => {
    if (journeyId) {
      sessionStorage.setItem(`vzw-seen-journey-${journeyId}`, 'true');
    }
    setLoading(false);
  };
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasBeenOpened = sessionStorage.getItem('vzw-context-opened-analyze');
      if (!hasBeenOpened) {
        sessionStorage.setItem('vzw-context-opened-analyze', 'true');
        return true;
      }
    }
    return false;
  });
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [tagToEditInPanel, setTagToEditInPanel] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Approved' | 'Rejected' | 'Proposed'>('All');
  const [isFilterTooltipOpen, setIsFilterTooltipOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dataLayer' | 'userInteractions' | 'systemEvents'>('dataLayer');
  const [isAISourcesOpen, setIsAISourcesOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [tagToReject, setTagToReject] = useState<TagComponent | null>(null);
  const [expandedEventCards, setExpandedEventCards] = useState<Set<number>>(new Set());

  // System Events CRUD state
  const [editableSystemEvents, setEditableSystemEvents] = useState<Record<number, Record<string, string>>>({});
  const [editingEventCell, setEditingEventCell] = useState<{ eventIdx: number, key: string, field: 'key' | 'value' } | null>(null);
  const [editEventValue, setEditEventValue] = useState<string>('');
  const [eventFieldErrors, setEventFieldErrors] = useState<Record<string, string>>({});
  const [deletedEventKeys, setDeletedEventKeys] = useState<Record<number, Set<string>>>({});

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editableGoal, setEditableGoal] = useState('');
  const [editableDataLayer, setEditableDataLayer] = useState<Record<string, string>>({});

  // Enhanced inline editing state for Data Layer table with CRUD support
  const [editingCell, setEditingCell] = useState<{ key: string, field: 'key' | 'value' } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [deletedKeys, setDeletedKeys] = useState<Set<string>>(new Set());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<Array<{ key: string, value: string, id: string, section: string }>>([]);

  // Manual tagging state
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [savedTagPosition, setSavedTagPosition] = useState<{ x: number, y: number } | null>(null);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [newTagData, setNewTagData] = useState({ name: '', event: 'click', level: 'component' });
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [manualTags, setManualTags] = useState<Array<{
    id: string;
    name: string;
    position: { x: number, y: number };
    event: string;
    level: string;
    source: 'manual';
    timestamp: string;
  }>>([]);

  const tagRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const found = mockJourneys.find(j => j.journeyId === journeyId);
    if (found) {
      setJourney(found);
      setSteps(found.steps);
      setEditableGoal(found.autoGeneratedGoal);
    }
  }, [journeyId]);

  // Initialize editableDataLayer when step changes
  useEffect(() => {
    const currentStep = steps[activeStepIdx];
    if (currentStep && journey) {
      const newData = {
        page_name: currentStep.stepName,
        page_url: `/journey/${journey.journeyName.toLowerCase().replace(/\s/g, '-')}/${currentStep.stepName.toLowerCase().replace(/\s/g, '-')}`,
        page_category: journey.category,
        journey_name: journey.journeyName,
        journey_stage: currentStep.screenTemplate,
        platform: journey.platform,
        step_number: (activeStepIdx + 1).toString(),
        step_total: steps.length.toString(),
      };
      setEditableDataLayer(prev => {
        // Only update if we don't have data yet or if the step changed
        if (Object.keys(prev).length === 0 || prev.page_name !== newData.page_name) {
          return newData;
        }
        return prev;
      });
    }
  }, [activeStepIdx, journey, steps]);

  // Escape key to exit tagging mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTaggingMode) {
        setIsTaggingMode(false);
        toast.info('Tagging mode cancelled');
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isTaggingMode]);

  // Sync stats to session storage for header
  useEffect(() => {
    if (!journeyId || steps.length === 0) return;
    const total = steps.reduce((acc, step) => acc + (step.components?.length || 0), 0);
    const accepted = steps.reduce((acc, step) => acc + (step.components?.filter(t => t.approvalState === 'Approved').length || 0), 0);
    sessionStorage.setItem(`vzw-journey-stats-${journeyId}`, JSON.stringify({ accepted, total }));
  }, [steps, journeyId]);

  // Dynamic scaling logic
  useEffect(() => {
    const updateScale = () => {
      if (!canvasContainerRef.current || !journey || journey.platform === 'Mobile') return;
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

  useEffect(() => {
    if (activeTagId && tagRefs.current[activeTagId]) {
      tagRefs.current[activeTagId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeTagId]);

  const activeStep = steps[activeStepIdx];

  const filteredTags = useMemo(() => {
    return activeStep?.components?.filter(tag => filterStatus === 'All' || tag.approvalState === filterStatus) || [];
  }, [activeStep, filterStatus]);

  // Enhanced Data Layer CRUD handlers
  const handleCellClick = (key: string, value: string, field: 'key' | 'value' = 'value') => {
    setEditingCell({ key, field });
    setEditValue(value);
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const validateField = (originalKey: string, newKey: string, isKeyEdit: boolean): string | null => {
    // For key edits
    if (isKeyEdit) {
      // Check if empty
      if (!newKey.trim()) {
        return 'Key cannot be empty';
      }
      
      // Check for duplicates (only if key changed)
      if (newKey !== originalKey) {
        const allKeys = [
          ...Object.keys(pageDataLayer).filter(k => !deletedKeys.has(k)),
          ...customFields.map(f => f.key)
        ];
        if (allKeys.includes(newKey)) {
          return 'Duplicate key - this field already exists';
        }
      }
    }
    
    return null;
  };

  const handleSave = (originalKey: string) => {
    if (!editingCell) return;
    
    const { field } = editingCell;
    const trimmedValue = editValue.trim();
    
    // Validate
    const error = validateField(originalKey, trimmedValue, field === 'key');
    if (error) {
      setFieldErrors(prev => ({ ...prev, [originalKey]: error }));
      return;
    }
    
    if (field === 'key') {
      // Renaming a key
      const isCustomField = customFields.some(f => f.id === originalKey);
      
      if (isCustomField) {
        // Update custom field key
        setCustomFields(prev => prev.map(f => 
          f.id === originalKey ? { ...f, key: trimmedValue } : f
        ));
      } else {
        // For standard fields, create new entry and mark old as "renamed"
        const oldValue = editableDataLayer[originalKey] || pageDataLayer[originalKey] || '';
        setEditableDataLayer(prev => {
          const newData = { ...prev };
          delete newData[originalKey];
          newData[trimmedValue] = oldValue;
          return newData;
        });
        setDeletedKeys(prev => new Set(prev).add(originalKey));
      }
    } else {
      // Updating a value
      const isCustomField = customFields.some(f => f.id === originalKey);
      
      if (isCustomField) {
        setCustomFields(prev => prev.map(f => 
          f.id === originalKey ? { ...f, value: trimmedValue } : f
        ));
      } else {
        setEditableDataLayer(prev => ({
          ...prev,
          [originalKey]: trimmedValue
        }));
      }
    }
    
    setEditingCell(null);
    setEditValue('');
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[originalKey];
      return newErrors;
    });
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
    if (editingCell) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[editingCell.key];
        return newErrors;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, key: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(key);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleDeleteField = (key: string) => {
    const isCustomField = customFields.some(f => f.id === key);
    
    if (isCustomField) {
      setCustomFields(prev => prev.filter(f => f.id !== key));
    } else {
      setDeletedKeys(prev => new Set(prev).add(key));
    }
    
    // Clear any errors for this field
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleAddField = (section: string) => {
    const newId = `custom_${Date.now()}`;
    const newField = {
      key: '',
      value: '',
      id: newId,
      section: section
    };
    
    setCustomFields(prev => [...prev, newField]);
    
    // Auto-focus on the new key field
    setTimeout(() => {
      handleCellClick('', '', 'key');
      setEditingCell({ key: newId, field: 'key' });
    }, 0);
  };

  // ===== System Events CRUD Handlers =====
  
  const handleEventCellClick = (eventIdx: number, key: string, currentValue: string, field: 'key' | 'value') => {
    console.log('🖱️ handleEventCellClick:', { eventIdx, key, currentValue, field });
    setEditingEventCell({ eventIdx, key, field });
    setEditEventValue(currentValue);
    setEventFieldErrors({});
  };

  const handleEventSave = (eventIdx: number, originalKey: string) => {
    const trimmedValue = editEventValue.trim();
    
    if (!trimmedValue) {
      setEventFieldErrors({ [originalKey]: 'This field cannot be empty' });
      return;
    }
    
    if (!editingEventCell) return;
    
    const eventPayload = editableSystemEvents[eventIdx] || systemEvents[eventIdx]?.dataLayer || {};
    
    if (editingEventCell.field === 'key') {
      // Check for duplicate key in the same event
      const existingKeys = Object.keys(eventPayload).filter(k => k !== originalKey);
      if (existingKeys.includes(trimmedValue)) {
        setEventFieldErrors({ [originalKey]: 'Duplicate key in this event' });
        return;
      }
      
      // Rename key - preserve order with new field at the beginning if it's a new field
      const oldValue = eventPayload[originalKey] || '';
      setEditableSystemEvents(prev => {
        const currentPayload = prev[eventIdx] || systemEvents[eventIdx]?.dataLayer || {};
        const entries = Object.entries(currentPayload);
        const newPayload: Record<string, string> = {};
        
        // If renaming the first key (new field), add it first
        const isFirstKey = entries.length > 0 && entries[0][0] === originalKey;
        if (isFirstKey) {
          newPayload[trimmedValue] = oldValue;
        }
        
        // Add all other entries, skipping the original key
        for (const [k, v] of entries) {
          if (k !== originalKey) {
            newPayload[k] = v;
          } else if (!isFirstKey) {
            // If not first key, add renamed key at its original position
            newPayload[trimmedValue] = oldValue;
          }
        }
        
        return { ...prev, [eventIdx]: newPayload };
      });
    } else {
      // Update value
      setEditableSystemEvents(prev => {
        const currentPayload = prev[eventIdx] || systemEvents[eventIdx]?.dataLayer || {};
        return {
          ...prev,
          [eventIdx]: { ...currentPayload, [originalKey]: trimmedValue }
        };
      });
    }
    
    setEditingEventCell(null);
    setEditEventValue('');
    setEventFieldErrors({});
  };

  const handleEventKeyDown = (e: React.KeyboardEvent, eventIdx: number, key: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEventSave(eventIdx, key);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingEventCell(null);
      setEditEventValue('');
      setEventFieldErrors({});
    }
  };

  const handleAddEventField = (eventIdx: number) => {
    console.log('🔵 handleAddEventField called for event index:', eventIdx);
    
    const newKey = 'new_field';
    let uniqueKey = newKey;
    let counter = 1;
    
    const eventPayload = editableSystemEvents[eventIdx] || systemEvents[eventIdx]?.dataLayer || {};
    console.log('📦 Current event payload:', eventPayload);
    
    // Ensure unique key
    while (eventPayload[uniqueKey]) {
      uniqueKey = `${newKey}_${counter}`;
      counter++;
    }
    
    console.log('✨ Creating new field with key:', uniqueKey);
    
    setEditableSystemEvents(prev => {
      const currentPayload = prev[eventIdx] || systemEvents[eventIdx]?.dataLayer || {};
      const newPayload = { [uniqueKey]: '', ...currentPayload };
      console.log('💾 New payload to save:', newPayload);
      // Add new field at the beginning by creating a new object with the new field first
      return {
        ...prev,
        [eventIdx]: newPayload
      };
    });
    
    // Auto-focus on the new field
    setTimeout(() => {
      console.log('🎯 Auto-focusing on new field');
      handleEventCellClick(eventIdx, uniqueKey, uniqueKey, 'key');
    }, 50);
  };

  const handleDeleteEventField = (eventIdx: number, key: string) => {
    setDeletedEventKeys(prev => {
      const currentDeleted = prev[eventIdx] || new Set();
      return { ...prev, [eventIdx]: new Set(currentDeleted).add(key) };
    });
    
    setEditableSystemEvents(prev => {
      const currentPayload = prev[eventIdx] || systemEvents[eventIdx]?.dataLayer || {};
      const newPayload = { ...currentPayload };
      delete newPayload[key];
      return { ...prev, [eventIdx]: newPayload };
    });
    
    setEventFieldErrors({});
  };

  // Page-level data layer (consistent for entire page)
  const pageDataLayer = useMemo(() => {
    if (!activeStep || !journey) return {};
    
    const stepNumber = (activeStepIdx + 1).toString();
    const totalSteps = steps.length.toString();
    const progressPercentage = Math.round((parseInt(stepNumber) / parseInt(totalSteps)) * 100);
    
    return {
      // === Core Page Attributes ===
      page_name: activeStep.stepName,
      page_url: `/journey/${journey.journeyName.toLowerCase().replace(/\s/g, '-')}/${activeStep.stepName.toLowerCase().replace(/\s/g, '-')}`,
      page_category: journey.category,
      page_type: 'journey_step',
      page_title: `${activeStep.stepName} - ${journey.journeyName}`,
      page_load_time: '1247',
      page_language: 'en-US',
      page_referrer: 'direct',
      page_domain: 'verizon.com',
      page_path: `/journey/${journey.journeyName.toLowerCase().replace(/\s/g, '-')}`,
      page_query_string: '',
      page_hash: '',
      page_encoding: 'UTF-8',
      page_viewport_width: '390',
      page_viewport_height: '844',
      
      // === Journey Attributes ===
      journey_name: journey.journeyName,
      journey_id: journey.id,
      journey_stage: activeStep.screenTemplate,
      journey_step_index: stepNumber,
      journey_total_steps: totalSteps,
      journey_progress_percentage: progressPercentage.toString(),
      journey_entry_point: 'homepage',
      journey_intent: 'purchase',
      journey_status: 'in_progress',
      journey_start_time: new Date(Date.now() - 324000).toISOString(),
      journey_duration_seconds: '324',
      journey_previous_step: activeStepIdx > 0 ? steps[activeStepIdx - 1]?.stepName : 'none',
      journey_next_step: activeStepIdx < steps.length - 1 ? steps[activeStepIdx + 1]?.stepName : 'completion',
      journey_completion_rate: '0.68',
      journey_drop_off_risk: 'low',
      
      // === User Identity Attributes ===
      user_id: 'user_abc123xyz',
      user_hashed_id: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      user_type: 'authenticated',
      user_status: 'active',
      user_registration_date: '2023-03-15',
      user_email_domain: 'gmail.com',
      user_phone_verified: 'true',
      user_email_verified: 'true',
      user_account_type: 'individual',
      user_vip_status: 'false',
      
      // === User Segmentation ===
      user_segment: 'premium',
      user_persona: 'tech_enthusiast',
      user_lifecycle_stage: 'loyal_customer',
      user_churn_risk: 'low',
      user_propensity_score: '0.82',
      user_clv_tier: 'high',
      user_rfm_segment: 'champions',
      user_behavioral_cluster: 'frequent_upgrader',
      
      // === User Metrics ===
      user_lifetime_value: '2450.00',
      user_account_age_days: '547',
      user_previous_purchases: '3',
      user_total_spent: '4820.50',
      user_average_order_value: '1606.83',
      user_last_purchase_days_ago: '42',
      user_loyalty_tier: 'gold',
      user_loyalty_points: '15420',
      user_referral_count: '2',
      user_support_tickets: '1',
      user_nps_score: '9',
      user_satisfaction_rating: '4.5',
      
      // === User Preferences ===
      user_preferred_language: 'en',
      user_preferred_currency: 'USD',
      user_preferred_contact_method: 'email',
      user_notification_preferences: 'email_sms',
      user_marketing_opt_in: 'true',
      user_data_sharing_consent: 'true',
      
      // === Session Attributes ===
      session_id: 'sess_' + Math.random().toString(36).substr(2, 12),
      session_start_time: new Date().toISOString(),
      session_page_views: '5',
      session_duration_seconds: '324',
      session_engagement_score: '78',
      session_is_bounce: 'false',
      session_entry_page: '/homepage',
      session_exit_page: '',
      session_events_count: '24',
      session_scroll_depth_max: '85',
      session_idle_time_seconds: '42',
      session_active_time_seconds: '282',
      session_interaction_count: '18',
      session_form_submissions: '0',
      session_video_plays: '1',
      session_downloads: '0',
      
      // === Platform/Device Attributes ===
      platform: journey.platform,
      platform_version: '2.4.1',
      platform_type: 'mobile_web',
      device_type: 'mobile',
      device_category: 'smartphone',
      device_model: 'iPhone 15 Pro',
      device_manufacturer: 'Apple',
      device_screen_size: '6.1',
      operating_system: 'iOS',
      operating_system_version: '17.2.1',
      browser_name: 'Safari',
      browser_version: '17.2',
      browser_engine: 'WebKit',
      browser_language: 'en-US',
      screen_resolution: '1170x2532',
      screen_pixel_density: '3',
      viewport_size: '390x844',
      viewport_orientation: 'portrait',
      color_depth: '24',
      
      // === Network/Connection ===
      connection_type: '5g',
      connection_speed: 'fast',
      connection_effective_type: '4g',
      connection_downlink: '10',
      connection_rtt: '50',
      connection_save_data: 'false',
      ip_address_hashed: 'a3f8e9b2c1d4567890abcdef12345678',
      isp_name: 'Verizon Wireless',
      
      // === Product Context ===
      product_id: 'IPHONE15PRO-256-TITAN',
      product_name: 'iPhone 15 Pro',
      product_sku: 'APL-IP15P-256-TIT',
      product_category: 'smartphones',
      product_subcategory: 'premium_phones',
      product_brand: 'Apple',
      product_model: 'iPhone 15 Pro',
      product_variant: 'Natural Titanium',
      product_color: 'Natural Titanium',
      product_storage: '256GB',
      product_price: '999.99',
      product_list_price: '1099.99',
      product_discount_amount: '100.00',
      product_discount_percentage: '9.09',
      product_currency: 'USD',
      product_availability: 'in_stock',
      product_stock_level: 'high',
      product_quantity: '1',
      product_list_position: '1',
      product_impression_id: 'imp_xyz789',
      product_rating: '4.7',
      product_review_count: '12847',
      product_is_new: 'true',
      product_release_date: '2023-09-22',
      
      // === Cart Context ===
      cart_id: 'cart_def456ghi',
      cart_total_items: '1',
      cart_unique_items: '1',
      cart_subtotal: '999.99',
      cart_total: '1079.98',
      cart_tax_amount: '79.99',
      cart_shipping_cost: '0.00',
      cart_discount_total: '100.00',
      cart_has_promotion: 'true',
      cart_promo_code: 'UPGRADE2026',
      cart_currency: 'USD',
      cart_created_date: new Date(Date.now() - 1800000).toISOString(),
      cart_last_modified: new Date(Date.now() - 60000).toISOString(),
      cart_is_gift: 'false',
      
      // === Order Context ===
      order_id: '',
      order_status: 'pending',
      order_type: 'online',
      order_payment_method: '',
      order_shipping_method: '',
      order_estimated_delivery: '',
      
      // === Marketing Attribution ===
      campaign_id: 'VZPROMO2026Q1',
      campaign_name: '5G Upgrade Promotion',
      campaign_source: 'email',
      campaign_medium: 'newsletter',
      campaign_term: '5g_upgrade',
      campaign_content: 'hero_banner',
      campaign_type: 'promotional',
      campaign_start_date: '2026-02-01',
      campaign_end_date: '2026-03-31',
      utm_source: 'email',
      utm_medium: 'newsletter',
      utm_campaign: 'feb_upgrade_promo',
      utm_term: '5g_iphone',
      utm_content: 'variant_a',
      
      // === A/B Testing ===
      ab_test_id: 'test_checkout_v2',
      ab_test_name: 'Checkout Flow Optimization',
      ab_test_variant: 'variant_b',
      ab_test_group: 'treatment',
      ab_test_start_date: '2026-02-01',
      
      // === Personalization ===
      personalization_id: 'pers_abc123',
      personalization_strategy: 'collaborative_filtering',
      personalization_confidence: '0.87',
      recommendation_algorithm: 'ml_personalization_v3',
      recommendation_model_version: 'v2.4.1',
      content_variant: 'premium_user',
      
      // === Performance Metrics ===
      performance_dom_load_time: '847',
      performance_window_load_time: '1247',
      performance_first_paint: '412',
      performance_first_contentful_paint: '587',
      performance_largest_contentful_paint: '923',
      performance_time_to_interactive: '1547',
      performance_first_input_delay: '23',
      performance_cumulative_layout_shift: '0.05',
      performance_page_size_kb: '2847',
      performance_resource_count: '47',
      performance_js_heap_size_mb: '42',
      performance_connection_time: '156',
      performance_server_response_time: '203',
      performance_render_time: '645',
      
      // === Geography ===
      geo_country: 'US',
      geo_country_name: 'United States',
      geo_region: 'CA',
      geo_region_name: 'California',
      geo_city: 'San Francisco',
      geo_postal_code: '94102',
      geo_metro_code: '807',
      geo_timezone: 'America/Los_Angeles',
      geo_timezone_offset: '-08:00',
      geo_coordinates: '37.7749,-122.4194',
      geo_accuracy: 'city',
      
      // === Business Context ===
      business_unit: 'consumer_wireless',
      business_line: 'mobility',
      revenue_stream: 'device_sales',
      cost_center: 'CC-4721',
      profit_center: 'PC-1205',
      service_tier: 'premium',
      customer_segment: 'high_value',
      market_segment: 'consumer',
      sales_channel: 'online',
      fulfillment_method: 'ship_to_home',
      
      // === Technical Context ===
      app_name: 'Verizon CX Portal',
      app_version: '2.4.1',
      app_build: '20260212.1',
      app_environment: 'production',
      api_version: 'v3',
      sdk_version: 'analytics-sdk-4.2.0',
      framework_name: 'React',
      framework_version: '18.2.0',
      
      // === Compliance/Privacy ===
      privacy_consent_given: 'true',
      privacy_consent_version: 'v2.1',
      privacy_consent_date: '2025-11-20',
      privacy_ccpa_opt_out: 'false',
      privacy_gdpr_applies: 'false',
      privacy_do_not_track: 'false',
      data_retention_days: '730',
      pii_included: 'false',
      data_classification: 'internal',
      
      // === Quality/Errors ===
      error_count: '0',
      warning_count: '0',
      console_error_count: '0',
      network_error_count: '0',
      validation_errors: 'none',
      data_quality_score: '98',
      data_completeness: '1.0',
      
      // === Integration IDs ===
      crm_customer_id: 'CRM-' + Math.random().toString(36).substr(2, 8),
      erp_order_id: '',
      payment_gateway: 'stripe',
      payment_gateway_version: '2023-10-16',
      inventory_system_id: 'INV-SYS-01',
      fulfillment_system_id: 'FULFILL-01',
      analytics_tool_version: 'GA4-2.1',
      tag_manager_version: 'GTM-v2.4',
      cdp_profile_id: 'CDP-' + Math.random().toString(36).substr(2, 10),
      
      // === Timestamps ===
      event_timestamp: new Date().toISOString(),
      event_timestamp_unix: Math.floor(Date.now() / 1000).toString(),
      client_timestamp: new Date().toISOString(),
      server_timestamp: new Date().toISOString(),
      ingestion_timestamp: new Date().toISOString(),
      
      // === Additional Context ===
      experiment_ids: 'exp_001,exp_042',
      feature_flags: 'new_checkout:true,quick_pay:false',
      custom_dimensions: '',
      custom_metrics: '',
      debug_mode: 'false',
      test_mode: 'false',
      sandbox_mode: 'false',
    };
  }, [activeStep, activeStepIdx, journey, steps.length]);

  // Enhanced VZDL Schema with metadata
  const dataLayerSchema = useMemo(() => {
    // Merge pageDataLayer with editableDataLayer, preferring editable values
    const mergedData = { ...pageDataLayer, ...editableDataLayer };
    
    const schema: Array<{
      key: string;
      value: string;
      source: 'AI' | 'Jira' | 'Rule' | 'BA';
      scope: 'Standard' | 'Page-specific';
      required: boolean;
      editable: boolean;
    }> = [
      { key: 'page_name', value: mergedData.page_name || '', source: 'Rule', scope: 'Standard', required: true, editable: false },
      { key: 'page_url', value: mergedData.page_url || '', source: 'Rule', scope: 'Standard', required: true, editable: false },
      { key: 'page_category', value: mergedData.page_category || '', source: 'AI', scope: 'Standard', required: true, editable: true },
      { key: 'journey_name', value: mergedData.journey_name || '', source: 'Jira', scope: 'Standard', required: true, editable: false },
      { key: 'journey_stage', value: mergedData.journey_stage || '', source: 'AI', scope: 'Page-specific', required: false, editable: true },
      { key: 'platform', value: mergedData.platform || '', source: 'Jira', scope: 'Standard', required: true, editable: false },
      { key: 'step_number', value: mergedData.step_number || '', source: 'Rule', scope: 'Standard', required: true, editable: false },
      { key: 'step_total', value: mergedData.step_total || '', source: 'Rule', scope: 'Standard', required: true, editable: false },
    ];

    // Add any custom page-specific keys from editable layer
    Object.entries(editableDataLayer).forEach(([key, value]) => {
      if (!schema.find(s => s.key === key)) {
        schema.push({
          key,
          value: value || '',
          source: 'BA',
          scope: 'Page-specific',
          required: false,
          editable: true
        });
      }
    });

    return schema;
  }, [pageDataLayer, editableDataLayer]);

  // System events (non-user-triggered)
  const systemEvents = useMemo(() => {
    if (!activeStep) return [];
    const s = activeStep.stepName.toLowerCase();
    const stepTemplate = activeStep.screenTemplate || '';
    
    // Generate contextual system events based on step type
    const events: Array<{ event_name: string; event_type: string; dataLayer: Record<string, string> }> = [];
    
    // Always fire page load event
    events.push({
      event_name: 'Page Load',
      event_type: 'system',
      dataLayer: {
        event_type: 'page_view',
        timestamp: 'auto',
        session_id: 'session_xyz123',
        load_time_ms: '1247',
        render_complete: 'true',
      }
    });

    // Landing/Promotion pages
    if (s.includes('promotion') || s.includes('landing') || s.includes('homepage') || stepTemplate === 'landing') {
      events.push({
        event_name: 'Banner Displayed',
        event_type: 'system',
        dataLayer: {
          banner_type: 'promotional',
          banner_position: 'hero',
          banner_content: '5G Upgrade Special Offer',
          visibility_threshold: '50%',
          impression_id: 'bnr_' + Math.random().toString(36).substr(2, 9),
        }
      });
      
      events.push({
        event_name: 'Promo Impression',
        event_type: 'system',
        dataLayer: {
          promo_id: 'VZPROMO2026Q1',
          promo_name: 'Premium Device Upgrade',
          promo_creative: 'hero_banner_v2',
          promo_position: 'above_fold',
        }
      });
    }

    // Product/Device selection pages
    if (s.includes('device') || s.includes('product') || s.includes('selection') || s.includes('config')) {
      events.push({
        event_name: 'Product Recommendation',
        dataLayer: {
          recommendation_engine: 'ml_personalization_v3',
          product_count: '4',
          algorithm_version: 'v2.4.1',
          model_confidence: '0.94',
          personalization_segment: 'high_value_customer',
        }
      });
      
      events.push({
        event_name: 'Dynamic Pricing Loaded',
        dataLayer: {
          pricing_engine: 'real_time_pricing',
          discount_applied: 'true',
          discount_type: 'loyalty_tier_3',
          price_tier: 'premium',
        }
      });
      
      events.push({
        event_name: 'Inventory Check',
        dataLayer: {
          check_type: 'real_time',
          availability_status: 'in_stock',
          warehouse_location: 'regional_hub_east',
          stock_level: 'high',
        }
      });
    }

    // Configuration/Form pages
    if (stepTemplate === 'config' || s.includes('configuration') || s.includes('customize')) {
      events.push({
        event_name: 'Form Auto-Fill Detected',
        dataLayer: {
          autofill_source: 'browser',
          fields_populated: '3',
          autofill_success: 'true',
        }
      });
      
      events.push({
        event_name: 'Validation Rules Loaded',
        dataLayer: {
          validation_engine: 'client_side',
          rules_count: '12',
          rules_version: 'v1.8.2',
        }
      });
    }

    // Form/Input pages
    if (stepTemplate === 'form' || s.includes('form') || s.includes('sign') || s.includes('login') || s.includes('auth')) {
      events.push({
        event_name: 'Security Check Initialized',
        dataLayer: {
          security_level: 'mfa_required',
          auth_method: '2fa_sms',
          session_encrypted: 'true',
          token_refresh: 'auto',
        }
      });
      
      events.push({
        event_name: 'Password Strength Validator',
        dataLayer: {
          validator_version: 'v2.1',
          complexity_required: 'high',
          pattern_check: 'enabled',
        }
      });
      
      events.push({
        event_name: 'CAPTCHA Challenge',
        dataLayer: {
          captcha_type: 'recaptcha_v3',
          risk_score: '0.1',
          challenge_required: 'false',
        }
      });
    }

    // Cart/Checkout/Review pages
    if (s.includes('cart') || s.includes('checkout') || s.includes('review') || stepTemplate === 'review') {
      events.push({
        event_name: 'Cart Timer Started',
        dataLayer: {
          timer_duration: '900',
          timer_type: 'session_expiry',
          warning_threshold: '120',
          auto_save: 'enabled',
        }
      });
      
      events.push({
        event_name: 'Fraud Detection Scan',
        dataLayer: {
          fraud_engine: 'ml_risk_assessment',
          risk_level: 'low',
          scan_duration_ms: '284',
          fraud_score: '0.03',
        }
      });
      
      events.push({
        event_name: 'Payment Gateway Ready',
        dataLayer: {
          gateway_provider: 'stripe',
          gateway_version: 'v3.2',
          encryption_level: 'pci_dss_compliant',
          tokenization: 'enabled',
        }
      });
      
      events.push({
        event_name: 'Order Summary Calculated',
        dataLayer: {
          calculation_engine: 'tax_service_v2',
          tax_calculated: 'true',
          shipping_calculated: 'true',
          discounts_applied: 'true',
        }
      });
    }

    // Success/Confirmation pages
    if (stepTemplate === 'success' || s.includes('success') || s.includes('confirm') || s.includes('complete')) {
      events.push({
        event_name: 'Order Confirmation Sent',
        dataLayer: {
          confirmation_method: 'email_sms',
          email_sent: 'true',
          sms_sent: 'true',
          receipt_generated: 'true',
        }
      });
      
      events.push({
        event_name: 'Analytics Event Queued',
        dataLayer: {
          queue_type: 'conversion_tracking',
          event_count: '8',
          sync_status: 'pending',
        }
      });
      
      events.push({
        event_name: 'CRM Update Triggered',
        dataLayer: {
          crm_system: 'salesforce',
          update_type: 'customer_transaction',
          sync_method: 'real_time_api',
        }
      });
    }

    // API Integration events (for any step)
    if (Math.random() > 0.5) {
      events.push({
        event_name: 'API Call Success',
        dataLayer: {
          api_endpoint: '/api/v2/customer/profile',
          response_time_ms: '342',
          status_code: '200',
          cache_hit: 'false',
        }
      });
    }

    // Error handling (occasionally)
    if (s.includes('form') || s.includes('input') || s.includes('validation')) {
      events.push({
        event_name: 'Error Handler Ready',
        dataLayer: {
          error_tracking: 'enabled',
          error_service: 'sentry',
          error_threshold: 'medium',
          auto_report: 'true',
        }
      });
    }

    // Accessibility events
    events.push({
      event_name: 'Accessibility Tools Detected',
      dataLayer: {
        screen_reader: 'false',
        high_contrast: 'false',
        keyboard_navigation: 'false',
        aria_labels: 'enabled',
      }
    });

    // Session management
    if (stepTemplate !== 'success') {
      events.push({
        event_name: 'Session Heartbeat',
        dataLayer: {
          session_active: 'true',
          idle_time_seconds: '0',
          session_duration_seconds: '124',
          auto_logout_threshold: '1800',
        }
      });
    }

    return events;
  }, [activeStep, pageDataLayer]);

  // AI Input Sources (mock data showing what was used for analysis)
  const aiInputSources = useMemo(() => {
    if (!journey) return [];
    
    const sources = [];
    
    // Check if journey has Jira context
    if (journey.jiraContext) {
      sources.push({
        id: 'jira-1',
        type: 'Jira Ticket',
        title: journey.jiraContext.title,
        subtitle: journey.jiraContext.ticketId,
        date: '2026-02-08',
        addedBy: 'System',
        isAutomatic: true,
        icon: 'Clipboard',
        preview: journey.jiraContext.description,
        metadata: {
          acceptanceCriteria: journey.jiraContext.acceptanceCriteria,
          reference: journey.jiraContext.reference
        }
      });
    }
    
    // Mock BA-added sources
    if (journey.journeyName.toLowerCase().includes('premium') || journey.journeyName.toLowerCase().includes('upgrade')) {
      sources.push({
        id: 'meeting-1',
        type: 'Meeting Notes',
        title: 'Stakeholder Alignment Meeting',
        subtitle: 'Premium Upgrade Strategy Session',
        date: '2026-02-05',
        addedBy: 'Abhinav Saxena',
        isAutomatic: false,
        icon: 'FileText',
        preview: 'Key discussion points:\n- Primary goal: Reduce checkout abandonment by 15%\n- Target audience: Existing customers with devices >2 years old\n- Must support legacy Safari browsers\n- Integration with existing trade-in flow required\n- Analytics team needs real-time conversion tracking',
        metadata: {
          attendees: ['Sarah Chen', 'Mike Rodriguez', 'Abhinav Saxena'],
          duration: '45 minutes'
        }
      });
      
      sources.push({
        id: 'transcript-1',
        type: 'Meeting Transcript',
        title: 'GTS Planning Session Recording',
        subtitle: 'Feb 3, 2026 - 2:30 PM EST',
        date: '2026-02-03',
        addedBy: 'System',
        isAutomatic: true,
        icon: 'Video',
        preview: '[Sarah Chen]: "We need to ensure the upgrade flow doesn\'t disrupt existing cart behavior. The data layer should capture device type and trade-in eligibility at entry."\\n\\n[Mike Rodriguez]: "Agreed. Let\'s also track cart timer events - we lost 8% conversion last quarter due to session expiry."\\n\\n[Abhinav Saxena]: "I\'ll document all interaction points for the tagging spec. We should align on naming conventions before dev handoff."',
        metadata: {
          duration: '52 minutes',
          format: 'Zoom Recording'
        }
      });
      
      sources.push({
        id: 'slack-1',
        type: 'Slack Thread',
        title: '#cx-analytics - Trade-in Flow Discussion',
        subtitle: '18 messages, 4 participants',
        date: '2026-02-04',
        addedBy: 'Abhinav Saxena',
        isAutomatic: false,
        icon: 'MessageSquare',
        preview: '@sarah.chen: The trade-in eligibility check needs to fire before cart addition\\n@mike.rodriguez: Should we track partial completions?\\n@abhinav.saxena: Yes - let\'s add a "trade_in_started" event\\n@analytics-team: +1, we need funnel visibility',
        metadata: {
          channel: '#cx-analytics',
          participants: 4
        }
      });
      
      sources.push({
        id: 'doc-1',
        type: 'Documentation',
        title: 'Product Requirements Document v3.2',
        subtitle: 'Confluence',
        date: '2026-02-03',
        addedBy: 'Abhinav Saxena',
        isAutomatic: false,
        icon: 'FileType',
        preview: null,
        externalLink: 'https://confluence.verizon.com/product/premium-upgrade-prd',
        metadata: {
          lastModified: '2026-02-03',
          owner: 'Product Team'
        }
      });
      
      sources.push({
        id: 'ba-notes-1',
        type: 'BA Notes',
        title: 'Implementation Considerations',
        subtitle: 'Added by BA during review',
        date: '2026-02-06',
        addedBy: 'Abhinav Saxena',
        isAutomatic: false,
        icon: 'Clipboard',
        preview: 'Important implementation notes:\\n\\n1. Legacy Safari support is critical - avoid modern JS features\\n2. Trade-in integration must complete before checkout\\n3. Analytics team needs real-time conversion tracking\\n4. Contact Sarah Chen (Product Lead) for edge case questions\\n5. Reference existing cart timer logic from Q4 2025 implementation',
        metadata: {
          lastUpdated: '2026-02-07',
          category: 'Implementation'
        }
      });
    }
    
    return sources;
  }, [journey]);

  const handleToggleApproval = (tagId: string) => {
    setSteps(prevSteps => prevSteps.map(step => ({
      ...step,
      components: step.components?.map(tag => 
        tag.componentId === tagId 
          ? { ...tag, approvalState: tag.approvalState === 'Approved' ? 'Proposed' : 'Approved' } 
          : tag
      )
    })));
  };

  const handleDeclineTag = (tagId: string) => {
    // Find the tag to reject
    const tag = steps.flatMap(s => s.components || []).find(t => t.componentId === tagId);
    if (tag && tag.approvalState !== 'Rejected') {
      // Open rejection modal
      setTagToReject(tag);
      setIsRejectionModalOpen(true);
    } else if (tag && tag.approvalState === 'Rejected') {
      // Toggle back to Proposed if already rejected
      setSteps(prevSteps => prevSteps.map(step => ({
        ...step,
        components: step.components?.map(t => 
          t.componentId === tagId 
            ? { ...t, approvalState: 'Proposed', rejectionReason: undefined, rejectionContext: undefined, rejectionScope: undefined } 
            : t
        )
      })));
    }
  };

  const handleRejectionSubmit = (reason: string, additionalContext: string, scope: 'local' | 'global') => {
    if (!tagToReject) return;
    
    // Get rejection reason label
    const reasonLabel = REJECTION_REASONS_MAP[reason] || reason;
    
    // Update tag with rejection metadata
    setSteps(prevSteps => prevSteps.map(step => ({
      ...step,
      components: step.components?.map(tag => 
        tag.componentId === tagToReject.componentId 
          ? { 
              ...tag, 
              approvalState: 'Rejected',
              rejectionReason: reason,
              rejectionReasonLabel: reasonLabel,
              rejectionContext: additionalContext,
              rejectionScope: scope,
              rejectionDate: new Date().toISOString()
            } 
          : tag
      )
    })));
    
    toast.success('Feedback submitted to AI', {
      description: scope === 'global' ? 'AI will learn from this for future recommendations' : 'Applied to this journey only'
    });
    
    // Reset modal state
    setIsRejectionModalOpen(false);
    setTagToReject(null);
  };

  const handleAcceptAll = () => {
    const filteredIds = new Set(filteredTags.map(t => t.componentId));
    setSteps(prevSteps => prevSteps.map((step, idx) => 
      idx === activeStepIdx 
        ? { 
            ...step, 
            components: step.components?.map(tag => 
              filteredIds.has(tag.componentId) ? { ...tag, approvalState: 'Approved' } : tag
            ) 
          }
        : step
    ));
  };

  const handleDeclineAll = () => {
    const filteredIds = new Set(filteredTags.map(t => t.componentId));
    setSteps(prevSteps => prevSteps.map((step, idx) => 
      idx === activeStepIdx 
        ? { 
            ...step, 
            components: step.components?.map(tag => 
              filteredIds.has(tag.componentId) ? { ...tag, approvalState: 'Rejected' } : tag
            ) 
          }
        : step
    ));
  };

  const handleApproveAllStages = () => {
    // Count total tags that will be approved
    const totalTags = steps.reduce((acc, step) => 
      acc + (step.components?.filter(tag => tag.approvalState === 'Proposed').length || 0), 0
    );
    
    // Approve all proposed tags across all stages
    setSteps(prevSteps => prevSteps.map(step => ({
      ...step,
      components: step.components?.map(tag => 
        tag.approvalState === 'Proposed' ? { ...tag, approvalState: 'Approved' } : tag
      )
    })));
    
    toast.success('All recommendations approved', {
      description: `${totalTags} tags approved across all ${steps.length} journey stages`
    });
  };

  const handleUpdateTag = (tagId: string, newValue: string, metadata?: any) => {
    setSteps(prevSteps => prevSteps.map(step => ({
      ...step,
      components: step.components?.map(tag => 
        tag.componentId === tagId 
          ? { 
              ...tag, 
              aiRecommendedTag: newValue,
              isModified: true,
              ...(metadata || {})
            } 
          : tag
      )
    })));
  };

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

  const handleMarkerClick = (tagId: string) => {
    if (activeTagId === tagId) {
      setActiveTagId(null);
      return;
    }
    setActiveTagId(tagId);
    // Auto-switch to User Interactions tab when selecting a component
    setActiveTab('userInteractions');
    if (!isRightPanelCollapsed) {
      const card = tagRefs.current[tagId];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Manual tagging handlers
  const handleEnableTaggingMode = () => {
    setIsTaggingMode(true);
    toast.info('Tagging mode enabled', {
      description: 'Click anywhere on the screen to add a tag',
      duration: 3000,
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only process if in tagging mode
    if (!isTaggingMode) return;
    
    // Don't tag if clicking on existing buttons/markers (except the overlay itself)
    const target = e.target as HTMLElement;
    if (target.closest('button') && !target.closest('.tagging-overlay')) return;
    
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    console.log('Tag position clicked:', { x, y, rect, clientX: e.clientX, clientY: e.clientY });
    
    // Save position and open modal
    setSavedTagPosition({ x, y });
    // Generate mock element based on position
    const mockElement = `<button id="cta_${Math.floor(x)}_${Math.floor(y)}" class="primary-btn" />`;
    setSelectedElement(mockElement);
    setIsAddTagModalOpen(true);
    setIsTaggingMode(false);
  };

  const handleAddTag = () => {
    // Save position before clearing context menu
    if (contextMenuPosition) {
      setSavedTagPosition(contextMenuPosition);
      // Generate mock element
      const mockElement = `<div id="element_${Math.floor(contextMenuPosition.x)}_${Math.floor(contextMenuPosition.y)}" class="interactive-component" />`;
      setSelectedElement(mockElement);
    }
    setIsAddTagModalOpen(true);
    setContextMenuPosition(null);
  };

  const handleSaveManualTag = () => {
    console.log('Saving manual tag:', { newTagData, savedTagPosition });
    if (!newTagData.name.trim() || !savedTagPosition) {
      console.log('Validation failed:', { hasName: !!newTagData.name.trim(), hasPosition: !!savedTagPosition });
      return;
    }
    
    const newTag = {
      id: `manual-${Date.now()}`,
      name: newTagData.name,
      position: savedTagPosition,
      event: newTagData.event,
      level: newTagData.level,
      source: 'manual' as const,
      timestamp: new Date().toISOString()
    };
    
    setManualTags(prev => [...prev, newTag]);
    
    // Log as AI feedback
    toast.success('Manual tag added successfully', {
      description: 'Feedback logged for AI learning improvement',
      duration: 4000,
    });
    
    // Reset form and clear saved position
    setNewTagData({ name: '', event: 'click', level: 'component' });
    setSavedTagPosition(null);
    setSelectedElement('');
    setIsAddTagModalOpen(false);
  };

  const handleRemoveManualTag = (tagId: string) => {
    setManualTags(prev => prev.filter(t => t.id !== tagId));
    toast.info('Manual tag removed');
  };

  if (loading) return (
    <LoadingScreen 
      onComplete={handleLoadingComplete} 
    />
  );
  if (!journey) return null;

  const isReviewType = journey.sourceType === 'Figma' || journey.sourceType === 'Jira';

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-white">
      
      {/* Rejection Reason Modal */}
      {tagToReject && (
        <RejectionReasonModal
          isOpen={isRejectionModalOpen}
          onClose={() => {
            setIsRejectionModalOpen(false);
            setTagToReject(null);
          }}
          onSubmit={handleRejectionSubmit}
          recommendationType={
            tagToReject.componentType === 'Button' || tagToReject.componentType === 'CTA' || tagToReject.componentType === 'Link'
              ? 'User Interaction'
              : tagToReject.componentType === 'Form Field' || tagToReject.componentType === 'Input'
              ? 'System Event'
              : 'Data Layer Variable'
          }
          recommendationName={tagToReject.aiRecommendedTag}
        />
      )}

      {/* Add Manual Tag Modal */}
      {isAddTagModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setIsAddTagModalOpen(false);
            setSavedTagPosition(null);
            setIsTaggingMode(false);
            setSelectedElement('');
            setNewTagData({ name: '', event: 'click', level: 'component' });
          }} />
          <div className="relative bg-white border-2 border-border rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 border-2 border-purple-200 flex items-center justify-center">
                  <Plus size={20} className="text-purple-600" />
                </div>
                <h2 className="text-[20px] font-bold text-foreground">Add Manual Tag</h2>
              </div>
              <button onClick={() => {
                setIsAddTagModalOpen(false);
                setSavedTagPosition(null);
                setIsTaggingMode(false);
                setSelectedElement('');
                setNewTagData({ name: '', event: 'click', level: 'component' });
              }} className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <Info size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <p className="text-[13px] text-purple-800 leading-relaxed">
                  Manual tags help train AI for better future recommendations. This feedback will be logged for continuous improvement.
                </p>
              </div>
              
              {/* Selected Element Display */}
              {selectedElement && (
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                    <Layout size={14} className="text-blue-600" />
                    Selected Element
                  </label>
                  <div className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-[12px] text-zinc-700 overflow-x-auto whitespace-nowrap">
                    {selectedElement}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    This is the UI element you clicked to add a tag
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-foreground">
                  Tag Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTagData.name}
                  onChange={(e) => setNewTagData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Promo Landing Header"
                  className="px-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-foreground">Event Type</label>
                  <select
                    value={newTagData.event}
                    onChange={(e) => setNewTagData(prev => ({ ...prev, event: e.target.value }))}
                    className="px-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    <option value="click">Click</option>
                    <option value="view">View</option>
                    <option value="submit">Submit</option>
                    <option value="change">Change</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-foreground">Level</label>
                  <select
                    value={newTagData.level}
                    onChange={(e) => setNewTagData(prev => ({ ...prev, level: e.target.value }))}
                    className="px-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    <option value="component">Component</option>
                    <option value="page">Page</option>
                    <option value="section">Section</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setIsAddTagModalOpen(false);
                  setSavedTagPosition(null);
                  setIsTaggingMode(false);
                  setSelectedElement('');
                  setNewTagData({ name: '', event: 'click', level: 'component' });
                }}
                className="px-5 py-2.5 bg-card border-2 border-border text-foreground rounded-xl text-[13px] font-bold hover:bg-surface-secondary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveManualTag}
                disabled={!newTagData.name.trim()}
                className={clsx(
                  "px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center gap-2",
                  newTagData.name.trim()
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-surface-secondary text-muted-foreground cursor-not-allowed opacity-50"
                )}
              >
                <CheckCircle2 size={16} />
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 1. Reorganized Journey Details Strip */}
      <div className="bg-white border-b border-zinc-100 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-10 py-4 bg-zinc-50/30">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3 text-zinc-400">
                <Target size={18} className="text-zinc-500" />
                <span className="text-[12px] font-black uppercase tracking-widest">Journey Context</span>
             </div>
             {!isDetailsExpanded && (
                <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                   <div className="flex items-center gap-3">
                      <span className="text-[14px] font-black text-zinc-900 line-clamp-1 max-w-[450px]">
                        {journey.autoGeneratedGoal}
                      </span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="h-4 w-[1px] bg-zinc-200" />
                      <div className="flex items-center gap-2">
                        <StatusBadge status="success" label={`${journey.platform} Optimization`} />
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock size={14} />
                        <span className="text-[12px] font-bold">Sync Health: 94%</span>
                      </div>
                   </div>
                </div>
             )}
          </div>
          <button 
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="flex items-center gap-2.5 px-4 py-2 bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl text-[12px] font-black text-zinc-900 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {isDetailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isDetailsExpanded ? 'Hide Details' : 'Show Details'}
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
              <div className="px-10 py-10 grid grid-cols-12 gap-12 bg-white items-start">
                {/* Column 1: Strategy & Technical DNA (7 cols) */}
                <div className="col-span-7 flex flex-col gap-10">
                   {/* Measurement Goal Section */}
                   <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-zinc-400">
                         <Target size={16} className="text-zinc-500" />
                         <span className="text-[11px] font-black uppercase tracking-widest">Measurement Goal</span>
                      </div>
                      <div className="relative group min-h-[60px]">
                        {isEditingGoal ? (
                          <div className="flex flex-col gap-3">
                            <textarea
                              autoFocus
                              value={editableGoal}
                              onChange={(e) => setEditableGoal(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  setIsEditingGoal(false);
                                }
                                if (e.key === 'Escape') {
                                  setEditableGoal(journey.autoGeneratedGoal);
                                  setIsEditingGoal(false);
                                }
                              }}
                              className="w-full text-[20px] font-black text-zinc-900 leading-tight tracking-tight bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all resize-none min-h-[100px]"
                            />
                            <div className="flex items-center gap-2 self-end">
                              <button 
                                onClick={() => {
                                  setEditableGoal(journey.autoGeneratedGoal);
                                  setIsEditingGoal(false);
                                }}
                                className="px-3 py-1.5 text-[11px] font-black uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => setIsEditingGoal(false)}
                                className="px-4 py-1.5 bg-zinc-900 text-white text-[11px] font-black uppercase rounded-lg shadow-lg shadow-zinc-900/10 hover:bg-black transition-all"
                              >
                                Save Goal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-[20px] font-black text-zinc-900 leading-tight tracking-tight pr-8">
                              {editableGoal}
                            </p>
                            <button 
                              onClick={() => setIsEditingGoal(true)}
                              className="absolute top-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-100 rounded-lg cursor-pointer"
                            >
                               <Edit3 size={16} className="text-zinc-400" />
                            </button>
                          </>
                        )}
                      </div>
                   </div>

                   {/* Strategic Metrics (Confidence & Sync) */}
                   <div className="flex items-center gap-10">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-zinc-400">
                           <ShieldCheck size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">AI Confidence</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-[28px] font-black text-zinc-900 leading-none">94%</span>
                           <span className="text-[10px] font-bold text-emerald-500 uppercase">High Accuracy</span>
                        </div>
                      </div>
                      <div className="h-10 w-[1px] bg-zinc-100" />
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-zinc-400">
                           <CheckCircle2 size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Code Signing</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-[28px] font-black text-emerald-600 leading-none">Live</span>
                           <span className="text-[10px] font-bold text-zinc-400 uppercase">Authenticated</span>
                        </div>
                      </div>
                   </div>

                   {/* Technical DNA Grid (Appears below Strategy) */}
                   <div className="flex flex-col gap-6 pt-8 border-t border-zinc-50">
                      <div className="flex items-center gap-2 text-zinc-400">
                         <Layers size={16} className="text-zinc-500" />
                         <span className="text-[11px] font-black uppercase tracking-widest">Technical DNA</span>
                      </div>
                      <div className="grid grid-cols-4 gap-6">
                         <div className="flex flex-col gap-2 p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                            <div className="flex items-center gap-2 text-zinc-400">
                               <Smartphone size={12} />
                               <span className="text-[10px] font-black uppercase tracking-tight">Platform</span>
                            </div>
                            <span className="text-[13px] font-black text-zinc-900">{journey.platform}</span>
                         </div>
                         <div className="flex flex-col gap-2 p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                            <div className="flex items-center gap-2 text-zinc-400">
                               <Zap size={12} />
                               <span className="text-[10px] font-black uppercase tracking-tight">Focus</span>
                            </div>
                            <span className="text-[13px] font-black text-zinc-900">{journey.trackingFocus}</span>
                         </div>
                         <div className="flex flex-col gap-2 p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                            <div className="flex items-center gap-2 text-zinc-400">
                               <Database size={12} />
                               <span className="text-[10px] font-black uppercase tracking-tight">Schema</span>
                            </div>
                            <span className="text-[13px] font-black text-zinc-900">VSDS v4.2</span>
                         </div>
                         <div className="flex flex-col gap-2 p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                            <div className="flex items-center gap-2 text-zinc-400">
                               <Link2 size={12} />
                               <span className="text-[10px] font-black uppercase tracking-tight">Source</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                               <span className="text-[13px] font-black text-zinc-900 truncate">{journey.source}</span>
                               <ExternalLink size={12} className="text-zinc-300" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 2: Operational context (5 cols) */}
                <div className="col-span-5 border-l border-zinc-100 pl-12">
                   {isReviewType && journey.jiraContext ? (
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-4">
                         <div className="flex items-center gap-2 text-zinc-400">
                            <ClipboardList size={18} className="text-zinc-500" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Jira Context</span>
                         </div>
                         <div className="flex flex-col bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100">
                            <h3 className="text-[16px] font-black text-zinc-900 leading-tight">
                               {journey.jiraContext.ticketId}: {journey.jiraContext.title}
                            </h3>
                            <p className="text-[14px] font-bold text-zinc-500 mt-3">
                               {journey.jiraContext.description}
                            </p>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Acceptance Criteria</span>
                         <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto no-scrollbar pr-2">
                            {journey.jiraContext.acceptanceCriteria.map((item, idx) => (
                               <div key={idx} className="flex items-start gap-4 px-1 group">
                                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0 group-hover:bg-zinc-900 transition-colors" />
                                  <span className="text-[14px] font-bold text-zinc-700 leading-relaxed">{item}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                       <div className="flex items-center gap-2 text-zinc-400">
                          <Database size={18} className="text-zinc-500" />
                          <span className="text-[11px] font-black uppercase tracking-widest">System Health</span>
                       </div>
                       <div className="flex items-center gap-5 p-8 bg-zinc-50 rounded-[40px] border border-zinc-100">
                          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-zinc-50">
                             <CheckCircle2 size={32} />
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[18px] font-black text-zinc-900">Live Production Sync</span>
                             <span className="text-[14px] font-bold text-zinc-500">Last successful sync: 2 hours ago</span>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Sources Banner */}
      {aiInputSources.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-y border-indigo-200 dark:border-indigo-800 px-10 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                  AI-Generated Recommendations
                </h3>
                <div className="px-2 py-0.5 bg-indigo-200 dark:bg-indigo-800 rounded-md text-[9px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest">
                  {aiInputSources.length} {aiInputSources.length === 1 ? 'Source' : 'Sources'} Used
                </div>
              </div>
              <p className="text-[12px] text-indigo-700 dark:text-indigo-300 font-medium">
                Analysis based on {aiInputSources.length} sources: Jira requirements, meeting transcripts, Slack discussions, and BA-provided documentation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAISourcesOpen(!isAISourcesOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-indigo-900/40 border-2 border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl text-[12px] font-black text-indigo-900 dark:text-indigo-200 transition-all cursor-pointer shadow-sm"
          >
            <Eye size={14} />
            {isAISourcesOpen ? 'Hide' : 'View'} Input Sources
            <ChevronDown size={14} className={clsx("transition-transform", isAISourcesOpen && "rotate-180")} />
          </button>
        </div>
      )}

      {/* AI Sources Expandable Panel */}
      <AnimatePresence>
        {isAISourcesOpen && aiInputSources.length > 0 && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-b border-zinc-200 overflow-hidden"
          >
            <div className="px-10 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[1400px]">
                {aiInputSources.map((source) => {
                  const IconComponent = source.icon === 'Clipboard' ? Clipboard 
                    : source.icon === 'FileText' ? FileText 
                    : source.icon === 'MessageSquare' ? MessageSquare
                    : source.icon === 'Video' ? Video
                    : source.icon === 'Mic' ? Mic
                    : source.icon === 'FileType' ? FileType
                    : Link2;
                  
                  return (
                    <div
                      key={source.id}
                      className="flex flex-col gap-3 p-5 bg-zinc-50 dark:bg-zinc-900/20 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-10 h-10 rounded-lg flex items-center justify-center border-2",
                            source.isAutomatic 
                              ? "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                              : "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                          )}>
                            <IconComponent size={18} className={source.isAutomatic ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{source.type}</span>
                              {source.isAutomatic ? (
                                <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-md text-[8px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest flex items-center gap-1">
                                  <Bot size={9} />
                                  Auto
                                </div>
                              ) : (
                                <div className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-md text-[8px] font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest flex items-center gap-1">
                                  <User size={9} />
                                  Manual
                                </div>
                              )}
                            </div>
                            <h4 className="text-[14px] font-bold text-foreground">{source.title}</h4>
                            {source.subtitle && (
                              <p className="text-[12px] text-muted-foreground">{source.subtitle}</p>
                            )}
                          </div>
                        </div>
                        {source.preview ? (
                          <button
                            onClick={() => setSelectedSource(source)}
                            className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-lg text-[11px] font-bold text-foreground transition-all flex items-center gap-1.5"
                          >
                            <Eye size={12} />
                            Preview
                          </button>
                        ) : source.externalLink ? (
                          <a
                            href={source.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-lg text-[11px] font-bold text-foreground transition-all flex items-center gap-1.5"
                          >
                            <ExternalLink size={12} />
                            Open
                          </a>
                        ) : null}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Calendar size={11} />
                          <span>{new Date(source.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <User size={11} />
                          <span>Added by {source.addedBy}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* AI Learning Signals Panel */}
      {steps.flatMap(s => s.components || []).some(t => t.approvalState === 'Approved' || t.approvalState === 'Rejected') && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-y border-purple-200 dark:border-purple-800 px-10 py-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Brain size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-black text-purple-900 dark:text-purple-200 uppercase tracking-wider mb-1">
                AI Learning Signals
              </h3>
              <div className="flex items-center gap-4 text-[12px] font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                    {steps.flatMap(s => s.components || []).filter(t => t.approvalState === 'Approved').length}
                  </span>
                  <span className="text-purple-700 dark:text-purple-300">recommendations accepted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <X size={14} className="text-red-600" />
                  <span className="text-red-700 dark:text-red-300 font-bold">
                    {steps.flatMap(s => s.components || []).filter(t => t.approvalState === 'Rejected').length}
                  </span>
                  <span className="text-purple-700 dark:text-purple-300">rejected with feedback</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Edit3 size={14} className="text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300 font-bold">
                    {steps.flatMap(s => s.components || []).filter(t => (t as any).isModified).length}
                  </span>
                  <span className="text-purple-700 dark:text-purple-300">modified manually</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-white/80 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 rounded-lg">
              <span className="text-[10px] font-black text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                Transparency
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Source Preview Modal */}
      <AnimatePresence>
        {selectedSource && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setSelectedSource(null)}
            />
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
            >
              <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-[800px] w-full max-h-[80vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-10 h-10 rounded-lg flex items-center justify-center border-2",
                      selectedSource.isAutomatic 
                        ? "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                        : "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                    )}>
                      {selectedSource.icon === 'Clipboard' ? <Clipboard size={18} className={selectedSource.isAutomatic ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"} /> : <FileText size={18} className={selectedSource.isAutomatic ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"} />}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-foreground">{selectedSource.title}</h3>
                      <p className="text-[12px] text-muted-foreground">{selectedSource.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSource(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-[13px] text-foreground leading-relaxed font-normal bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      {selectedSource.preview}
                    </pre>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} />
                      <span>{new Date(selectedSource.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={11} />
                      <span>{selectedSource.addedBy}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSource(null)}
                    className="px-4 py-2 bg-foreground text-background rounded-xl text-[13px] font-bold hover:bg-black dark:hover:bg-zinc-800 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Main Three-Column Interaction Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Column 1: Journey Stages (Left, Sticky) */}
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
                  "p-2.5 rounded-xl transition-all cursor-pointer hover:bg-zinc-100 text-zinc-500",
                  isLeftPanelCollapsed ? "mx-auto" : ""
                )}
                title={isLeftPanelCollapsed ? "Expand Stages" : "Collapse Stages"}
              >
                {isLeftPanelCollapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
              </button>
           </div>
           <div className={clsx(
             "flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3",
             isLeftPanelCollapsed ? "p-4 items-center" : "p-6"
           )}>
              {steps.map((step, idx) => {
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

        {/* Column 2: Analysis Canvas (Center, Scrollable) */}
        <div className="flex-1 bg-zinc-100 relative overflow-hidden flex flex-col" ref={canvasContainerRef}>
           {/* Tagging Control Bar - Above Device Frame */}
           <div className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                 <div className={clsx(
                   "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                   isTaggingMode ? "bg-accent shadow-lg shadow-accent/30" : "bg-zinc-100"
                 )}>
                   <Plus size={16} className={clsx(
                     "transition-colors",
                     isTaggingMode ? "text-white" : "text-zinc-500"
                   )} strokeWidth={3} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[11px] font-bold text-zinc-900">Manual Tagging</span>
                   <span className="text-[10px] text-zinc-500">Click element to add custom tag</span>
                 </div>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               {isTaggingMode && (
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                   <span className="text-[11px] font-bold text-zinc-700">Tagging Mode Active</span>
                 </div>
               )}
               
               <button
                 onClick={() => {
                   setIsTaggingMode(!isTaggingMode);
                   if (!isTaggingMode) {
                     toast.success('Tagging mode enabled', {
                       description: 'Click any element on the preview to add a tag',
                       duration: 3000
                     });
                   } else {
                     toast.info('Tagging mode disabled');
                   }
                 }}
                 className={clsx(
                   "px-4 py-2 rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-2",
                   isTaggingMode
                     ? "bg-zinc-900 text-white hover:bg-black"
                     : "bg-white border-2 border-border hover:border-accent text-foreground hover:text-accent"
                 )}
               >
                 {isTaggingMode ? (
                   <>
                     <X size={14} strokeWidth={3} />
                     Exit Tagging Mode
                   </>
                 ) : (
                   <>
                     <Plus size={14} strokeWidth={3} />
                     Enable Tagging Mode
                   </>
                 )}
               </button>
             </div>
           </div>
           
           <div className="flex-1 relative overflow-auto custom-scrollbar scroll-smooth p-16">
              <div className={clsx(
                "relative w-full min-h-full flex items-start justify-center transition-all duration-300",
                journey.platform === 'Mobile' ? "items-center" : "pt-0"
              )}>
                {/* Analysis Frame */}
                <div className={clsx(
                  "relative bg-white transition-all duration-500 border border-zinc-200/50 will-change-transform flex flex-col",
                  journey.platform === 'Mobile' 
                    ? "aspect-[9/19.5] max-h-[820px] h-[820px] rounded-[60px] border-[12px] border-zinc-900 overflow-hidden ring-1 ring-white/10 shadow-2xl" 
                    : "w-full max-w-[1440px] min-h-[1600px] shadow-2xl origin-top"
                )}
                style={journey.platform !== 'Mobile' ? { 
                  transform: `scale(${scale})`, 
                  marginBottom: `-${1600 * (1 - scale)}px` 
                } : {}}
                >
                  <div 
                    className={clsx(
                      "relative flex-1 flex flex-col",
                      journey.platform === 'Mobile' 
                        ? "w-full h-full overflow-y-auto overflow-x-hidden" 
                        : "w-full h-full overflow-y-auto overflow-x-hidden",
                      isTaggingMode && "cursor-crosshair"
                    )}
                    onClick={handleCanvasClick}
                  >
                    <JourneyScreenGenerator 
                      journey={journey}
                      step={activeStep}
                    />
                  </div>
                  
                  {/* Selected Element Highlight - Shows when modal is open */}
                  {isAddTagModalOpen && savedTagPosition && (
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute z-[90] pointer-events-none"
                      style={{
                        top: `${savedTagPosition.y}%`,
                        left: `${savedTagPosition.x}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {/* Outer glow ring */}
                      <div className="absolute w-32 h-32 rounded-xl bg-accent/20 blur-xl animate-pulse" />
                      
                      {/* Main highlight box */}
                      <div className="relative w-24 h-24 rounded-lg border-4 border-accent bg-accent/10 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse">
                        {/* Corner accents */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-accent rounded-tl" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-accent rounded-tr" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-accent rounded-bl" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-accent rounded-br" />
                        
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
                            <Target size={18} className="text-white" strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Label */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="px-3 py-1.5 bg-accent text-white text-[11px] font-bold rounded-lg shadow-xl">
                          Selected Element
                        </div>
                        <div className="w-2 h-2 bg-accent rotate-45 absolute left-1/2 -translate-x-1/2 -top-1" />
                      </div>
                    </Motion.div>
                  )}
                  
                  {/* Context Menu for Manual Tagging */}
                  {contextMenuPosition && (
                    <div 
                      className="absolute z-[100] bg-white border-2 border-zinc-200 rounded-xl shadow-2xl p-2 min-w-[160px]"
                      style={{
                        top: `${contextMenuPosition.y}%`,
                        left: `${contextMenuPosition.x}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <button
                        onClick={handleAddTag}
                        className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-zinc-900 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} className="text-blue-600" />
                        Add Tag
                      </button>
                      <button
                        onClick={() => setContextMenuPosition(null)}
                        className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                  
                  {/* Tag Markers Layer (Inside Frame) */}
                  <div className="absolute inset-0 z-[50] pointer-events-none">
                    {activeStep?.components?.map((tag, i) => {
                      const isActive = activeTagId === tag.componentId;
                      const isApproved = tag.approvalState === 'Approved';
                      const isRejected = tag.approvalState === 'Rejected';
                      const pos = getComponentPosition(tag, i, activeStep.components?.length || 0, activeStep.screenTemplate, journey.platform);

                      return (
                        <div 
                          key={`marker-${tag.componentId}`} 
                          className="absolute pointer-events-none will-change-transform"
                          style={{ 
                            top: `${pos.top}%`, 
                            left: `${pos.left}%`, 
                            zIndex: isActive ? 1000 : 40,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div className="flex items-center justify-center pointer-events-auto group/marker">
                            {/* Pulsing ring for proposed tags */}
                            {!isApproved && !isRejected && (
                              <div className="absolute w-14 h-14 rounded-full bg-blue-500 animate-ping opacity-20" />
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkerClick(tag.componentId);
                              }}
                              className={clsx(
                                "w-14 h-14 rounded-full border-[5px] transition-all duration-300 flex items-center justify-center font-black text-[18px] shadow-2xl relative cursor-pointer will-change-transform",
                                isApproved ? "bg-emerald-500 border-white text-white shadow-emerald-500/30" : (isRejected ? "bg-zinc-400 border-white text-white shadow-zinc-400/30" : "bg-zinc-600 border-white text-white shadow-zinc-600/40"),
                                isActive ? "scale-125 ring-[16px] ring-zinc-900/15" : "hover:scale-110 active:scale-90 group-hover/marker:ring-8 group-hover/marker:ring-zinc-500/20"
                              )}
                              title="Click to review interaction"
                            >
                              {isApproved ? <Check size={24} strokeWidth={4} /> : (isRejected ? <X size={24} strokeWidth={4} /> : i + 1)}
                            </button>
                            {/* Hover tooltip */}
                            {!isActive && (
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                <div className="px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-bold rounded-lg shadow-xl">
                                  Click to review
                                </div>
                                <div className="w-2 h-2 bg-zinc-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Manual Tag Markers */}
                    {manualTags.map((tag) => (
                      <div 
                        key={tag.id}
                        className="absolute pointer-events-none will-change-transform"
                        style={{ 
                          top: `${tag.position.y}%`, 
                          left: `${tag.position.x}%`, 
                          zIndex: 45,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="flex items-center justify-center pointer-events-auto group/manual">
                          {/* Manual tag badge */}
                          <div className="flex flex-col items-center gap-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveManualTag(tag.id);
                              }}
                              className="w-12 h-12 rounded-full border-[4px] border-white bg-zinc-600 text-white shadow-2xl flex items-center justify-center font-black text-[11px] hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-zinc-600/40 relative"
                              title="Manual tag - click to remove"
                            >
                              <User size={20} strokeWidth={3} />
                              {/* Manual indicator */}
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white text-[8px] font-black flex items-center justify-center">
                                M
                              </div>
                            </button>
                            <div className="px-2 py-1 bg-zinc-600 text-white text-[10px] font-bold rounded-md shadow-lg whitespace-nowrap max-w-[120px] truncate">
                              {tag.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Floating Add Tag Button */}
                    <div className="absolute bottom-6 right-6 z-[60] pointer-events-auto">

                    </div>
                    
                    {/* Tagging Mode Overlay */}
                    {isTaggingMode && (
                      <div 
                        className="tagging-overlay absolute inset-0 bg-purple-500/10 backdrop-blur-[1px] z-[100] border-4 border-purple-500 border-dashed rounded-[inherit] animate-pulse cursor-crosshair"
                        onClick={handleCanvasClick}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-6 py-4 rounded-2xl shadow-2xl pointer-events-none">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                            <span className="font-bold text-[15px]">Click anywhere to add a tag</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tooltips Layer (Outside Device Frame to avoid clipping) */}
        <AnimatePresence>
          {activeTagId && isRightPanelCollapsed && (
            <div className="absolute inset-0 pointer-events-none z-[200]">
              {activeStep?.components?.map((tag, i) => {
                if (activeTagId !== tag.componentId) return null;
                
                const pos = getComponentPosition(tag, i, activeStep.components?.length || 0, activeStep.screenTemplate, journey.platform);
                
                // Positioning logic
                const tooltipSide = pos.top > 50 ? 'top' : 'bottom';
                const tooltipAlign = pos.left > 80 ? 'right' : (pos.left < 20 ? 'left' : 'center');

                return (
                  <div 
                    key={`tooltip-portal-${tag.componentId}`}
                    className="absolute will-change-transform"
                    style={{ 
                      top: journey.platform === 'Mobile' 
                        ? `calc(50% + ${(pos.top - 50) * 8.2}px)`
                        : `calc(0% + ${(pos.top) * 16}px * ${scale})`,
                      left: journey.platform === 'Mobile'
                        ? `calc(50% + ${(pos.left - 50) * 3.78}px)`
                        : `calc(50% + ${(pos.left - 50) * 14.4}px * ${scale})`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <TagTooltip 
                      tag={tag}
                      side={tooltipSide}
                      align={tooltipAlign}
                      onClose={() => setActiveTagId(null)}
                      onAccept={() => handleToggleApproval(tag.componentId)}
                      onDecline={() => handleDeclineTag(tag.componentId)}
                      onUpdate={(name, meta) => handleUpdateTag(tag.componentId, name, meta)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Column 3: Suggested Tags (Right, Sticky) */}
        <Motion.div 
          initial={false}
          animate={{ width: isRightPanelCollapsed ? 80 : 660 }}
          className="border-l border-zinc-100 bg-zinc-50/50 flex flex-col shrink-0 overflow-hidden"
        >
           {/* Header with collapse button */}
           <div className="p-6 bg-white border-b border-zinc-100 flex items-center gap-4 h-[72px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] shrink-0">
              {!isRightPanelCollapsed && (
                <Motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-3 text-zinc-400 flex-1"
                >
                   <Database size={18} className="text-zinc-500" />
                   <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">
                     CX Data Definitions
                   </span>
                </Motion.div>
              )}
              {!isRightPanelCollapsed && (
                <button
                  onClick={handleApproveAllStages}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200"
                  title="Approve Journey"
                >
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                  <span className="text-[12px] font-bold">Approve Journey</span>
                </button>
              )}
              <button 
                onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
                className={clsx(
                  "w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer hover:bg-zinc-100 text-zinc-500 shrink-0",
                  isRightPanelCollapsed ? "mx-auto" : ""
                )}
                title={isRightPanelCollapsed ? "Expand Panel" : "Collapse Panel"}
              >
                {isRightPanelCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
              </button>
           </div>

           {/* Data Layer Ribbon */}
           {!isRightPanelCollapsed && activeTab === 'dataLayer' && (
             <div className="bg-blue-50 border-b border-blue-200 px-6 py-4 shrink-0">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Database size={20} className="text-blue-600" strokeWidth={2.5} />
                   <div className="flex flex-col">
                     <span className="text-[15px] font-black text-blue-900">
                       Review Data Layer
                     </span>
                     <span className="text-[12px] text-blue-700">
                       Start by reviewing variables and page metadata
                     </span>
                   </div>
                 </div>
                 <button
                   onClick={() => setActiveTab('userInteractions')}
                   className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-2"
                 >
                   Continue 
                   <ArrowRight size={16} strokeWidth={2.5} />
                 </button>
               </div>
             </div>
           )}
           
           {/* User Interactions CTA - Light Purple */}
           {!isRightPanelCollapsed && activeTab === 'userInteractions' && (
             <div className="bg-purple-50 border-b border-purple-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MousePointer2 size={20} className="text-purple-600" strokeWidth={2.5} />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-black text-purple-900">
                      Review User Interactions
                    </span>
                    <span className="text-[12px] text-purple-700">
                      Validate click events, form interactions, and user actions
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('systemEvents')}
                  className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-600 hover:text-purple-700 rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  Continue
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
           )}

           {/* System Events CTA - Light Emerald */}
           {!isRightPanelCollapsed && activeTab === 'systemEvents' && (
             <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-emerald-600" strokeWidth={2.5} />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-black text-emerald-900">
                      Review System Events
                    </span>
                    <span className="text-[12px] text-emerald-700">
                      Verify automated events and system-triggered analytics
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toast.success('Review Complete', {
                      description: 'All tracking definitions have been reviewed.',
                    });
                  }}
                  className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                  Complete Review
                </button>
              </div>
            </div>
           )}

           {/* Tab Navigation */}
           {!isRightPanelCollapsed && (
             <div className="bg-white border-b border-zinc-100 px-6 py-3 flex gap-1 shrink-0">
               {[
                 { id: 'dataLayer', label: 'Data Layer', icon: Database },
                 { id: 'userInteractions', label: 'User Interactions', icon: MousePointer2 },
                 { id: 'systemEvents', label: 'System Events', icon: Activity }
               ].map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={clsx(
                     "flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all",
                     activeTab === tab.id
                       ? "bg-zinc-900 text-white shadow-sm"
                       : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                   )}
                 >
                   <tab.icon size={14} />
                   <span>{tab.label}</span>
                 </button>
               ))}
             </div>
           )}
           
           {!isRightPanelCollapsed && (
             <Motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.2 }}
               className="flex-1 overflow-y-auto custom-scrollbar flex flex-col"
             >
                {/* Data Layer Tab */}
                {activeTab === 'dataLayer' && (
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={handleAcceptAll}
                            className="px-2.5 h-6 bg-emerald-600 text-white rounded-md transition-all flex items-center justify-center gap-1 shadow-sm hover:bg-emerald-700 active:scale-[0.95] cursor-pointer group"
                            title="Accept All"
                          >
                            <Check size={11} strokeWidth={3} />
                            <span className="text-[10px] font-bold">Accept</span>
                          </button>
                          <button 
                            onClick={handleDeclineAll}
                            className="px-2.5 h-6 bg-white border border-zinc-300 text-zinc-600 rounded-md transition-all flex items-center justify-center gap-1 shadow-sm hover:border-red-500 hover:text-red-600 hover:bg-red-50 active:scale-[0.95] cursor-pointer group"
                            title="Decline All"
                          >
                            <X size={11} strokeWidth={3} />
                            <span className="text-[10px] font-bold">Decline</span>
                          </button>
                          <div className="w-px h-4 bg-zinc-200 mx-0.5" />
                          <div className="relative">
                            <button 
                              onClick={() => setIsFilterTooltipOpen(!isFilterTooltipOpen)}
                              className={clsx(
                                "px-2.5 h-6 flex items-center justify-center gap-1 rounded-md transition-all cursor-pointer border",
                                filterStatus !== 'All' 
                                  ? "text-blue-700 bg-blue-50 border-blue-200 shadow-sm" 
                                  : "text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-50"
                              )}
                              title="Filter"
                            >
                              <Filter size={11} strokeWidth={2.5} />
                              <span className="text-[10px] font-bold">Filter</span>
                            </button>
                            <AnimatePresence>
                              {isFilterTooltipOpen && (
                                <>
                                  <div className="fixed inset-0 z-[90]" onClick={() => setIsFilterTooltipOpen(false)} />
                                  <Motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-zinc-200 rounded-xl shadow-xl z-[100] p-1.5 overflow-hidden"
                                  >
                                    {[
                                      { label: 'Show All', value: 'All', icon: '○' },
                                      { label: 'Accepted', value: 'Approved', icon: '✓' },
                                      { label: 'Declined', value: 'Rejected', icon: '✕' },
                                      { label: 'Unmarked', value: 'Proposed', icon: '◦' }
                                    ].map((opt) => (
                                      <button
                                        key={opt.value}
                                        onClick={() => {
                                          setFilterStatus(opt.value as any);
                                          setIsFilterTooltipOpen(false);
                                        }}
                                        className={clsx(
                                          "w-full text-left px-3 py-2 rounded-lg text-[12px] font-bold transition-all flex items-center gap-2",
                                          filterStatus === opt.value 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "text-zinc-700 hover:bg-zinc-100"
                                        )}
                                      >
                                        <span className="text-[11px] opacity-70">{opt.icon}</span>
                                        {opt.label}
                                      </button>
                                    ))}
                                  </Motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scrollable Categorized Table */}
                    <div className="flex flex-col border-2 border-zinc-200 rounded-xl overflow-hidden bg-white shadow-md max-h-[600px] overflow-y-auto custom-scrollbar">
                      {/* Categorized Standard Fields */}
                      {[
                        {
                          category: 'Page Attributes',
                          icon: Layout,
                          color: 'blue',
                          fields: ['page_name', 'page_url', 'page_category', 'page_type', 'page_title', 'page_language', 'page_referrer']
                        },
                        {
                          category: 'Journey Context',
                          icon: Target,
                          color: 'emerald',
                          fields: ['journey_name', 'journey_id', 'journey_stage', 'journey_step', 'step_sequence', 'step_total', 'progress_percentage']
                        },
                        {
                          category: 'User Context',
                          icon: User,
                          color: 'amber',
                          fields: ['user_type', 'user_id', 'user_segment', 'login_status', 'account_type', 'customer_lifetime_value']
                        },
                        {
                          category: 'Platform & Device',
                          icon: Monitor,
                          color: 'violet',
                          fields: ['platform', 'device_category', 'browser_name', 'os_name', 'screen_resolution', 'viewport_size']
                        },
                        {
                          category: 'Technical',
                          icon: Database,
                          color: 'slate',
                          fields: ['environment', 'app_version', 'page_load_time', 'session_id', 'timestamp', 'debug_mode', 'test_mode', 'sandbox_mode']
                        }
                      ].map((section) => {
                        const sectionFields = Object.entries(pageDataLayer)
                          .filter(([key]) => !deletedKeys.has(key) && section.fields.includes(key));
                        
                        // Get custom fields for this section
                        const sectionCustomFields = customFields.filter(f => f.section === section.category);
                        const totalFields = sectionFields.length + sectionCustomFields.length;
                        
                        if (totalFields === 0) return null;
                        
                        const IconComponent = section.icon;
                        
                        return (
                          <div key={section.category}>
                            {/* Category Header */}
                            <div 
                              className={clsx(
                                "sticky px-4 py-2 border-b-2 flex items-center justify-between z-10",
                                section.color === 'blue' && "bg-blue-100 border-blue-200",
                                section.color === 'emerald' && "bg-emerald-100 border-emerald-200",
                                section.color === 'amber' && "bg-amber-100 border-amber-200",
                                section.color === 'violet' && "bg-violet-100 border-violet-200",
                                section.color === 'slate' && "bg-slate-100 border-slate-200"
                              )}
                              style={{
                                top: '0px'
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <IconComponent size={14} className={clsx(
                                  section.color === 'blue' && "text-blue-600",
                                  section.color === 'emerald' && "text-emerald-600",
                                  section.color === 'amber' && "text-amber-600",
                                  section.color === 'violet' && "text-violet-600",
                                  section.color === 'slate' && "text-slate-600"
                                )} />
                                <span className={clsx(
                                  "text-[10px] font-black uppercase tracking-widest",
                                  section.color === 'blue' && "text-blue-900",
                                  section.color === 'emerald' && "text-emerald-900",
                                  section.color === 'amber' && "text-amber-900",
                                  section.color === 'violet' && "text-violet-900",
                                  section.color === 'slate' && "text-slate-900"
                                )}>{section.category}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={clsx(
                                  "text-[9px] font-bold",
                                  section.color === 'blue' && "text-blue-600",
                                  section.color === 'emerald' && "text-emerald-600",
                                  section.color === 'amber' && "text-amber-600",
                                  section.color === 'violet' && "text-violet-600",
                                  section.color === 'slate' && "text-slate-600"
                                )}>{totalFields}</span>
                                <button
                                  onClick={() => handleAddField(section.category)}
                                  className={clsx(
                                    "px-2 py-1 border rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all",
                                    section.color === 'blue' && "bg-blue-200 hover:bg-blue-300 border-blue-300 text-blue-900",
                                    section.color === 'emerald' && "bg-emerald-200 hover:bg-emerald-300 border-emerald-300 text-emerald-900",
                                    section.color === 'amber' && "bg-amber-200 hover:bg-amber-300 border-amber-300 text-amber-900",
                                    section.color === 'violet' && "bg-violet-200 hover:bg-violet-300 border-violet-300 text-violet-900",
                                    section.color === 'slate' && "bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-900"
                                  )}
                                >
                                  <Plus size={11} strokeWidth={2.5} />
                                  Add Field
                                </button>
                              </div>
                            </div>
                            
                            {/* Fields in Category */}
                            {sectionFields.map(([key, value], idx) => {
                              const displayValue = editableDataLayer[key] || value;
                              const isEditingKey = editingCell?.key === key && editingCell?.field === 'key';
                              const isEditingValue = editingCell?.key === key && editingCell?.field === 'value';
                              const hasError = !!fieldErrors[key];
                              const isLastInSection = idx === sectionFields.length - 1 && sectionCustomFields.length === 0;
                              
                              return (
                                <div key={key}>
                                  <div 
                                    className={clsx(
                                      "grid grid-cols-[140px_1fr_auto] text-left border-zinc-200 group",
                                      !isLastInSection && "border-b",
                                      hasError && "bg-red-50/50"
                                    )}
                                  >
                                    {/* Key Column */}
                                    <div 
                                      className={clsx(
                                        "px-4 py-3 bg-zinc-50/80 border-r border-zinc-200 text-[11px] font-bold uppercase tracking-tight flex items-center justify-between transition-colors relative cursor-pointer hover:bg-zinc-100",
                                        isEditingKey && "bg-blue-50 border-2 border-blue-400 -m-px z-10",
                                        hasError && "text-red-600"
                                      )}
                                      onClick={() => !isEditingKey && handleCellClick(key, key, 'key')}
                                    >
                                      {isEditingKey ? (
                                        <input
                                          type="text"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          onKeyDown={(e) => handleKeyDown(e, key)}
                                          onBlur={() => handleSave(key)}
                                          autoFocus
                                          className="w-full bg-transparent outline-none text-zinc-900 font-bold uppercase text-[11px]"
                                          placeholder="Enter key"
                                        />
                                      ) : (
                                        <>
                                          <span className={hasError ? "text-red-600" : "text-zinc-500"}>{key.replace(/_/g, ' ')}</span>
                                          <Pencil 
                                            size={12} 
                                            className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" 
                                          />
                                        </>
                                      )}
                                    </div>
                                    
                                    {/* Value Column */}
                                    <div 
                                      className={clsx(
                                        "px-4 py-3 text-[13px] font-medium flex items-center justify-between transition-colors relative border-r border-zinc-200",
                                        isEditingValue 
                                          ? "bg-blue-50 border-2 border-blue-400 -m-px z-10" 
                                          : "bg-white text-zinc-900 cursor-pointer hover:bg-zinc-50"
                                      )}
                                      onClick={() => !isEditingValue && handleCellClick(key, displayValue, 'value')}
                                    >
                                      {isEditingValue ? (
                                        <input
                                          type="text"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          onKeyDown={(e) => handleKeyDown(e, key)}
                                          onBlur={() => handleSave(key)}
                                          autoFocus
                                          className="w-full bg-transparent outline-none text-zinc-900 font-medium"
                                          placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                                        />
                                      ) : (
                                        <>
                                          <span className="flex-1">{displayValue}</span>
                                          <Pencil 
                                            size={14} 
                                            className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 shrink-0" 
                                          />
                                        </>
                                      )}
                                    </div>
                                    
                                    {/* Delete Button */}
                                    <div className="px-3 py-3 bg-white flex items-center justify-center">
                                      <button
                                        onClick={() => handleDeleteField(key)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-600"
                                        title="Delete field"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Error Message */}
                                  {hasError && (
                                    <div className="px-4 py-2 bg-red-50 border-b border-red-200 flex items-start gap-2">
                                      <AlertCircle size={14} className="text-red-600 mt-0.5 shrink-0" />
                                      <span className="text-[11px] font-medium text-red-600">{fieldErrors[key]}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                            {/* Custom Fields in Category */}
                            {sectionCustomFields.map((field, idx) => {
                              const isEditingKey = editingCell?.key === field.id && editingCell?.field === 'key';
                              const isEditingValue = editingCell?.key === field.id && editingCell?.field === 'value';
                              const hasError = !!fieldErrors[field.id];
                              const isLast = idx === sectionCustomFields.length - 1;
                              
                              return (
                                <div key={field.id}>
                                  <div 
                                    className={clsx(
                                      "grid grid-cols-[140px_1fr_auto] text-left group",
                                      !isLast && "border-b border-zinc-200",
                                      hasError && "bg-red-50/50"
                                    )}
                                  >
                                    {/* Key Column - Editable */}
                                    <div 
                                      className={clsx(
                                        "px-4 py-3 border-r border-zinc-200 text-[11px] font-bold uppercase tracking-tight flex items-center justify-between transition-colors relative cursor-pointer",
                                        section.color === 'blue' && "bg-blue-50/50 hover:bg-blue-100/50",
                                        section.color === 'emerald' && "bg-emerald-50/50 hover:bg-emerald-100/50",
                                        section.color === 'amber' && "bg-amber-50/50 hover:bg-amber-100/50",
                                        section.color === 'violet' && "bg-violet-50/50 hover:bg-violet-100/50",
                                        section.color === 'slate' && "bg-slate-50/50 hover:bg-slate-100/50",
                                        isEditingKey && "bg-blue-50 border-2 border-blue-400 -m-px z-10",
                                        hasError && "text-red-600"
                                      )}
                                      onClick={() => !isEditingKey && handleCellClick(field.id, field.key, 'key')}
                                    >
                                      {isEditingKey ? (
                                        <input
                                          type="text"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          onKeyDown={(e) => handleKeyDown(e, field.id)}
                                          onBlur={() => handleSave(field.id)}
                                          autoFocus
                                          className="w-full bg-transparent outline-none text-zinc-900 font-bold uppercase text-[11px]"
                                          placeholder="Enter key"
                                        />
                                      ) : (
                                        <>
                                          <span className={clsx(
                                            hasError ? "text-red-600" : field.key ? (
                                              section.color === 'blue' ? "text-blue-600" :
                                              section.color === 'emerald' ? "text-emerald-600" :
                                              section.color === 'amber' ? "text-amber-600" :
                                              section.color === 'violet' ? "text-violet-600" :
                                              "text-slate-600"
                                            ) : "text-zinc-400 italic"
                                          )}>
                                            {field.key || 'new field'}
                                          </span>
                                          <Pencil 
                                            size={12} 
                                            className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" 
                                          />
                                        </>
                                      )}
                                    </div>
                                    
                                    {/* Value Column - Editable */}
                                    <div 
                                      className={clsx(
                                        "px-4 py-3 text-[13px] font-medium flex items-center justify-between transition-colors relative border-r border-zinc-200",
                                        isEditingValue 
                                          ? "bg-blue-50 border-2 border-blue-400 -m-px z-10" 
                                          : "bg-white text-zinc-900 cursor-pointer hover:bg-zinc-50"
                                      )}
                                      onClick={() => !isEditingValue && handleCellClick(field.id, field.value, 'value')}
                                    >
                                      {isEditingValue ? (
                                        <input
                                          type="text"
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          onKeyDown={(e) => handleKeyDown(e, field.id)}
                                          onBlur={() => handleSave(field.id)}
                                          autoFocus
                                          className="w-full bg-transparent outline-none text-zinc-900 font-medium"
                                          placeholder="Enter value"
                                        />
                                      ) : (
                                        <>
                                          <span className={clsx("flex-1", !field.value && "text-zinc-400 italic")}>
                                            {field.value || 'empty'}
                                          </span>
                                          <Pencil 
                                            size={14} 
                                            className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 shrink-0" 
                                          />
                                        </>
                                      )}
                                    </div>
                                    
                                    {/* Delete Button */}
                                    <div className="px-3 py-3 bg-white flex items-center justify-center">
                                      <button
                                        onClick={() => handleDeleteField(field.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-600"
                                        title="Delete field"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Error Message */}
                                  {hasError && (
                                    <div className="px-4 py-2 bg-red-50 border-b border-red-200 flex items-start gap-2">
                                      <AlertCircle size={14} className="text-red-600 mt-0.5 shrink-0" />
                                      <span className="text-[11px] font-medium text-red-600">{fieldErrors[field.id]}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* User Interactions Tab */}
                {activeTab === 'userInteractions' && (
                  <div className="p-6 flex flex-col gap-4">
                    {/* Instruction Banner */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={handleAcceptAll}
                            className="px-2.5 h-6 bg-emerald-600 text-white rounded-md transition-all flex items-center justify-center gap-1 shadow-sm hover:bg-emerald-700 active:scale-[0.95] cursor-pointer group"
                            title="Accept All"
                          >
                            <Check size={11} strokeWidth={3} />
                            <span className="text-[10px] font-bold">Accept</span>
                          </button>
                          <button 
                            onClick={handleDeclineAll}
                            className="px-2.5 h-6 bg-white border border-zinc-300 text-zinc-600 rounded-md transition-all flex items-center justify-center gap-1 shadow-sm hover:border-red-500 hover:text-red-600 hover:bg-red-50 active:scale-[0.95] cursor-pointer group"
                            title="Decline All"
                          >
                            <X size={11} strokeWidth={3} />
                            <span className="text-[10px] font-bold">Decline</span>
                          </button>
                          <div className="w-px h-4 bg-zinc-200 mx-0.5" />
                          <div className="relative">
                            <button 
                              onClick={() => setIsFilterTooltipOpen(!isFilterTooltipOpen)}
                              className={clsx(
                                "px-2.5 h-6 flex items-center justify-center gap-1 rounded-md transition-all cursor-pointer border",
                                filterStatus !== 'All' 
                                  ? "text-blue-700 bg-blue-50 border-blue-200 shadow-sm" 
                                  : "text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-50"
                              )}
                              title="Filter"
                            >
                              <Filter size={11} strokeWidth={2.5} />
                              <span className="text-[10px] font-bold">Filter</span>
                            </button>
                            <AnimatePresence>
                              {isFilterTooltipOpen && (
                                <>
                                  <div className="fixed inset-0 z-[90]" onClick={() => setIsFilterTooltipOpen(false)} />
                                  <Motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-zinc-200 rounded-xl shadow-xl z-[100] p-1.5 overflow-hidden"
                                  >
                                    {[
                                      { label: 'Show All', value: 'All', icon: '○' },
                                      { label: 'Accepted', value: 'Approved', icon: '✓' },
                                      { label: 'Declined', value: 'Rejected', icon: '✕' },
                                      { label: 'Unmarked', value: 'Proposed', icon: '◦' }
                                    ].map((opt) => (
                                      <button
                                        key={opt.value}
                                        onClick={() => {
                                          setFilterStatus(opt.value as any);
                                          setIsFilterTooltipOpen(false);
                                        }}
                                        className={clsx(
                                          "w-full text-left px-3 py-2 rounded-lg text-[12px] font-bold transition-all flex items-center gap-2",
                                          filterStatus === opt.value 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "text-zinc-700 hover:bg-zinc-100"
                                        )}
                                      >
                                        <span className="text-[11px] opacity-70">{opt.icon}</span>
                                        {opt.label}
                                      </button>
                                    ))}
                                  </Motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Component Indicator */}
                    {activeTagId && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-widest">
                            Component Selected
                          </span>
                        </div>
                        <p className="text-[12px] text-blue-700 mt-1 leading-relaxed">
                          {filteredTags.find(t => t.componentId === activeTagId)?.componentLabel || 'Interactive Element'}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-5">
                      {filteredTags.map((tag, tIdx) => (
                        <SidebarTagCard 
                          key={tag.componentId}
                          tag={tag}
                          index={tIdx}
                          isActive={activeTagId === tag.componentId}
                          onToggleApproval={() => handleToggleApproval(tag.componentId)}
                          onDecline={() => handleDeclineTag(tag.componentId)}
                          onUpdateTag={(name, meta) => handleUpdateTag(tag.componentId, name, meta)}
                          onClick={() => setActiveTagId(prev => prev === tag.componentId ? null : tag.componentId)}
                          cardRef={(el) => { tagRefs.current[tag.componentId] = el; }}
                          isInitiallyEditing={tagToEditInPanel === tag.componentId}
                        />
                      ))}
                      {filteredTags.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                           <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                              <Filter size={24} className="text-zinc-300" />
                           </div>
                           <p className="text-[14px] font-bold text-zinc-400">No interactions match filter</p>
                           <button 
                             onClick={() => setFilterStatus('All')}
                             className="mt-4 text-[12px] font-black text-zinc-900 uppercase tracking-widest border-b border-zinc-900 pb-0.5"
                           >
                             Clear Filter
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* System Events Tab */}
                {activeTab === 'systemEvents' && (
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={handleAcceptAll}
                            className="px-2.5 h-6 bg-emerald-600 text-white rounded-md transition-all flex items-center justify-center gap-1 shadow-sm hover:bg-emerald-700 active:scale-[0.95] cursor-pointer group"
                            title="Accept All"
                          >
                            <Check size={11} strokeWidth={3} />
                            <span className="text-[10px] font-bold">Accept</span>
                          </button>
                          <button 
                            onClick={handleDeclineAll}
                            className="px-2.5 h-6 bg-white border border-zinc-300 text-zinc-600 rounded-md transition-all flex items-center justify-center gap-1 shadow-sm hover:border-red-500 hover:text-red-600 hover:bg-red-50 active:scale-[0.95] cursor-pointer group"
                            title="Decline All"
                          >
                            <X size={11} strokeWidth={3} />
                            <span className="text-[10px] font-bold">Decline</span>
                          </button>
                          <div className="w-px h-4 bg-zinc-200 mx-0.5" />
                          <div className="relative">
                            <button 
                              onClick={() => setIsFilterTooltipOpen(!isFilterTooltipOpen)}
                              className={clsx(
                                "px-2.5 h-6 flex items-center justify-center gap-1 rounded-md transition-all cursor-pointer border",
                                filterStatus !== 'All' 
                                  ? "text-blue-700 bg-blue-50 border-blue-200 shadow-sm" 
                                  : "text-zinc-600 bg-white border-zinc-300 hover:bg-zinc-50"
                              )}
                              title="Filter"
                            >
                              <Filter size={11} strokeWidth={2.5} />
                              <span className="text-[10px] font-bold">Filter</span>
                            </button>
                            <AnimatePresence>
                              {isFilterTooltipOpen && (
                                <>
                                  <div className="fixed inset-0 z-[90]" onClick={() => setIsFilterTooltipOpen(false)} />
                                  <Motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-zinc-200 rounded-xl shadow-xl z-[100] p-1.5 overflow-hidden"
                                  >
                                    {[
                                      { label: 'Show All', value: 'All', icon: '○' },
                                      { label: 'Accepted', value: 'Approved', icon: '✓' },
                                      { label: 'Declined', value: 'Rejected', icon: '✕' },
                                      { label: 'Unmarked', value: 'Proposed', icon: '◦' }
                                    ].map((opt) => (
                                      <button
                                        key={opt.value}
                                        onClick={() => {
                                          setFilterStatus(opt.value as any);
                                          setIsFilterTooltipOpen(false);
                                        }}
                                        className={clsx(
                                          "w-full text-left px-3 py-2 rounded-lg text-[12px] font-bold transition-all flex items-center gap-2",
                                          filterStatus === opt.value 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "text-zinc-700 hover:bg-zinc-100"
                                        )}
                                      >
                                        <span className="text-[11px] opacity-70">{opt.icon}</span>
                                        {opt.label}
                                      </button>
                                    ))}
                                  </Motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {systemEvents.map((event, idx) => {
                        const eventPayload = editableSystemEvents[idx] || event.dataLayer;
                        console.log(`📋 Rendering event ${idx}:`, event.event_name, 'Payload:', eventPayload);
                        const deletedKeys = deletedEventKeys[idx] || new Set();
                        const visibleEntries = Object.entries(eventPayload).filter(([key]) => !deletedKeys.has(key));
                        const displayedEntries = expandedEventCards.has(idx) ? visibleEntries : visibleEntries.slice(0, 3);
                        
                        return (
                          <div key={idx} className="flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden group">
                            {/* Event Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/50 border-b border-zinc-100">
                              <div className="flex items-center gap-2.5">
                                <h4 className="text-[13px] font-bold text-zinc-900">{event.event_name}</h4>
                                <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-100 rounded text-[9px] font-bold text-purple-700 uppercase tracking-wider">
                                  System
                                </span>
                              </div>
                              <button
                                onClick={() => { console.log('❗ Button clicked for idx:', idx); handleAddEventField(idx); }}
                                className="px-2 py-1 bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-300 rounded-lg text-[10px] font-bold text-zinc-600 hover:text-blue-600 flex items-center gap-1 transition-all"
                              >
                                <Plus size={11} strokeWidth={2.5} />
                                Add Field
                              </button>
                            </div>

                            {/* Event Payload Table */}
                            <div className="flex flex-col">
                              {displayedEntries.map(([key, value], i) => {
                                const isEditingKey = editingEventCell?.eventIdx === idx && editingEventCell?.key === key && editingEventCell?.field === 'key';
                                const isEditingValue = editingEventCell?.eventIdx === idx && editingEventCell?.key === key && editingEventCell?.field === 'value';
                                const hasError = !!eventFieldErrors[key];
                                const isLast = i === displayedEntries.length - 1;
                                
                                return (
                                  <div key={key}>
                                    <div 
                                      className={clsx(
                                        "grid grid-cols-[160px_1fr_auto] text-left hover:bg-zinc-50/50 transition-colors",
                                        !isLast && "border-b border-zinc-100",
                                        hasError && "bg-red-50/50"
                                      )}
                                    >
                                      {/* Key Column - Editable */}
                                      <div 
                                        className={clsx(
                                          "px-4 py-2.5 bg-zinc-50/50 border-r border-zinc-100 text-[11px] font-medium text-zinc-600 flex items-center justify-between transition-colors cursor-pointer hover:bg-zinc-100/50",
                                          isEditingKey && "bg-blue-50 border-2 border-blue-400 -m-px z-10",
                                          hasError && "text-red-600"
                                        )}
                                        onClick={() => !isEditingKey && handleEventCellClick(idx, key, key, 'key')}
                                      >
                                        {isEditingKey ? (
                                          <input
                                            type="text"
                                            value={editEventValue}
                                            onChange={(e) => setEditEventValue(e.target.value)}
                                            onKeyDown={(e) => handleEventKeyDown(e, idx, key)}
                                            onBlur={() => handleEventSave(idx, key)}
                                            autoFocus
                                            className="w-full bg-transparent outline-none text-zinc-900 font-medium text-[11px]"
                                            placeholder="Enter key"
                                          />
                                        ) : (
                                          <>
                                            <span>{key.replace(/_/g, ' ')}</span>
                                            <Pencil 
                                              size={10} 
                                              className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" 
                                            />
                                          </>
                                        )}
                                      </div>
                                      
                                      {/* Value Column - Editable */}
                                      <div 
                                        className={clsx(
                                          "px-4 py-2.5 text-[12px] font-normal text-zinc-900 flex items-center justify-between transition-colors border-r border-zinc-100",
                                          isEditingValue 
                                            ? "bg-blue-50 border-2 border-blue-400 -m-px z-10" 
                                            : "bg-white cursor-pointer hover:bg-zinc-50/50"
                                        )}
                                        onClick={() => !isEditingValue && handleEventCellClick(idx, key, value, 'value')}
                                      >
                                        {isEditingValue ? (
                                          <input
                                            type="text"
                                            value={editEventValue}
                                            onChange={(e) => setEditEventValue(e.target.value)}
                                            onKeyDown={(e) => handleEventKeyDown(e, idx, key)}
                                            onBlur={() => handleEventSave(idx, key)}
                                            autoFocus
                                            className="w-full bg-transparent outline-none text-zinc-900 font-normal"
                                            placeholder="Enter value"
                                          />
                                        ) : (
                                          <>
                                            <span className={clsx("flex-1 truncate", !value && "text-zinc-400 italic")}>
                                              {value || 'empty'}
                                            </span>
                                            <Pencil 
                                              size={11} 
                                              className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" 
                                            />
                                          </>
                                        )}
                                      </div>
                                      
                                      {/* Delete Button */}
                                      <div className="px-3 py-2.5 bg-white flex items-center justify-center">
                                        <button
                                          onClick={() => handleDeleteEventField(idx, key)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-zinc-400 hover:text-red-600"
                                          title="Delete field"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Error Message */}
                                    {hasError && (
                                      <div className="px-4 py-2 bg-red-50 border-b border-red-200 flex items-start gap-2">
                                        <AlertCircle size={12} className="text-red-600 mt-0.5 shrink-0" />
                                        <span className="text-[10px] font-medium text-red-600">{eventFieldErrors[key]}</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* View More/Less */}
                            {visibleEntries.length > 3 && (
                              <div className="px-4 py-2.5 bg-zinc-50/30 border-t border-zinc-100">
                                <button
                                  onClick={() => {
                                    setExpandedEventCards(prev => {
                                      const newSet = new Set(prev);
                                      if (newSet.has(idx)) {
                                        newSet.delete(idx);
                                      } else {
                                        newSet.add(idx);
                                      }
                                      return newSet;
                                    });
                                  }}
                                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                                >
                                  {expandedEventCards.has(idx) ? (
                                    <>
                                      <ChevronUp size={13} />
                                      View Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown size={13} />
                                      View {visibleEntries.length - 3} More Field{visibleEntries.length - 3 !== 1 ? 's' : ''}
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="h-20" /> {/* Bottom spacer */}
             </Motion.div>
           )}
        </Motion.div>
      </div>

    </div>
  );
};
