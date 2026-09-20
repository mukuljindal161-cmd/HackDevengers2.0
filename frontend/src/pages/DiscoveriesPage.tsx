import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Compass,
  Search,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { api } from '../services/api';
import type { Discovery } from '../services/api';
import { WhyModal } from '../components/WhyModal';
import { useTheme } from '../context/ThemeContext';

export const DiscoveriesPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscoveryForWhy, setSelectedDiscoveryForWhy] = useState<Discovery | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'contradiction' | 'clash'>('all');

  const fetchDiscoveries = useCallback(() => {
    if (!workspaceId) return;
    setLoading(true);
    api.listDiscoveries(workspaceId)
      .then(data => setDiscoveries(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [workspaceId]);

  useEffect(() => {
    fetchDiscoveries();
  }, [fetchDiscoveries]);

  const handleGenerate = async () => {
    if (!workspaceId) return;
    setGenerating(true);
    try {
      const newItems = await api.generateDiscoveries(workspaceId);
      setDiscoveries(newItems);
    } catch (err: any) {
      alert(`Error generating discoveries: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await api.dismissDiscovery(id);
      setDiscoveries(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredDiscoveries = discoveries.filter(d => {
    if (activeFilter === 'high') return d.severity === 'high';
    if (activeFilter === 'contradiction') return d.type.toLowerCase().includes('contradict') || (d.title + d.description).toLowerCase().includes('contradict');
    if (activeFilter === 'clash') return d.type.toLowerCase().includes('clash') || (d.title + d.description).toLowerCase().includes('clash');
    return true;
  });

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isDark ? 'bg-[#080B10]' : 'bg-[#F6F8FA]'}`}>
      {/* Header */}
      <div className={`h-14 border-b px-6 flex items-center justify-between transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Compass className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>Context & Relationship Discoveries</h1>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
            isDark ? 'bg-[#111722] border-[#202832] text-[#94A3B8]' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            {discoveries.length} active insights
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Filter Pills */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer border ${
                activeFilter === 'all'
                  ? isDark ? 'bg-[#111722] text-[#F1F5F9] border-[#202832]' : 'bg-white text-slate-900 border-slate-300'
                  : isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9] border-transparent' : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              All ({discoveries.length})
            </button>
            <button
              onClick={() => setActiveFilter('high')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer border ${
                activeFilter === 'high'
                  ? isDark ? 'bg-[#111722] text-rose-400 border-rose-900/50' : 'bg-rose-50 text-rose-700 border-rose-200'
                  : isDark ? 'text-[#94A3B8] hover:text-rose-300 border-transparent' : 'text-slate-600 hover:text-rose-700 border-transparent'
              }`}
            >
              High Severity
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-medium shadow-xs transition disabled:opacity-50 cursor-pointer ${
              isDark ? 'bg-[#111722] hover:bg-[#1A2333] border-[#202832] text-[#F1F5F9]' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <Search className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>{generating ? 'Synthesizing...' : 'Run Discovery Agent'}</span>
          </button>
          <button
            onClick={fetchDiscoveries}
            title="Refresh"
            className={`p-1.5 rounded-md border transition cursor-pointer ${
              isDark ? 'bg-[#111722] hover:bg-[#1A2333] border-[#202832] text-[#94A3B8]' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading && discoveries.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`rounded-xl border p-5 animate-pulse ${
                  isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="h-4 w-1/3 bg-slate-700/30 rounded mb-3" />
                <div className="h-5 w-3/4 bg-slate-700/40 rounded mb-2" />
                <div className="h-4 w-full bg-slate-700/20 rounded mb-1" />
                <div className="h-4 w-5/6 bg-slate-700/20 rounded" />
              </div>
            ))}
          </div>
        )}

        {filteredDiscoveries.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-3 ${
              isDark ? 'bg-[#111722] border-[#202832] text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <Compass className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>No Discoveries Match Active Filter</h3>
            <p className={`text-xs max-w-sm mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
              Ingest notices or run the Discovery Agent to analyze cross-document relationship clashes.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-7xl mx-auto">
          {filteredDiscoveries.map(disc => {
            const isHigh = disc.severity === 'high';
            const isMedium = disc.severity === 'medium';

            return (
              <div
                key={disc.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition duration-150 group shadow-xs ${
                  isDark ? 'bg-[#0D1219] border-[#202832] hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isHigh ? 'text-rose-500' :
                        isMedium ? 'text-amber-500' :
                        isDark ? 'text-[#94A3B8]' : 'text-slate-600'
                      }`}>
                        ● {disc.severity} Severity
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                        {disc.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-mono font-medium ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                        Impact: {disc.impact_score}/100
                      </span>
                      <button
                        onClick={() => handleDismiss(disc.id)}
                        title="Dismiss Discovery"
                        className="text-slate-500 hover:text-rose-400 p-0.5 transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-sm font-semibold tracking-tight transition ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                    {disc.title}
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                    {disc.description}
                  </p>

                  {/* Affected Entities Chips */}
                  {disc.affected_entities?.length > 0 && (
                    <div className="mt-3.5">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                        Affected Entities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {disc.affected_entities.map((entityName, idx) => (
                          <span
                            key={idx}
                            className={`text-[11px] px-2 py-0.5 rounded border font-mono ${
                              isDark ? 'bg-[#111722] text-[#F1F5F9] border-[#202832]' : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {entityName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action preview */}
                  {disc.recommended_actions?.length > 0 && (
                    <div className="mt-3">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider block mb-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                        Recommended Action
                      </span>
                      <p className={`text-xs ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
                        {disc.recommended_actions[0]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Bar with "Why?" Button */}
                <div className={`mt-5 pt-3.5 border-t flex items-center justify-between ${isDark ? 'border-[#202832]' : 'border-slate-200'}`}>
                  <div className={`flex items-center space-x-1.5 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Confidence: {Math.round(disc.confidence * 100)}%</span>
                  </div>

                  <button
                    onClick={() => setSelectedDiscoveryForWhy(disc)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-medium shadow-xs transition cursor-pointer ${
                      isDark ? 'bg-[#111722] hover:bg-[#1A2333] border-[#202832] text-[#F1F5F9]' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <HelpCircle className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span>Inspect "Why?"</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Modal */}
      {selectedDiscoveryForWhy && (
        <WhyModal
          discovery={selectedDiscoveryForWhy}
          onClose={() => setSelectedDiscoveryForWhy(null)}
        />
      )}
    </div>
  );
};
