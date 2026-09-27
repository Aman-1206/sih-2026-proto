import { ScienceDomain, SocialPlatform, ReadingLevel, UserRole } from './types';

export const BRAND = {
  NAME: 'ORUVIA',
  TAGLINE: 'Knowledge, alive.',
  DESCRIPTION: 'Unified scientific knowledge system bridging expeditions, datasets, research publications and living planet observations.',
  BASE_BG: '#F4F2EC',
  DARK_BG: '#0D1211',
  MUTED_TEXT: '#747A75',
  PRIMARY_ACCENT: '#B7FF5A',
  SCIENTIFIC_BLUE: '#3D7BFF',
} as const;

export const SCIENCE_DOMAINS: ScienceDomain[] = [
  'Atmosphere',
  'Cryosphere',
  'Oceans',
  'Paleoclimate',
  'Biosphere',
  'Solid Earth',
  'Glaciology',
  'Climate',
  'Marine Biology',
  'Geophysics'
];

export const REGIONS = [
  'Antarctic Peninsula',
  'East Antarctica (Larsemann Hills)',
  'Central Dronning Maud Land',
  'Southern Ocean',
  'Arctic Ocean',
  'Svalbard Archipelago',
  'Himalayas & Karakoram',
  'Indian Ocean Sector'
];

export const SOCIAL_PLATFORMS_META: Record<SocialPlatform, { label: string; icon: string; maxLength: number }> = {
  website_article: { label: 'Website Article', icon: 'FileText', maxLength: 2500 },
  instagram: { label: 'Instagram Caption', icon: 'Instagram', maxLength: 2200 },
  x: { label: 'X (Twitter) Thread', icon: 'Twitter', maxLength: 280 },
  linkedin: { label: 'LinkedIn Article / Post', icon: 'Linkedin', maxLength: 3000 },
  facebook: { label: 'Facebook Update', icon: 'Facebook', maxLength: 2000 },
  youtube: { label: 'YouTube Video Description', icon: 'Youtube', maxLength: 5000 },
  newsletter: { label: 'Scientific Newsletter Digest', icon: 'Mail', maxLength: 1800 },
  press_brief: { label: 'Institutional Press Brief', icon: 'Megaphone', maxLength: 1200 }
};

export const READING_LEVEL_LABELS: Record<ReadingLevel, { label: string; description: string }> = {
  quick: { label: 'Quick Read', description: '2-min visual summary and bullet takeaways' },
  student: { label: 'Student / Educator', description: 'Clear concepts with visual analogies and glossary context' },
  general: { label: 'General Public', description: 'Narrative storytelling with observational context' },
  research: { label: 'Research Depth', description: 'Rigorous methodology, variable tables, statistical bounds, DOIs' }
};

export const DEMO_ACCOUNTS = [
  {
    email: 'admin@oruvia.demo',
    role: 'ADMIN' as UserRole,
    name: 'Dr. Evelyn Vance',
    affiliation: 'Global Earth Observation Directorate',
    passwordHint: 'oruvia2026'
  },
  {
    email: 'editor@oruvia.demo',
    role: 'EDITOR' as UserRole,
    name: 'Marcus Thorne',
    affiliation: 'Scientific Outreach & Editorial Office',
    passwordHint: 'oruvia2026'
  },
  {
    email: 'reviewer@oruvia.demo',
    role: 'REVIEWER' as UserRole,
    name: 'Prof. Ananya Sen',
    affiliation: 'Glaciology & Climate Review Board',
    passwordHint: 'oruvia2026'
  },
  {
    email: 'contributor@oruvia.demo',
    role: 'CONTRIBUTOR' as UserRole,
    name: 'Kasper Lindqvist',
    affiliation: 'Polar Ice Core & Sensor Program',
    passwordHint: 'oruvia2026'
  }
];

export function generateDatasetJsonLd(dataset: any): string {
  return JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    name: dataset.title,
    description: dataset.abstract,
    identifier: dataset.doi ? `https://doi.org/${dataset.doi}` : dataset.slug,
    license: dataset.license,
    creator: dataset.creators?.map((c: any) => ({
      '@type': 'Person',
      name: c.name,
      affiliation: c.affiliation
    })),
    temporalCoverage: `${dataset.temporalCoverage?.startDate}/${dataset.temporalCoverage?.endDate}`,
    spatialCoverage: {
      '@type': 'Place',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: dataset.spatialCoverage?.latitude,
        longitude: dataset.spatialCoverage?.longitude
      }
    },
    variableMeasured: dataset.variables?.map((v: any) => v.name),
    distribution: dataset.downloadUrl ? [
      {
        '@type': 'DataDownload',
        contentUrl: dataset.downloadUrl,
        encodingFormat: dataset.formats?.[0] || 'text/csv'
      }
    ] : []
  }, null, 2);
}

export function generateBibtex(pubOrDataset: any, type: 'article' | 'misc' = 'misc'): string {
  const key = pubOrDataset.slug?.replace(/-/g, '_') || 'oruvia_ref';
  const authorStr = pubOrDataset.authors 
    ? pubOrDataset.authors.map((a: any) => a.name).join(' and ')
    : pubOrDataset.creators 
      ? pubOrDataset.creators.map((c: any) => c.name).join(' and ')
      : 'ORUVIA Scientific Consortium';
  const year = pubOrDataset.year || (pubOrDataset.createdAt ? new Date(pubOrDataset.createdAt).getFullYear() : 2026);
  
  if (type === 'article' || pubOrDataset.journal) {
    return `@article{${key},
  author = {${authorStr}},
  title = {${pubOrDataset.title}},
  journal = {${pubOrDataset.journal || 'ORUVIA Earth Systems'}},
  year = {${year}},
  doi = {${pubOrDataset.doi || '10.5281/oruvia.demo'}},
  url = {https://oruvia.science/publications/${pubOrDataset.slug}}
}`;
  }

  return `@misc{${key},
  author = {${authorStr}},
  title = {${pubOrDataset.title}},
  publisher = {ORUVIA Scientific Knowledge Repository},
  year = {${year}},
  doi = {${pubOrDataset.doi || '10.5281/oruvia.demo'}},
  url = {https://oruvia.science/datasets/${pubOrDataset.slug}}
}`;
}
