import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface RealityGraphLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const RealityGraphLogo: React.FC<RealityGraphLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dimension presets
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const titleSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  const subSizeClasses = {
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[9px] tracking-[0.25em]',
    lg: 'text-[11px] tracking-[0.25em]',
    xl: 'text-xs tracking-[0.3em]',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Dynamic Theme R-Graph Icon */}
      <div className={`${iconSizeClasses[size]} shrink-0 relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Gradients */}
            <linearGradient id="rgIconBgDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#131C28" />
              <stop offset="100%" stopColor="#080D14" />
            </linearGradient>
            <linearGradient id="rgIconBgLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            {/* Line Gradients */}
            <linearGradient id="rgStemGrad" x1="28" y1="28" x2="28" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor={isDark ? '#FFFFFF' : '#334155'} />
            </linearGradient>
            <linearGradient id="rgLoopGrad" x1="28" y1="28" x2="72" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="rgDiagGrad1" x1="72" y1="28" x2="46" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isDark ? '#FFFFFF' : '#334155'} />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="rgDiagGrad2" x1="46" y1="50" x2="74" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Rounded Icon Tile */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="22"
            fill={isDark ? 'url(#rgIconBgDark)' : 'url(#rgIconBgLight)'}
            stroke={isDark ? '#1F2937' : '#CBD5E1'}
            strokeWidth="2.5"
          />

          {/* Graph Edges forming 'R' */}
          {/* Vertical Stem */}
          <line
            x1="28"
            y1="28"
            x2="28"
            y2="72"
            stroke="url(#rgStemGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Top Bar */}
          <line
            x1="28"
            y1="28"
            x2="72"
            y2="28"
            stroke="url(#rgLoopGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Loop Diagonal to Center */}
          <line
            x1="72"
            y1="28"
            x2="46"
            y2="50"
            stroke="url(#rgDiagGrad1)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Right Leg */}
          <line
            x1="46"
            y1="50"
            x2="74"
            y2="72"
            stroke="url(#rgDiagGrad2)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* 5 Network Graph Nodes */}
          {/* Top Left - Cyan */}
          <circle cx="28" cy="28" r="9" fill="#38BDF8" />
          {/* Top Right - High Contrast White/Slate */}
          <circle cx="72" cy="28" r="9" fill={isDark ? '#FFFFFF' : '#1E293B'} />
          {/* Center - Blue */}
          <circle cx="46" cy="50" r="8.5" fill="#3B82F6" />
          {/* Bottom Left - White/Slate */}
          <circle cx="28" cy="72" r="9" fill={isDark ? '#FFFFFF' : '#1E293B'} />
          {/* Bottom Right - Blue */}
          <circle cx="74" cy="72" r="9" fill="#2563EB" />
        </svg>
      </div>

      {/* Brand Name & Subtitle */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className={`font-sans font-bold tracking-tight ${titleSizeClasses[size]}`} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <span className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>Reality</span>
            <span className={isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}>Graph</span>
          </div>
          {showSubtitle && (
            <span
              className={`font-sans uppercase font-medium mt-0.5 ${subSizeClasses[size]} ${
                isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              CONTEXT ENGINE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
