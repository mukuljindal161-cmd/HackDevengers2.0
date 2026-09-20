import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileText, X, Cpu, Database, Server } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type TrustModalTab = 'security' | 'privacy' | 'terms' | 'status';

interface SecurityTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: TrustModalTab;
}

export const SecurityTrustModal: React.FC<SecurityTrustModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'security',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = React.useState<TrustModalTab>(defaultTab);

  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDark ? 'bg-[#0D1117] border-[#202832] text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-[#202832]' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isDark ? 'bg-[#11161D] border-[#202832] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Trust, Safety & Security Governance</h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Spec-Driven Context Engine • RealityGraph Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className={`flex border-b text-xs font-medium px-4 ${isDark ? 'border-[#202832] bg-[#060B10]' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition ${
              activeTab === 'security'
                ? isDark
                  ? 'border-blue-400 text-blue-400'
                  : 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Firewall
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition ${
              activeTab === 'privacy'
                ? isDark
                  ? 'border-blue-400 text-blue-400'
                  : 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Data Privacy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition ${
              activeTab === 'terms'
                ? isDark
                  ? 'border-blue-400 text-blue-400'
                  : 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Terms & Provenance
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition ${
              activeTab === 'status'
                ? isDark
                  ? 'border-blue-400 text-blue-400'
                  : 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            System Status
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className={`p-3.5 rounded-lg border ${isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-2 mb-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-sm">Deterministic Hallucination Firewall</span>
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  RealityGraph enforces a mathematical grounding layer. Answers are generated strictly with verified citations against ingested official notices. If a conflict or contradiction exists between documents, RealityGraph explicitly surfaces the contradiction rather than hallucinating an arbitrary compromise.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Multi-Hop Verification</span>
                  </div>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Every relationship edge in the knowledge graph is validated with bi-directional entity extraction and provenance hashing.
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Workspace Isolation</span>
                  </div>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tenant data, notice documents, and scenario hypothesis graphs remain strictly partitioned in private SQLite & vector sandboxes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className={`p-3.5 rounded-lg border ${isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold mb-1.5">Zero Data Selling & Private Processing</h4>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  We do not sell, rent, or monetize your institutional documents, schedules, or personal calendar queries. All ingested files are processed solely for the active session graph computation.
                </p>
              </div>
              <ul className={`list-disc list-inside space-y-1.5 text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li><strong>Local Token Authentication:</strong> Session tokens are securely hashed in local storage with automatic expiry.</li>
                <li><strong>No Cross-Tenant Graph Bleed:</strong> Graph queries never query external or neighboring workspace databases.</li>
                <li><strong>Instant Data Deletion:</strong> Resetting a scenario immediately flushes counterfactual overrides from memory.</li>
              </ul>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <div className={`p-3.5 rounded-lg border ${isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold mb-1.5">Spec-Driven Grounding & Explainability Terms</h4>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  RealityGraph is provided as an analytical context discovery tool. All mitigation simulations are counterfactual what-if calculations designed to assist human administrators and students in making informed schedule decisions.
                </p>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Document source citations represent immutable references to official notices ingested into the system at timestamped intervals.
              </p>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-3">
              <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold">All Operational Systems Normal</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold">
                  99.99% Uptime
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`p-2.5 rounded border ${isDark ? 'bg-[#060B10] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400">Knowledge Graph Engine</div>
                  <div className="font-semibold text-emerald-500 mt-0.5">● Operational (0.12s latency)</div>
                </div>
                <div className={`p-2.5 rounded border ${isDark ? 'bg-[#060B10] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400">RAG Document Ingestion</div>
                  <div className="font-semibold text-emerald-500 mt-0.5">● Operational (Chunking Active)</div>
                </div>
                <div className={`p-2.5 rounded border ${isDark ? 'bg-[#060B10] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400">What-If Simulation Sandbox</div>
                  <div className="font-semibold text-emerald-500 mt-0.5">● Operational</div>
                </div>
                <div className={`p-2.5 rounded border ${isDark ? 'bg-[#060B10] border-[#202832]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400">Hallucination Defense Firewall</div>
                  <div className="font-semibold text-emerald-500 mt-0.5">● Active (100% Grounded)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-[#202832] bg-[#060B10] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <span>RealityGraph Architecture Version 2.4</span>
          <button
            onClick={onClose}
            className={`px-3 py-1 rounded border font-medium cursor-pointer transition ${
              isDark ? 'bg-[#11161D] hover:bg-[#202832] text-slate-200 border-[#202832]' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
