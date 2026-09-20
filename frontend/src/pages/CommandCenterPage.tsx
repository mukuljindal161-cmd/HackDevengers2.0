import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Network,
  AlertTriangle,
  Compass,
  FileText,
  Clock,
  Cpu,
  Search,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Layers,
  Zap,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import type { Discovery, GraphNode, GraphEdge, Source } from '../services/api';
import { WhyModal } from '../components/WhyModal';
import { PresenterStoryBar } from '../components/PresenterStoryBar';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const CommandCenterPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [selectedDiscoveryForWhy, setSelectedDiscoveryForWhy] = useState<Discovery | null>(null);

  // Quick query
  const [quickQuery, setQuickQuery] = useState('');
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const [srcList, graphData, discList] = await Promise.all([
        api.getSources(workspaceId).catch(() => []),
        api.getGraph(workspaceId).catch(() => ({ nodes: [], edges: [] })),
        api.listDiscoveries(workspaceId).catch(() => []),
      ]);

      setSources(srcList);
      setNodes(graphData.nodes || []);
      setEdges(graphData.edges || []);
      setDiscoveries(discList);
    } catch (err) {
      console.error('Failed to load command center data:', err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleQuickQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim() || !workspaceId) return;
    navigate(`/workspace/${workspaceId}/query?q=${encodeURIComponent(quickQuery.trim())}`);
  };

  const handleLoadDemo = async () => {
    if (!workspaceId) return;
    setLoadingDemo(true);
    setDemoMessage(null);
    try {
      await api.loadDemoDataset(workspaceId);
      setDemoMessage('Demo dataset loaded! Context engine analyzing dependencies...');
      setTimeout(() => {
        loadDashboardData();
        setDemoMessage(null);
      }, 1200);
    } catch (err: any) {
      alert(`Failed to load demo: ${err.message}`);
    } finally {
      setLoadingDemo(false);
    }
  };

  const highSeverityClashes = discoveries.filter(d => d.severity === 'high');
  const personalizedImpact = discoveries.find(d => d.type === 'personalized_impact');
  const contradictions = discoveries.filter(d => d.type === 'contradiction');

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${
      isDark ? 'bg-[#080B10] text-[#F1F5F9]' : 'bg-[#F6F8FA] text-[#0F172A]'
    }`}>

      {/* Top Header */}
      <div className={`h-16 border-b px-8 flex items-center justify-between backdrop-blur-md transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-[#E2E8F0] bg-white shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#111722] border border-[#202832]' : 'bg-slate-100 border border-[#E2E8F0]'}`}>
            <LayoutDashboard className={`w-4.5 h-4.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-sm font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{t('header.title') || 'AI Intelligence Command Center'}</h1>
              <span className={`text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                · Active Context Engine
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {t('header.subtitle') || 'Continuously discovering consequences, schedule collisions, and hidden dependencies'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {nodes.length === 0 && (
            <button
              onClick={handleLoadDemo}
              disabled={loadingDemo}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer ${
                isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9] hover:bg-[#161F2E]' : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <span>{loadingDemo ? (t('header.processing') || 'Synthesizing...') : (t('header.load_demo') || 'Load 1-Click Demo')}</span>
            </button>
          )}

          <button
            onClick={loadDashboardData}
            title="Refresh Command Center"
            className={`p-2 rounded-md border transition cursor-pointer ${
              isDark
                ? 'bg-[#111722] hover:bg-[#161F2E] text-[#94A3B8] hover:text-[#F1F5F9] border-[#202832]'
                : 'bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] border-[#E2E8F0]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        {/* Success Banner */}
        {demoMessage && (
          <div className={`p-3 rounded-lg border text-xs flex items-center space-x-2 animate-fadeIn ${
            isDark ? 'border-[#202832] text-slate-300' : 'border-slate-200 text-slate-700'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{demoMessage}</span>
          </div>
        )}

        {/* Presenter Demo Journey Story Bar */}
        <PresenterStoryBar
          workspaceId={workspaceId || ''}
          hasData={sources.length > 0 || nodes.length > 0}
          loadingDemo={loadingDemo}
          onLoadDemo={handleLoadDemo}
          discoveries={discoveries}
          onOpenWhyModal={d => setSelectedDiscoveryForWhy(d)}
        />

        {/* Hero Quick Query Bar */}
        <div className={`p-6 rounded-xl border relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#0D1219] border-[#202832]'
            : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-slate-400" />
              <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                {t('quick_query.title') || 'Natural-Language Intelligence Query'}
              </h2>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {t('quick_query.subtitle') || 'Grounded across RAG citations & Knowledge Graph'}
            </span>
          </div>

          <form onSubmit={handleQuickQuerySubmit} className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-400'}`} />
              <input
                type="text"
                value={quickQuery}
                onChange={e => setQuickQuery(e.target.value)}
                placeholder={t('quick_query.placeholder') || "Ask RealityGraph: 'What could affect my exam on September 20?', 'Explain Route 4 detour'..."}
                className={`w-full rounded-md pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-slate-500 transition border ${
                  isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9] placeholder-[#94A3B8]' : 'bg-slate-50 border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8]'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={!quickQuery.trim()}
              className={`px-5 py-2.5 rounded-md text-xs font-medium shadow-xs transition flex items-center space-x-2 disabled:opacity-50 shrink-0 cursor-pointer border ${
                isDark
                  ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              <span>{t('quick_query.button') || 'Query Intelligence'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-slate-300' : 'text-[#0F172A]'}`} />
            </button>
          </form>

          {/* Prompt chips */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className={`text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{t('quick_query.suggested') || 'Suggested:'}</span>
            {[
              "What could affect my exam on September 20?",
              "Why is the Main Gate closure significant?",
              "Show me all detected schedule conflicts",
              "What dependencies exist around Bus Route 4?"
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuickQuery(p);
                  navigate(`/workspace/${workspaceId}/query?q=${encodeURIComponent(p)}`);
                }}
                className={`text-[10px] px-2.5 py-1 rounded-md border transition cursor-pointer ${
                  isDark ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]' : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A] border-[#E2E8F0]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* System Understanding Pulse (4-Card Metric Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate(`/workspace/${workspaceId}/sources`)}
            className={`p-5 rounded-xl border transition cursor-pointer group ${
              isDark ? 'bg-[#0D1219] border-[#202832] hover:border-slate-500' : 'bg-white border-[#E2E8F0] hover:border-slate-400 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Ingested Sources
              </span>
              <FileText className="w-4 h-4 text-slate-400 group-hover:scale-110 transition" />
            </div>
            <div className={`text-2xl font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{sources.length}</div>
            <p className={`text-[11px] mt-1 flex items-center justify-between ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              <span>{sources.filter(s => s.status === 'completed').length} completed</span>
              <span className="text-slate-400 font-mono text-[10px] flex items-center">
                Manage <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </p>
          </div>

          <div
            onClick={() => navigate(`/workspace/${workspaceId}/graph`)}
            className={`p-5 rounded-xl border transition cursor-pointer group ${
              isDark ? 'bg-[#0D1219] border-[#202832] hover:border-slate-500' : 'bg-white border-[#E2E8F0] hover:border-slate-400 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Extracted Entities
              </span>
              <Network className="w-4 h-4 text-slate-400 group-hover:scale-110 transition" />
            </div>
            <div className={`text-2xl font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{nodes.length}</div>
            <p className={`text-[11px] mt-1 flex items-center justify-between ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              <span>Events, Locations, Transport, Risks</span>
              <span className="text-slate-400 font-mono text-[10px] flex items-center">
                Explore <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </p>
          </div>

          <div
            onClick={() => navigate(`/workspace/${workspaceId}/graph`)}
            className={`p-5 rounded-xl border transition cursor-pointer group ${
              isDark ? 'bg-[#0D1219] border-[#202832] hover:border-slate-500' : 'bg-white border-[#E2E8F0] hover:border-slate-400 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Discovered Edges
              </span>
              <Layers className="w-4 h-4 text-slate-400 group-hover:scale-110 transition" />
            </div>
            <div className={`text-2xl font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{edges.length}</div>
            <p className={`text-[11px] mt-1 flex items-center justify-between ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              <span>Multi-hop relationship paths</span>
              <span className="text-slate-400 font-mono text-[10px] flex items-center">
                Inspect <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </p>
          </div>

          <div
            onClick={() => navigate(`/workspace/${workspaceId}/discoveries`)}
            className={`p-5 rounded-xl border transition cursor-pointer group ${
              isDark ? 'bg-[#0D1219] border-[#202832] hover:border-slate-500' : 'bg-white border-[#E2E8F0] hover:border-slate-400 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Active Discoveries
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-bold text-rose-400">{discoveries.length}</div>
            <p className={`text-[11px] mt-1 flex items-center justify-between ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              <span className={`font-semibold ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>{highSeverityClashes.length} high severity</span>
              <span className="text-rose-400 font-mono text-[10px] flex items-center">
                Review <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </p>
          </div>
        </div>

        {/* Source Contradiction Alert Banner (Hallucination Firewall, Spec 8.7) */}
        {contradictions.length > 0 && (
          <div className={`p-4 rounded-xl border flex items-start justify-between animate-fadeIn ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Hallucination Firewall: {contradictions.length} Source Contradiction{contradictions.length > 1 ? 's' : ''} Detected
                  </span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Conflicting facts detected across disparate official documents. RealityGraph refuses to hallucinate a resolution and preserves both references.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDiscoveryForWhy(contradictions[0])}
              className={`text-xs font-medium px-3 py-1.5 rounded-md border shadow-xs shrink-0 transition cursor-pointer ${
                isDark
                  ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              Inspect Sources
            </button>
          </div>
        )}

        {/* Personalized Impact Card ("Impact on Me", Spec 8.1) */}
        {personalizedImpact && (
          <div className={`p-5 rounded-xl border relative overflow-hidden animate-fadeIn ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    Personalized Impact Analysis: "Impact on Me" (Spec 8.1)
                  </span>
                  <span className="text-[10px] font-mono text-rose-500 font-semibold">
                    Vulnerability Index: 96/100
                  </span>
                </div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                  {personalizedImpact.title}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed max-w-4xl ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  {personalizedImpact.description}
                </p>

                {/* Persona Profile Tags */}
                <div className="flex flex-wrap gap-2 mt-3 items-center">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9]' : 'bg-slate-100 border-[#E2E8F0] text-[#0F172A]'}`}>
                    Origin: North Hostel
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9]' : 'bg-slate-100 border-[#E2E8F0] text-[#0F172A]'}`}>
                    Destination: Examination Hall B
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9]' : 'bg-slate-100 border-[#E2E8F0] text-[#0F172A]'}`}>
                    Target Time: Sept 20, 09:30 AM
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9]' : 'bg-slate-100 border-[#E2E8F0] text-[#0F172A]'}`}>
                    Commute Mode: Campus Shuttle (Route 4)
                  </span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    const sampleDisc: Discovery = {
                      id: 'disc-personalized-gate-route4',
                      workspace_id: workspaceId || '',
                      title: 'Commute-Exam Collision',
                      description: 'Main Gate closure detour delays Route 4 shuttle, causing student to arrive 35 minutes late for Midterm Exam.',
                      type: 'contradiction',
                      severity: 'high',
                      impact_score: 96,
                      confidence: 0.94,
                      status: 'active',
                      evidence: ['Academic Notice 2026/04', 'Admin Order 2026/11', 'Transport Circular 2026/02'],
                      reasoning: [
                        { step: 1, statement: 'Official Exam Schedule schedules Midterm on Sept 20 at 09:30 AM in Hall B' },
                        { step: 2, statement: 'Main Gate Maintenance completely closes North Hostel pedestrian/shuttle access Sept 18-22' },
                        { step: 3, statement: 'Shuttle Route 4 is detoured via South Ring adding 35 minutes delay' },
                        { step: 4, statement: 'Student will arrive at 10:05 AM (35 mins late) missing mandatory hall entry gate' },
                      ],
                      affected_entities: ['Main Gate', 'Route 4 Shuttle', 'Mid-Semester Exam'],
                      recommended_actions: ['Depart hostel by 07:45 AM', 'Use East Gate pedestrian corridor'],
                      created_at: new Date().toISOString()
                    };
                    setSelectedDiscoveryForWhy(sampleDisc);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer border ${
                    isDark
                      ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                      : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Why</span>
                </button>
                <button
                  onClick={() => navigate(`/workspace/${workspaceId}/simulate?preset=move_exam`)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer border ${
                    isDark
                      ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                      : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Simulate Mitigation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Multi-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Clashes & Discoveries */}
          <div className={`p-5 rounded-xl border flex flex-col shadow-xs ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                  Critical Active Risks & Collisions
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-500 font-semibold">
                {highSeverityClashes.length} Urgent
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {highSeverityClashes.map(disc => (
                <div
                  key={disc.id}
                  className={`p-4 rounded-lg border transition flex flex-col justify-between ${
                    isDark ? 'bg-[#111722] border-[#202832] hover:border-slate-500' : 'bg-slate-50 border-[#E2E8F0] hover:border-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase text-rose-500 font-semibold">
                        {disc.type} • Impact {disc.impact_score}/100
                      </span>
                      <button
                        onClick={() => setSelectedDiscoveryForWhy(disc)}
                        className={`text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition ${
                          isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why?</span>
                      </button>
                    </div>
                    <h4 className={`text-xs font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{disc.title}</h4>
                    <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {disc.description}
                    </p>
                  </div>

                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${isDark ? 'border-[#202832]' : 'border-[#E2E8F0]'}`}>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {disc.affected_entities?.length || 0} entities involved
                    </span>

                    <button
                      onClick={() => navigate(`/workspace/${workspaceId}/simulate`)}
                      className={`text-[10px] font-mono flex items-center space-x-1 cursor-pointer transition ${
                        isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>Simulate Resolution</span>
                    </button>
                  </div>
                </div>
              ))}

              {highSeverityClashes.length === 0 && (
                <div className="p-8 rounded-lg border border-dashed border-[#202832] text-center flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className={`font-medium ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>No High-Severity Clashes Detected</span>
                  <span className={`text-[11px] mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Workspace is currently within safe operational parameters.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Discovered Connections & Explainability Feed */}
          <div className={`p-6 rounded-xl border flex flex-col ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b mb-4 ${isDark ? 'border-[#202832]' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-slate-400" />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                  Discovered Cross-Source Connections
                </h3>
              </div>
              <button
                onClick={() => navigate(`/workspace/${workspaceId}/discoveries`)}
                className={`text-[11px] font-mono flex items-center space-x-1 cursor-pointer transition ${
                  isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <span>View All ({discoveries.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {discoveries.slice(0, 3).map(disc => (
                <div
                  key={disc.id}
                  className={`p-4 rounded-lg border transition ${
                    isDark ? 'bg-[#111722] border-[#202832] hover:border-slate-500' : 'bg-slate-50 border-[#E2E8F0] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isDark ? 'bg-[#0D1219] border-[#202832] text-[#F1F5F9]' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
                    }`}>
                      Inferred Connection
                    </span>
                    <button
                      onClick={() => setSelectedDiscoveryForWhy(disc)}
                      className={`text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition ${
                        isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Explain "Why?"</span>
                    </button>
                  </div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{disc.title}</h4>
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    {disc.description}
                  </p>
                </div>
              ))}

              {discoveries.length === 0 && (
                <div className="p-8 rounded-lg border border-dashed border-[#202832] text-center flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                  <Compass className="w-8 h-8 text-slate-400 mb-2" />
                  <span className={`font-medium ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>No Discoveries Synthesized Yet</span>
                  <span className={`text-[11px] mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Ingest documents or load the demo dataset to uncover non-obvious connections.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Launchpad to Core Intelligence Modules */}
        <div className={`rounded-xl border p-5 ${
          isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Intelligence Modules & Simulation Engines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => navigate(`/workspace/${workspaceId}/simulate`)}
              className={`p-4 rounded-lg border text-left transition group cursor-pointer ${
                isDark ? 'bg-[#111722] border-[#202832] hover:border-slate-500' : 'bg-slate-50 border-[#E2E8F0] hover:border-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2 text-slate-300 mb-1">
                <Cpu className="w-4 h-4" />
                <span className={`text-xs font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>What-If Counterfactual Simulation</span>
              </div>
              <p className={`text-[11px] leading-snug ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Modify gate closure or exam dates and calculate multi-hop cascading impacts in real time.
              </p>
            </button>

            <button
              onClick={() => navigate(`/workspace/${workspaceId}/timeline`)}
              className={`p-4 rounded-lg border text-left transition group cursor-pointer ${
                isDark ? 'bg-[#111722] border-[#202832] hover:border-slate-500' : 'bg-slate-50 border-[#E2E8F0] hover:border-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2 text-slate-300 mb-1">
                <Clock className="w-4 h-4" />
                <span className={`text-xs font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>Timeline & Temporal Clashes</span>
              </div>
              <p className={`text-[11px] leading-snug ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Inspect chronological timeline markers and evaluate simultaneous schedule overlap risks.
              </p>
            </button>

            <button
              onClick={() => navigate(`/workspace/${workspaceId}/graph`)}
              className={`p-4 rounded-lg border text-left transition group cursor-pointer ${
                isDark ? 'bg-[#111722] border-[#202832] hover:border-slate-500' : 'bg-slate-50 border-[#E2E8F0] hover:border-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2 text-slate-300 mb-1">
                <Network className="w-4 h-4" />
                <span className={`text-xs font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>Knowledge Graph Visualizer</span>
              </div>
              <p className={`text-[11px] leading-snug ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Explore typed nodes, inspect relationship confidence, and trace evidence paths directly.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Why Modal */}
      <WhyModal
        discovery={selectedDiscoveryForWhy}
        onClose={() => setSelectedDiscoveryForWhy(null)}
      />
    </div>
  );
};

export default CommandCenterPage;
