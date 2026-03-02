import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Database,
  MousePointer2,
  Activity,
  FileJson,
  Send,
  Clock,
  Download,
  Copy,
  Eye,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const Motion = motion;

interface ShippingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyId: string;
}

// Demo data for realistic presentation
const demoDataLayerVariables = [
  { variableName: 'pageName', value: 'DeviceSelection', changeType: 'Unchanged', source: 'System' },
  { variableName: 'deviceType', value: 'iPhone', changeType: 'Updated', source: 'User Edited' },
  { variableName: 'promotionType', value: 'LimitedOffer', changeType: 'New', source: 'AI Generated' },
  { variableName: 'flowName', value: '5GUpgradeFlow', changeType: 'Unchanged', source: 'System' },
  { variableName: 'businessUnit', value: 'Consumer', changeType: 'Unchanged', source: 'System' },
  { variableName: 'experimentGroup', value: 'VariantB', changeType: 'New', source: 'AI Generated' },
  { variableName: 'customerSegment', value: 'Premium', changeType: 'Updated', source: 'User Edited' },
  { variableName: 'pageCategory', value: 'Commerce', changeType: 'Unchanged', source: 'System' },
];

const demoUserInteractions = [
  { eventName: 'ctaName', value: 'SelectDevice', changeType: 'Updated', source: 'User Edited' },
  { eventName: 'ctaName', value: 'ViewPlans', changeType: 'New', source: 'AI Generated' },
  { eventName: 'linkName', value: 'LearnMore', changeType: 'Unchanged', source: 'System' },
  { eventName: 'ctaName', value: 'ConfirmUpgrade', changeType: 'New', source: 'AI Generated' },
  { eventName: 'ctaName', value: 'CompareDevices', changeType: 'Updated', source: 'User Edited' },
  { eventName: 'linkName', value: 'ViewDetails', changeType: 'New', source: 'AI Generated' },
  { eventName: 'ctaName', value: 'AddToCart', changeType: 'Unchanged', source: 'System' },
  { eventName: 'ctaName', value: 'CheckoutNow', changeType: 'Updated', source: 'User Edited' },
];

const demoSystemEvents = [
  { eventType: 'pageLoad', trigger: 'Initial Load', changeType: 'Unchanged', source: 'System' },
  { eventType: 'bannerDisplayed', trigger: 'Promo Banner', changeType: 'Updated', source: 'AI Generated' },
  { eventType: 'promoImpression', trigger: 'Offer Card', changeType: 'New', source: 'AI Generated' },
  { eventType: 'validationErrorShown', trigger: 'Form Submit', changeType: 'Updated', source: 'User Edited' },
  { eventType: 'modalOpened', trigger: 'User Action', changeType: 'New', source: 'AI Generated' },
  { eventType: 'contentLoaded', trigger: 'Dynamic Content', changeType: 'Unchanged', source: 'System' },
];

const demoGeneratedFiles = [
  { name: 'tracking-spec.json', type: 'JSON', scope: 'Delta Update', size: '18 KB' },
  { name: 'data-layer-schema.json', type: 'JSON', scope: 'Full Schema', size: '12 KB' },
  { name: 'event-mapping.json', type: 'JSON', scope: 'Delta Update', size: '10 KB' },
  { name: 'delta-update.json', type: 'JSON', scope: 'Incremental Change', size: '6 KB' },
];

export const ShippingConfirmationModal = ({ isOpen, onClose, journeyId }: ShippingConfirmationModalProps) => {
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    dataLayer: true,
    userInteractions: false,
    systemEvents: false
  });
  const [developerComments, setDeveloperComments] = useState('');
  const [isShipped, setIsShipped] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleConfirmShip = () => {
    sessionStorage.setItem(`vzw-validation-enabled-${journeyId}`, 'true');
    sessionStorage.setItem(`vzw-package-sent-${journeyId}`, 'true');

    // Show confirmation screen instead of navigating immediately
    setIsShipped(true);
  };

  const handleBackToDashboard = () => {
    navigate('/playground');
    onClose();
    setIsShipped(false);
  };

  const handleDownload = (fileName: string) => {
    toast.success(`Downloaded ${fileName}`);
  };

  const handleCopyJSON = () => {
    toast.success('JSON copied to clipboard');
  };

  const handleViewFile = (fileName: string) => {
    toast.info(`Viewing ${fileName}`);
  };

  if (!isOpen) return null;

  // Show confirmation screen after shipping
  if (isShipped) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
          >
            {/* Success Content */}
            <div className="p-8 sm:p-12 flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 border-4 border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={2.5} />
              </div>

              {/* Heading */}
              <h2 className="text-[24px] sm:text-[28px] font-black text-foreground mb-3">
                Package Sent to Development
              </h2>

              {/* Description */}
              <p className="text-[15px] sm:text-[16px] text-muted-foreground mb-2 max-w-md">
                Your tracking implementation package has been successfully delivered to the development team.
              </p>

              <p className="text-[14px] sm:text-[15px] text-foreground font-medium mb-8 max-w-md">
                You will be notified once the code is implemented and validation results are available.
              </p>

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-surface-secondary border border-border rounded-lg p-4">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Files Delivered
                  </div>
                  <div className="text-[20px] font-black text-foreground">
                    4 JSON
                  </div>
                </div>
                <div className="bg-surface-secondary border border-border rounded-lg p-4">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Definitions
                  </div>
                  <div className="text-[20px] font-black text-foreground">
                    42 Tags
                  </div>
                </div>
              </div>

              {/* Notification Info */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-8 w-full max-w-md">
                <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="text-[13px] font-bold text-blue-900 dark:text-blue-200 mb-1">
                    Expected Timeline
                  </div>
                  <div className="text-[12px] text-blue-700 dark:text-blue-300">
                    Implementation typically takes 2-5 business days. You'll receive an email notification when validation results are ready.
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleBackToDashboard}
                className="px-8 py-3 bg-foreground hover:bg-black dark:hover:bg-zinc-800 text-background rounded-xl text-[14px] font-bold transition-all shadow-md flex items-center gap-2"
              >
                Back to Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          </Motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-border bg-surface-secondary">
            <div className="flex-1 pr-4">
              <h2 className="text-[20px] sm:text-[24px] font-black text-foreground mb-1 sm:mb-2">
                Developer Handoff Summary
              </h2>
              <p className="text-[13px] sm:text-[14px] text-muted-foreground">
                Review tracking definitions before shipping to development
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-surface-primary transition-colors shrink-0"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:gap-6">
              
              {/* Summary Section */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-widest">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Tracking Definitions</span>
                    </div>
                    <div className="pl-0 sm:pl-6 flex flex-col gap-1.5">
                      <div className="text-[13px] text-emerald-800 dark:text-emerald-300">
                        <span className="font-black text-[18px] sm:text-[20px]">42</span> <span className="font-medium">Approved</span>
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-emerald-700 dark:text-emerald-400">
                        12 Data Layer Variables
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-emerald-700 dark:text-emerald-400">
                        24 Interaction Events
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-emerald-700 dark:text-emerald-400">
                        6 System Events
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-widest">
                      <FileJson size={16} className="text-emerald-600 shrink-0" />
                      <span>Deployment Info</span>
                    </div>
                    <div className="pl-0 sm:pl-6 flex flex-col gap-1.5">
                      <div className="text-[11px] sm:text-[12px] text-emerald-700 dark:text-emerald-400">
                        <span className="font-bold">Scope:</span> Incremental Update
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-emerald-700 dark:text-emerald-400">
                        <span className="font-bold">Environment:</span> Staging
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <Clock size={12} className="shrink-0" />
                        <span className="font-bold">Last Updated:</span> 2 hours ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes for Developer */}
              <div className="bg-card border-2 border-border rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={16} className="text-blue-600 shrink-0" />
                  <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground">
                    Additional Notes for Developer
                  </h3>
                  <span className="text-[11px] text-muted-foreground">(Optional)</span>
                </div>
                <textarea
                  value={developerComments}
                  onChange={(e) => setDeveloperComments(e.target.value)}
                  placeholder="Add any context, implementation notes, or special instructions for the development team..."
                  className="w-full min-h-[100px] p-3 text-[13px] text-foreground bg-surface-secondary border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-muted-foreground"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-muted-foreground">
                    These notes will be included in the handoff package
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {developerComments.length}/500
                  </span>
                </div>
              </div>

              {/* Expandable Change Sections */}
              <div className="flex flex-col gap-3">
                
                {/* Data Layer Changes */}
                <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('dataLayer')}
                    className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Database size={18} className="text-emerald-600 shrink-0" />
                      <span className="text-[14px] sm:text-[15px] font-bold text-foreground">
                        Data Layer Changes (12)
                      </span>
                    </div>
                    {expandedSections.dataLayer ? (
                      <ChevronUp size={20} className="text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {expandedSections.dataLayer && (
                    <div className="border-t-2 border-border">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                          <thead>
                            <tr className="bg-surface-secondary border-b border-border">
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Variable Name</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Value</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Change Type</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Source</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {demoDataLayerVariables.map((item, idx) => (
                              <tr key={idx} className="hover:bg-surface-secondary/50">
                                <td className="px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-mono text-foreground">{item.variableName}</td>
                                <td className="px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] text-muted-foreground">{item.value}</td>
                                <td className="px-3 sm:px-4 py-2.5">
                                  <span className={clsx(
                                    "px-2 py-0.5 border rounded text-[10px] font-bold uppercase whitespace-nowrap",
                                    item.changeType === 'New' 
                                      ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                      : item.changeType === 'Updated'
                                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                                      : "bg-zinc-100 dark:bg-zinc-900/20 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                                  )}>
                                    {item.changeType}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 py-2.5 text-[11px] sm:text-[12px] text-muted-foreground">{item.source}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Interaction Events */}
                <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('userInteractions')}
                    className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <MousePointer2 size={18} className="text-blue-600 shrink-0" />
                      <span className="text-[14px] sm:text-[15px] font-bold text-foreground">
                        User Interaction Events (24)
                      </span>
                    </div>
                    {expandedSections.userInteractions ? (
                      <ChevronUp size={20} className="text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {expandedSections.userInteractions && (
                    <div className="border-t-2 border-border">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                          <thead>
                            <tr className="bg-surface-secondary border-b border-border">
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Event Name</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Element</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Change Type</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Source</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {demoUserInteractions.map((item, idx) => (
                              <tr key={idx} className="hover:bg-surface-secondary/50">
                                <td className="px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-mono text-foreground">{item.eventName}</td>
                                <td className="px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] text-muted-foreground">{item.value}</td>
                                <td className="px-3 sm:px-4 py-2.5">
                                  <span className={clsx(
                                    "px-2 py-0.5 border rounded text-[10px] font-bold uppercase whitespace-nowrap",
                                    item.changeType === 'New' 
                                      ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                      : item.changeType === 'Updated'
                                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                                      : "bg-zinc-100 dark:bg-zinc-900/20 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                                  )}>
                                    {item.changeType}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 py-2.5 text-[11px] sm:text-[12px] text-muted-foreground">{item.source}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* System Events */}
                <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('systemEvents')}
                    className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Activity size={18} className="text-purple-600 shrink-0" />
                      <span className="text-[14px] sm:text-[15px] font-bold text-foreground">
                        System Events (6)
                      </span>
                    </div>
                    {expandedSections.systemEvents ? (
                      <ChevronUp size={20} className="text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {expandedSections.systemEvents && (
                    <div className="border-t-2 border-border">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                          <thead>
                            <tr className="bg-surface-secondary border-b border-border">
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Event Type</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Trigger</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Change Type</th>
                              <th className="px-3 sm:px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Source</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {demoSystemEvents.map((item, idx) => (
                              <tr key={idx} className="hover:bg-surface-secondary/50">
                                <td className="px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-mono text-foreground">{item.eventType}</td>
                                <td className="px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] text-muted-foreground">{item.trigger}</td>
                                <td className="px-3 sm:px-4 py-2.5">
                                  <span className={clsx(
                                    "px-2 py-0.5 border rounded text-[10px] font-bold uppercase whitespace-nowrap",
                                    item.changeType === 'New' 
                                      ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                      : item.changeType === 'Updated'
                                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                                      : "bg-zinc-100 dark:bg-zinc-900/20 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                                  )}>
                                    {item.changeType}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 py-2.5 text-[11px] sm:text-[12px] text-muted-foreground">{item.source}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* File Output Summary */}
              <div className="bg-card border-2 border-border rounded-xl p-4 sm:p-5">
                <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <FileJson size={16} className="shrink-0" />
                  <span>Generated Files</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {demoGeneratedFiles.map((file, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-surface-secondary border border-border rounded-lg">
                      <FileJson size={18} className="text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] sm:text-[13px] font-mono font-bold text-foreground break-all">{file.name}</div>
                        <div className="text-[10px] sm:text-[11px] text-muted-foreground">
                          {file.type} • {file.scope} • {file.size}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleDownload(file.name)}
                          className="p-1.5 hover:bg-surface-primary rounded transition-colors"
                          title="Download"
                        >
                          <Download size={14} className="text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={handleCopyJSON}
                          className="p-1.5 hover:bg-surface-primary rounded transition-colors"
                          title="Copy JSON"
                        >
                          <Copy size={14} className="text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => handleViewFile(file.name)}
                          className="p-1.5 hover:bg-surface-primary rounded transition-colors"
                          title="View File"
                        >
                          <Eye size={14} className="text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-border bg-surface-secondary">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-card border border-border hover:border-foreground rounded-xl text-[13px] font-bold text-foreground transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmShip}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Confirm & Ship
            </button>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};