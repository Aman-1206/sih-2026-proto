import { Request, Response } from 'express';
import { Station } from '../models/Station';
import { Expedition } from '../models/Expedition';
import { Dataset } from '../models/Dataset';
import { MediaAsset } from '../models/MediaAsset';

export async function getAtlasLayers(_req: Request, res: Response): Promise<void> {
  const [stations, expeditions, datasets, media] = await Promise.all([
    Station.find({}).lean(),
    Expedition.find({}).lean(),
    Dataset.find({}).lean(),
    MediaAsset.find({ coordinates: { $exists: true } }).lean(),
  ]);

  // Stations GeoJSON
  const stationFeatures = stations.map((s) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [s.coordinates.longitude, s.coordinates.latitude],
    },
    properties: {
      id: s._id.toString(),
      type: 'station',
      slug: s.slug,
      name: s.name,
      code: s.code,
      region: s.region,
      status: s.operationalStatus,
      isLive: s.isLive,
      temperatureC: s.currentObservations?.temperatureC,
      windSpeedKts: s.currentObservations?.windSpeedKts,
    },
  }));

  // Expeditions GeoJSON (Routes as LineString, Milestones as Points)
  const expeditionRouteFeatures = expeditions
    .filter((e) => e.routeCoordinates && e.routeCoordinates.length > 1)
    .map((e) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: e.routeCoordinates,
      },
      properties: {
        id: e._id.toString(),
        type: 'expedition_route',
        slug: e.slug,
        number: e.number,
        name: e.name,
        region: e.region,
      },
    }));

  const expeditionMilestoneFeatures = expeditions.flatMap((e) =>
    (e.milestones || [])
      .filter((m) => m.coordinates && m.coordinates.length === 2)
      .map((m) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: m.coordinates,
        },
        properties: {
          id: `${e._id.toString()}_${m.title}`,
          expeditionId: e._id.toString(),
          type: 'milestone',
          slug: e.slug,
          expeditionName: e.name,
          title: m.title,
          description: m.description,
          date: m.date,
        },
      }))
  );

  // Datasets GeoJSON
  const datasetFeatures = datasets
    .filter((d) => d.spatialCoverage?.latitude && d.spatialCoverage?.longitude)
    .map((d) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [d.spatialCoverage.longitude, d.spatialCoverage.latitude],
      },
      properties: {
        id: d._id.toString(),
        type: 'dataset',
        slug: d.slug,
        title: d.title,
        domains: d.scienceDomains,
        region: d.spatialCoverage.regionName,
        doi: d.doi,
      },
    }));

  // Media GeoJSON
  const mediaFeatures = media
    .filter((m) => m.coordinates?.latitude && m.coordinates?.longitude)
    .map((m) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [m.coordinates!.longitude, m.coordinates!.latitude],
      },
      properties: {
        id: m._id.toString(),
        type: 'media',
        title: m.title,
        mediaType: m.mediaType,
        thumbnailUrl: m.thumbnailUrl || m.url,
        caption: m.caption,
      },
    }));

  res.json({
    stations: { type: 'FeatureCollection', features: stationFeatures },
    expeditionRoutes: { type: 'FeatureCollection', features: expeditionRouteFeatures },
    expeditionMilestones: { type: 'FeatureCollection', features: expeditionMilestoneFeatures },
    datasets: { type: 'FeatureCollection', features: datasetFeatures },
    media: { type: 'FeatureCollection', features: mediaFeatures },
  });
}
