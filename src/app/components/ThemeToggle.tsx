import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';

interface ThemeToggleProps {
  className?: string;
  isExpanded?: boolean;
}

export const ThemeToggle = ({ className, isExpanded = true }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "relative flex items-center bg-surface-secondary border border-border rounded-2xl transition-all duration-300 group cursor-pointer overflow-hidden",
        isExpanded ? "w-full p-1.5" : "w-10 h-10 justify-center",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className={clsx(
        "flex items-center transition-all duration-300 w-full",
        isExpanded ? "px-2 gap-3" : "justify-center"
      )}>
        {/* Expanded View: Show both icons with a label */}
        {isExpanded ? (
          <>
            <div className={clsx(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
              theme === 'light' ? "bg-white text-amber-500 shadow-sm" : "text-zinc-500"
            )}>
              <Sun size={16} />
            </div>
            
            <span className="text-[13px] font-bold text-foreground flex-1 truncate text-left">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>

            <div className={clsx(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
              theme === 'dark' ? "bg-zinc-800 text-indigo-400 shadow-sm" : "text-zinc-400"
            )}>
              <Moon size={16} />
            </div>
          </>
        ) : (
          /* Collapsed View: Show only one icon (the current mode) */
          <div className={clsx(
            "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
            theme === 'light' ? "text-amber-500" : "text-indigo-400"
          )}>
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          </div>
        )}
      </div>
    </button>
  );
};
