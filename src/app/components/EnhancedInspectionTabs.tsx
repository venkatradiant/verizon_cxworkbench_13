import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { 
  Database, 
  Globe, 
  MousePointer2, 
  Activity, 
  Info, 
  BarChart3, 
  Edit3, 
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  FileJson,
  Code,
  X
} from 'lucide-react';

// Enhanced Data Layer Tab with Enterprise Scale Support
export const EnhancedDataLayerTab = ({ 
  dataLayerSchema, 
  editableDataLayer,
  onUpdateValue
}: {
  dataLayerSchema: Array<{
    key: string;
    value: string;
    source: 'AI' | 'Jira' | 'Rule' | 'BA';
    scope: 'Standard' | 'Page-specific';
    required: boolean;
    editable: boolean;
    category?: string;
    description?: string;
    dataType?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  }>;
  editableDataLayer: Record<string, string>;
  onUpdateValue: (key: string, value: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedScope, setSelectedScope] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyRequired, setShowOnlyRequired] = useState(false);
  const [showOnlyEditable, setShowOnlyEditable] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Standard', 'Product', 'User']));
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('grouped');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(dataLayerSchema.map(item => item.category || 'Uncategorized'));
    return Array.from(cats).sort();
  }, [dataLayerSchema]);

  // Filtered data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = dataLayerSchema;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.key.toLowerCase().includes(query) ||
        item.value.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // Source filter
    if (selectedSource !== 'All') {
      filtered = filtered.filter(item => item.source === selectedSource);
    }

    // Scope filter
    if (selectedScope !== 'All') {
      filtered = filtered.filter(item => item.scope === selectedScope);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => (item.category || 'Uncategorized') === selectedCategory);
    }

    // Required filter
    if (showOnlyRequired) {
      filtered = filtered.filter(item => item.required);
    }

    // Editable filter
    if (showOnlyEditable) {
      filtered = filtered.filter(item => item.editable);
    }

    return filtered;
  }, [dataLayerSchema, searchQuery, selectedSource, selectedScope, selectedCategory, showOnlyRequired, showOnlyEditable]);

  // Group by category
  const groupedData = useMemo(() => {
    const groups: Record<string, typeof filteredData> = {};
    filteredData.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });
    return groups;
  }, [filteredData]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportJSON = () => {
    const exportData = filteredData.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-layer-schema.json';
    a.click();
  };

  const sourceOptions = ['All', 'AI', 'Jira', 'Rule', 'BA'];
  const scopeOptions = ['All', 'Standard', 'Page-specific'];

  // Stats
  const stats = {
    total: dataLayerSchema.length,
    filtered: filteredData.length,
    required: dataLayerSchema.filter(i => i.required).length,
    editable: dataLayerSchema.filter(i => i.editable).length,
    standard: dataLayerSchema.filter(i => i.scope === 'Standard').length,
    pageSpecific: dataLayerSchema.filter(i => i.scope === 'Page-specific').length,
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header with Stats */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700 flex items-center justify-center shrink-0">
              <Database size={20} className="text-emerald-700 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest">Enterprise Data Layer Schema</span>
              <p className="text-[13px] text-emerald-700 dark:text-emerald-400 leading-snug font-medium">
                {stats.total} attributes · {stats.required} required · {stats.editable} editable
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-lg">
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                {stats.standard} Standard
              </span>
            </div>
            <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
              <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                {stats.pageSpecific} Page-Specific
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by key, value, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border-2 border-border rounded-xl text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-surface-secondary border border-border rounded-lg">
            <button
              onClick={() => setViewMode('grouped')}
              className={clsx(
                "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all",
                viewMode === 'grouped'
                  ? "bg-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Grouped
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={clsx(
                "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all",
                viewMode === 'table'
                  ? "bg-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Table
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-card border-2 border-border hover:border-accent rounded-xl text-[12px] font-bold text-foreground transition-all flex items-center gap-2"
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Source Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source:</span>
            <div className="flex items-center gap-1">
              {sourceOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setSelectedSource(option)}
                  className={clsx(
                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border",
                    selectedSource === option
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                      : "bg-surface-secondary text-muted-foreground border-border hover:border-accent"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Scope:</span>
            <div className="flex items-center gap-1">
              {scopeOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setSelectedScope(option)}
                  className={clsx(
                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border",
                    selectedScope === option
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                      : "bg-surface-secondary text-muted-foreground border-border hover:border-accent"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1 bg-surface-secondary border border-border rounded-md text-[10px] font-bold text-foreground uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="All">All</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Toggle Filters */}
          <div className="h-5 w-px bg-border mx-1" />
          
          <button
            onClick={() => setShowOnlyRequired(!showOnlyRequired)}
            className={clsx(
              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5",
              showOnlyRequired
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                : "bg-surface-secondary text-muted-foreground border-border hover:border-accent"
            )}
          >
            <Lock size={10} />
            Required Only
          </button>

          <button
            onClick={() => setShowOnlyEditable(!showOnlyEditable)}
            className={clsx(
              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5",
              showOnlyEditable
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                : "bg-surface-secondary text-muted-foreground border-border hover:border-accent"
            )}
          >
            <Edit3 size={10} />
            Editable Only
          </button>

          {/* Results Count */}
          <div className="ml-auto px-3 py-1 bg-surface-secondary border border-border rounded-md">
            <span className="text-[11px] font-bold text-foreground">
              {filteredData.length} of {stats.total} attributes
            </span>
          </div>
        </div>
      </div>

      {/* Data Display */}
      {viewMode === 'grouped' ? (
        // Grouped View
        <div className="flex flex-col gap-4">
          {Object.entries(groupedData).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-3 px-4 py-3 bg-card border-2 border-border hover:border-accent rounded-xl transition-all group"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-[13px] font-black text-foreground uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    ({items.length})
                  </span>
                </div>
                {expandedCategories.has(category) ? (
                  <ChevronUp size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                )}
              </button>

              {/* Category Items */}
              {expandedCategories.has(category) && (
                <div className="border-2 border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-secondary border-b-2 border-border">
                        <th className="text-left px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[25%]">Key</th>
                        <th className="text-left px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[35%]">Value</th>
                        <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Source</th>
                        <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Scope</th>
                        <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Type</th>
                        <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.key} className={clsx(
                          "border-b border-border hover:bg-surface-secondary/50 transition-colors group",
                          !item.editable && "bg-surface-secondary/30"
                        )}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <code className="text-[11px] font-mono font-bold text-foreground">
                                {item.key}
                              </code>
                              {item.required && (
                                <span className="text-[8px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded font-black uppercase tracking-wider">
                                  Req
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {item.editable ? (
                              <input
                                type="text"
                                value={item.value}
                                onChange={(e) => onUpdateValue(item.key, e.target.value)}
                                className="w-full px-3 py-1.5 text-[12px] font-medium text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                              />
                            ) : (
                              <span className="text-[12px] font-medium text-muted-foreground">{item.value}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={clsx(
                              "inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                              item.source === 'AI' && "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
                              item.source === 'Jira' && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
                              item.source === 'Rule' && "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700",
                              item.source === 'BA' && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                            )}>
                              {item.source}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={clsx(
                              "text-[10px] font-bold uppercase tracking-wider",
                              item.scope === 'Standard' ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"
                            )}>
                              {item.scope === 'Standard' ? 'Std' : 'Page'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">
                              {item.dataType || 'string'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleCopyKey(item.key)}
                                className="p-1 hover:bg-surface-secondary rounded transition-colors"
                                title="Copy key"
                              >
                                {copiedKey === item.key ? (
                                  <CheckCircle2 size={12} className="text-emerald-600" />
                                ) : (
                                  <Copy size={12} className="text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="border-2 border-border rounded-xl overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-surface-secondary border-b-2 border-border z-10">
                <tr>
                  <th className="text-left px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[25%]">Key</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[30%]">Value</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Source</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Scope</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[10%]">Category</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[8%]">Type</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[7%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.key} className={clsx(
                    "border-b border-border hover:bg-surface-secondary/50 transition-colors group",
                    !item.editable && "bg-surface-secondary/30"
                  )}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] font-mono font-bold text-foreground">
                          {item.key}
                        </code>
                        {item.required && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded font-black uppercase tracking-wider">
                            Req
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.editable ? (
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => onUpdateValue(item.key, e.target.value)}
                          className="w-full px-3 py-1.5 text-[12px] font-medium text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                      ) : (
                        <span className="text-[12px] font-medium text-muted-foreground truncate block">{item.value}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={clsx(
                        "inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                        item.source === 'AI' && "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
                        item.source === 'Jira' && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
                        item.source === 'Rule' && "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700",
                        item.source === 'BA' && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                      )}>
                        {item.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-wider",
                        item.scope === 'Standard' ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"
                      )}>
                        {item.scope === 'Standard' ? 'Std' : 'Page'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {item.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        {item.dataType || 'str'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyKey(item.key)}
                          className="p-1 hover:bg-surface-secondary rounded transition-colors"
                          title="Copy key"
                        >
                          {copiedKey === item.key ? (
                            <CheckCircle2 size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-surface-secondary border-2 border-dashed border-border rounded-2xl">
          <AlertCircle size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-[16px] font-bold text-foreground mb-2">No attributes found</h3>
          <p className="text-[13px] text-muted-foreground text-center max-w-md">
            Try adjusting your search query or filters to see more results.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-2 p-4 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest">Enterprise Schema Contract</span>
            <p className="text-[12px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
              This data layer defines the analytics contract for implementation. Standard keys remain consistent across all pages. Page-specific keys can be customized per journey. Use filters and search to navigate large schemas efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced User Interactions Tab
export const EnhancedUserInteractionsInfo = () => {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
          <MousePointer2 size={18} className="text-blue-700 dark:text-blue-400" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest">User-Triggered Event Payloads</span>
          <p className="text-[12px] text-blue-700 dark:text-blue-400 leading-snug">
            Click & action payloads · Not UI elements · Data relevant to the interaction
          </p>
        </div>
      </div>
    </div>
  );
};

// Enhanced System Events Tab Info
export const EnhancedSystemEventsInfo = () => {
  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
          <Activity size={18} className="text-purple-700 dark:text-purple-400" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-black text-purple-900 dark:text-purple-300 uppercase tracking-widest">Programmatic Event Payloads</span>
          <p className="text-[12px] text-purple-700 dark:text-purple-400 leading-snug">
            API-triggered · Timed · Conditional · No user interaction required
          </p>
        </div>
      </div>
    </div>
  );
};
