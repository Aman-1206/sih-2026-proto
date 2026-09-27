import { Request, Response } from 'express';
import { Activity } from '../models/Activity';

export async function getActivities(req: Request, res: Response): Promise<void> {
  const { category, search } = req.query;

  const query: any = {};
  if (category) query.category = category;
  if (search) {
    const reg = new RegExp((search as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: reg }, { summary: reg }, { description: reg }, { locationName: reg }];
  }

  const activities = await Activity.find(query).sort({ date: -1 });
  res.json({ activities, total: activities.length });
}

export async function getActivityBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const activity = await Activity.findOne({ slug });

  if (!activity) {
    res.status(404).json({ error: 'Activity not found.' });
    return;
  }

  res.json({ activity });
}
