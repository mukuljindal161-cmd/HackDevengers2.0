import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Cpu,
  BookOpen,
  Network,
  CheckCircle2,
  Loader2,
  ChevronRight,
  AlertCircle,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import type { QueryResult } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

import { updateDemoJourney } from '../services/demoJourney';

export const QueryPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);

  useEffect(() => {
    api.getHealth()
      .then(h => setAiEnabled(h.ai_enabled))
      .catch(() => setAiEnabled(false));
  }, []);

  const predefinedQueries = [
    t('storybar.step3_query') || "Will I miss my exam because of the current gate closure and Route 4 disruption?",
    "What could affect my commute or exam this week?",
    "Why is the Main Gate closure significant?",
    "What dependencies exist around Bus Route 4?",
    "Show me all detected schedule conflicts."
  ];

  const handleSearch = useCallback(async (queryText: string) => {
    if (!workspaceId || !queryText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.queryIntelligence(workspaceId, queryText, language);
      setResult(res);
      updateDemoJourney(workspaceId, { step3_queried: true });
    } catch (err: any) {
      setError(err.message || 'Query execution failed');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, language]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams, handleSearch]);

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isDark ? 'bg-[#080B10]' : 'bg-[#F6F8FA]'}`}>
      {/* Header */}
      <div className={`h-14 border-b px-6 flex items-center justify-between transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <MessageSquare className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{t('query_page.title') || 'Hybrid Context & Graph Query'}</h1>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
        {/* Input Bar */}
        <div className={`p-4 rounded-xl border shadow-xs ${isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-slate-200 bg-white'}`}>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('query_page.placeholder') || "Ask anything: 'What could affect me this week?', 'Show me conflicts'..."}
              className={`flex-1 border rounded-md px-4 py-2.5 text-xs focus:outline-none transition ${
                isDark ? 'bg-[#080B10] border-[#202832] text-[#F1F5F9] placeholder-[#64748B] focus:border-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`px-4 py-2.5 rounded-md text-xs font-medium shadow-xs transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer border ${
                isDark
                  ? 'bg-[#111722] hover:bg-[#1A2333] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              {loading ? (
                <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              ) : (
                <Send className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              )}
              <span>{loading ? (t('query_page.btn_loading') || 'Synthesizing...') : (t('query_page.btn') || 'Query')}</span>
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className={`text-[11px] font-medium ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>{t('query_page.suggested_prompts') || 'Quick suggestions:'}</span>
            {predefinedQueries.map((pq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(pq);
                  handleSearch(pq);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition cursor-pointer ${
                  isDark ? 'bg-[#111722] hover:bg-[#1A2333] text-[#F1F5F9] border-[#202832]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {pq}
              </button>
            ))}
          </div>
        </div>

        {/* Results Stream */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Core Answer */}
            <div className={`p-6 rounded-xl border relative overflow-hidden shadow-xs ${
              isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b mb-4 ${
                isDark ? 'border-[#202832]' : 'border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Cpu className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-xs font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-900'}`}>Synthesized Reasoning</span>
                </div>
                <span className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                  {t('query_page.confidence') || 'Grounding Confidence'}: {Math.round(result.confidence * 100)}%
                </span>
              </div>

              <div className={`text-xs leading-relaxed space-y-3 whitespace-pre-line ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                {result.answer}
              </div>

              {/* Related Knowledge Graph Nodes */}
              {result.nodes?.length > 0 && (
                <div className={`mt-5 pt-4 border-t ${isDark ? 'border-[#202832]' : 'border-slate-200'}`}>
                  <span className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                    <Network className={`w-3.5 h-3.5 mr-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    {t('query_page.connected_nodes') || 'Relevant Knowledge Graph Entities'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.nodes.map(node => (
                      <span
                        key={node.id}
                        className={`text-xs px-2.5 py-1 rounded-md border font-mono ${
                          isDark ? 'bg-[#111722] text-[#F1F5F9] border-[#202832]' : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {node.name} <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>({node.type})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Evidence & Reasoning Chain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Reasoning Steps */}
              <div className={`p-5 rounded-xl border shadow-xs ${
                isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
                  {t('query_page.reasoning') || 'Reasoning Chain'}
                </h3>
                <div className="space-y-2.5">
                  {result.reasoning.map(step => (
                    <div key={step.step} className={`text-xs flex items-start space-x-2 ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span>{step.thought}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Chunks */}
              <div className={`p-5 rounded-xl border shadow-xs ${
                isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
                  <BookOpen className={`w-3.5 h-3.5 mr-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  {t('query_page.citations') || 'Semantic Chunk Citations'}
                </h3>
                <div className="space-y-2">
                  {result.sources.map((src, idx) => (
                    <div key={idx} className={`p-2.5 rounded-md border ${
                      isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-semibold block ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>{src.title}</span>
                      <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>"{src.snippet}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
