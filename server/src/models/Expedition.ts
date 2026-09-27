import mongoose, { Schema, Document } from 'mongoose';
import { IExpedition } from '@oruvia/shared';

export interface IExpeditionDocument extends Omit<IExpedition, '_id'>, Document {}

const ExpeditionSchema = new Schema<IExpeditionDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    number: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    status: { type: String, enum: ['COMPLETED', 'IN_PROGRESS', 'PLANNED'], default: 'COMPLETED', index: true },
    region: { type: String, required: true, index: true },
    dates: {
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
    },
    overview: { type: String, required: true },
    detailedReport: { type: String },
    routeCoordinates: [[{ type: Number }]], // [[lng, lat]]
    milestones: [
      {
        date: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        coordinates: [{ type: Number }],
      },
    ],
    researchThemes: [{ type: String, index: true }],
    leadScientist: {
      name: { type: String, required: true },
      affiliation: { type: String, required: true },
      personId: { type: String },
    },
    participantsCount: { type: Number, default: 0 },
    vesselOrTransport: { type: String },
    relatedDatasetIds: [{ type: String }],
    relatedPublicationIds: [{ type: String }],
    relatedMediaIds: [{ type: String }],
    coverImageUrl: { type: String, required: true },
    isDemoRecord: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ExpeditionSchema.index({ name: 'text', overview: 'text', region: 'text' });

export const Expedition = mongoose.model<IExpeditionDocument>('Expedition', ExpeditionSchema);
