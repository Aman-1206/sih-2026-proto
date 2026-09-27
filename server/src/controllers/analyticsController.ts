import { Request, Response } from 'express';
import { Dataset } from '../models/Dataset';
import { Publication } from '../models/Publication';
import { Expedition } from '../models/Expedition';
import { MediaAsset } from '../models/MediaAsset';
import { Story } from '../models/Story';
import { ContentDraft } from '../models/ContentDraft';
import { IAnalyticsOverview } from '@oruvia/shared';

export async function getAnalyticsOverview(_req: Request, res: Response): Promise<void> {
  const [
    datasetCount,
    publicationCount,
    expeditionCount,
    mediaCount,
    storyCount,
    draftsInProgress,
    awaitingReview,
    approvedDrafts,
  ] = await Promise.all([
    Dataset.countDocuments({}),
    Publication.countDocuments({}),
    Expedition.countDocuments({}),
    MediaAsset.countDocuments({}),
    Story.countDocuments({}),
    ContentDraft.countDocuments({ status: { $in: ['DRAFT', 'AI_GENERATED'] } }),
    ContentDraft.countDocuments({ status: 'NEEDS_REVIEW' }),
    ContentDraft.countDocuments({ status: 'APPROVED' }),
  ]);

  const overview: IAnalyticsOverview = {
    totalResources: datasetCount + publicationCount + expeditionCount + mediaCount + storyCount,
    totalDatasets: datasetCount,
    totalPublications: publicationCount,
    totalExpeditions: expeditionCount,
    totalMediaAssets: mediaCount,
    totalStories: storyCount,
    totalDownloads: 14280,
    totalSearches: 48920,
    knowledgeToOutreach: {
      reportsIndexed: 142,
      storiesGenerated: storyCount * 4,
      socialPostsGenerated: 86,
      datasetsVisualized: datasetCount,
    },
    contentMetrics: {
      draftsInProgress,
      awaitingReview,
      approved: approvedDrafts,
      publishedThisMonth: 18,
    },
    popularSearchTerms: [
      { term: 'Larsemann Hills ice core', count: 1240 },
      { term: 'Atmospheric boundary layer Maitri', count: 980 },
      { term: 'Southern Ocean phytoplankton bloom', count: 850 },
      { term: 'Svalbard permafrost thaw rate', count: 720 },
      { term: 'Himansh glacier mass balance', count: 640 },
    ],
    zeroResultSearches: [
      { term: 'Mars analogue drill telemetry 2011', count: 12 },
      { term: 'Equatorial sub-surface acoustic buoy', count: 9 },
    ],
    monthlyGrowth: [
      { month: 'Oct 2025', datasets: 8, publications: 11, stories: 2 },
      { month: 'Nov 2025', datasets: 10, publications: 13, stories: 3 },
      { month: 'Dec 2025', datasets: 12, publications: 15, stories: 4 },
      { month: 'Jan 2026', datasets: 14, publications: 16, stories: 5 },
      { month: 'Feb 2026', datasets: 15, publications: 18, stories: 6 },
    ],
  };

  res.json(overview);
}
