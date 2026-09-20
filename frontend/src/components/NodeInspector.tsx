import React, { useEffect, useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, BookOpen, Layers, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { GraphNode, GraphEdge } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface NodeInspectorProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [neighborData, setNeighborData] = useState<{
    in_edges: GraphEdge[];
    out_edges: GraphEdge[];
    neighbors: GraphNode[];
  } | null>(null);
  const [evidenceList, setEvidenceList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!node) return;
    let isMounted = true;
    setLoading(true);
    Promise.all([
      api.getNodeNeighbors(node.id),
      api.getNodeEvidence(node.id)
    ])
      .then(([neighbors, ev]) => {
        if (isMounted) {
          setNeighborData(neighbors);
          setEvidenceList(ev.evidence || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [node]);

  if (!node) return null;

  return (
    <div className={`w-80 border-l p-5 flex flex-col h-full overflow-y-auto transition-colors shadow-lg z-20 ${
      isDark ? 'border-[#202832] bg-[#0D1219] text-[#F1F5F9]' : 'border-[#E2E8F0] bg-white text-[#0F172A]'
    }`}>
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDark ? 'border-[#202832]' : 'border-[#E2E8F0]'
      }`}>
        <div className="flex items-center space-x-2">
          <Layers className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Entity Inspector</span>
        </div>
        <button onClick={onClose} className={`p-1 rounded cursor-pointer transition ${
          isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        }`}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          <div>
            <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-medium border ${
              isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9]' : 'bg-slate-100 border-[#E2E8F0] text-[#0F172A]'
            }`}>
              {node.type}
            </span>
            <h3 className={`text-base font-bold mt-2 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{node.name}</h3>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {node.description || 'No direct description available.'}
            </p>
            <div className={`mt-2 text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Confidence: <span className={`font-mono font-medium ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{Math.round(node.confidence * 100)}%</span>
            </div>
          </div>

          {/* Relationships */}
          {neighborData && (
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Connected Edges</h4>
              <div className="space-y-2">
                {neighborData.out_edges.map(e => (
                  <div key={e.id} className={`text-xs p-2 rounded-md border flex items-center justify-between ${
                    isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
                  }`}>
                    <span className={`flex items-center ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {e.relationship_type}
                    </span>
                    <span className={`font-mono text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>outgoing</span>
                  </div>
                ))}
                {neighborData.in_edges.map(e => (
                  <div key={e.id} className={`text-xs p-2 rounded-md border flex items-center justify-between ${
                    isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
                  }`}>
                    <span className={`flex items-center ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                      <ArrowDownLeft className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {e.relationship_type}
                    </span>
                    <span className={`font-mono text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>incoming</span>
                  </div>
                ))}
                {neighborData.out_edges.length === 0 && neighborData.in_edges.length === 0 && (
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No active edges recorded.</span>
                )}
              </div>
            </div>
          )}

          {/* Evidence */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              Grounding Evidence
            </h4>
            <div className="space-y-1.5">
              {evidenceList.map((ev, idx) => (
                <div key={idx} className={`text-[11px] p-2.5 rounded-md border font-mono ${
                  isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9]' : 'bg-slate-50 border-[#E2E8F0] text-[#0F172A]'
                }`}>
                  {ev}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
