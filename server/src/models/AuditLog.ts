import mongoose, { Schema, Document } from 'mongoose';
import { IAuditLog } from '@oruvia/shared';

export interface IAuditLogDocument extends Omit<IAuditLog, '_id'>, Document {}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    actorId: { type: String, required: true, index: true },
    actorName: { type: String, required: true },
    actorEmail: { type: String, required: true },
    event: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ipAddress: { type: String, default: '127.0.0.1' },
    aiMetadata: {
      modelUsed: { type: String },
      provider: { type: String },
      sourcesReferenced: [{ type: String }],
      tokensUsed: { type: Number },
    },
    timestamp: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);

export interface INotificationDocument extends Document {
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'APPROVAL' | 'SUCCESS' | 'WARNING';
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['INFO', 'APPROVAL', 'SUCCESS', 'WARNING'], default: 'INFO' },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotificationDocument>('Notification', NotificationSchema);

export interface ISavedSearchDocument extends Document {
  userId: string;
  query: string;
  filters: Record<string, any>;
  name?: string;
  createdAt: Date;
}

const SavedSearchSchema = new Schema<ISavedSearchDocument>(
  {
    userId: { type: String, required: true, index: true },
    query: { type: String, required: true },
    filters: { type: Schema.Types.Mixed, default: {} },
    name: { type: String },
  },
  { timestamps: true }
);

export const SavedSearch = mongoose.model<ISavedSearchDocument>('SavedSearch', SavedSearchSchema);
