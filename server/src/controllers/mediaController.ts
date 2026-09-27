import { Request, Response } from 'express';
import { MediaAsset } from '../models/MediaAsset';
import { getStorageProvider } from '../services/storage/storageProvider';
import { aiProvider } from '../services/ai/aiProvider';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/errorHandler';

export async function getMedia(req: Request, res: Response): Promise<void> {
  const { type, region, tag, page = '1', limit = '24' } = req.query;

  const query: any = {};
  if (type) query.mediaType = type;
  if (region) query.region = new RegExp(region as string, 'i');
  if (tag) query.tags = tag;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const total = await MediaAsset.countDocuments(query);
  const media = await MediaAsset.find(query)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ dateCaptured: -1 });

  res.json({
    media,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
}

export async function getMediaById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const asset = await MediaAsset.findById(id);

  if (!asset) {
    res.status(404).json({ error: 'Media record not found.' });
    return;
  }

  res.json({ asset });
}

export async function uploadMedia(req: AuthRequest, res: Response): Promise<void> {
  const storage = getStorageProvider();
  const file = (req as any).file;

  if (!file) {
    res.status(400).json({ error: 'No media file provided.' });
    return;
  }

  const fileUrl = await storage.uploadFile(file.buffer, file.originalname, file.mimetype);
  const aiTags = await aiProvider.suggestTags(req.body.title || file.originalname);

  const asset = await MediaAsset.create({
    title: req.body.title || file.originalname,
    mediaType: req.body.mediaType || (file.mimetype.startsWith('video') ? 'VIDEO' : 'PHOTO'),
    url: fileUrl,
    caption: req.body.caption || 'Scientific archival media asset.',
    description: req.body.description || 'Captured during field science operations.',
    photographerOrCreator: req.body.photographer || req.user?.name || 'ORUVIA Scientific Team',
    dateCaptured: req.body.dateCaptured || new Date().toISOString().split('T')[0],
    region: req.body.region || 'Antarctic Peninsula',
    tags: req.body.tags ? req.body.tags.split(',') : ['Scientific Observation'],
    aiSuggestedTags: aiTags,
    isDemoRecord: false,
  });

  await logAudit(req, 'UPLOAD_MEDIA', 'MediaAsset', asset._id.toString());
  res.status(201).json({ asset });
}
