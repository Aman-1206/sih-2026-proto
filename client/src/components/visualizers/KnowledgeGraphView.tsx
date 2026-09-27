import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { IKnowledgeGraphData, IKnowledgeGraphNode, IKnowledgeGraphLink, ResourceType } from '@oruvia/shared';
import { Database, FileText, MapPin, Radio, Image as ImageIcon, User, Maximize2, RotateCcw, Info } from 'lucide-react';
import { Link } from 'wouter';

interface KnowledgeGraphViewProps {
  data: IKnowledgeGraphData;
  height?: number;
  initialSelectedId?: string;
}

const TYPE_COLORS: Record<string, string> = {
  station: '#B7FF5A',
  expedition: '#E5A93C',
  dataset: '#3D7BFF',
  publication: '#9C27B0',
  media: '#00BCD4',
  person: '#FF7043',
  organization: '#78909C',
};

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  data,
  height = 550,
  initialSelectedId,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<IKnowledgeGraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = svgRef.current.clientWidth || 800;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create container for zoom behavior
    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Filter nodes if active filter
    const activeNodes = filterType === 'ALL'
      ? data.nodes
      : data.nodes.filter((n) => n.type === filterType || n.type === 'station');
    const nodeIds = new Set(activeNodes.map((n) => n.id));
    const activeLinks = data.links.filter(
      (l) => nodeIds.has(typeof l.source === 'object' ? (l.source as any).id : l.source) &&
             nodeIds.has(typeof l.target === 'object' ? (l.target as any).id : l.target)
    );

    // Deep clone data so d3 simulation doesn't mutate original props directly
    const nodes = activeNodes.map((d) => ({ ...d }));
    const links = activeLinks.map((d) => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-240))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => (d.size || 20) + 12));

    // Links lines
    const link = g.append('g')
      .attr('stroke', '#747A75')
      .attr('stroke-opacity', 0.4)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1.5);

    // Nodes group
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(
        d3.drag<any, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (_event, d: any) => {
        setSelectedNode(d);
      });

    // Node circles
    node.append('circle')
      .attr('r', (d: any) => d.size ? d.size / 2 : 10)
      .attr('fill', (d: any) => TYPE_COLORS[d.type] || '#747A75')
      .attr('stroke', '#0D1211')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer');

    // Node labels
    node.append('text')
      .text((d: any) => d.name.length > 20 ? d.name.substring(0, 18) + '...' : d.name)
      .attr('x', (d: any) => (d.size ? d.size / 2 : 10) + 4)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('font-family', '"Plus Jakarta Sans", sans-serif')
      .attr('font-weight', 500)
      .attr('fill', '#0D1211')
      .attr('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    if (initialSelectedId) {
      const match = nodes.find((n) => n.id === initialSelectedId);
      if (match) setSelectedNode(match);
    }

    return () => {
      simulation.stop();
    };
  }, [data, height, filterType]);

  return (
    <div className="relative border border-[#0D1211]/15 rounded-xl bg-[#FAF9F5] overflow-hidden">
      {/* Top Controls Bar */}
      <div className="p-3 bg-[#F4F2EC] border-b border-[#0D1211]/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#747A75] uppercase text-[10px]">Filter Entity:</span>
          {['ALL', 'dataset', 'publication', 'expedition', 'station', 'person'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors ${
                filterType === t ? 'bg-[#0D1211] text-[#F4F2EC]' : 'bg-[#EBE8DF] text-[#0D1211] hover:bg-[#D8D4C8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[#747A75] text-[11px]">
          <span>Drag nodes to explore · Scroll to zoom</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Selected Node Side Inspector */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-72 bg-[#FAF9F5]/95 backdrop-blur-md border border-[#0D1211]/20 rounded-lg p-4 shadow-xl z-20 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono uppercase text-[#0D1211] inline-block font-semibold"
                  style={{ backgroundColor: TYPE_COLORS[selectedNode.type] || '#EBE8DF' }}
                >
                  {selectedNode.type}
                </span>
                <h4 className="font-serif text-base font-semibold text-[#0D1211] mt-1 line-clamp-2">
                  {selectedNode.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#747A75] hover:text-[#0D1211] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {selectedNode.meta && (
              <div className="text-xs space-y-1 text-[#747A75] font-mono border-t border-[#0D1211]/10 pt-2">
                {selectedNode.meta.region && <p>Region: <span className="text-[#0D1211]">{selectedNode.meta.region}</span></p>}
                {selectedNode.meta.doi && <p className="truncate">DOI: <span className="text-[#0D1211]">{selectedNode.meta.doi}</span></p>}
                {selectedNode.meta.journal && <p>Journal: <span className="text-[#0D1211]">{selectedNode.meta.journal}</span></p>}
                {selectedNode.meta.affiliation && <p>Affiliation: <span className="text-[#0D1211]">{selectedNode.meta.affiliation}</span></p>}
              </div>
            )}

            {selectedNode.slug && (
              <div className="pt-2 border-t border-[#0D1211]/10">
                <Link
                  href={`/${selectedNode.type}s/${selectedNode.slug}`}
                  className="w-full inline-flex items-center justify-center py-1.5 px-3 bg-[#0D1211] text-[#F4F2EC] rounded text-xs font-mono uppercase hover:bg-[#192220] transition-colors"
                >
                  Open {selectedNode.type} Detail →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
