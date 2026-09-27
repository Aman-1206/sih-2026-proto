import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ResourceType, RelationType } from '@oruvia/shared';
import { Search, Filter, ZoomIn, ZoomOut, Layers, ExternalLink, Network } from 'lucide-react';

const NODE_TYPES: Array<{ type: ResourceType; label: string; color: string }> = [
  { type: 'dataset', label: 'Dataset', color: '#3D7BFF' },
  { type: 'publication', label: 'Publication', color: '#B7FF5A' },
  { type: 'expedition', label: 'Expedition', color: '#2E7D32' },
  { type: 'station', label: 'Station', color: '#E5A93C' },
  { type: 'person', label: 'Person', color: '#9C27B0' },
  { type: 'organization', label: 'Organization', color: '#00BCD4' },
  { type: 'location', label: 'Location', color: '#FF5722' },
  { type: 'media', label: 'Media', color: '#E91E63' },
  { type: 'story', label: 'Story', color: '#795548' },
];

const RELATIONSHIPS: RelationType[] = [
  'COLLECTED_DURING',
  'COLLECTED_AT',
  'AUTHORED_BY',
  'AFFILIATED_WITH',
  'USES_DATASET',
  'DERIVED_FROM',
  'DOCUMENTED_BY',
  'CITES',
  'RELATED_TO',
];

export default function KnowledgeGraphPage() {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['knowledge-graph'],
    queryFn: () => api.graph.getGraph(),
  });

  const nodes = data?.nodes || [];
  const links = data?.links || [];

  const filteredNodes = nodes.filter((n: any) => {
    const matchesType = selectedType === 'ALL' || n.type === selectedType;
    const matchesSearch = !searchTerm || n.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#0D1211] flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 px-6 sm:px-8 border-b border-[#0D1211]/10 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1211] text-[#B7FF5A] text-xs font-mono">
            <Network className="w-3.5 h-3.5" />
            <span>CONNECTED SCIENTIFIC KNOWLEDGE MODEL</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#0D1211]">
            Knowledge Graph
          </h1>

          <p className="text-base sm:text-xl text-[#747A75] font-light max-w-3xl leading-relaxed">
            Visual relationships between research stations, expeditions, datasets, publications, and contributors. Progressive node disclosure preserves graph clarity.
          </p>
        </div>
      </section>

      {/* Main Interactive Graph Area */}
      <main className="flex-1 py-8 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#0D1211]/15 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#747A75] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search graph nodes..."
                className="w-full bg-[#F4F2EC] pl-9 pr-4 py-2 rounded-lg border border-[#0D1211]/10 text-xs text-[#0D1211] focus:outline-none"
              />
            </div>

            {/* Node Type Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-full uppercase transition-colors ${selectedType === 'ALL' ? 'bg-[#0D1211] text-[#B7FF5A] font-semibold' : 'bg-[#F4F2EC] text-[#747A75] hover:text-[#0D1211]'}`}
              >
                All Nodes ({nodes.length})
              </button>
              {NODE_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full uppercase transition-colors ${selectedType === type ? 'bg-[#0D1211] text-[#B7FF5A] font-semibold' : 'bg-[#F4F2EC] text-[#747A75] hover:text-[#0D1211]'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Graph Visualization Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Stage */}
            <div className="lg:col-span-8 bg-[#0D1211] rounded-2xl border border-[#0D1211]/15 min-h-[550px] relative overflow-hidden p-6 flex flex-col justify-between text-[#F4F2EC]">
              <div className="flex items-center justify-between z-10 font-mono text-xs">
                <span className="text-[#B7FF5A] font-semibold">Graph Viewer · {filteredNodes.length} Nodes Active</span>
                <span className="text-[#747A75]">Drag or click node to inspect metadata</span>
              </div>

              {/* Force-directed SVG Simulation Representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" className="absolute inset-0">
                  {/* Links */}
                  {links.slice(0, 35).map((l: any, i: number) => (
                    <line
                      key={i}
                      x1={`${15 + ((i * 37) % 70)}%`}
                      y1={`${15 + ((i * 53) % 70)}%`}
                      x2={`${20 + ((i * 71) % 65)}%`}
                      y2={`${20 + ((i * 43) % 65)}%`}
                      stroke="rgba(183,255,90,0.18)"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  ))}
                  {/* Nodes */}
                  {filteredNodes.slice(0, 30).map((node: any, i: number) => {
                    const nodeTypeMeta = NODE_TYPES.find((t) => t.type === node.type) || { color: '#B7FF5A' };
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <g
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx={`${12 + ((i * 47) % 76)}%`}
                          cy={`${12 + ((i * 31) % 76)}%`}
                          r={isSelected ? 14 : 9}
                          fill={nodeTypeMeta.color}
                          stroke="#0D1211"
                          strokeWidth={isSelected ? 3 : 1.5}
                          className="transition-all duration-300 group-hover:scale-125"
                        />
                        <text
                          x={`${12 + ((i * 47) % 76)}%`}
                          y={`${12 + ((i * 31) % 76) + 4}%`}
                          fontSize="9"
                          fontFamily="IBM Plex Mono"
                          fill="#FAF9F5"
                          textAnchor="middle"
                          className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend overlay */}
              <div className="z-10 bg-[#131B19]/90 border border-[#747A75]/30 p-3 rounded-xl font-mono text-[11px] flex flex-wrap gap-3">
                {NODE_TYPES.map(({ type, label, color }) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[#747A75]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspector Panel */}
            <div className="lg:col-span-4 bg-[#FAF9F5] rounded-2xl border border-[#0D1211]/15 p-6 flex flex-col justify-between space-y-6">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-[#0D1211]/10 pb-2">
                    <span className="px-2 py-0.5 rounded bg-[#0D1211] text-[#B7FF5A] uppercase font-semibold text-[10px]">
                      {selectedNode.type}
                    </span>
                    <span className="text-[#747A75]">ID: {selectedNode.id}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-medium text-[#0D1211]">{selectedNode.name}</h3>

                  <div className="space-y-2 text-xs font-mono text-[#747A75]">
                    <div>
                      <span className="text-[#0D1211] font-semibold block">Domain / Group:</span>
                      <span>{selectedNode.group || 'Polar Science'}</span>
                    </div>
                    {selectedNode.meta?.doi && (
                      <div>
                        <span className="text-[#0D1211] font-semibold block">DOI:</span>
                        <span>https://doi.org/{selectedNode.meta.doi}</span>
                      </div>
                    )}
                  </div>

                  {selectedNode.slug && (
                    <Link
                      href={`/${selectedNode.type}s/${selectedNode.slug}`}
                      className="w-full py-2.5 bg-[#0D1211] text-[#F4F2EC] rounded text-center font-mono text-xs uppercase hover:bg-[#192220] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Open Full Resource Page</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#B7FF5A]" />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Network className="w-8 h-8 text-[#747A75] mx-auto opacity-50" />
                  <p className="font-mono text-xs text-[#747A75]">
                    Click any node on the graph to inspect metadata and navigate entity relationships.
                  </p>
                </div>
              )}

              {/* Relationship Taxonomy Guide */}
              <div className="pt-4 border-t border-[#0D1211]/10 space-y-2">
                <span className="text-[10px] font-mono text-[#747A75] uppercase block">Supported Relationship Types:</span>
                <div className="flex flex-wrap gap-1.5">
                  {RELATIONSHIPS.map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded bg-[#F4F2EC] text-[10px] font-mono text-[#0D1211] border border-[#0D1211]/10">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
