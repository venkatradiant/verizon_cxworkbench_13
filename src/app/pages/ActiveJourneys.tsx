import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  Search, 
  ChevronDown, 
  ArrowRight,
  Activity,
  Layers,
  CheckCircle2,
  X,
  Plus,
  LayoutGrid,
  Smartphone,
  Globe,
  Filter,
  Users,
  List,
  LayoutList
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { StatusBadge } from '@/app/components/Foundation';
import { DemoNoticeModal } from '@/app/components/DemoNoticeModal';
import { mockJourneys, Journey } from '@/app/data/mockJourneys';
import { clsx } from 'clsx';

// --- Sub-components ---

const MetricCard = ({ label, value, subtext, icon: Icon, colorClass }: { label: string, value: string, subtext: string, icon: any, colorClass?: string }) => (
  <div className="bg-card border border-border p-5 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-all flex-1 min-w-[240px]">
    <div className="flex justify-between items-start">
      <div className={clsx("w-10 h-10 rounded-lg bg-surface-primary flex items-center justify-center", colorClass || "text-muted-foreground")}>
        <Icon size={18} />
      </div>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="text-[28px] font-bold text-foreground tracking-tight">{value}</span>
      <span className="text-[12px] text-muted-foreground font-medium">{subtext}</span>
    </div>
  </div>
);

const FilterDropdown = ({ label, options, selected, onSelect }: { label: string, options: string[], selected: string, onSelect: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 bg-card border rounded-xl shadow-sm hover:border-muted-foreground transition-all cursor-pointer min-w-[140px] justify-between",
          selected !== 'All' ? "border-accent/40 ring-1 ring-accent/5" : "border-border"
        )}
      >
        <div className="flex flex-col items-start leading-none">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</span>
          <span className="text-[13px] font-bold text-foreground truncate max-w-[100px]">{selected}</span>
        </div>
        <ChevronDown size={14} className={clsx("text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden">
            {['All', ...options].map(opt => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-surface-secondary flex items-center justify-between",
                  selected === opt ? "bg-surface-secondary text-accent font-bold" : "text-foreground"
                )}
              >
                {opt}
                {selected === opt && <CheckCircle2 size={12} className="text-accent" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const ActiveJourneys = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location.state]);
  
  // Filter States
  const [platform, setPlatform] = useState('All');
  const [channel, setChannel] = useState('All');
  const [status, setPlatformStatus] = useState('All');
  const [source, setSource] = useState('All');
  const [domain, setDomain] = useState('All');
  const [owner, setOwner] = useState('All');
  
  // View Mode State
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Static Filter Options
  const platforms = ['vzw.com', 'Verizon Business', 'Visible'];
  const channels = ['Web', 'Mobile', 'Hybrid'];
  const statuses = ['Not started', 'In progress', 'Completed', 'Artifact generated'];
  const sources = ['Figma Design', 'Jira Ticket', 'Analytics Sync', 'Data Layer Discovery'];
  const domains = ['Sales', 'Growth', 'Service', 'Retention', 'Security', 'Plan', 'Broadband', 'Account', 'Business'];
  const owners = ['Abhinav Saxena', 'Sarah Chen', 'Michael Scott', 'System Sync'];

  const tabs = [
    { id: 'All', label: 'All' },
    { id: 'Existing', label: 'Existing Journeys' },
    { id: 'Review', label: 'New Journeys to Review' },
    { id: 'Created', label: 'Created Journeys' },
  ];

  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case 'Existing':
        return mockJourneys.filter(j => j.sourceType === 'System' || !j.sourceType);
      case 'Review':
        return mockJourneys.filter(j => j.sourceType === 'Figma' || j.sourceType === 'Jira');
      case 'Created':
        return mockJourneys.filter(j => j.sourceType === 'Manual');
      default:
        return mockJourneys;
    }
  }, [activeTab]);

  const finalFilteredJourneys = useMemo(() => {
    return filteredByTab.filter(j => {
      const matchesSearch = j.journeyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           j.autoGeneratedGoal.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPlatform = platform === 'All' || j.environmentLink.toLowerCase().includes(platform.toLowerCase().replace(' ', ''));
      const matchesChannel = channel === 'All' || j.platform === channel;
      const matchesStatus = status === 'All' || j.status === status || (status === 'Not started' && (j.sourceType === 'Figma' || j.sourceType === 'Jira'));
      const matchesSource = source === 'All' || (j.source && j.source.includes(source));
      const matchesDomain = domain === 'All' || j.category === domain;
      const matchesOwner = owner === 'All' || j.lastUpdatedBy.includes(owner);

      return matchesSearch && matchesPlatform && matchesChannel && matchesStatus && matchesSource && matchesDomain && matchesOwner;
    });
  }, [filteredByTab, searchQuery, platform, channel, status, source, domain, owner]);

  const stats = useMemo(() => {
    return {
      total: finalFilteredJourneys.length,
      inProgress: finalFilteredJourneys.filter(j => j.status === 'In progress').length,
      completed: finalFilteredJourneys.filter(j => j.status === 'Completed' || j.status === 'Artifact generated').length
    };
  }, [finalFilteredJourneys]);

  const clearFilters = () => {
    setPlatform('All');
    setChannel('All');
    setPlatformStatus('All');
    setSource('All');
    setDomain('All');
    setOwner('All');
    setSearchQuery('');
  };

  const hasActiveFilters = platform !== 'All' || channel !== 'All' || status !== 'All' || source !== 'All' || domain !== 'All' || owner !== 'All' || searchQuery !== '';

  // Kanban columns configuration
  const kanbanColumns = [
    { id: 'ready', label: 'Ready for Analysis', statuses: ['Not started'], colorClass: 'border-t-amber-400' },
    { id: 'in-progress', label: 'In Progress', statuses: ['In progress'], colorClass: 'border-t-blue-500' },
    { id: 'artifact', label: 'Sent to Dev', statuses: ['Artifact generated'], colorClass: 'border-t-purple-500' },
    { id: 'completed', label: 'Completed', statuses: ['Completed'], colorClass: 'border-t-emerald-500' }
  ];

  // Group journeys by status for Kanban view
  const kanbanGroupedJourneys = useMemo(() => {
    return kanbanColumns.map(column => ({
      ...column,
      journeys: finalFilteredJourneys.filter(j => column.statuses.includes(j.status))
    }));
  }, [finalFilteredJourneys]);

  return (
    <div className="flex-1 flex flex-col min-h-full py-10 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto w-full px-8 flex flex-col gap-8">
        
        {/* 1. Page Header */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
              Journeys
            </h1>
            <p className="text-[13px] text-muted-foreground font-medium">
              Unified repository of journeys detected from Analytics, Data Layer, Figma, and Jira.
            </p>
          </div>

          <button 
            onClick={() => setIsDemoModalOpen(true)}
            className="bg-foreground text-background px-5 py-2.5 rounded-2xl text-[13px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Create New Journey
          </button>
        </header>

        {/* Demo Notice Modal */}
        <DemoNoticeModal 
          isOpen={isDemoModalOpen} 
          onClose={() => setIsDemoModalOpen(false)} 
        />

        {/* 2. Tab Navigation */}
        <div className="flex items-center border-b border-border w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                clearFilters();
              }}
              className={clsx(
                "px-6 py-3 text-[14px] font-bold transition-all relative",
                activeTab === tab.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* 3. Context-Aware Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full">
          <FilterDropdown label="Platform" options={platforms} selected={platform} onSelect={setPlatform} />
          
          {(activeTab === 'All' || activeTab === 'Existing' || activeTab === 'Review') && (
            <FilterDropdown label="Channel" options={channels} selected={channel} onSelect={setChannel} />
          )}

          {(activeTab === 'All' || activeTab === 'Existing' || activeTab === 'Created') && (
            <FilterDropdown label="Status" options={statuses} selected={status} onSelect={setPlatformStatus} />
          )}

          {(activeTab === 'All' || activeTab === 'Existing') && (
            <FilterDropdown label="Source" options={sources} selected={source} onSelect={setSource} />
          )}

          {(activeTab === 'All' || activeTab === 'Existing' || activeTab === 'Review') && (
            <FilterDropdown label="Business Area" options={domains} selected={domain} onSelect={setDomain} />
          )}

          {activeTab === 'Created' && (
            <FilterDropdown label="Owner" options={owners} selected={owner} onSelect={setOwner} />
          )}
          
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-accent hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer ml-auto"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* 4. Insight Cards */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-5">
            <MetricCard 
              label="Total Journeys" 
              value={stats.total.toString()} 
              subtext={activeTab === 'Created' && stats.total === 0 ? "No manual journeys yet" : `Filtered from ${activeTab.toLowerCase()} set`} 
              icon={Layers} 
            />
            <MetricCard 
              label="Journeys In Progress" 
              value={stats.inProgress.toString()} 
              subtext={activeTab === 'Created' && stats.total === 0 ? "No active work" : "Optimization active"} 
              icon={Activity} 
              colorClass="text-blue-500"
            />
            <MetricCard 
              label="Completed / Optimized" 
              value={stats.completed.toString()} 
              subtext={activeTab === 'Created' && stats.total === 0 ? "None finished" : "Measurement artifacts ready"} 
              icon={CheckCircle2} 
              colorClass="text-emerald-500"
            />
          </div>
        </section>

        {/* 5. Search & Results - View Toggle Available */}
        <section className="flex flex-col gap-6">
          {(activeTab !== 'Created' || finalFilteredJourneys.length > 0) && (
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={16} />
                <Input 
                  placeholder="Search journeys by name, platform, or domain..." 
                  className="h-11 pl-10 bg-card border-border rounded-2xl text-[14px] font-medium focus-visible:ring-0 focus:border-accent/40 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                  Showing {finalFilteredJourneys.length} of {filteredByTab.length} Results
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center bg-surface-primary border border-border rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('list')}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5",
                      viewMode === 'list' 
                        ? "bg-card text-accent shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutList size={14} />
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5",
                      viewMode === 'kanban' 
                        ? "bg-card text-accent shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutGrid size={14} />
                    Kanban View
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={clsx(
            "bg-card border border-border rounded-2xl overflow-hidden shadow-sm",
            activeTab === 'Created' && finalFilteredJourneys.length === 0 && "py-20"
          )}>
            {activeTab === 'Created' && finalFilteredJourneys.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center px-6 gap-6 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-surface-primary flex items-center justify-center text-accent/40 border border-border">
                  <Plus size={40} strokeWidth={1} />
                </div>
                <div className="flex flex-col gap-2">
                   <h3 className="text-[20px] font-bold text-foreground tracking-tight">No created journeys yet</h3>
                   <p className="text-[14px] text-muted-foreground font-medium leading-relaxed">
                     Journeys you create manually will appear here. Create a new journey to start defining a custom measurement narrative.
                   </p>
                </div>
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="bg-foreground text-background px-8 py-3 rounded-2xl text-[14px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={18} />
                  Create New Journey
                </button>
              </div>
            ) : viewMode === 'list' ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-primary border-b border-border sticky top-0 z-10 backdrop-blur-sm">
                        <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Journey</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Platform</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Channel</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Domain</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last Updated</th>
                        <th className="px-6 py-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {finalFilteredJourneys.map((j) => (
                        <tr 
                          key={j.journeyId} 
                          className="hover:bg-surface-secondary transition-colors group cursor-pointer"
                          onClick={() => navigate(`/playground/journey/${j.journeyId}/overview`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-lg bg-surface-primary flex items-center justify-center text-muted-foreground group-hover:text-accent transition-all">
                                <j.icon size={18} strokeWidth={1.5} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[14px] font-bold text-foreground truncate group-hover:text-accent transition-colors">{j.journeyName}</span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate">{j.source || 'Data Layer Sync'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge 
                              status={j.status === 'Completed' || j.status === 'Artifact generated' ? 'success' : j.status === 'In progress' ? 'neutral' : 'warning'} 
                              label={j.status} 
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                               <span className="text-[13px] font-bold text-foreground whitespace-nowrap">
                                 {j.environmentLink.includes('vzw.com') ? 'vzw.com' : 
                                  j.environmentLink.includes('visible.com') ? 'visible.com' : 
                                  j.environmentLink.includes('business') ? 'Verizon Business' : 
                                  j.environmentLink.includes('figma') ? 'Figma Design' : 'Jira Ticket'}
                               </span>
                               <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{j.environmentLink.includes('http') ? j.environmentLink.split('/')[2] : 'Source Link'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                              {j.platform === 'Mobile' ? <Smartphone size={14} /> : <Globe size={14} />}
                              {j.platform}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[12px] font-bold text-muted-foreground px-2.5 py-1 bg-surface-primary rounded-lg">
                              {j.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-medium text-foreground">{j.lastUpdated}</span>
                              <span className="text-[10px] text-muted-foreground font-medium">by {j.lastUpdatedBy.split(' ')[0]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all inline-block" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              // Kanban View
              <div className="flex gap-4 p-6 overflow-x-auto">
                {kanbanGroupedJourneys.map((column) => (
                  <div key={column.id} className="flex flex-col gap-3 min-w-[320px] flex-1">
                    {/* Column Header */}
                    <div className="flex items-center justify-between px-3">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-[13px] font-black text-foreground uppercase tracking-wide">{column.label}</h3>
                        <span className="text-[10px] font-bold text-muted-foreground">{column.journeys.length} {column.journeys.length === 1 ? 'Journey' : 'Journeys'}</span>
                      </div>
                    </div>

                    {/* Column Cards */}
                    <div className="flex flex-col gap-3 min-h-[200px]">
                      {column.journeys.map((j) => (
                        <div
                          key={j.journeyId}
                          onClick={() => navigate(`/playground/journey/${j.journeyId}/overview`)}
                          className={clsx(
                            "bg-background border-2 border-border rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:border-accent/40 hover:shadow-md transition-all group border-t-4",
                            column.colorClass
                          )}
                        >
                          {/* Card Header */}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-primary flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors shrink-0">
                              <j.icon size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <h4 className="text-[14px] font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">{j.journeyName}</h4>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{j.source || 'Data Layer Sync'}</span>
                            </div>
                          </div>

                          {/* Card Meta Info */}
                          <div className="flex flex-col gap-2 pt-2 border-t border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium text-muted-foreground">Platform</span>
                              <span className="text-[12px] font-bold text-foreground">
                                {j.environmentLink.includes('vzw.com') ? 'vzw.com' : 
                                 j.environmentLink.includes('visible.com') ? 'visible.com' : 
                                 j.environmentLink.includes('business') ? 'Verizon Business' : 
                                 j.environmentLink.includes('figma') ? 'Figma Design' : 'Jira Ticket'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium text-muted-foreground">Channel</span>
                              <div className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                                {j.platform === 'Mobile' ? <Smartphone size={12} /> : <Globe size={12} />}
                                {j.platform}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium text-muted-foreground">Domain</span>
                              <span className="text-[11px] font-bold text-muted-foreground px-2 py-0.5 bg-surface-primary rounded-md">
                                {j.category}
                              </span>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border">
                            <span className="font-medium">{j.lastUpdated}</span>
                            <span className="font-medium">by {j.lastUpdatedBy.split(' ')[0]}</span>
                          </div>
                        </div>
                      ))}

                      {/* Empty State */}
                      {column.journeys.length === 0 && (
                        <div className="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-surface-primary/30">
                          <span className="text-[12px] font-medium text-muted-foreground">No journeys in this stage</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};