import React from 'react';
import { ShieldCheck, Cloud } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="px-[var(--spacing-page)] py-6 flex items-center justify-between bg-white border-t border-[var(--border-subtle)] shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)] font-medium">
          <Cloud size={14} className="text-zinc-300" />
          <span>Narratives are saved automatically</span>
        </div>
        <div className="w-[1px] h-3 bg-[var(--border-default)]" />
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)] font-medium">
          <ShieldCheck size={14} className="text-zinc-300" />
          <span>Human-governed, AI-assisted platform</span>
        </div>
      </div>
      
      <div className="text-[11px] text-[var(--text-tertiary)] font-medium opacity-60">
        Verizon CX Fabric • Confidential Executive View
      </div>
    </footer>
  );
};
