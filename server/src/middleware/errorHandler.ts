import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuditLog } from '../models/AuditLog';
import { AuthRequest } from './auth';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[ORUVIA API Error]', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ error: 'Invalid resource ID format.' });
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

export async function logAudit(
  req: AuthRequest,
  event: string,
  entity: string,
  entityId: string,
  oldValue?: any,
  newValue?: any,
  aiMetadata?: any
) {
  try {
    const actorId = req.user?.id || 'ANONYMOUS';
    const actorName = req.user?.name || 'Anonymous Guest';
    const actorEmail = req.user?.email || 'anonymous@oruvia.public';
    const ipAddress = (req?.headers?.['x-forwarded-for'] as string) || req?.socket?.remoteAddress || '127.0.0.1';

    await AuditLog.create({
      actorId,
      actorName,
      actorEmail,
      event,
      entity,
      entityId,
      oldValue,
      newValue,
      ipAddress,
      aiMetadata,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record audit entry:', err);
  }
}
