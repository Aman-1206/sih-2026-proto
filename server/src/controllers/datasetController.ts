import { Request, Response } from 'express';
import { Dataset } from '../models/Dataset';
import { generateBibtex, generateDatasetJsonLd } from '@oruvia/shared';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/errorHandler';

export async function getDatasets(req: Request, res: Response): Promise<void> {
  const { domain, region, access, search, page = '1', limit = '12' } = req.query;

  const query: any = {};
  if (domain) query.scienceDomains = domain;
  if (region) query['spatialCoverage.regionName'] = new RegExp(region as string, 'i');
  if (access) query.accessRights = access;
  if (search) {
    const reg = new RegExp((search as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: reg }, { abstract: reg }, { keywords: reg }, { instrument: reg }];
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const total = await Dataset.countDocuments(query);
  const datasets = await Dataset.find(query)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  res.json({
    datasets,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
}

export async function getDatasetBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const dataset = await Dataset.findOne({ slug });

  if (!dataset) {
    res.status(404).json({ error: 'Dataset not found.' });
    return;
  }

  const jsonLd = generateDatasetJsonLd(dataset);
  const bibtex = generateBibtex(dataset, 'misc');

  res.json({
    dataset,
    jsonLd,
    citations: {
      plainText: dataset.citationText,
      bibtex,
      ris: `TY  - DATA\nTI  - ${dataset.title}\nAU  - ${dataset.creators?.[0]?.name || 'ORUVIA'}\nPY  - 2025\nDO  - ${dataset.doi}\nUR  - https://oruvia.science/datasets/${dataset.slug}\nER  - `,
      json: JSON.stringify(dataset, null, 2),
    },
  });
}

export async function downloadDatasetData(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const dataset = await Dataset.findById(id);

  if (!dataset) {
    res.status(404).json({ error: 'Dataset not found.' });
    return;
  }

  // Generate sample CSV from sample data preview or variables
  let csvContent = 'Timestamp,Latitude,Longitude,';
  const varNames = dataset.variables.map((v) => `${v.name} (${v.unit})`);
  csvContent += varNames.join(',') + '\n';

  if (dataset.sampleDataPreview && dataset.sampleDataPreview.length > 0) {
    for (const row of dataset.sampleDataPreview) {
      const vals = Object.values(row).join(',');
      csvContent += `${vals}\n`;
    }
  } else {
    // Generate sample time series rows
    const baseLat = dataset.spatialCoverage?.latitude || -69.4;
    const baseLng = dataset.spatialCoverage?.longitude || 76.2;
    for (let i = 0; i < 20; i++) {
      const date = new Date(Date.now() - (20 - i) * 3600 * 1000).toISOString();
      const vals = dataset.variables.map((_, idx) => (Math.sin(i + idx) * 12 + 10).toFixed(2));
      csvContent += `${date},${baseLat},${baseLng},${vals.join(',')}\n`;
    }
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${dataset.slug}_telemetry.csv"`);
  res.send(csvContent);
}

export async function createDataset(req: AuthRequest, res: Response): Promise<void> {
  const data = req.body;
  const created = await Dataset.create(data);

  await logAudit(req, 'CREATE_DATASET', 'Dataset', created._id.toString(), null, created.toObject());
  res.status(201).json({ dataset: created });
}
