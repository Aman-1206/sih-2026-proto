import mongoose, { Schema, Document } from 'mongoose';
import { IDataset } from '@oruvia/shared';

export interface IDatasetDocument extends Omit<IDataset, '_id'>, Document {}

const DatasetSchema = new Schema<IDatasetDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    abstract: { type: String, required: true },
    description: { type: String, required: true },
    creators: [
      {
        name: { type: String, required: true },
        orcid: { type: String },
        affiliation: { type: String },
        personId: { type: String },
      },
    ],
    contributors: [
      {
        name: { type: String },
        role: { type: String },
        affiliation: { type: String },
      },
    ],
    organizations: [{ type: String }],
    keywords: [{ type: String, index: true }],
    scienceDomains: [{ type: String, index: true }],
    spatialCoverage: {
      regionName: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      boundingBox: [{ type: Number }],
    },
    temporalCoverage: {
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
    },
    stationId: { type: String, index: true },
    stationName: { type: String },
    expeditionId: { type: String, index: true },
    expeditionName: { type: String },
    instrument: { type: String, required: true },
    variables: [
      {
        name: { type: String, required: true },
        unit: { type: String, required: true },
        description: { type: String },
        dataType: { type: String },
      },
    ],
    processingLevel: { type: String, enum: ['L0', 'L1', 'L2', 'L3', 'L4'], default: 'L2' },
    formats: [{ type: String }],
    fileSizeMb: { type: Number, default: 0 },
    version: { type: String, default: '1.0.0' },
    license: { type: String, default: 'CC-BY-4.0' },
    accessRights: { type: String, enum: ['OPEN', 'RESTRICTED', 'EMBARGOED'], default: 'OPEN' },
    doi: { type: String, required: true, unique: true, index: true },
    externalIdentifier: { type: String },
    citationText: { type: String, required: true },
    sampleDataPreview: [{ type: Schema.Types.Mixed }],
    downloadUrl: { type: String },
    source: { type: String, default: 'ORUVIA Scientific Repository' },
    provenance: { type: String, required: true },
    isDemoRecord: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DatasetSchema.index({ title: 'text', abstract: 'text', keywords: 'text', description: 'text' });
DatasetSchema.index({ 'spatialCoverage.latitude': 1, 'spatialCoverage.longitude': 1 });

export const Dataset = mongoose.model<IDatasetDocument>('Dataset', DatasetSchema);
