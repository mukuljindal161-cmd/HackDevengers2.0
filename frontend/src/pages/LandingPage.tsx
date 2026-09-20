import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Compass, Eye, Layers } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { RealityGraphLogo } from '../components/RealityGraphLogo';
import { SecurityTrustModal, type TrustModalTab } from '../components/SecurityTrustModal';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [trustModalTab, setTrustModalTab] = useState<TrustModalTab>('security');

  const openTrustModal = (tab: TrustModalTab) => {
    setTrustModalTab(tab);
    setTrustModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      isDark ? 'bg-[#080B10] text-[#F1F5F9]' : 'bg-[#F6F8FA] text-[#0F172A]'
    }`}>
      {/* Top Bar (Sticky Navbar) */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1219]/95 shadow-xs' : 'border-[#E2E8F0] bg-white/95 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="cursor-pointer">
            <RealityGraphLogo size="md" />
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeToggle />
            <Link
              to="/login"
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition ${
                isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`text-xs font-medium px-4 py-2 rounded-md shadow-xs transition flex items-center space-x-1.5 cursor-pointer border ${
                isDark
                  ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md border text-xs font-medium mb-8 ${
          isDark ? 'border-[#202832] bg-[#0D1117] text-slate-300' : 'border-slate-200 bg-white text-slate-700 shadow-xs'
        }`}>
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Spec-Driven Context & Relationship Intelligence</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] max-w-4xl mx-auto ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          Information tells you what happened. <br />
          <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
            RealityGraph tells you what it means.
          </span>
        </h1>

        <p className={`mt-6 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Traditional search finds documents. RealityGraph autonomously connects the dots across isolated notices, calendars, and schedules—revealing hidden dependencies, conflicts, and commute disruptions with 100% explainability.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className={`px-6 py-2.5 rounded-md font-medium text-xs shadow-xs transition flex items-center space-x-2 cursor-pointer border ${
              isDark
                ? 'bg-[#11161D] hover:bg-[#1A2230] text-slate-100 border-[#202832]'
                : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-200'
            }`}
          >
            <span>Explore Your Reality</span>
            <ArrowRight className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-900'}`} />
          </Link>
          <Link
            to="/login"
            className={`px-6 py-2.5 rounded-md font-medium text-xs shadow-xs transition cursor-pointer border ${
              isDark
                ? 'bg-[#11161D] hover:bg-[#1A2230] text-slate-100 border-[#202832]'
                : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-200'
            }`}
          >
            View Interactive Demo
          </Link>
        </div>
      </section>

      {/* Core Innovation Showcase */}
      <section className={`py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t w-full ${isDark ? 'border-[#202832]' : 'border-slate-200'}`}>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>The Core Problem & Breakthrough</h2>
          <h3 className={`text-2xl sm:text-3xl font-bold mt-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Connecting Disconnected Realities</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3 sm:space-y-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs text-rose-500 font-semibold block mb-1">Notice A (Exam Calendar)</span>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"Mid-semester exam is scheduled on September 20 at 9:00 AM."</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs text-amber-500 font-semibold block mb-1">Notice B (Campus Roadworks)</span>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"Main Gate is closed for pipeline construction September 19–21."</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className="text-xs text-blue-500 font-semibold block mb-1">Notice C (Transit Advisory)</span>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"Bus Route 4 diverted due to Main Gate closure."</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <span className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Notice D (Met Weather Alert)</span>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"Torrential rainfall and waterlogging expected September 20."</p>
            </div>
          </div>

          <div className={`p-6 rounded-xl border shadow-xs relative ${
            isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-rose-500">
                ● Critical Inferred Discovery
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Impact Score: 88/100</span>
            </div>
            <h4 className={`text-base font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Examination Commute Severely Compromised
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Your September 20 examination commute is directly jeopardized. Route 4 bus diversion combined with severe rainfall creates an estimated 45-minute delay, placing students at risk of missing exam entry.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className={`py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t w-full ${isDark ? 'border-[#202832]' : 'border-slate-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'}`}>
            <Compass className={`w-6 h-6 mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
            <h4 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Discovery Engine</h4>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Discovers hidden multi-hop connections between seemingly disparate documents and policies.
            </p>
          </div>
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'}`}>
            <Eye className={`w-6 h-6 mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
            <h4 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Deep Explainability ("Why?")</h4>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Never a black box. Inspect full step-by-step reasoning chains and source passage evidence.
            </p>
          </div>
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'}`}>
            <Cpu className={`w-6 h-6 mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
            <h4 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>What-If Simulation</h4>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Modify graph conditions (e.g. gate closure duration) and simulate downstream impacts in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-auto border-t py-8 px-6 text-xs transition-colors ${
        isDark ? 'border-[#202832] bg-[#060B10] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <RealityGraphLogo size="sm" />
            <span className="text-[11px]">© 2026 RealityGraph Core.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => openTrustModal('security')}
              className="hover:underline cursor-pointer transition text-inherit"
            >
              Security Architecture
            </button>
            <span>•</span>
            <button
              onClick={() => openTrustModal('privacy')}
              className="hover:underline cursor-pointer transition text-inherit"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => openTrustModal('terms')}
              className="hover:underline cursor-pointer transition text-inherit"
            >
              Terms & Provenance
            </button>
            <span>•</span>
            <button
              onClick={() => openTrustModal('status')}
              className="hover:underline cursor-pointer transition text-inherit flex items-center space-x-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>System Status</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Trust & Security Modal */}
      <SecurityTrustModal
        isOpen={trustModalOpen}
        onClose={() => setTrustModalOpen(false)}
        defaultTab={trustModalTab}
      />
    </div>
  );
};
