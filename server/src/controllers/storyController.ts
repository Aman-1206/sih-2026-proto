import { Request, Response } from 'express';
import { Story } from '../models/Story';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/errorHandler';

export async function getStories(req: Request, res: Response): Promise<void> {
  const { domain } = req.query;
  const query: any = {};
  if (domain) query.scienceDomains = domain;

  const stories = await Story.find(query).sort({ publishedAt: -1 });
  res.json({ stories, total: stories.length });
}

export async function getStoryBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const story = await Story.findOne({ slug });

  if (!story) {
    res.status(404).json({ error: 'Editorial story not found.' });
    return;
  }

  res.json({ story });
}

export async function createStory(req: AuthRequest, res: Response): Promise<void> {
  const story = await Story.create(req.body);
  await logAudit(req, 'CREATE_STORY', 'Story', story._id.toString());
  res.status(201).json({ story });
}
