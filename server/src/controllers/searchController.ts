import { Request, Response } from 'express';
import { Dataset } from '../models/Dataset';
import { Publication } from '../models/Publication';
import { Expedition } from '../models/Expedition';
import { MediaAsset } from '../models/MediaAsset';
import { Story } from '../models/Story';
import { Station } from '../models/Station';
import { Activity } from '../models/Activity';
import { SavedSearch } from '../models/AuditLog';
import { AuthRequest } from '../middleware/auth';
import { ISearchResultItem, ISearchResponse } from '@oruvia/shared';
import { embeddingProvider } from '../services/ai/embeddingProvider';

export async function searchAll(req: Request, res: Response): Promise<void> {
  const query = (req.query.q as string) || '';
  const typeFilter = req.query.type as string;
  const domainFilter = req.query.domain as string;
  const regionFilter = req.query.region as string;
  const yearFilter = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '12', 10);

  const results: ISearchResultItem[] = [];

  const textRegex = query ? new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;

  // 1. Search Datasets
  if (!typeFilter || typeFilter === 'dataset') {
    const q: any = {};
    if (textRegex) {
      q.$or = [{ title: textRegex }, { abstract: textRegex }, { keywords: textRegex }];
    }
    if (domainFilter) q.scienceDomains = domainFilter;
    if (regionFilter) q['spatialCoverage.regionName'] = new RegExp(regionFilter, 'i');

    const datasets = await Dataset.find(q).lean();
    for (const d of datasets) {
      results.push({
        id: d._id.toString(),
        type: 'dataset',
        title: d.title,
        slug: d.slug,
        abstractOrCaption: d.abstract,
        region: d.spatialCoverage?.regionName,
        scienceDomains: d.scienceDomains,
        doi: d.doi,
        creators: d.creators?.map((c) => c.name),
        date: d.temporalCoverage?.startDate,
        year: d.temporalCoverage?.startDate ? new Date(d.temporalCoverage.startDate).getFullYear() : undefined,
      });
    }
  }

  // 2. Search Publications
  if (!typeFilter || typeFilter === 'publication') {
    const q: any = {};
    if (textRegex) {
      q.$or = [{ title: textRegex }, { abstract: textRegex }, { keywords: textRegex }, { journal: textRegex }];
    }
    if (domainFilter) q.scienceDomains = domainFilter;
    if (yearFilter) q.year = yearFilter;

    const pubs = await Publication.find(q).lean();
    for (const p of pubs) {
      results.push({
        id: p._id.toString(),
        type: 'publication',
        title: p.title,
        slug: p.slug,
        abstractOrCaption: p.abstract,
        scienceDomains: p.scienceDomains,
        doi: p.doi,
        creators: p.authors?.map((a) => a.name),
        year: p.year,
        date: `${p.year}-01-01`,
      });
    }
  }

  // 3. Search Expeditions
  if (!typeFilter || typeFilter === 'expedition') {
    const q: any = {};
    if (textRegex) {
      q.$or = [{ name: textRegex }, { overview: textRegex }, { region: textRegex }];
    }
    if (domainFilter) q.researchThemes = domainFilter;
    if (regionFilter) q.region = new RegExp(regionFilter, 'i');

    const exps = await Expedition.find(q).lean();
    for (const e of exps) {
      results.push({
        id: e._id.toString(),
        type: 'expedition',
        title: `${e.number} ${e.name}`,
        slug: e.slug,
        abstractOrCaption: e.overview,
        region: e.region,
        scienceDomains: e.researchThemes,
        thumbnailUrl: e.coverImageUrl,
        date: e.dates?.startDate,
        year: e.dates?.startDate ? new Date(e.dates.startDate).getFullYear() : undefined,
      });
    }
  }

  // 4. Search Media
  if (!typeFilter || typeFilter === 'media') {
    const q: any = {};
    if (textRegex) {
      q.$or = [{ title: textRegex }, { caption: textRegex }, { description: textRegex }, { tags: textRegex }];
    }
    if (regionFilter) q.region = new RegExp(regionFilter, 'i');

    const media = await MediaAsset.find(q).lean();
    for (const m of media) {
      results.push({
        id: m._id.toString(),
        type: 'media',
        title: m.title,
        slug: m.slug || m._id.toString(),
        abstractOrCaption: m.caption,
        region: m.region,
        thumbnailUrl: m.thumbnailUrl || m.url,
        creators: [m.photographerOrCreator],
        date: m.dateCaptured,
        year: m.dateCaptured ? new Date(m.dateCaptured).getFullYear() : undefined,
      });
    }
  }

  // 5. Search Stories
  if (!typeFilter || typeFilter === 'story') {
    const q: any = {};
    if (textRegex) {
      q.$or = [{ title: textRegex }, { subtitle: textRegex }];
    }
    if (domainFilter) q.scienceDomains = domainFilter;

    const stories = await Story.find(q).lean();
    for (const s of stories) {
      results.push({
        id: s._id.toString(),
        type: 'story',
        title: s.title,
        slug: s.slug,
        abstractOrCaption: s.subtitle,
        scienceDomains: s.scienceDomains,
        thumbnailUrl: s.heroImageUrl,
        creators: [s.author.name],
        date: s.publishedAt,
        year: s.publishedAt ? new Date(s.publishedAt).getFullYear() : undefined,
      });
    }
  }

  // Facets computation
  const typeCounts: Record<string, number> = {};
  const domainCounts: Record<string, number> = {};
  const regionCounts: Record<string, number> = {};
  const yearCounts: Record<number, number> = {};

  for (const item of results) {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    if (item.region) regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
    if (item.year) yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
    if (item.scienceDomains) {
      for (const d of item.scienceDomains) {
        domainCounts[d] = (domainCounts[d] || 0) + 1;
      }
    }
  }

  const total = results.length;
  const startIndex = (page - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);

  const response: ISearchResponse = {
    items: paginatedItems,
    total,
    page,
    limit,
    facets: {
      resourceTypes: Object.entries(typeCounts).map(([key, count]) => ({ key: key as any, count })),
      scienceDomains: Object.entries(domainCounts).map(([key, count]) => ({ key: key as any, count })),
      regions: Object.entries(regionCounts).map(([key, count]) => ({ key, count })),
      years: Object.entries(yearCounts).map(([k, count]) => ({ key: parseInt(k, 10), count })),
    },
  };

  res.json(response);
}

export async function getSuggestions(req: Request, res: Response): Promise<void> {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    res.json({
      datasets: [],
      publications: [],
      expeditions: [],
      media: [],
      stations: [],
      stories: [],
    });
    return;
  }

  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  const [datasets, publications, expeditions, media, stations, stories] = await Promise.all([
    Dataset.find({ title: regex }).limit(3).select('title slug doi').lean(),
    Publication.find({ title: regex }).limit(3).select('title slug doi year').lean(),
    Expedition.find({ name: regex }).limit(3).select('name slug number region').lean(),
    MediaAsset.find({ title: regex }).limit(3).select('title url mediaType').lean(),
    Station.find({ name: regex }).limit(2).select('name slug code region').lean(),
    Story.find({ title: regex }).limit(2).select('title slug heroImageUrl').lean(),
  ]);

  res.json({
    datasets,
    publications,
    expeditions,
    media,
    stations,
    stories,
  });
}

export async function semanticSearch(req: Request, res: Response): Promise<void> {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query string is required for semantic search.' });
    return;
  }

  const queryVec = await embeddingProvider.getEmbedding(query);
  const [datasets, publications, expeditions] = await Promise.all([
    Dataset.find({}).limit(20).lean(),
    Publication.find({}).limit(20).lean(),
    Expedition.find({}).limit(10).lean(),
  ]);

  const scored: Array<ISearchResultItem & { similarityScore: number }> = [];

  for (const d of datasets) {
    const text = `${d.title} ${d.abstract} ${d.keywords?.join(' ')}`;
    const vec = await embeddingProvider.getEmbedding(text);
    const sim = embeddingProvider.computeCosineSimilarity(queryVec, vec);
    scored.push({
      id: d._id.toString(),
      type: 'dataset',
      title: d.title,
      slug: d.slug,
      abstractOrCaption: d.abstract,
      region: d.spatialCoverage?.regionName,
      scienceDomains: d.scienceDomains,
      doi: d.doi,
      similarityScore: sim,
    });
  }

  for (const p of publications) {
    const text = `${p.title} ${p.abstract} ${p.keywords?.join(' ')}`;
    const vec = await embeddingProvider.getEmbedding(text);
    const sim = embeddingProvider.computeCosineSimilarity(queryVec, vec);
    scored.push({
      id: p._id.toString(),
      type: 'publication',
      title: p.title,
      slug: p.slug,
      abstractOrCaption: p.abstract,
      scienceDomains: p.scienceDomains,
      doi: p.doi,
      year: p.year,
      similarityScore: sim,
    });
  }

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  res.json({ items: scored.slice(0, 12), total: scored.length });
}

export async function getSavedSearches(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const searches = await SavedSearch.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ searches });
}

export async function createSavedSearch(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const { query, filters, name } = req.body;
  const saved = await SavedSearch.create({
    userId: req.user.id,
    query,
    filters,
    name: name || query,
  });

  res.status(201).json({ saved });
}
