import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const LanguageSelector: React.FC<{ compact?: boolean }> = () => {
  const { language, setLanguage, languages, currentLanguageOption } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer shadow-xs border ${
          isDark
            ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
            : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
        }`}
        title="Select Interface & AI Language"
      >
        <Globe className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
        <span className="font-medium text-[11px] sm:text-xs">{currentLanguageOption.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-44 rounded-xl border shadow-xl py-1.5 z-50 animate-fadeIn ${
            isDark
              ? 'bg-[#0D1219] border-[#202832] shadow-black/80'
              : 'bg-white border-[#E2E8F0] shadow-slate-300/40'
          }`}
        >
          <div
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border-b mb-1 ${
              isDark ? 'text-[#94A3B8] border-[#202832]' : 'text-[#64748B] border-[#E2E8F0]'
            }`}
          >
            Interface & AI Language
          </div>
          {languages.map(opt => {
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLanguage(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-[#111722] text-[#F1F5F9] font-semibold border-l-2 border-[#3B82F6] pl-2.5'
                      : 'bg-slate-100 text-[#0F172A] font-semibold border-l-2 border-[#2563EB] pl-2.5'
                    : isDark
                      ? 'text-[#94A3B8] hover:bg-[#111722] hover:text-[#F1F5F9]'
                      : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{opt.flag}</span>
                  <div>
                    <div className="text-xs">{opt.nativeLabel}</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{opt.label}</div>
                  </div>
                </div>
                {isSelected && (
                  <Check className={`w-3.5 h-3.5 shrink-0 ml-2 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
