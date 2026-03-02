import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  Zap, 
  Layout, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Search, 
  HelpCircle, 
  Bell, 
  User 
} from 'lucide-react';
import { mockJourneys } from '@/app/data/mockJourneys';
import { StatusBadge } from '@/app/components/Foundation';
import { useChat } from '@/app/context/ChatContext';
import { ShippingConfirmationModal } from '@/app/components/ShippingConfirmationModal';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export const Header = () => {
  const { isPanelOpen } = useChat();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if we are on a journey-related page
  const journeyIdMatch = location.pathname.match(/\/playground\/journey\/([^/]+)/);
  const journeyId = journeyIdMatch ? journeyIdMatch[1] : null;
  
  const isAnalyze = location.pathname.includes('/overview');
  const isDeveloperPackage = location.pathname.includes('/artifacts') || location.pathname.includes('/package');
  const isValidate = location.pathname.includes('/validation');

  const isDashboardRoute = ['/playground', '/journeys', '/tag-manager'].includes(location.pathname);
  
  const journey = useMemo(() => {
    if (!journeyId) return null;
    return mockJourneys.find(j => j.journeyId === journeyId);
  }, [journeyId]);

  // Tag acceptance state from session storage
  const [tagStats, setTagStats] = useState({ accepted: 0, total: 0 });

  useEffect(() => {
    if (!journeyId) return;
    
    const updateStats = () => {
      const stored = sessionStorage.getItem(`vzw-journey-stats-${journeyId}`);
      if (stored) {
        setTagStats(JSON.parse(stored));
      } else if (journey) {
        const total = (journey.steps || []).reduce((acc, step) => acc + (step.components?.length || 0), 0);
        setTagStats({ accepted: 0, total });
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 1000); // Poll for changes
    return () => clearInterval(interval);
  }, [journeyId, journey]);

  const canGenerate = tagStats.accepted === tagStats.total && tagStats.total > 0;
  const artifactsEnabled = sessionStorage.getItem(`vzw-artifacts-enabled-${journeyId}`) === 'true' || isDeveloperPackage || isValidate;
  const validateEnabled = sessionStorage.getItem(`vzw-validation-enabled-${journeyId}`) === 'true' || isValidate;

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const handleScroll = () => {
      setIsScrolled(mainContent.scrollTop > 20);
    };

    mainContent.addEventListener('scroll', handleScroll);
    return () => mainContent.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerate = () => {
    if (isAnalyze) {
      // Open shipping confirmation modal
      setIsShippingModalOpen(true);
    } else if (isValidate) {
      toast.success('Validation report is already up to date');
    }
  };

  // 1. Dashboard/Listing/TagManager Header
  if (isDashboardRoute) {
    return (
      <header className="sticky top-0 z-[100] h-20 flex items-center px-10 bg-card border-b border-border transition-colors duration-300">
        <div className="w-full flex items-center justify-between gap-10">
          <div className="flex items-center gap-10 flex-1">
            {/* Left: Search Bar */}
            <div className="relative group w-full max-w-[520px]">
               <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search journeys, tag namespaces, or registry..."
                 className="w-full h-[52px] pl-14 pr-6 bg-surface-secondary border border-border rounded-full text-[14px] font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
               />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1">
                  <span className="px-2 py-1 bg-card border border-border rounded-md text-[10px] font-black text-muted-foreground shadow-sm">ESC</span>
               </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
             <div className="flex items-center p-1.5 bg-surface-secondary border border-border rounded-[20px] gap-1 shadow-inner">
                <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-card rounded-xl transition-all cursor-pointer group relative">
                   <HelpCircle size={20} />
                   <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-800 text-white text-[8px] font-black rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -top-8 pointer-events-none px-2 py-1 whitespace-nowrap">HELP</div>
                </button>
                <div className="relative group">
                   <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-card rounded-xl transition-all cursor-pointer">
                      <Bell size={20} />
                   </button>
                   <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-surface-secondary group-hover:border-card transition-colors" />
                </div>
             </div>
          </div>
        </div>
      </header>
    );
  }

  // 2. Fallback for other non-journey pages (if any)
  if (!journeyId) {
    return (
      <header className="sticky top-0 z-[100] h-20 flex items-center px-8 bg-card border-b border-border transition-colors duration-300">
        <div className="w-full flex items-center justify-between">
          {/* Branding removed per user request */}
        </div>
      </header>
    );
  }

  // 3. Journey Details Header (Analyze, Validate - Developer Package removed)
  return (
    <header className="sticky top-0 z-[100] h-20 flex items-center px-8 bg-card border-b border-border shadow-sm transition-colors duration-300">
      <div className="w-full flex items-center justify-between">
        
        {/* Left: Journey Title, Status & Timestamp (Fill Container) */}
        <div className="flex-1 flex items-center gap-4 transition-all duration-300 min-w-0">
          <button 
            onClick={() => navigate('/playground')}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-surface-primary border border-border rounded-xl hover:bg-surface-secondary transition-all cursor-pointer group"
          >
            <ChevronLeft size={20} className="text-muted-foreground group-hover:text-foreground transition-all" />
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-black text-foreground tracking-tight truncate">
                {journey?.journeyName}
              </h1>
              {!isPanelOpen && (
                <StatusBadge 
                  status={journey?.status === 'Completed' ? 'success' : journey?.status === 'In progress' ? 'neutral' : 'warning'} 
                  label={journey?.status || 'Draft'} 
                />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
               <Clock size={12} />
               <span className="text-[11px] font-bold uppercase tracking-widest truncate">Updated {journey?.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Center: Mode Toggle - Only Analyze and Validate */}
        <div className="flex-shrink-0 flex justify-center transition-all duration-300">
          <div className="flex w-fit p-1.5 bg-surface-secondary rounded-[20px] border border-border shadow-inner">
            <button 
              onClick={() => navigate(`/playground/journey/${journeyId}/overview`)}
              title={isPanelOpen ? "Analyze" : undefined}
              className={clsx(
                "flex items-center gap-2 rounded-xl text-[13px] font-black transition-all cursor-pointer",
                isAnalyze ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:text-foreground",
                isPanelOpen ? "px-3 py-2.5" : "px-6 py-2.5"
              )}
            >
              <Layout size={16} />
              {!isPanelOpen && "Analyze"}
            </button>
            <button 
              onClick={() => validateEnabled && navigate(`/playground/journey/${journeyId}/validation`)}
              disabled={!validateEnabled}
              title={isPanelOpen ? "Validate" : undefined}
              className={clsx(
                "flex items-center gap-2 rounded-xl text-[13px] font-black transition-all",
                isValidate ? "bg-foreground text-background shadow-lg" : 
                validateEnabled ? "text-muted-foreground hover:text-foreground cursor-pointer" : "text-muted-foreground cursor-not-allowed opacity-60",
                isPanelOpen ? "px-3 py-2.5" : "px-6 py-2.5"
              )}
            >
              <ShieldCheck size={16} />
              {!isPanelOpen && "Validate"}
            </button>
          </div>
        </div>

        {/* Right: Progress & Ship to Development Button */}
        <div className="flex-1 flex items-center justify-end gap-6 transition-all duration-300">
          <div className="flex flex-col items-end gap-1.5">
             <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest leading-none">Review Progress</span>
                <span className="text-[13px] font-black text-foreground leading-none">{tagStats.accepted} / {tagStats.total}</span>
             </div>
             <div className="w-36 h-2 bg-surface-secondary rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                  style={{ width: `${tagStats.total > 0 ? (tagStats.accepted / tagStats.total) * 100 : 0}%` }}
                />
             </div>
          </div>
          
          {isAnalyze && !isValidate && (
            <button 
              onClick={handleGenerate}
              disabled={!canGenerate}
              title={!canGenerate ? 'Complete review to enable shipping' : ''}
              className={clsx(
                "px-6 py-3 rounded-xl text-[14px] font-black transition-all flex items-center gap-2.5 shadow-sm",
                canGenerate
                  ? "bg-foreground text-background hover:bg-black dark:hover:bg-zinc-800 cursor-pointer active:scale-95" 
                  : "bg-surface-secondary text-muted-foreground cursor-not-allowed border border-border shadow-none"
              )}
            >
              Ship to Development
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Shipping Confirmation Modal */}
      {journeyId && (
        <ShippingConfirmationModal 
          isOpen={isShippingModalOpen}
          onClose={() => setIsShippingModalOpen(false)}
          journeyId={journeyId}
        />
      )}
    </header>
  );
};