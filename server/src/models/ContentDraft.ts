import mongoose, { Schema, Document } from 'mongoose';
import { IContentDraft } from '@oruvia/shared';

export interface IContentDraftDocument extends Omit<IContentDraft, '_id'>, Document {}

const EvidenceSentenceSchema = new Schema(
  {
    sentenceId: { type: String, required: true },
    text: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['SUPPORTED', 'EDITOR_VERIFIED', 'EDITORIAL', 'UNVERIFIED'], 
      required: true,
      default: 'UNVERIFIED'
    },
    sourceCitation: {
      resourceId: { type: String },
      resourceType: { type: String },
      resourceTitle: { type: String },
      exactQuoteOrData: { type: String },
      chunkId: { type: String },
      pageNumber: { type: Number },
      confidenceScore: { type: Number, default: 0 },
    },
    editorNotes: { type: String },
    verifiedByUserId: { type: String },
    verifiedAt: { type: String },
  },
  { _id: false }
);

const ContentDraftSchema = new Schema<IContentDraftDocument>(
  {
    title: { type: String, required: true, index: true },
    platform: { 
      type: String, 
      enum: ['website_article', 'instagram', 'x', 'linkedin', 'facebook', 'youtube', 'newsletter', 'press_brief'],
      required: true,
      index: true
    },
    audience: { type: String, enum: ['Students', 'General public', 'Researchers', 'Media'], required: true },
    tone: { type: String, enum: ['Educational', 'Informative', 'Announcement', 'Storytelling'], required: true },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    targetLengthWords: { type: Number, default: 300 },
    sourceResourceIds: [{ type: String, required: true }],
    sourceResourcesPreview: [
      {
        id: { type: String },
        type: { type: String },
        title: { type: String },
        slug: { type: String },
      },
    ],
    content: { type: String, required: true },
    evidenceSentences: [EvidenceSentenceSchema],
    evidenceSummary: {
      totalSentences: { type: Number, default: 0 },
      supportedCount: { type: Number, default: 0 },
      editorVerifiedCount: { type: Number, default: 0 },
      editorialCount: { type: Number, default: 0 },
      unverifiedCount: { type: Number, default: 0 },
      isLockedForApproval: { type: Boolean, default: false },
    },
    status: { 
      type: String, 
      enum: ['DRAFT', 'AI_GENERATED', 'NEEDS_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true
    },
    campaignId: { type: String, index: true },
    campaignName: { type: String },
    scheduledPublishAt: { type: String },
    publishedUrl: { type: String },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    reviewerId: { type: String },
    reviewerName: { type: String },
    reviewComments: [
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        comment: { type: String, required: true },
        createdAt: { type: String, required: true },
        action: { type: String, enum: ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'] },
      },
    ],
  },
  { timestamps: true }
);

export const ContentDraft = mongoose.model<IContentDraftDocument>('ContentDraft', ContentDraftSchema);
