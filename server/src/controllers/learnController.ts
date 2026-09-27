import { Request, Response } from 'express';
import { LearnTopic } from '../models/LearnTopic';

export async function getLearnTopics(req: Request, res: Response): Promise<void> {
  const { category } = req.query;
  const query: any = {};
  if (category) query.category = category;

  const topics = await LearnTopic.find(query).sort({ readingTimeMin: 1 });
  res.json({ topics, total: topics.length });
}

export async function getLearnTopicBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const topic = await LearnTopic.findOne({ slug });

  if (!topic) {
    res.status(404).json({ error: 'Learning module not found.' });
    return;
  }

  res.json({ topic });
}
