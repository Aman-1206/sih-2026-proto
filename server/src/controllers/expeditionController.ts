import { Request, Response } from 'express';
import { Expedition } from '../models/Expedition';
import { Dataset } from '../models/Dataset';
import { Publication } from '../models/Publication';
import { MediaAsset } from '../models/MediaAsset';

export async function getExpeditions(req: Request, res: Response): Promise<void> {
  const { region, theme, status } = req.query;

  const query: any = {};
  if (region) query.region = new RegExp(region as string, 'i');
  if (theme) query.researchThemes = theme;
  if (status) query.status = status;

  const expeditions = await Expedition.find(query).sort({ 'dates.startDate': -1 });
  res.json({ expeditions, total: expeditions.length });
}

export async function getExpeditionBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const expedition = await Expedition.findOne({ slug });

  if (!expedition) {
    res.status(404).json({ error: 'Expedition not found.' });
    return;
  }

  // Fetch connected resources
  const [datasets, publications, media] = await Promise.all([
    Dataset.find({ $or: [{ expeditionId: expedition._id.toString() }, { _id: { $in: expedition.relatedDatasetIds } }] }).lean(),
    Publication.find({ _id: { $in: expedition.relatedPublicationIds } }).lean(),
    MediaAsset.find({ $or: [{ expeditionId: expedition._id.toString() }, { _id: { $in: expedition.relatedMediaIds } }] }).lean(),
  ]);

  res.json({
    expedition,
    datasets,
    publications,
    media,
  });
}
