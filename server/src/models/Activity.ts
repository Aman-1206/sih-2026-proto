import mongoose, { Schema, Document } from 'mongoose';
import { IActivity } from '@oruvia/shared';

export interface IActivityDocument extends Omit<IActivity, '_id'>, Document {}

const ActivitySchema = new Schema<IActivityDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    category: { 
      type: String, 
      enum: ['OUTREACH', 'WORKSHOP', 'FIELD_CAMPAIGN', 'INSTITUTIONAL', 'SYMPOSIUM', 'TRAINING'], 
      required: true,
      index: true 
    },
    date: { type: String, required: true },
    locationName: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    leadCoordinator: { type: String, required: true },
    collaboratingOrganizations: [{ type: String }],
    targetAudience: { type: String, required: true },
    outcomes: [{ type: String }],
    coverImageUrl: { type: String },
    mediaIds: [{ type: String }],
    relatedDatasetIds: [{ type: String }],
    relatedExpeditionIds: [{ type: String }],
    isDemoRecord: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ActivitySchema.index({ title: 'text', summary: 'text', description: 'text' });

export const Activity = mongoose.model<IActivityDocument>('Activity', ActivitySchema);
