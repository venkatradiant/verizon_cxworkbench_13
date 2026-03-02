import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Database, 
  Tag as TagIcon, 
  RefreshCcw,
  Plus,
  Hash,
  Box,
  Globe,
  ChevronDown,
  Filter,
  X,
  CheckCircle2,
  FolderOpen,
  ExternalLink,
  MoreHorizontal,
  Settings,
  FileText,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Info,
  Lock,
  CheckSquare,
  Download,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  Brain,
  Eye
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { DemoNoticeModal } from '@/app/components/DemoNoticeModal';
import { BusinessRuleModal, EditDataLayerVariableModal } from '@/app/components/EditModals';
import { DataLayerVariableModal } from '@/app/components/DataLayerVariableModal';
import { AIFeedbackLog } from '@/app/components/AIFeedbackLog';
import { Observability } from '@/app/components/Observability';

// --- Types & Mock Data ---

interface DataDefinition {
  id: string;
  name: string;
  namespace: string;
  path: string;
  lastUpdated: string;
  status: 'Active' | 'Deprecated' | 'Draft';
  usageCount: number;
}

interface BusinessRule {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  source: 'System' | 'User-defined';
  lastModified: string;
}

interface DataLayerVariable {
  id: string;
  variableName: string;
  description: string;
  acceptableValues: string;
  type: string;
  scope: string;
  required: boolean;
  source: 'AI-suggested' | 'User-added';
}

const mockDataDefinitions: DataDefinition[] = [
  { id: '1', name: 'retail:hero-banner', namespace: 'Retail', path: '/vzw.com/retail/hero-banner', lastUpdated: '2026-02-01', status: 'Active', usageCount: 42 },
  { id: '2', name: 'retail:product-grid', namespace: 'Retail', path: '/vzw.com/retail/product-grid', lastUpdated: '2026-01-15', status: 'Active', usageCount: 128 },
  { id: '3', name: 'vzw:conversion-funnel', namespace: 'Verizon', path: '/vzw.com/verizon/conversion-funnel', lastUpdated: '2026-02-04', status: 'Active', usageCount: 312 },
  { id: '4', name: 'vzw:cart-interaction', namespace: 'Verizon', path: '/vzw.com/verizon/cart-interaction', lastUpdated: '2026-01-20', status: 'Active', usageCount: 89 },
  { id: '5', name: 'global:header-nav', namespace: 'Global', path: '/vzw.com/global/header-nav', lastUpdated: '2025-12-10', status: 'Deprecated', usageCount: 15 },
  { id: '6', name: 'mobile:app-link', namespace: 'Mobile', path: '/vzw.com/mobile/app-link', lastUpdated: '2026-02-02', status: 'Active', usageCount: 56 },
  { id: '7', name: 'support:faq-search', namespace: 'Support', path: '/vzw.com/support/faq-search', lastUpdated: '2026-01-05', status: 'Draft', usageCount: 0 },
  { id: '8', name: 'retail:checkout-btn', namespace: 'Retail', path: '/vzw.com/retail/checkout-btn', lastUpdated: '2026-02-03', status: 'Active', usageCount: 204 },
  { id: '9', name: 'vzw:billing-overview', namespace: 'Verizon', path: '/vzw.com/verizon/billing-overview', lastUpdated: '2026-01-30', status: 'Active', usageCount: 77 },
  { id: '10', name: 'global:footer-links', namespace: 'Global', path: '/vzw.com/global/footer-links', lastUpdated: '2026-02-01', status: 'Active', usageCount: 45 },
];

const mockBusinessRules: BusinessRule[] = [
  { id: '1', name: 'Button Click Priority', description: 'Prioritize tracking primary CTAs over secondary navigation elements', status: 'Active', source: 'System', lastModified: '2026-01-15' },
  { id: '2', name: 'Page View Requirement', description: 'All page transitions must include page_name and page_category in data layer', status: 'Active', source: 'System', lastModified: '2026-02-01' },
  { id: '3', name: 'Commerce Event Sequencing', description: 'Track product impressions before click events in discovery flows', status: 'Active', source: 'User-defined', lastModified: '2026-01-20' },
  { id: '4', name: 'Form Validation Tracking', description: 'Capture validation errors as system events before submit attempts', status: 'Inactive', source: 'User-defined', lastModified: '2026-01-10' },
  { id: '5', name: 'Mobile Gesture Recognition', description: 'Distinguish between tap, swipe, and long-press interactions on mobile', status: 'Active', source: 'System', lastModified: '2026-02-05' },
  { id: '6', name: 'Funnel Step Tracking', description: 'Ensure sequential tracking of multi-step conversion funnels with step_number parameter', status: 'Active', source: 'System', lastModified: '2026-02-08' },
  { id: '7', name: 'Error Event Categorization', description: 'Classify errors by severity (critical, warning, info) in event parameters', status: 'Active', source: 'User-defined', lastModified: '2026-01-25' },
  { id: '8', name: 'Video Engagement Milestones', description: 'Track video playback at 25%, 50%, 75%, and 100% completion', status: 'Active', source: 'System', lastModified: '2026-02-03' },
  { id: '9', name: 'Search Result Click-Through', description: 'Capture search term and result position when users click search results', status: 'Active', source: 'User-defined', lastModified: '2026-01-28' },
  { id: '10', name: 'Cart Abandonment Triggers', description: 'Fire abandonment event after 5 minutes of cart inactivity', status: 'Inactive', source: 'User-defined', lastModified: '2026-01-12' },
  { id: '11', name: 'Cross-Sell Impression Tracking', description: 'Track product recommendations shown but not clicked', status: 'Active', source: 'System', lastModified: '2026-02-06' },
  { id: '12', name: 'Promo Code Application', description: 'Capture promo code value and discount amount on successful application', status: 'Active', source: 'User-defined', lastModified: '2026-01-18' },
  { id: '13', name: 'Navigation Pattern Analysis', description: 'Track user navigation path through site sections for journey mapping', status: 'Active', source: 'System', lastModified: '2026-02-04' },
  { id: '14', name: 'Payment Method Selection', description: 'Record payment type chosen during checkout flow', status: 'Active', source: 'User-defined', lastModified: '2026-01-22' },
  { id: '15', name: 'Session Timeout Warning', description: 'Trigger event when session timeout warning is displayed to user', status: 'Inactive', source: 'System', lastModified: '2026-01-08' },
  { id: '16', name: 'Filter Interaction Tracking', description: 'Track filter selections on product listing and search pages', status: 'Active', source: 'User-defined', lastModified: '2026-02-02' },
  { id: '17', name: 'Live Chat Engagement', description: 'Capture chat initiation, duration, and resolution status', status: 'Active', source: 'System', lastModified: '2026-01-30' },
  { id: '18', name: 'Download Event Tracking', description: 'Track file downloads with file type and size parameters', status: 'Active', source: 'User-defined', lastModified: '2026-01-16' },
  { id: '19', name: 'Comparison Tool Usage', description: 'Track product comparisons including items compared and final selection', status: 'Inactive', source: 'User-defined', lastModified: '2026-01-14' },
  { id: '20', name: 'Newsletter Subscription', description: 'Capture newsletter opt-in/opt-out events with preference details', status: 'Active', source: 'System', lastModified: '2026-02-07' },
];

const mockDataLayerVariables: DataLayerVariable[] = [
  { id: '1', variableName: 'page_name', description: 'Human-readable page identifier', acceptableValues: 'String (camelCase)', type: 'string', scope: 'page', required: true, source: 'AI-suggested' },
  { id: '2', variableName: 'page_category', description: 'Top-level site section', acceptableValues: 'retail | support | account', type: 'enum', scope: 'page', required: true, source: 'AI-suggested' },
  { id: '3', variableName: 'user_segment', description: 'Customer classification', acceptableValues: 'new | returning | premium', type: 'enum', scope: 'session', required: false, source: 'AI-suggested' },
  { id: '4', variableName: 'journey_stage', description: 'Current funnel position', acceptableValues: 'awareness | consideration | conversion', type: 'enum', scope: 'page', required: false, source: 'User-added' },
  { id: '5', variableName: 'device_type', description: 'User device classification', acceptableValues: 'mobile | tablet | desktop', type: 'enum', scope: 'session', required: true, source: 'AI-suggested' },
  { id: '6', variableName: 'ab_test_variant', description: 'Active experiment variant', acceptableValues: 'control | variantA | variantB', type: 'enum', scope: 'session', required: false, source: 'User-added' },
];

const namespaceList = ['Retail', 'Verizon', 'Global', 'Mobile', 'Support'];

// --- Components ---

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

export const TagManager = () => {
  const [activeTab, setActiveTab] = useState<'business-rules' | 'data-layer' | 'ai-feedback' | 'observability'>('business-rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedBusinessRule, setSelectedBusinessRule] = useState<BusinessRule | null>(null);
  const [selectedDataLayerVariable, setSelectedDataLayerVariable] = useState<DataLayerVariable | null>(null);

  // Business Rules specific state
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>(mockBusinessRules);
  const [brSearchQuery, setBrSearchQuery] = useState('');
  const [brStatusFilter, setBrStatusFilter] = useState('all');
  const [brSourceFilter, setBrSourceFilter] = useState('all');
  const [brCurrentPage, setBrCurrentPage] = useState(1);
  const [brRowsPerPage, setBrRowsPerPage] = useState(10);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [isEditRuleModalOpen, setIsEditRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<BusinessRule | null>(null);

  // Data Layer specific state
  const [dataLayerVariables, setDataLayerVariables] = useState<DataLayerVariable[]>(mockDataLayerVariables);
  const [dlSearchQuery, setDlSearchQuery] = useState('');
  const [dlTypeFilter, setDlTypeFilter] = useState('all');
  const [dlScopeFilter, setDlScopeFilter] = useState('all');
  const [dlSourceFilter, setDlSourceFilter] = useState('all');
  const [dlRequiredOnly, setDlRequiredOnly] = useState(false);
  const [selectedVariableIds, setSelectedVariableIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<DataLayerVariable | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Telemetry configuration synchronized successfully');
    }, 1500);
  };

  const filteredTags = useMemo(() => {
    return mockDataDefinitions.filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tag.path.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNamespace = namespaceFilter === 'All' || tag.namespace === namespaceFilter;
      const matchesStatus = statusFilter === 'All' || tag.status === statusFilter;
      return matchesSearch && matchesNamespace && matchesStatus;
    });
  }, [searchQuery, namespaceFilter, statusFilter]);

  // Business Rules filtering
  const filteredBusinessRules = useMemo(() => {
    return businessRules.filter(rule => {
      const matchesSearch = brSearchQuery === '' || 
        rule.name.toLowerCase().includes(brSearchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(brSearchQuery.toLowerCase());
      
      const matchesStatus = brStatusFilter === 'all' || rule.status === brStatusFilter;
      const matchesSource = brSourceFilter === 'all' || rule.source === brSourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [businessRules, brSearchQuery, brStatusFilter, brSourceFilter]);

  // Data Layer filtering
  const filteredDataLayerVariables = useMemo(() => {
    return dataLayerVariables.filter(variable => {
      const matchesSearch = dlSearchQuery === '' || 
        variable.variableName.toLowerCase().includes(dlSearchQuery.toLowerCase()) ||
        variable.description.toLowerCase().includes(dlSearchQuery.toLowerCase()) ||
        variable.acceptableValues.toLowerCase().includes(dlSearchQuery.toLowerCase());
      
      const matchesType = dlTypeFilter === 'all' || variable.type === dlTypeFilter;
      const matchesScope = dlScopeFilter === 'all' || variable.scope === dlScopeFilter;
      const matchesSource = dlSourceFilter === 'all' || variable.source === dlSourceFilter;
      const matchesRequired = !dlRequiredOnly || variable.required;

      return matchesSearch && matchesType && matchesScope && matchesSource && matchesRequired;
    });
  }, [dataLayerVariables, dlSearchQuery, dlTypeFilter, dlScopeFilter, dlSourceFilter, dlRequiredOnly]);

  // Pagination
  const paginatedVariables = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredDataLayerVariables.slice(startIndex, endIndex);
  }, [filteredDataLayerVariables, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredDataLayerVariables.length / rowsPerPage);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVariableIds(new Set(paginatedVariables.map(v => v.id)));
    } else {
      setSelectedVariableIds(new Set());
    }
  };

  const handleSelectVariable = (id: string, checked: boolean) => {
    const newSet = new Set(selectedVariableIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedVariableIds(newSet);
  };

  const isAllSelected = paginatedVariables.length > 0 && paginatedVariables.every(v => selectedVariableIds.has(v.id));

  // CRUD operations
  const handleAddVariable = (newVariable: Omit<DataLayerVariable, 'id'>) => {
    const variable: DataLayerVariable = {
      ...newVariable,
      id: Math.random().toString(36).substr(2, 9)
    };
    setDataLayerVariables([...dataLayerVariables, variable]);
    toast.success('Variable added successfully');
    setIsAddModalOpen(false);
  };

  const handleEditVariable = (updatedVariable: DataLayerVariable) => {
    setDataLayerVariables(dataLayerVariables.map(v => 
      v.id === updatedVariable.id ? updatedVariable : v
    ));
    toast.success('Variable updated successfully');
    setIsEditModalOpen(false);
    setEditingVariable(null);
  };

  const handleDeleteVariable = (id: string) => {
    setDataLayerVariables(dataLayerVariables.filter(v => v.id !== id));
    toast.success('Variable deleted successfully');
  };

  const handleCopyVariable = (variable: DataLayerVariable) => {
    const copiedVariable: DataLayerVariable = {
      ...variable,
      id: Math.random().toString(36).substr(2, 9),
      variableName: `${variable.variableName}_copy`
    };
    setDataLayerVariables([...dataLayerVariables, copiedVariable]);
    toast.success('Variable copied successfully');
  };

  const handleBulkDelete = () => {
    if (selectedVariableIds.size === 0) return;
    setDataLayerVariables(dataLayerVariables.filter(v => !selectedVariableIds.has(v.id)));
    setSelectedVariableIds(new Set());
    toast.success(`${selectedVariableIds.size} variables deleted`);
  };

  const handleExport = () => {
    const dataToExport = filteredDataLayerVariables.map(v => ({
      variableName: v.variableName,
      description: v.description,
      acceptableValues: v.acceptableValues,
      type: v.type,
      scope: v.scope,
      required: v.required,
      source: v.source
    }));
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-layer-variables.json';
    a.click();
    toast.success('Variables exported successfully');
  };

  // Business Rules CRUD operations
  const handleAddRule = (newRule: BusinessRule) => {
    setBusinessRules([...businessRules, newRule]);
    toast.success('Business rule added successfully');
    setIsAddRuleModalOpen(false);
  };

  const handleEditRule = (updatedRule: BusinessRule) => {
    setBusinessRules(businessRules.map(r => 
      r.id === updatedRule.id ? updatedRule : r
    ));
    toast.success('Business rule updated successfully');
    setIsEditRuleModalOpen(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (id: string) => {
    setBusinessRules(businessRules.filter(r => r.id !== id));
    toast.success('Business rule deleted successfully');
  };

  const handleToggleRuleStatus = (ruleId: string) => {
    setBusinessRules(businessRules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' }
        : rule
    ));
    toast.success('Rule status updated');
  };

  // Business Rules Pagination
  const paginatedBusinessRules = useMemo(() => {
    const startIndex = (brCurrentPage - 1) * brRowsPerPage;
    const endIndex = startIndex + brRowsPerPage;
    return filteredBusinessRules.slice(startIndex, endIndex);
  }, [filteredBusinessRules, brCurrentPage, brRowsPerPage]);

  const brTotalPages = Math.ceil(filteredBusinessRules.length / brRowsPerPage);

  const clearFilters = () => {
    setSearchQuery('');
    setNamespaceFilter('All');
    setStatusFilter('All');
  };

  const hasActiveFilters = searchQuery !== '' || namespaceFilter !== 'All' || statusFilter !== 'All';

  const toggleRuleStatus = (ruleId: string) => {
    handleToggleRuleStatus(ruleId);
  };

  return (
    <div className="flex-1 flex flex-col min-h-full py-10 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto w-full px-8 flex flex-col gap-8">
        
        {/* 1. Page Header */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
              Telemetry
            </h1>
            <p className="text-[13px] text-muted-foreground font-medium">
              Configure tracking rules, data definitions, and measurement structure for AI-powered recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-card text-foreground border border-border px-5 py-2.5 rounded-2xl text-[13px] font-bold hover:border-foreground transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw size={16} className={clsx(isRefreshing && "animate-spin")} />
              Sync Registry
            </button>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-foreground text-background px-5 py-2.5 rounded-2xl text-[13px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Add Configuration
            </button>
          </div>
        </header>

        {/* Demo Notice Modal */}
        <DemoNoticeModal 
          isOpen={isDemoModalOpen} 
          onClose={() => setIsDemoModalOpen(false)} 
          featureName="Telemetry Configuration"
        />

        {/* 2. Insight Cards */}
        <section className="flex flex-wrap gap-5">
          <MetricCard 
            label="Active Rules" 
            value={mockBusinessRules.filter(r => r.status === 'Active').length.toString()} 
            subtext="Guiding AI recommendations" 
            icon={Settings} 
            colorClass="text-blue-500"
          />
          <MetricCard 
            label="Data Layer Vars" 
            value={mockDataLayerVariables.length.toString()} 
            subtext="Defined telemetry schema" 
            icon={Database} 
            colorClass="text-emerald-500"
          />
          <MetricCard 
            label="Sync Status" 
            value="Operational" 
            subtext="Last sync: 12m ago" 
            icon={Globe} 
            colorClass="text-purple-500"
          />
        </section>

        {/* 3. Tab Navigation */}
        <div className="flex items-center justify-between border-b border-border">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('business-rules')}
              className={clsx(
                "px-6 py-3 text-[14px] font-bold transition-all relative",
                activeTab === 'business-rules'
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Settings size={16} />
                Business Rules
              </div>
              {activeTab === 'business-rules' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('data-layer')}
              className={clsx(
                "px-6 py-3 text-[14px] font-bold transition-all relative",
                activeTab === 'data-layer'
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Database size={16} />
                Data Layer
              </div>
              {activeTab === 'data-layer' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('ai-feedback')}
              className={clsx(
                "px-6 py-3 text-[14px] font-bold transition-all relative",
                activeTab === 'ai-feedback'
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Brain size={16} />
                AI Feedback
              </div>
              {activeTab === 'ai-feedback' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('observability')}
              className={clsx(
                "px-6 py-3 text-[14px] font-bold transition-all relative",
                activeTab === 'observability'
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Eye size={16} />
                Observability
              </div>
              {activeTab === 'observability' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          </div>
        </div>

        {/* 4. Tab Content */}
        {activeTab === 'business-rules' && (
          <>
            {/* Add/Edit Business Rule Modals */}
            <BusinessRuleModal
              isOpen={isAddRuleModalOpen}
              onClose={() => setIsAddRuleModalOpen(false)}
              onSave={handleAddRule}
              mode="add"
            />
            <BusinessRuleModal
              isOpen={isEditRuleModalOpen}
              onClose={() => {
                setIsEditRuleModalOpen(false);
                setEditingRule(null);
              }}
              onSave={handleEditRule}
              rule={editingRule}
              mode="edit"
            />

            <section className="flex flex-col gap-6">
              {/* Header with Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl flex-1">
                  <Info size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                    These rules guide how AI generates telemetry recommendations. Active rules influence tag suggestions and tracking logic.
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsAddRuleModalOpen(true)}
                  className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <Plus size={16} />
                  Add Rule
                </button>
              </div>

              {/* Search and Filters Bar */}
              <div className="flex flex-col gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search rules by name or description..."
                    value={brSearchQuery}
                    onChange={(e) => setBrSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status:</span>
                    <select 
                      value={brStatusFilter}
                      onChange={(e) => setBrStatusFilter(e.target.value)}
                      className="px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-[11px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="all">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Source Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source:</span>
                    <select 
                      value={brSourceFilter}
                      onChange={(e) => setBrSourceFilter(e.target.value)}
                      className="px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-[11px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="all">All</option>
                      <option value="System">System</option>
                      <option value="User-defined">User-defined</option>
                    </select>
                  </div>

                  {/* Results Counter */}
                  <div className="ml-auto px-3 py-1.5 bg-surface-secondary border border-border rounded-lg">
                    <span className="text-[11px] font-bold text-foreground">
                      {filteredBusinessRules.length} rules
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Rules Table */}
              <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-primary border-b-2 border-border">
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Rule Name</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Description</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Source</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedBusinessRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-surface-secondary transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-[14px] font-bold text-foreground">{rule.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] text-muted-foreground leading-relaxed">{rule.description}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={clsx(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                            rule.source === 'System' 
                              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          )}>
                            {rule.source}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleRuleStatus(rule.id)}
                            className="flex items-center gap-2 group cursor-pointer"
                          >
                            {rule.status === 'Active' ? (
                              <>
                                <ToggleRight size={24} className="text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                                <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-300">Active</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-[12px] font-bold text-muted-foreground">Inactive</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingRule(rule);
                                setIsEditRuleModalOpen(true);
                              }}
                              className="p-2 text-muted-foreground hover:text-accent transition-colors rounded hover:bg-surface-secondary"
                              title="Edit rule"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteRule(rule.id)}
                              className="p-2 text-muted-foreground hover:text-red-600 transition-colors rounded hover:bg-surface-secondary"
                              title="Delete rule"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-border bg-surface-primary">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-muted-foreground">Rows per page:</span>
                  <select 
                    value={brRowsPerPage}
                    onChange={(e) => {
                      setBrRowsPerPage(Number(e.target.value));
                      setBrCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-background border border-border rounded text-[12px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-muted-foreground">
                    {filteredBusinessRules.length === 0 ? '0-0' : `${(brCurrentPage - 1) * brRowsPerPage + 1}-${Math.min(brCurrentPage * brRowsPerPage, filteredBusinessRules.length)}`} of {filteredBusinessRules.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setBrCurrentPage(brCurrentPage - 1)}
                    disabled={brCurrentPage === 1}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button className="px-3 py-1.5 bg-accent text-white rounded text-[12px] font-bold">
                    {brCurrentPage}
                  </button>
                  <button 
                    onClick={() => setBrCurrentPage(brCurrentPage + 1)}
                    disabled={brCurrentPage >= brTotalPages}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
        )}

        {activeTab === 'data-layer' && (
          <>
            {/* Add/Edit Variable Modals */}
            <DataLayerVariableModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSave={handleAddVariable}
              mode="add"
            />
            <DataLayerVariableModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingVariable(null);
              }}
              onSave={handleEditVariable}
              variable={editingVariable}
              mode="edit"
            />

            <section className="flex flex-col gap-6">
              {/* Header with Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex-1">
                  <Info size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                    Define page-level telemetry variables. Required variables must be present in all tracking implementations.
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <Plus size={16} />
                  Add Variable
                </button>
              </div>

              {/* Search and Filters Bar */}
              <div className="flex flex-col gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by variable name, description, or value..."
                    value={dlSearchQuery}
                    onChange={(e) => setDlSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-background border-2 border-border rounded-xl text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Type Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Type:</span>
                    <select 
                      value={dlTypeFilter}
                      onChange={(e) => setDlTypeFilter(e.target.value)}
                      className="px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-[11px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="all">All</option>
                      <option value="string">String</option>
                      <option value="integer">Integer</option>
                      <option value="boolean">Boolean</option>
                      <option value="array">Array</option>
                      <option value="enum">Enum</option>
                    </select>
                  </div>

                  {/* Scope Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Scope:</span>
                    <select 
                      value={dlScopeFilter}
                      onChange={(e) => setDlScopeFilter(e.target.value)}
                      className="px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-[11px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="all">All</option>
                      <option value="page">Page</option>
                      <option value="session">Session</option>
                      <option value="event">Event</option>
                      <option value="global">Global</option>
                    </select>
                  </div>

                  {/* Source Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source:</span>
                    <select 
                      value={dlSourceFilter}
                      onChange={(e) => setDlSourceFilter(e.target.value)}
                      className="px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-[11px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="all">All</option>
                      <option value="AI-suggested">AI-suggested</option>
                      <option value="User-added">User-added</option>
                    </select>
                  </div>

                  {/* Required Filter */}
                  <button 
                    onClick={() => setDlRequiredOnly(!dlRequiredOnly)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5",
                      dlRequiredOnly
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                        : "bg-surface-secondary text-muted-foreground border-border hover:border-accent"
                    )}
                  >
                    <Lock size={10} />
                    Required Only
                  </button>

                  <div className="h-5 w-px bg-border mx-1" />

                  {/* Bulk Actions */}
                  <button 
                    onClick={handleBulkDelete}
                    disabled={selectedVariableIds.size === 0}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5",
                      selectedVariableIds.size > 0
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/40"
                        : "bg-surface-secondary text-muted-foreground border-border opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Trash2 size={12} />
                    Delete ({selectedVariableIds.size})
                  </button>

                  <button 
                    onClick={handleExport}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border bg-surface-secondary text-muted-foreground border-border hover:border-accent flex items-center gap-1.5"
                  >
                    <Download size={12} />
                    Export
                  </button>

                  {/* Results Counter */}
                  <div className="ml-auto px-3 py-1.5 bg-surface-secondary border border-border rounded-lg">
                    <span className="text-[11px] font-bold text-foreground">
                      {filteredDataLayerVariables.length} variables
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Layer Variables Table */}
              <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-surface-primary border-b-2 border-border z-10">
                        <tr>
                          <th className="px-4 py-4">
                            <input 
                              type="checkbox" 
                              checked={isAllSelected}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              className="w-4 h-4 rounded border-border text-accent focus:ring-2 focus:ring-accent"
                            />
                          </th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                              Variable Name
                              <ChevronDown size={12} className="text-muted-foreground" />
                            </div>
                          </th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Description</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Acceptable Values</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Scope</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Source</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {paginatedVariables.map((variable) => (
                          <tr key={variable.id} className="hover:bg-surface-secondary transition-colors group">
                            <td className="px-4 py-4">
                              <input 
                                type="checkbox" 
                                checked={selectedVariableIds.has(variable.id)}
                                onChange={(e) => handleSelectVariable(variable.id, e.target.checked)}
                                className="w-4 h-4 rounded border-border text-accent focus:ring-2 focus:ring-accent"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-mono font-bold text-foreground">{variable.variableName}</span>
                                {variable.required && (
                                  <span className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded text-[9px] font-black uppercase tracking-wider">
                                    Required
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[13px] text-muted-foreground leading-relaxed">{variable.description}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[12px] font-mono text-foreground bg-surface-primary px-2 py-1 rounded border border-border">
                                {variable.acceptableValues}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">{variable.type}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[11px] font-bold text-muted-foreground">{variable.scope}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={clsx(
                                "inline-flex items-center w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                                variable.source === 'AI-suggested'
                                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                  : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                              )}>
                                {variable.source}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setEditingVariable(variable);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="p-2 text-muted-foreground hover:text-accent transition-colors rounded hover:bg-surface-secondary"
                                  title="Edit variable"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleCopyVariable(variable)}
                                  className="p-2 text-muted-foreground hover:text-blue-600 transition-colors rounded hover:bg-surface-secondary"
                                  title="Copy variable"
                                >
                                  <Copy size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteVariable(variable.id)}
                                  className="p-2 text-muted-foreground hover:text-red-600 transition-colors rounded hover:bg-surface-secondary"
                                  title="Delete variable"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t-2 border-border bg-surface-primary">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-muted-foreground">Rows per page:</span>
                    <select 
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 bg-background border border-border rounded text-[12px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-muted-foreground">
                      {filteredDataLayerVariables.length === 0 ? '0-0' : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredDataLayerVariables.length)}`} of {filteredDataLayerVariables.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button className="px-3 py-1.5 bg-accent text-white rounded text-[12px] font-bold">
                      {currentPage}
                    </button>
                    <button 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'ai-feedback' && (
          <AIFeedbackLog />
        )}

        {activeTab === 'observability' && (
          <Observability />
        )}
      </div>
    </div>
  );
};