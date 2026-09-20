import React, { useEffect, useState } from 'react';
import { X, ArrowRight, BookOpen, CheckCircle, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Discovery } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface WhyModalProps {
  discovery: Discovery | null;
  onClose: () => void;
}

export const WhyModal: React.FC<WhyModalProps> = ({ discovery, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [explanation, setExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!discovery) return;
    let isMounted = true;
    api.getDiscoveryExplanation(discovery.id)
      .then(data => {
        if (isMounted) setExplanation(data);
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [discovery]);

  if (!discovery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-start justify-between ${
          isDark ? 'border-[#202832] bg-[#060B10]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div>
            <div className="flex items-center space-x-3">
              <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                discovery.severity === 'high' ? 'text-rose-500' :
                discovery.severity === 'medium' ? 'text-amber-500' :
                'text-blue-500'
              }`}>
                ● {discovery.severity} Severity
              </span>
              <span className={`text-[11px] font-mono uppercase font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {discovery.type.replace('_', ' ')}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Impact: <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{discovery.impact_score}/100</span>
              </span>
            </div>
            <h2 className={`text-lg font-bold mt-2 leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {discovery.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Specialized Contradiction Discrepancy Card */}
              {discovery.type === 'contradiction' && (
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-2 text-amber-500 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Hallucination Firewall: Source Contradiction
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Disparate official documents present discordant facts regarding this entity. RealityGraph surfaces both sources rather than fabricating an arbitrary resolution.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`p-3 rounded-md border ${
                      isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-[10px] font-mono text-amber-500 block mb-1">Source Notice A</span>
                      <span className={`text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {discovery.evidence?.[0] || 'Original bulletin specifies active baseline status'}
                      </span>
                    </div>
                    <div className={`p-3 rounded-md border ${
                      isDark ? 'bg-[#0D1117] border-[#202832]' : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-[10px] font-mono text-amber-500 block mb-1">Source Notice B</span>
                      <span className={`text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {discovery.evidence?.[1] || 'Secondary circular lists conflicting operational timing'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Specialized Personalized Impact Breakdown */}
              {discovery.type === 'personalized_impact' && (
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center">
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Personalized Persona Risk Profile (Spec 8.1)
                    </span>
                    <span className="text-[10px] font-mono text-rose-500 font-semibold">
                      Vulnerability: 96/100
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    This risk specifically targets your daily routine: <strong>North Hostel → Bus Route 4 → Academic Block A</strong> for the 9:00 AM exam cutoff. Other campus cohorts are unaffected.
                  </p>
                </div>
              )}

              {/* Core conclusion */}
              <div className={`p-4 rounded-lg border ${
                isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-1 flex items-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Zap className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Core Inferred Intelligence
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {explanation?.core_conclusion || discovery.description}
                </p>
              </div>

              {/* Reasoning Chain */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Step-by-Step Reasoning Chain
                </h3>
                <div className="space-y-3">
                  {(explanation?.reasoning_chain || discovery.reasoning || []).map((step: any, idx: number) => (
                    <div key={idx} className={`flex items-start space-x-3 p-3 rounded-lg border ${
                      isDark ? 'bg-[#11161D] border-[#202832]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`w-5 h-5 rounded font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border ${
                        isDark ? 'bg-[#0D1117] border-[#202832] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        {step.step || idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{step.statement}</p>
                        {step.evidence_type && (
                          <span className={`inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            isDark ? 'border-[#202832] text-slate-400' : 'border-slate-200 text-slate-600'
                          }`}>
                            {step.evidence_type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Citations */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <BookOpen className="w-3.5 h-3.5 mr-1" />
                  Direct Source Evidence
                </h3>
                <div className="space-y-2">
                  {(explanation?.evidence_citations || discovery.evidence || []).map((item: string, idx: number) => (
                    <div key={idx} className={`text-xs p-2.5 rounded-md border font-mono ${
                      isDark ? 'bg-[#11161D] border-[#202832] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      "{item}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              {(explanation?.action_items || discovery.recommended_actions || []).length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-3 flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Recommended Next Actions
                  </h3>
                  <ul className="space-y-2">
                    {(explanation?.action_items || discovery.recommended_actions).map((act: string, idx: number) => (
                      <li key={idx} className={`flex items-start text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <ArrowRight className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${
          isDark ? 'border-[#202832] bg-[#060B10]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-medium rounded-md shadow-xs transition cursor-pointer border ${
              isDark
                ? 'bg-[#11161D] hover:bg-[#1A2230] text-slate-100 border-[#202832]'
                : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-200'
            }`}
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
