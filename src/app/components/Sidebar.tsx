import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { clsx } from 'clsx';
import { 
  Sparkles, 
  Layers,
  ChevronRight,
  ChevronLeft,
  Database,
  User,
  Zap
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ThemeToggle } from './ThemeToggle';
import profileImg from "https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-svg-download-png-456322.png";

const navItems = [
  { path: '/playground', label: 'Dashboard', icon: Sparkles, description: 'Explore & Create' },
  { path: '/journeys', label: 'Journeys', icon: Layers, description: 'Unified Repository' },
  { path: '/tag-manager', label: 'Telemetry', icon: Database, description: 'Schema & Rules' },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      style={{ width: isExpanded ? '260px' : '88px' }}
      className="bg-card flex flex-col h-full overflow-hidden shrink-0 relative z-[60] border-r border-border transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
    >
      {/* Product Branding Area */}
      <div className={clsx(
        "flex items-center transition-all duration-300",
        isExpanded ? 'px-6 pt-10 pb-4 gap-4' : 'justify-center pt-10 pb-4'
      )}>
        <div className="shrink-0 relative">
          <div className="w-10 h-10 bg-zinc-950 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-zinc-900/10">
            <Zap size={22} fill="currentColor" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#EE0000] rounded-full border-2 border-white dark:border-zinc-950 shadow-[0_0_10px_rgba(238,0,0,0.4)]" />
        </div>
        {isExpanded && (
          <div className="flex flex-col">
            <span className="text-[18px] font-black text-foreground tracking-tighter leading-none">
              Verizon
            </span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mt-1 whitespace-nowrap">
              CX Workbench
            </span>
          </div>
        )}
      </div>

      <div className="px-4 pb-6">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            "h-10 rounded-xl bg-surface-primary border border-border flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all shadow-xs hover:shadow-md transition-shadow active:scale-95",
            isExpanded ? "w-full px-4 justify-between" : "w-10 justify-center mx-auto"
          )}
        >
          {isExpanded && <span className="text-sm font-medium">Collapse</span>}
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 overflow-y-auto overflow-x-hidden no-scrollbar">
        <ul className="space-y-2 w-full">
          {navItems.map((item) => {
            const isReallyActive = location.pathname.startsWith(item.path);
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={clsx(
                    "flex items-center transition-all duration-200 relative group",
                    isExpanded ? 'px-4 py-3.5 rounded-xl gap-4' : 'justify-center w-14 h-14 rounded-2xl mx-auto',
                    isReallyActive 
                      ? 'bg-accent-soft text-accent shadow-sm' 
                      : 'text-muted-foreground hover:bg-surface-primary hover:text-foreground'
                  )}
                  title={!isExpanded ? item.label : undefined}
                >
                  <item.icon className="shrink-0" size={isExpanded ? 18 : 22} strokeWidth={isReallyActive ? 2.5 : 2} />
                  
                  {isExpanded && (
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold tracking-normal whitespace-nowrap">
                        {item.label}
                      </span>
                      <span className={clsx(
                        "text-[10px] font-medium transition-opacity",
                        isReallyActive ? 'text-accent/70' : 'text-muted-foreground'
                      )}>
                        {item.description}
                      </span>
                    </div>
                  )}

                  {isReallyActive && (
                    <div className="absolute -left-1 w-1.5 h-6 bg-accent rounded-full" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto p-4 flex flex-col gap-3">
        <ThemeToggle isExpanded={isExpanded} />

        <div className={clsx(
          "flex items-center bg-surface-secondary border border-border rounded-2xl",
          isExpanded ? 'px-4 py-3 gap-3' : 'justify-center py-3'
        )}>
          <div className="w-10 h-10 rounded-xl bg-card border border-border overflow-hidden shrink-0 shadow-sm">
             <ImageWithFallback 
                src={profileImg} 
                alt="Abhinav Saxena"
                className="w-full h-full object-cover"
             />
          </div>
          {isExpanded && (
            <div className="flex flex-col min-w-0 overflow-hidden">
               <span className="text-[13px] font-black text-foreground leading-none truncate">Abhinav Saxena</span>
               <span className="text-[10px] font-bold text-accent uppercase tracking-wider mt-1 whitespace-nowrap">Lead Architect</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
