import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import type { GraphNode, GraphEdge } from '../services/api';
import { NodeInspector } from '../components/NodeInspector';
import { useTheme } from '../context/ThemeContext';

export const GraphPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const loadGraphData = useCallback(() => {
    if (!workspaceId) return;
    setLoading(true);
    api.getGraph(workspaceId)
      .then(data => {
        setNodes(data.nodes);
        setEdges(data.edges);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [workspaceId]);

  useEffect(() => {
    loadGraphData();
  }, [loadGraphData]);

  // Color mapping by entity type
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'event':
        return { bg: '#3b82f6', border: '#60a5fa', text: '#dbeafe', label: 'Event' };
      case 'risk':
        return { bg: '#ef4444', border: '#f87171', text: '#fee2e2', label: 'Risk' };
      case 'transport':
        return { bg: '#8b5cf6', border: '#a78bfa', text: '#ede9fe', label: 'Transport' };
      case 'location':
        return { bg: '#10b981', border: '#34d399', text: '#d1fae5', label: 'Location' };
      case 'person':
        return { bg: '#f59e0b', border: '#fbbf24', text: '#fef3c7', label: 'Person' };
      case 'policy':
        return { bg: '#06b6d4', border: '#22d3ee', text: '#cffafe', label: 'Policy' };
      default:
        return { bg: '#64748b', border: '#94a3b8', text: '#f1f5f9', label: 'Entity' };
    }
  };

  // Node position calculation in an aesthetic radial circular layout
  const nodePositions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const total = nodes.length;
    if (total === 0) return pos;

    const centerX = 450;
    const centerY = 320;
    const radius = Math.min(260, 90 + total * 20);

    nodes.forEach((node, idx) => {
      const angle = (idx / total) * 2 * Math.PI;
      pos[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return pos;
  }, [nodes]);

  // Filtering
  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (n.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || n.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const activeNodeIds = new Set(filteredNodes.map(n => n.id));

  const filteredEdges = edges.filter(
    e => activeNodeIds.has(e.source_entity_id) && activeNodeIds.has(e.target_entity_id)
  );

  const nodeTypes = Array.from(new Set(nodes.map(n => n.type)));

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-canvas') {
      setDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className={`flex-1 flex flex-col h-full relative overflow-hidden ${isDark ? 'bg-[#060B10]' : 'bg-[#F8FAFC]'}`}>
      {/* Top Header Bar */}
      <div className={`h-14 border-b px-4 sm:px-6 flex items-center justify-between z-10 transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1117]' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
          <div className="flex items-center space-x-2 shrink-0">
            <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Knowledge Graph</span>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
              isDark ? 'border-[#202832] text-slate-400' : 'border-slate-200 text-slate-600'
            }`}>
              {nodes.length} nodes · {edges.length} edges
            </span>
          </div>

          {/* Search */}
          <div className="relative w-36 sm:w-56 ml-2 shrink-0">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search entities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full border rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none transition ${
                isDark ? 'bg-[#11161D] border-[#202832] text-slate-200 placeholder-slate-500 focus:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
              }`}
            />
          </div>

          {/* Type Filter */}
          <div className="hidden md:flex items-center space-x-1 ml-2 overflow-x-auto">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer border ${
                selectedType === 'ALL'
                  ? isDark ? 'bg-[#11161D] text-slate-100 border-[#202832]' : 'bg-white text-slate-900 border-slate-300'
                  : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-[#11161D] border-transparent' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              All
            </button>
            {nodeTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer border ${
                  selectedType === type
                    ? isDark ? 'bg-[#11161D] text-slate-100 border-[#202832]' : 'bg-white text-slate-900 border-slate-300'
                    : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-[#11161D] border-transparent' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 2.2))}
            title="Zoom In"
            className={`p-1.5 rounded-md border transition cursor-pointer ${
              isDark ? 'bg-[#11161D] hover:bg-[#1A2230] border-[#202832] text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.4))}
            title="Zoom Out"
            className={`p-1.5 rounded-md border transition cursor-pointer ${
              isDark ? 'bg-[#11161D] hover:bg-[#1A2230] border-[#202832] text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            title="Reset View"
            className={`p-1.5 rounded-md border transition cursor-pointer ${
              isDark ? 'bg-[#11161D] hover:bg-[#1A2230] border-[#202832] text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={loadGraphData}
            title="Reload Graph"
            className={`p-1.5 rounded-md border transition cursor-pointer ${
              isDark ? 'bg-[#11161D] hover:bg-[#1A2230] border-[#202832] text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area + Optional Right Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        <div
          id="graph-canvas"
          className="flex-1 h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {nodes.length === 0 && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <Layers className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-300">No Graph Entities Ingested</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Upload documents in Sources or click "Load Campus Demo" in the sidebar to visualize relationships.
              </p>
            </div>
          )}

          <svg
            className="w-full h-full"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: dragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <defs>
              <pattern id="graph-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={isDark ? '#202832' : '#E2E8F0'} />
              </pattern>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill={isDark ? '#60A5FA' : '#3B82F6'} />
              </marker>
              <marker
                id="arrowhead-selected"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill={isDark ? '#93C5FD' : '#2563EB'} />
              </marker>
            </defs>

            {/* Background grid */}
            <rect width="5000" height="5000" x="-2500" y="-2500" fill="url(#graph-grid)" opacity={isDark ? 0.6 : 0.8} />

            {/* Render Edges */}
            {filteredEdges.map(edge => {
              const src = nodePositions[edge.source_entity_id];
              const tgt = nodePositions[edge.target_entity_id];
              if (!src || !tgt) return null;

              const isConnectedToSelected =
                selectedNode &&
                (edge.source_entity_id === selectedNode.id || edge.target_entity_id === selectedNode.id);

              return (
                <g key={edge.id} className="transition-opacity duration-200">
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isConnectedToSelected ? (isDark ? '#93C5FD' : '#2563EB') : (isDark ? '#2A3545' : '#CBD5E1')}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                    strokeDasharray={edge.relationship_type === 'affects' || edge.relationship_type === 'delays' ? '4 3' : undefined}
                    markerEnd={isConnectedToSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)"}
                  />
                  {/* Relationship label */}
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 6}
                    fill={isConnectedToSelected ? (isDark ? '#93C5FD' : '#1D4ED8') : (isDark ? '#94A3B8' : '#64748B')}
                    fontSize="10"
                    fontFamily="ui-monospace, monospace"
                    textAnchor="middle"
                    className="select-none font-medium pointer-events-none"
                  >
                    {edge.relationship_type}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {filteredNodes.map(node => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isSelected = selectedNode?.id === node.id;
              const color = getTypeColor(node.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Glow circle if selected */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill="none"
                      stroke={isDark ? '#60A5FA' : '#3B82F6'}
                      strokeWidth="2.5"
                      className="animate-pulse"
                      strokeOpacity="0.9"
                    />
                  )}

                  {/* Base Node */}
                  <circle
                    r="18"
                    fill={color.bg}
                    stroke={isSelected ? '#ffffff' : color.border}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-transform duration-200 group-hover:scale-110 shadow-sm"
                  />

                  {/* Node Icon Initial */}
                  <text
                    y="4"
                    fill={color.text}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.name[0]}
                  </text>

                  {/* Node Label Card */}
                  <text
                    y="32"
                    fill={isDark ? (isSelected ? '#FFFFFF' : '#E2E8F0') : (isSelected ? '#0F172A' : '#1E293B')}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : '500'}
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Node Inspector */}
        {selectedNode && (
          <NodeInspector
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};
