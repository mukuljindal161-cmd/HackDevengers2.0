import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-md border transition cursor-pointer flex items-center justify-center shadow-xs ${
        isDark
          ? 'bg-[#111722] hover:bg-[#161F2E] text-slate-300 hover:text-amber-400 border-[#202832]'
          : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-[#E2E8F0]'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200" />
      )}
    </button>
  );
};
