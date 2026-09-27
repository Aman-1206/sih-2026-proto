import mongoose, { Schema, Document } from 'mongoose';
import { ICampaign } from '@oruvia/shared';

export interface ICampaignDocument extends Omit<ICampaign, '_id'>, Document {}

const CampaignSchema = new Schema<ICampaignDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, enum: ['PLANNING', 'ACTIVE', 'COMPLETED'], default: 'ACTIVE', index: true },
    targetPlatforms: [{ type: String }],
    associatedStoryId: { type: String },
    associatedStoryTitle: { type: String },
    associatedResourceIds: [{ type: String }],
    draftCount: { type: Number, default: 0 },
    publishedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model<ICampaignDocument>('Campaign', CampaignSchema);
