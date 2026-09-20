import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Cpu,
  Play,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Network,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Loader2,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import type { SimulationResult, GraphNode } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { updateDemoJourney } from '../services/demoJourney';

interface ScenarioPreset {
  id: string;
  title: string;
  description: string;
  badge: string;
  entity: string;
  property: string;
  value: string;
}

export const SimulationPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Graph entities in current workspace
  const [workspaceNodes, setWorkspaceNodes] = useState<GraphNode[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);

  // Simulation form state
  const [targetEntity, setTargetEntity] = useState('Main Gate Closure');
  const [targetProperty, setTargetProperty] = useState('end_date');
  const [newValue, setNewValue] = useState('2026-09-23');

  // Execution state
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scenario presets
  const presets: ScenarioPreset[] = [
    {
      id: 'closure_extension',
      title: 'Extend Gate Closure by 2 Days',
      description: 'Prolongs closure past exam date, inducing route diversion clash',
      badge: 'Conflict Generator',
      entity: 'Main Gate Closure',
      property: 'end_date',
      value: '2026-09-23',
    },
    {
      id: 'reschedule_exam',
      title: 'Reschedule Exam to Sept 24',
      description: 'Moves exam safely after gate reopening and rainfall storm window',
      badge: 'Conflict Resolver',
      entity: 'Mid-Semester Examination',
      property: 'start_date',
      value: '2026-09-24',
    },
    {
      id: 'early_reopening',
      title: 'Early Gate Reopening (Sept 18)',
      description: 'Simulates expedited repairs reopening Route 4 prior to exam',
      badge: 'Early Mitigation',
      entity: 'Main Gate Closure',
      property: 'end_date',
      value: '2026-09-18',
    },
    {
      id: 'heavy_rain_extended',
      title: 'Torrential Rain Persists to Sept 22',
      description: 'Tests secondary road closures and shuttle delays under heavy storm',
      badge: 'Weather Risk',
      entity: 'Heavy Rainfall Warning',
      property: 'end_date',
      value: '2026-09-22',
    }
  ];

  // Load workspace graph entities for selection
  const loadWorkspaceEntities = useCallback(async () => {
    if (!workspaceId) return;
    setLoadingNodes(true);
    try {
      const graph = await api.getGraph(workspaceId);
      setWorkspaceNodes(graph.nodes || []);
    } catch (err) {
      console.warn('Could not pre-load workspace nodes:', err);
    } finally {
      setLoadingNodes(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadWorkspaceEntities();
  }, [loadWorkspaceEntities]);

  useEffect(() => {
    const presetId = searchParams.get('preset');
    const autoRun = searchParams.get('autoRun') === 'true';

    if (presetId) {
      const found = presets.find(p => p.id === presetId);
      if (found) {
        applyPreset(found);
        if (autoRun && workspaceId) {
          setSimulating(true);
          api.simulateChange(workspaceId, {
            entity: found.entity,
            property: found.property,
            value: found.value,
          })
            .then(res => {
              setResult(res);
              updateDemoJourney(workspaceId, { step4_simulated: true });
            })
            .catch(err => {
              setError(err.message || 'Simulation execution failed');
            })
            .finally(() => {
              setSimulating(false);
            });
        }
      }
    }
  }, [searchParams, workspaceId]);

  const applyPreset = (preset: ScenarioPreset) => {
    setTargetEntity(preset.entity);
    setTargetProperty(preset.property);
    setNewValue(preset.value);
    setError(null);
  };

  const handleSimulate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!workspaceId) return;
    if (!targetEntity.trim()) {
      setError('Please select or specify a target entity to simulate.');
      return;
    }

    setSimulating(true);
    setError(null);

    try {
      const res = await api.simulateChange(workspaceId, {
        entity: targetEntity.trim(),
        property: targetProperty.trim(),
        value: newValue.trim(),
      });
      setResult(res);
      updateDemoJourney(workspaceId, { step4_simulated: true });
    } catch (err: any) {
      setError(err.message || 'Simulation execution failed');
    } finally {
      setSimulating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const getNodeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'event': return 'text-slate-300';
      case 'risk': return 'text-rose-400';
      case 'transport': return 'text-slate-300';
      case 'location': return 'text-slate-300';
      case 'person': return 'text-slate-300';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isDark ? 'bg-[#080B10]' : 'bg-[#F6F8FA]'}`}>
      {/* Header */}
      <div className={`h-14 border-b px-6 flex items-center justify-between transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isDark ? 'bg-[#111722] border-[#202832] text-blue-400' : 'bg-slate-100 border-slate-200 text-blue-600'
          }`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className={`text-sm font-semibold tracking-tight flex items-center space-x-2 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              <span>What-If Counterfactual Simulation Engine</span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                · Multi-Hop Propagation
              </span>
            </h1>
            <p className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
              Modify graph conditions to dynamically compute downstream cascade effects and conflict transitions
            </p>
          </div>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className={`px-3 py-1.5 rounded-md text-xs font-medium shadow-xs flex items-center space-x-1.5 transition cursor-pointer border ${
              isDark
                ? 'bg-[#111722] hover:bg-[#1A2333] text-[#F1F5F9] border-[#202832]'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>Reset Scenario</span>
          </button>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto max-w-6xl mx-auto w-full space-y-6">
        {/* Error Banner */}
        {error && (
          <div className={`p-3.5 rounded-lg border flex items-start justify-between animate-fadeIn ${
            isDark ? 'bg-[#0D1219] border-rose-500/40 text-rose-400' : 'bg-white border-rose-200 text-rose-700 shadow-xs'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">Simulation Error</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs underline ml-4 opacity-70 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Scenario Presets */}
        <div className={`rounded-xl border p-4 shadow-xs ${
          isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sliders className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
                Hypothesis Presets & Counterfactual Queries
              </h3>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Click any preset to pre-fill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-lg border text-left transition duration-150 cursor-pointer ${
                  targetEntity === preset.entity && newValue === preset.value
                    ? isDark ? 'bg-[#111722] border-blue-500/60 text-[#F1F5F9]' : 'bg-blue-50/50 border-blue-300 text-slate-900'
                    : isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9] hover:border-slate-600 hover:bg-[#1A2333]' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isDark ? 'bg-[#0D1219] border-[#202832] text-[#94A3B8]' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    {preset.badge}
                  </span>
                </div>
                <h4 className={`text-xs font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                  {preset.title}
                </h4>
                <p className={`text-[11px] mt-1 line-clamp-2 leading-snug ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Parameter Form */}
        <div className={`rounded-xl border p-6 shadow-xs ${
          isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sliders className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                Configure Parameter Perturbation
              </h3>
            </div>
            {workspaceNodes.length > 0 && (
              <span className={`text-[11px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                {workspaceNodes.length} graph entities available
              </span>
            )}
          </div>

          <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`text-xs font-medium mb-1.5 flex items-center justify-between ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
                <span>Target Entity</span>
                {loadingNodes && <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />}
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="workspace-entity-list"
                  value={targetEntity}
                  onChange={e => setTargetEntity(e.target.value)}
                  placeholder="e.g. Main Gate Closure"
                  className={`w-full border rounded-md px-3 py-2 text-xs focus:outline-none transition ${
                    isDark ? 'bg-[#080B10] border-[#202832] text-[#F1F5F9] placeholder-[#64748B] focus:border-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  }`}
                />
                <datalist id="workspace-entity-list">
                  {workspaceNodes.map(node => (
                    <option key={node.id} value={node.name}>
                      {node.type}
                    </option>
                  ))}
                </datalist>
              </div>
              <span className={`text-[10px] mt-1 block ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                Select from graph or type any entity name
              </span>
            </div>

            <div>
              <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
                Property / Parameter
              </label>
              <input
                type="text"
                value={targetProperty}
                onChange={e => setTargetProperty(e.target.value)}
                placeholder="end_date, status, severity, etc."
                className={`w-full border rounded-md px-3 py-2 text-xs focus:outline-none transition ${
                  isDark ? 'bg-[#080B10] border-[#202832] text-[#F1F5F9] placeholder-[#64748B] focus:border-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                }`}
              />
              <span className={`text-[10px] mt-1 block ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                Property key to perturb in counterfactual state
              </span>
            </div>

            <div>
              <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
                Simulated Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="e.g. 2026-09-23 or Resolved"
                className={`w-full border rounded-md px-3 py-2 text-xs focus:outline-none transition ${
                  isDark ? 'bg-[#080B10] border-[#202832] text-[#F1F5F9] placeholder-[#64748B] focus:border-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                }`}
              />
              <span className={`text-[10px] mt-1 block ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                New condition to project forward through relationships
              </span>
            </div>

            <div className={`md:col-span-3 flex items-center justify-between pt-2 border-t mt-2 ${isDark ? 'border-[#202832]' : 'border-slate-200'}`}>
              <div className={`flex items-center space-x-2 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Traverses upstream & downstream edges across multi-hop dependencies.</span>
              </div>

              <button
                type="submit"
                disabled={simulating}
                className={`px-6 py-2.5 rounded-md text-xs font-medium shadow-xs transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer border ${
                  isDark
                    ? 'bg-[#111722] hover:bg-[#1A2333] text-[#F1F5F9] border-[#202832]'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                {simulating ? (
                  <>
                    <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span>Calculating Cascade Impacts...</span>
                  </>
                ) : (
                  <>
                    <Play className={`w-3.5 h-3.5 fill-current ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading Skeleton */}
        {simulating && (
          <div className={`rounded-xl border p-8 flex flex-col items-center justify-center space-y-3 animate-pulse ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className={`text-xs font-medium ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
              Performing multi-hop graph traversal and counterfactual conflict analysis...
            </p>
          </div>
        )}

        {/* Simulation Output */}
        {result && !simulating && (
          <div className="space-y-6 animate-fadeIn">
            {/* Impact Summary Banner */}
            <div className={`p-6 rounded-xl border relative overflow-hidden ${
              isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b mb-4 ${
                isDark ? 'border-[#202832]' : 'border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                      Simulation Intelligence Summary
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isDark ? 'bg-[#111722] border-[#202832] text-[#94A3B8]' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      ID: {result.simulation_id}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed font-medium mt-1 ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                    {result.summary}
                  </p>
                </div>

                {/* Metric Quick Stats */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className={`px-3.5 py-2 rounded-lg border text-center ${
                    isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-500 block font-mono">Impacted</span>
                    <span className={`text-base font-bold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                      {result.impacted_nodes.length}
                    </span>
                  </div>
                  <div className={`px-3.5 py-2 rounded-lg border text-center ${
                    isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-500 block font-mono">Emergent</span>
                    <span className="text-base font-bold text-rose-500">
                      {result.new_conflicts.length}
                    </span>
                  </div>
                  <div className={`px-3.5 py-2 rounded-lg border text-center ${
                    isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-500 block font-mono">Resolved</span>
                    <span className="text-base font-bold text-emerald-500">
                      {result.resolved_conflicts.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* State Comparison Card: Original vs Simulated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className={`p-3.5 rounded-lg border ${
                  isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Baseline / Original Graph State
                  </span>
                  <div className="text-xs space-y-1">
                    {Object.entries(result.original_state).map(([k, v]) => (
                      <div key={k} className={`flex justify-between py-0.5 border-b last:border-0 ${
                        isDark ? 'border-[#202832]' : 'border-slate-200'
                      }`}>
                        <span className="text-slate-500 font-mono">{k}:</span>
                        <span className={`font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>{String(v)}</span>
                      </div>
                    ))}
                    {Object.keys(result.original_state).length === 0 && (
                      <span className="text-slate-500 italic">No previous baseline state bound</span>
                    )}
                  </div>
                </div>

                <div className={`p-3.5 rounded-lg border ${
                  isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider block mb-1">
                    Perturbed / Counterfactual State
                  </span>
                  <div className="text-xs space-y-1">
                    {Object.entries(result.modified_state).map(([k, v]) => (
                      <div key={k} className={`flex justify-between py-0.5 border-b last:border-0 ${
                        isDark ? 'border-[#202832]' : 'border-slate-200'
                      }`}>
                        <span className="text-slate-500 font-mono">{k}:</span>
                        <span className="font-semibold text-emerald-500">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Conflicts Matrix: Emergent vs Resolved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emergent Conflicts & Risks */}
              <div className={`p-5 rounded-xl border flex flex-col ${
                isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                    Emergent Conflicts & Risks ({result.new_conflicts.length})
                  </h3>
                  {result.new_conflicts.length > 0 && (
                    <span className="text-[10px] font-mono text-rose-500 font-semibold">
                      High Impact
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 flex-1">
                  {result.new_conflicts.map((conflict, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                        isDark ? 'bg-[#111722] border-[#202832] text-rose-300' : 'bg-slate-50 border-slate-200 text-rose-700'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{conflict}</span>
                    </div>
                  ))}

                  {result.new_conflicts.length === 0 && (
                    <div className={`p-4 rounded-lg border border-dashed text-center flex flex-col items-center justify-center h-full text-xs ${
                      isDark ? 'border-[#202832] text-slate-500' : 'border-slate-200 text-slate-600'
                    }`}>
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1.5" />
                      <span>No new conflicts or risk factors induced by this change.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolved Conflicts & Mitigations */}
              <div className={`p-5 rounded-xl border flex flex-col ${
                isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Resolved Conflicts & Mitigations ({result.resolved_conflicts.length})
                  </h3>
                  {result.resolved_conflicts.length > 0 && (
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                      Positive Transition
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 flex-1">
                  {result.resolved_conflicts.map((resolved, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                        isDark ? 'bg-[#111722] border-[#202832] text-emerald-300' : 'bg-slate-50 border-slate-200 text-emerald-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{resolved}</span>
                    </div>
                  ))}

                  {result.resolved_conflicts.length === 0 && (
                    <div className={`p-4 rounded-lg border border-dashed text-center flex flex-col items-center justify-center h-full text-xs ${
                      isDark ? 'border-[#202832] text-slate-500' : 'border-slate-200 text-slate-600'
                    }`}>
                      <Info className="w-5 h-5 text-slate-400 mb-1" />
                      <span>No existing schedule clashes resolved under this perturbation.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Downstream Affected Entities Grid */}
            <div className={`p-5 rounded-xl border ${
              isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xs font-semibold uppercase tracking-wider flex items-center ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                  <Network className={`w-3.5 h-3.5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  Impacted Knowledge Graph Nodes ({result.impacted_nodes.length})
                </h3>
                <span className={`text-[11px] font-mono ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                  Full multi-hop propagation path
                </span>
              </div>

              {result.impacted_nodes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {result.impacted_nodes.map(node => (
                    <div
                      key={node.id}
                      className={`p-3 rounded-lg border flex items-center justify-between transition ${
                        isDark ? 'bg-[#111722] border-[#202832] hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="overflow-hidden mr-2">
                        <span className={`text-xs font-semibold block truncate ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                          {node.name}
                        </span>
                        <span className={`text-[10px] block truncate ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                          {node.name.toLowerCase().includes(targetEntity.toLowerCase()) ? 'Target Node' : 'Downstream Dependency'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                          isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
                        } ${getNodeBadgeClass(node.type)}`}
                      >
                        {node.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 rounded-lg border text-center text-xs ${
                  isDark ? 'bg-[#111722] border-[#202832] text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  No downstream entities affected. The target node may be isolated or disconnected from the graph.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State before running */}
        {!result && !simulating && (
          <div className={`p-8 rounded-xl border text-center flex flex-col items-center justify-center space-y-3 ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              isDark ? 'bg-[#111722] border-[#202832] text-blue-400' : 'bg-slate-100 border-slate-200 text-blue-600'
            }`}>
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>No Simulation Executed Yet</h3>
              <p className={`text-xs max-w-md mx-auto mt-1 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                Choose a hypothesis preset above or configure a parameter change to test how schedule delays, closures, or policy shifts propagate downstream across your workspace graph.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;
