import { Request, Response } from 'express';
import { Station } from '../models/Station';
import { Dataset } from '../models/Dataset';
import { MediaAsset } from '../models/MediaAsset';

export async function getStations(_req: Request, res: Response): Promise<void> {
  const stations = await Station.find({}).sort({ establishedYear: 1 });
  res.json({ stations, total: stations.length });
}

export async function getStationBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const station = await Station.findOne({ slug });

  if (!station) {
    res.status(404).json({ error: 'Station not found.' });
    return;
  }

  const [datasets, media] = await Promise.all([
    Dataset.find({ $or: [{ stationId: station._id.toString() }, { stationName: station.name }] }).lean(),
    MediaAsset.find({ $or: [{ stationId: station._id.toString() }, { stationName: station.name }] }).lean(),
  ]);

  res.json({
    station,
    datasets,
    media,
  });
}

export async function getStationWeather(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const station = await Station.findOne({ slug });

  if (!station) {
    res.status(404).json({ error: 'Station not found.' });
    return;
  }

  // Return real sensor or gracefully marked DEMO telemetry
  res.json({
    isDemoData: station.isDemoData,
    current: station.currentObservations || {
      temperatureC: -14.2,
      windSpeedKts: 18.5,
      windDirectionDeg: 120,
      pressureHpa: 986.4,
      humidityPercent: 68,
      solarRadiationWm2: 210,
      timestamp: new Date().toISOString(),
      dataSource: 'DEMO_SEED',
    },
    historical: station.historicalObservations || [],
  });
}
