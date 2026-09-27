import mongoose, { Schema, Document } from 'mongoose';
import { IMediaAsset } from '@oruvia/shared';

export interface IMediaAssetDocument extends Omit<IMediaAsset, '_id'>, Document {}

const MediaAssetSchema = new Schema<IMediaAssetDocument>(
  {
    slug: { type: String, index: true },
    title: { type: String, required: true, index: true },
    mediaType: { 
      type: String, 
      enum: ['PHOTO', 'VIDEO', 'AUDIO', 'ILLUSTRATION', 'INFOGRAPHIC'], 
      required: true,
      index: true 
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    caption: { type: String, required: true },
    description: { type: String, required: true },
    photographerOrCreator: { type: String, required: true },
    copyright: { type: String, default: 'ORUVIA Scientific Consortium' },
    license: { type: String, default: 'CC-BY-4.0' },
    dateCaptured: { type: String, required: true },
    region: { type: String, required: true, index: true },
    stationId: { type: String, index: true },
    stationName: { type: String },
    expeditionId: { type: String, index: true },
    expeditionName: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    tags: [{ type: String, index: true }],
    aiSuggestedTags: [{ type: String }],
    peopleMentioned: [{ type: String }],
    subjects: [{ type: String }],
    relatedResourceIds: [{ type: String }],
    aspectRatio: { type: String, default: '16:9' },
    isDemoRecord: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MediaAssetSchema.index({ title: 'text', caption: 'text', description: 'text', tags: 'text' });

export const MediaAsset = mongoose.model<IMediaAssetDocument>('MediaAsset', MediaAssetSchema);
