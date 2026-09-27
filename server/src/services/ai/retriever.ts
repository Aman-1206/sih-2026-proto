import { Dataset } from '../../models/Dataset';
import { Publication } from '../../models/Publication';
import { Expedition } from '../../models/Expedition';
import { Story } from '../../models/Story';
import { Station } from '../../models/Station';
import { embeddingProvider } from './embeddingProvider';
import { ResourceType } from '@oruvia/shared';

export interface IRetrievalSource {
  resourceId: string;
  resourceType: ResourceType;
  title: string;
  slug?: string;
  doi?: string;
  snippet: string;
  relevanceScore: number;
}

export class RAGRetriever {
  async retrieveContext(query: string, contextResourceIds?: string[]): Promise<IRetrievalSource[]> {
    const queryVec = await embeddingProvider.getEmbedding(query);
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const results: IRetrievalSource[] = [];

    // 1. If contextResourceIds provided, prioritize them
    // Otherwise search Datasets, Publications, Expeditions, Stories, Stations
    const [datasets, publications, expeditions, stories, stations] = await Promise.all([
      Dataset.find(contextResourceIds?.length ? { _id: { $in: contextResourceIds } } : {}).limit(10).lean(),
      Publication.find(contextResourceIds?.length ? { _id: { $in: contextResourceIds } } : {}).limit(10).lean(),
      Expedition.find(contextResourceIds?.length ? { _id: { $in: contextResourceIds } } : {}).limit(5).lean(),
      Story.find({}).limit(5).lean(),
      Station.find({}).limit(4).lean(),
    ]);

    for (const d of datasets) {
      const textToMatch = `${d.title} ${d.abstract} ${d.keywords?.join(' ')} ${d.provenance}`;
      const docVec = await embeddingProvider.getEmbedding(textToMatch);
      const sim = embeddingProvider.computeCosineSimilarity(queryVec, docVec);
      
      let tokenMatchBonus = 0;
      const lower = textToMatch.toLowerCase();
      for (const tok of queryTokens) {
        if (lower.includes(tok)) tokenMatchBonus += 0.15;
      }

      const score = Math.min(1.0, sim * 0.6 + tokenMatchBonus);
      if (score > 0.25 || (contextResourceIds && contextResourceIds.includes(d._id.toString()))) {
        results.push({
          resourceId: d._id.toString(),
          resourceType: 'dataset',
          title: d.title,
          slug: d.slug,
          doi: d.doi,
          snippet: d.abstract.substring(0, 240) + '...',
          relevanceScore: score,
        });
      }
    }

    for (const p of publications) {
      const fullTextStr = p.fullText ? `${p.fullText.introduction || ''} ${p.fullText.methodology || ''} ${p.fullText.results || ''} ${p.fullText.discussion || ''}` : '';
      const textToMatch = `${p.title} ${p.abstract} ${p.journal} ${p.keywords?.join(' ')} ${fullTextStr}`;
      const docVec = await embeddingProvider.getEmbedding(textToMatch);
      const sim = embeddingProvider.computeCosineSimilarity(queryVec, docVec);
      
      let tokenMatchBonus = 0;
      const lower = textToMatch.toLowerCase();
      for (const tok of queryTokens) {
        if (lower.includes(tok)) tokenMatchBonus += 0.15;
      }

      const score = Math.min(1.0, sim * 0.6 + tokenMatchBonus);
      if (score > 0.25 || (contextResourceIds && contextResourceIds.includes(p._id.toString()))) {
        let snippet = p.abstract;
        if (p.fullText?.results && lower.includes('result')) {
          snippet = `[Results Section] ${p.fullText.results.substring(0, 220)}...`;
        } else if (p.fullText?.methodology && lower.includes('method')) {
          snippet = `[Methodology Section] ${p.fullText.methodology.substring(0, 220)}...`;
        } else {
          snippet = p.abstract.substring(0, 240) + '...';
        }

        results.push({
          resourceId: p._id.toString(),
          resourceType: 'publication',
          title: p.title,
          slug: p.slug,
          doi: p.doi,
          snippet,
          relevanceScore: score,
        });
      }
    }

    for (const e of expeditions) {
      const textToMatch = `${e.name} ${e.overview} ${e.region}`;
      const docVec = await embeddingProvider.getEmbedding(textToMatch);
      const sim = embeddingProvider.computeCosineSimilarity(queryVec, docVec);
      const score = Math.min(1.0, sim * 0.6 + (textToMatch.toLowerCase().includes(queryTokens[0] || '') ? 0.2 : 0));
      if (score > 0.25 || (contextResourceIds && contextResourceIds.includes(e._id.toString()))) {
        results.push({
          resourceId: e._id.toString(),
          resourceType: 'expedition',
          title: `${e.number} ${e.name}`,
          slug: e.slug,
          snippet: e.overview.substring(0, 240) + '...',
          relevanceScore: score,
        });
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 8);
  }
}

export const retriever = new RAGRetriever();
