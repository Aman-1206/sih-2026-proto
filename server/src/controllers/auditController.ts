import { Request, Response } from 'express';
import { AuditLog, Notification } from '../models/AuditLog';
import { AuthRequest } from '../middleware/auth';

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  const { entity, event, page = '1', limit = '25' } = req.query;

  const query: any = {};
  if (entity) query.entity = entity;
  if (event) query.event = event;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .sort({ timestamp: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({ logs, total, page: pageNum, limit: limitNum });
}

export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id || 'demo_user';
  const notifications = await Notification.find({
    $or: [{ userId }, { userId: 'reviewer_broadcast' }],
  }).sort({ createdAt: -1 }).limit(20);

  res.json({ notifications });
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await Notification.findByIdAndUpdate(id, { isRead: true });
  res.json({ success: true });
}
