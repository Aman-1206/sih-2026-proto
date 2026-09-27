import mongoose, { Schema, Document } from 'mongoose';
import { IPublication } from '@oruvia/shared';

export interface IPublicationDocument extends Omit<IPublication, '_id'>, Document {}

const PublicationSchema = new Schema<IPublicationDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    authors: [
      {
        name: { type: String, required: true },
        orcid: { type: String },
        affiliation: { type: String },
        personId: { type: String },
      },
    ],
    abstract: { type: String, required: true },
    year: { type: Number, required: true, index: true },
    journal: { type: String, required: true, index: true },
    volume: { type: String },
    issue: { type: String },
    pages: { type: String },
    doi: { type: String, required: true, unique: true, index: true },
    keywords: [{ type: String, index: true }],
    license: { type: String, default: 'CC-BY-4.0' },
    openAccess: { type: Boolean, default: true },
    relatedDatasetIds: [{ type: String }],
    relatedExpeditionIds: [{ type: String }],
    pdfUrl: { type: String },
    citationBibtex: { type: String },
    citationRis: { type: String },
    citationApa: { type: String },
    scienceDomains: [{ type: String, index: true }],
    isDemoRecord: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PublicationSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });

export const Publication = mongoose.model<IPublicationDocument>('Publication', PublicationSchema);
