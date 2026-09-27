import { Request, Response } from 'express';
import { Dataset } from '../models/Dataset';
import { Publication } from '../models/Publication';
import { Expedition } from '../models/Expedition';
import { Station } from '../models/Station';
import { MediaAsset } from '../models/MediaAsset';
import { IKnowledgeGraphNode, IKnowledgeGraphLink } from '@oruvia/shared';

export async function getKnowledgeGraph(req: Request, res: Response): Promise<void> {
  const { resourceId } = req.query;

  const [datasets, publications, expeditions, stations, media] = await Promise.all([
    Dataset.find({}).limit(15).lean(),
    Publication.find({}).limit(18).lean(),
    Expedition.find({}).limit(8).lean(),
    Station.find({}).limit(4).lean(),
    MediaAsset.find({}).limit(12).lean(),
  ]);

  const nodes: IKnowledgeGraphNode[] = [];
  const links: IKnowledgeGraphLink[] = [];
  const nodeMap = new Set<string>();

  function addNode(node: IKnowledgeGraphNode) {
    if (!nodeMap.has(node.id)) {
      nodeMap.add(node.id);
      nodes.push(node);
    }
  }

  // 1. Stations
  for (const s of stations) {
    addNode({
      id: s._id.toString(),
      name: s.name,
      type: 'station',
      slug: s.slug,
      group: 'station',
      size: 24,
      meta: { region: s.region, code: s.code },
    });
  }

  // 2. Expeditions
  for (const e of expeditions) {
    const expId = e._id.toString();
    addNode({
      id: expId,
      name: `${e.number} ${e.name}`,
      type: 'expedition',
      slug: e.slug,
      group: 'expedition',
      size: 28,
      meta: { region: e.region, status: e.status },
    });

    if (e.leadScientist?.name) {
      const scientistId = `person_${e.leadScientist.name.replace(/\s+/g, '_')}`;
      addNode({
        id: scientistId,
        name: e.leadScientist.name,
        type: 'person',
        group: 'person',
        size: 16,
        meta: { affiliation: e.leadScientist.affiliation },
      });
      links.push({
        source: scientistId,
        target: expId,
        relation: 'AFFILIATED_WITH',
        label: 'leads expedition',
      });
    }
  }

  // 3. Datasets
  for (const d of datasets) {
    const dId = d._id.toString();
    addNode({
      id: dId,
      name: d.title,
      type: 'dataset',
      slug: d.slug,
      group: 'dataset',
      size: 20,
      meta: { doi: d.doi, domains: d.scienceDomains },
    });

    if (d.expeditionId && nodeMap.has(d.expeditionId)) {
      links.push({
        source: dId,
        target: d.expeditionId,
        relation: 'COLLECTED_DURING',
        label: 'collected during',
      });
    }

    if (d.stationId && nodeMap.has(d.stationId)) {
      links.push({
        source: dId,
        target: d.stationId,
        relation: 'COLLECTED_AT',
        label: 'recorded at station',
      });
    }

    if (d.creators && d.creators.length > 0) {
      const c = d.creators[0];
      const personId = `person_${c.name.replace(/\s+/g, '_')}`;
      addNode({
        id: personId,
        name: c.name,
        type: 'person',
        group: 'person',
        size: 16,
        meta: { affiliation: c.affiliation },
      });
      links.push({
        source: personId,
        target: dId,
        relation: 'AUTHORED_BY',
        label: 'creator of',
      });
    }
  }

  // 4. Publications
  for (const p of publications) {
    const pId = p._id.toString();
    addNode({
      id: pId,
      name: p.title,
      type: 'publication',
      slug: p.slug,
      group: 'publication',
      size: 22,
      meta: { doi: p.doi, journal: p.journal, year: p.year },
    });

    for (const dId of p.relatedDatasetIds || []) {
      if (nodeMap.has(dId)) {
        links.push({
          source: pId,
          target: dId,
          relation: 'DERIVED_FROM',
          label: 'derived from dataset',
        });
      }
    }

    for (const expId of p.relatedExpeditionIds || []) {
      if (nodeMap.has(expId)) {
        links.push({
          source: pId,
          target: expId,
          relation: 'ASSOCIATED_WITH',
          label: 'expedition study',
        });
      }
    }
  }

  // 5. Media
  for (const m of media) {
    const mId = m._id.toString();
    addNode({
      id: mId,
      name: m.title,
      type: 'media',
      group: 'media',
      size: 14,
      meta: { type: m.mediaType, url: m.url },
    });

    if (m.expeditionId && nodeMap.has(m.expeditionId)) {
      links.push({
        source: mId,
        target: m.expeditionId,
        relation: 'DOCUMENTED_BY',
        label: 'photo record of',
      });
    }
  }

  // If filtered to a specific resource, filter connected subgraph
  if (resourceId) {
    const connectedNodeIds = new Set<string>([resourceId as string]);
    const filteredLinks = links.filter((l) => {
      if (l.source === resourceId || l.target === resourceId) {
        connectedNodeIds.add(l.source);
        connectedNodeIds.add(l.target);
        return true;
      }
      return false;
    });
    const filteredNodes = nodes.filter((n) => connectedNodeIds.has(n.id));
    res.json({ nodes: filteredNodes, links: filteredLinks });
    return;
  }

  res.json({ nodes, links });
}
