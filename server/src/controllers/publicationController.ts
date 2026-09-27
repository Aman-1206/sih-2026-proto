import { Request, Response } from 'express';
import { Publication } from '../models/Publication';
import { Dataset } from '../models/Dataset';
import { Expedition } from '../models/Expedition';
import { generateBibtex } from '@oruvia/shared';

export async function getPublications(req: Request, res: Response): Promise<void> {
  const { domain, year, search, page = '1', limit = '12' } = req.query;

  const query: any = {};
  if (domain) query.scienceDomains = domain;
  if (year) query.year = parseInt(year as string, 10);
  if (search) {
    const reg = new RegExp((search as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: reg }, { abstract: reg }, { journal: reg }, { keywords: reg }];
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const total = await Publication.countDocuments(query);
  const publications = await Publication.find(query)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ year: -1, createdAt: -1 });

  res.json({
    publications,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
}

export async function getPublicationBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const publication = await Publication.findOne({ slug });

  if (!publication) {
    res.status(404).json({ error: 'Publication not found.' });
    return;
  }

  const [datasets, expeditions] = await Promise.all([
    Dataset.find({ _id: { $in: publication.relatedDatasetIds } }).lean(),
    Expedition.find({ _id: { $in: publication.relatedExpeditionIds } }).lean(),
  ]);

  const bibtex = publication.citationBibtex || generateBibtex(publication, 'article');

  res.json({
    publication,
    datasets,
    expeditions,
    bibtex,
  });
}
