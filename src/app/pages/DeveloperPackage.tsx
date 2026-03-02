import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { mockJourneys } from '@/app/data/mockJourneys';
import { 
  Package,
  CheckCircle2,
  AlertCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Database,
  MousePointer2,
  Activity,
  MessageSquare,
  ArrowRight,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const Motion = motion;

export const DeveloperPackage = () => {
  const { journeyId } = useParams();
  const navigate = useNavigate();
  const journey = useMemo(() => mockJourneys.find(j => j.journeyId === journeyId), [journeyId]);

  const [isPackageContentOpen, setIsPackageContentOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPackageSent, setIsPackageSent] = useState(false);

  if (!journey) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Journey Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested journey could not be found.</p>
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

  // Calculate package contents
  const packageSummary = useMemo(() => {
    const dataLayerTags: string[] = [];
    const userInteractions: string[] = [];
    const systemEvents: string[] = [];
    
    journey.steps.forEach((step) => {
      step.components?.forEach((comp) => {
        if (comp.approvalState === 'Approved') {
          const eventType = comp.eventType.toLowerCase();
          const tagName = comp.dataLayer.event_name || comp.componentLabel;
          
          if (eventType.includes('page') || eventType.includes('view') || tagName.toLowerCase().includes('page')) {
            if (!dataLayerTags.includes(tagName)) dataLayerTags.push(tagName);
          } else if (eventType.includes('click') || eventType.includes('submit') || eventType.includes('change')) {
            if (!userInteractions.includes(tagName)) userInteractions.push(tagName);
          } else {
            if (!systemEvents.includes(tagName)) systemEvents.push(tagName);
          }
        }
      });
    });

    return { dataLayerTags, userInteractions, systemEvents };
  }, [journey]);

  const baCommentCount = 1; // Mock - would come from actual comments

  const handleSendPackage = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSend = () => {
    setIsConfirmModalOpen(false);
    setIsPackageSent(true);
    
    toast.success('Package Sent Successfully', {
      description: 'Development workflow has been initiated'
    });

    // Enable validation tab
    sessionStorage.setItem(`vzw-validation-enabled-${journeyId}`, 'true');
  };

  const handleGoToValidation = () => {
    navigate(`/playground/journey/${journeyId}/validation`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-full bg-background transition-colors duration-300">
      
      {/* Main Content - Centered Layout */}
      <div className="flex-1 overflow-y-auto px-8 py-12">
        <div className="max-w-[700px] mx-auto flex flex-col gap-8">

          {!isPackageSent ? (
            <>
              {/* Section 1: Package Summary Card */}
              <div className="bg-card border-2 border-border rounded-2xl p-10 flex flex-col items-center text-center gap-6 shadow-sm">
                {/* Icon */}
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center justify-center">
                  <Package size={40} className="text-emerald-600 dark:text-emerald-400" />
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-[28px] font-black text-foreground tracking-tight">
                    Developer Package Ready
                  </h1>
                  <p className="text-[15px] text-muted-foreground font-medium leading-relaxed max-w-[500px]">
                    All accepted recommendations have been compiled into a deployment-ready package.
                  </p>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-4">
                  <div className="flex items-center gap-3 p-4 bg-surface-secondary border border-border rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700 rounded-lg flex items-center justify-center shrink-0">
                      <Database size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[24px] font-black text-foreground">{packageSummary.dataLayerTags.length}</span>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Data Layer Tags</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-surface-secondary border border-border rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg flex items-center justify-center shrink-0">
                      <MousePointer2 size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[24px] font-black text-foreground">{packageSummary.userInteractions.length}</span>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">User Interactions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-surface-secondary border border-border rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-lg flex items-center justify-center shrink-0">
                      <Activity size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[24px] font-black text-foreground">{packageSummary.systemEvents.length}</span>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">System Events</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-surface-secondary border border-border rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg flex items-center justify-center shrink-0">
                      <MessageSquare size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[24px] font-black text-foreground">{baCommentCount}</span>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">BA Comment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: What Happens Next */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <h3 className="text-[16px] font-bold text-foreground mb-3">
                  What Happens Next
                </h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-3 text-[14px] text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span>All approved tracking assets will be delivered to the assigned developer</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span>A development task will be initiated</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span>You will be notified when staging validation is ready</span>
                  </li>
                </ul>
              </div>

              {/* Section 3: Optional Package Contents */}
              <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setIsPackageContentOpen(!isPackageContentOpen)}
                  className="w-full p-5 flex items-center justify-between hover:bg-surface-secondary transition-colors"
                >
                  <span className="text-[14px] font-bold text-foreground">View Package Contents</span>
                  {isPackageContentOpen ? (
                    <ChevronUp size={20} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isPackageContentOpen && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t-2 border-border overflow-hidden"
                    >
                      <div className="p-6 flex flex-col gap-6 bg-surface-secondary">
                        
                        {/* Data Layer Tags */}
                        {packageSummary.dataLayerTags.length > 0 && (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <Database size={16} className="text-emerald-600" />
                              <h4 className="text-[14px] font-bold text-foreground">Data Layer Tags</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {packageSummary.dataLayerTags.map((tag, idx) => (
                                <div key={idx} className="px-3 py-1.5 bg-card border border-border rounded-lg">
                                  <span className="text-[13px] font-mono text-foreground">{tag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* User Interactions */}
                        {packageSummary.userInteractions.length > 0 && (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <MousePointer2 size={16} className="text-blue-600" />
                              <h4 className="text-[14px] font-bold text-foreground">User Interactions</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {packageSummary.userInteractions.map((tag, idx) => (
                                <div key={idx} className="px-3 py-1.5 bg-card border border-border rounded-lg">
                                  <span className="text-[13px] font-mono text-foreground">{tag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* System Events */}
                        {packageSummary.systemEvents.length > 0 && (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <Activity size={16} className="text-purple-600" />
                              <h4 className="text-[14px] font-bold text-foreground">System Events</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {packageSummary.systemEvents.map((tag, idx) => (
                                <div key={idx} className="px-3 py-1.5 bg-card border border-border rounded-lg">
                                  <span className="text-[13px] font-mono text-foreground">{tag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Section 4: Primary CTA */}
              <div className="flex flex-col items-center gap-3 pt-4">
                <button
                  onClick={handleSendPackage}
                  className="w-full max-w-md px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[16px] font-black uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Send size={20} />
                  Send to Development
                </button>
                <p className="text-[12px] text-muted-foreground text-center max-w-md">
                  This will initiate implementation and move this journey to the validation stage
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-10 flex flex-col items-center text-center gap-6 shadow-sm"
            >
              {/* Success Icon */}
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
              </div>

              {/* Success Title */}
              <div className="flex flex-col gap-2">
                <h1 className="text-[28px] font-black text-foreground tracking-tight">
                  Package Sent Successfully
                </h1>
                <p className="text-[15px] text-muted-foreground font-medium leading-relaxed max-w-[500px]">
                  Development workflow has been initiated. You will be notified once implementation is staged.
                </p>
              </div>

              {/* Go to Validation Button */}
              <button
                onClick={handleGoToValidation}
                className="w-full max-w-md px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[16px] font-black uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
              >
                Go to Validation
                <ArrowRight size={20} />
              </button>
            </Motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsConfirmModalOpen(false)}
            />
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              <div 
                className="bg-card border-2 border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between p-6 border-b border-border">
                  <div className="flex-1">
                    <h3 className="text-[20px] font-bold text-foreground mb-2">
                      Send Tracking Package to Development?
                    </h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      This will initiate implementation and move this journey to the validation stage.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors"
                  >
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 bg-surface-secondary">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                      <Package size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-bold text-foreground">Package Contents</span>
                        <span className="text-[12px] text-muted-foreground">
                          {packageSummary.dataLayerTags.length + packageSummary.userInteractions.length + packageSummary.systemEvents.length} approved tracking assets
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                      <Send size={20} className="text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-bold text-foreground">Development Task</span>
                        <span className="text-[12px] text-muted-foreground">
                          Assigned developer will receive implementation package
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                  <button
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="px-5 py-2.5 bg-surface-secondary border border-border hover:border-accent rounded-lg text-[13px] font-bold text-foreground transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSend}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Send size={16} />
                    Confirm & Send
                  </button>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};