import mongoose, { Schema, Document } from 'mongoose';
import { IStation } from '@oruvia/shared';

export interface IStationDocument extends Omit<IStation, '_id'>, Document {}

const StationSchema = new Schema<IStationDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    establishedYear: { type: Number, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      elevationMeters: { type: Number, default: 0 },
    },
    description: { type: String, required: true },
    operationalStatus: { 
      type: String, 
      enum: ['ACTIVE', 'SEASONAL', 'DECOMMISSIONED'], 
      default: 'ACTIVE',
      index: true 
    },
    isLive: { type: Boolean, default: true },
    isDemoData: { type: Boolean, default: true },
    researchThemes: [{ type: String }],
    currentObservations: {
      temperatureC: { type: Number },
      windSpeedKts: { type: Number },
      windDirectionDeg: { type: Number },
      pressureHpa: { type: Number },
      humidityPercent: { type: Number },
      solarRadiationWm2: { type: Number },
      timestamp: { type: String },
      dataSource: { type: String, enum: ['LIVE_SENSOR', 'DEMO_SEED'], default: 'DEMO_SEED' },
    },
    historicalObservations: [
      {
        date: { type: String },
        temperatureC: { type: Number },
        windSpeedKts: { type: Number },
        pressureHpa: { type: Number },
        humidityPercent: { type: Number },
      },
    ],
    photos: [{ type: String }],
    affiliatedOrganizationIds: [{ type: String }],
  },
  { timestamps: true }
);

StationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

export const Station = mongoose.model<IStationDocument>('Station', StationSchema);
