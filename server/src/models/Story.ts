import mongoose, { Schema, Document } from 'mongoose';
import { IStory } from '@oruvia/shared';

export interface IStoryDocument extends Omit<IStory, '_id'>, Document {}

const StoryVariantSchema = new Schema(
  {
    readingLevel: { type: String, enum: ['quick', 'student', 'general', 'research'], required: true },
    contentHtml: { type: String, required: true },
    summary: { type: String, required: true },
    estimatedReadTimeMin: { type: Number, required: true },
  },
  { _id: false }
);

const StorySchema = new Schema<IStoryDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    subtitle: { type: String, required: true },
    heroImageUrl: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      role: { type: String, required: true },
      avatarUrl: { type: String },
    },
    publishedAt: { type: String, required: true },
    scienceDomains: [{ type: String, index: true }],
    readingLevels: {
      quick: { type: StoryVariantSchema, required: true },
      student: { type: StoryVariantSchema, required: true },
      general: { type: StoryVariantSchema, required: true },
      research: { type: StoryVariantSchema, required: true },
    },
    embeddedDatasets: [
      {
        datasetId: { type: String },
        title: { type: String },
        doi: { type: String },
      },
    ],
    embeddedExpeditions: [
      {
        expeditionId: { type: String },
        name: { type: String },
      },
    ],
    embeddedCharts: [
      {
        chartType: { type: String },
        title: { type: String },
        metric: { type: String },
      },
    ],
    quotes: [
      {
        quote: { type: String },
        speaker: { type: String },
        role: { type: String },
      },
    ],
    isDemoRecord: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StorySchema.index({ title: 'text', subtitle: 'text' });

export const Story = mongoose.model<IStoryDocument>('Story', StorySchema);
