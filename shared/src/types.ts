export type UserRole = 'PUBLIC' | 'CONTRIBUTOR' | 'EDITOR' | 'REVIEWER' | 'ADMIN';

export type ResourceType = 
  | 'dataset'
  | 'publication'
  | 'expedition'
  | 'person'
  | 'organization'
  | 'station'
  | 'location'
  | 'media'
  | 'activity'
  | 'story'
  | 'document';

export type ScienceDomain =
  | 'Atmosphere'
  | 'Cryosphere'
  | 'Oceans'
  | 'Paleoclimate'
  | 'Biosphere'
  | 'Solid Earth'
  | 'Glaciology'
  | 'Climate'
  | 'Marine Biology'
  | 'Geophysics';

export type VerificationStatus = 'VERIFIED' | 'DEMO' | 'UNVERIFIED';

export type EvidenceLockStatus = 'SUPPORTED' | 'EDITOR_VERIFIED' | 'EDITORIAL' | 'UNVERIFIED';

export type DraftStatus = 
  | 'DRAFT'
  | 'AI_GENERATED'
  | 'NEEDS_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type SocialPlatform = 
  | 'website_article'
  | 'instagram'
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'youtube'
  | 'newsletter'
  | 'press_brief';

export type ReadingLevel = 'quick' | 'student' | 'general' | 'research';

export type AudienceType = 'Students' | 'General public' | 'Researchers' | 'Media';

export type ToneType = 'Educational' | 'Informative' | 'Announcement' | 'Storytelling';

export type RelationType = 
  | 'COLLECTED_DURING'
  | 'AUTHORED_BY'
  | 'ASSOCIATED_WITH'
  | 'COLLECTED_AT'
  | 'CITES'
  | 'DERIVED_FROM'
  | 'USES_DATASET'
  | 'RELATED_TO'
  | 'DOCUMENTED_BY'
  | 'AFFILIATED_WITH';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  affiliation?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILocation {
  _id?: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  boundingBox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

export interface IStation {
  _id: string;
  slug: string;
  name: string;
  code: string;
  region: string;
  establishedYear: number;
  coordinates: {
    latitude: number;
    longitude: number;
    elevationMeters: number;
  };
  description: string;
  operationalStatus: 'ACTIVE' | 'SEASONAL' | 'DECOMMISSIONED';
  isLive: boolean;
  isDemoData: boolean;
  researchThemes: ScienceDomain[];
  currentObservations?: {
    temperatureC: number;
    windSpeedKts: number;
    windDirectionDeg: number;
    pressureHpa: number;
    humidityPercent: number;
    solarRadiationWm2?: number;
    timestamp: string;
    dataSource: 'LIVE_SENSOR' | 'DEMO_SEED';
  };
  historicalObservations?: Array<{
    date: string;
    temperatureC: number;
    windSpeedKts: number;
    pressureHpa: number;
    humidityPercent: number;
  }>;
  photos: string[];
  affiliatedOrganizationIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IDatasetVariable {
  name: string;
  unit: string;
  description: string;
  dataType: string;
}

export interface IDataset {
  _id: string;
  slug: string;
  title: string;
  abstract: string;
  description: string;
  creators: Array<{
    name: string;
    orcid?: string;
    affiliation?: string;
    personId?: string;
  }>;
  contributors?: Array<{
    name: string;
    role: string;
    affiliation?: string;
  }>;
  organizations: string[];
  keywords: string[];
  scienceDomains: ScienceDomain[];
  spatialCoverage: {
    regionName: string;
    latitude: number;
    longitude: number;
    boundingBox?: [number, number, number, number];
  };
  temporalCoverage: {
    startDate: string;
    endDate: string;
  };
  stationId?: string;
  stationName?: string;
  expeditionId?: string;
  expeditionName?: string;
  instrument: string;
  variables: IDatasetVariable[];
  processingLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  formats: string[];
  fileSizeMb: number;
  version: string;
  license: string;
  accessRights: 'OPEN' | 'RESTRICTED' | 'EMBARGOED';
  doi: string;
  externalIdentifier?: string;
  citationText: string;
  sampleDataPreview?: Array<Record<string, string | number>>;
  downloadUrl?: string;
  source: string;
  provenance: string;
  isDemoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPublicationFigure {
  id: string;
  caption: string;
  url?: string;
  datasetId?: string;
  metric?: string;
}

export interface IPublicationTable {
  id: string;
  caption: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}

export interface IPublicationReference {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
}

export interface IPublicationFullText {
  introduction: string;
  background?: string;
  methodology: string;
  studyArea?: string;
  instrumentation?: string;
  dataCollection?: string;
  analysis?: string;
  results: string;
  discussion: string;
  limitations?: string;
  conclusion: string;
}

export interface IPublication {
  _id: string;
  slug: string;
  title: string;
  authors: Array<{
    name: string;
    orcid?: string;
    affiliation?: string;
    personId?: string;
  }>;
  abstract: string;
  year: number;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi: string;
  keywords: string[];
  license: string;
  openAccess: boolean;
  relatedDatasetIds: string[];
  relatedExpeditionIds: string[];
  pdfUrl?: string;
  citationBibtex?: string;
  citationRis?: string;
  citationApa?: string;
  scienceDomains: ScienceDomain[];
  fullText?: IPublicationFullText;
  figures?: IPublicationFigure[];
  tables?: IPublicationTable[];
  references?: IPublicationReference[];
  acknowledgements?: string;
  isDemoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IExpeditionMilestone {
  date: string;
  title: string;
  description: string;
  coordinates?: [number, number]; // [lng, lat]
}

export interface IExpedition {
  _id: string;
  slug: string;
  number: string;
  name: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  region: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  overview: string;
  detailedReport?: string;
  routeCoordinates: Array<[number, number]>; // [[lng, lat], ...]
  milestones: IExpeditionMilestone[];
  researchThemes: ScienceDomain[];
  leadScientist: {
    name: string;
    affiliation: string;
    personId?: string;
  };
  participantsCount: number;
  vesselOrTransport?: string;
  relatedDatasetIds: string[];
  relatedPublicationIds: string[];
  relatedMediaIds: string[];
  coverImageUrl: string;
  isDemoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMediaAsset {
  _id: string;
  slug?: string;
  title: string;
  mediaType: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'ILLUSTRATION' | 'INFOGRAPHIC';
  url: string;
  thumbnailUrl?: string;
  caption: string;
  description: string;
  photographerOrCreator: string;
  copyright: string;
  license: string;
  dateCaptured: string;
  region: string;
  stationId?: string;
  stationName?: string;
  expeditionId?: string;
  expeditionName?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
  aiSuggestedTags: string[];
  peopleMentioned: string[];
  subjects: string[];
  relatedResourceIds: string[];
  aspectRatio?: string;
  isDemoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IActivity {
  _id: string;
  slug: string;
  title: string;
  category: 'OUTREACH' | 'WORKSHOP' | 'FIELD_CAMPAIGN' | 'INSTITUTIONAL' | 'SYMPOSIUM' | 'TRAINING';
  date: string;
  locationName: string;
  summary: string;
  description: string;
  leadCoordinator: string;
  collaboratingOrganizations: string[];
  targetAudience: string;
  outcomes: string[];
  coverImageUrl?: string;
  mediaIds: string[];
  relatedDatasetIds?: string[];
  relatedExpeditionIds?: string[];
  isDemoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IStoryVariant {
  readingLevel: ReadingLevel;
  contentHtml: string;
  summary: string;
  estimatedReadTimeMin: number;
}

export interface IStory {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImageUrl: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  scienceDomains: ScienceDomain[];
  readingLevels: {
    quick: IStoryVariant;
    student: IStoryVariant;
    general: IStoryVariant;
    research: IStoryVariant;
  };
  embeddedDatasets?: Array<{
    datasetId: string;
    title: string;
    doi: string;
  }>;
  embeddedExpeditions?: Array<{
    expeditionId: string;
    name: string;
  }>;
  embeddedCharts?: Array<{
    chartType: string;
    title: string;
    metric: string;
  }>;
  quotes: Array<{
    quote: string;
    speaker: string;
    role: string;
  }>;
  isDemoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILearnTopic {
  _id: string;
  slug: string;
  title: string;
  category: 'Polar regions' | 'Climate' | 'Ice' | 'Oceans' | 'Expeditions' | 'People' | 'Glossary';
  summary: string;
  heroImageUrl: string;
  readingTimeMin: number;
  interactiveExplainer: {
    title: string;
    description: string;
    steps: Array<{
      stepNumber: number;
      title: string;
      text: string;
      diagramType?: string;
      dataHighlight?: string;
    }>;
  };
  quiz: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  glossaryTerms: Array<{
    term: string;
    definition: string;
    domain: ScienceDomain;
  }>;
  featuredScientist?: {
    name: string;
    title: string;
    bio: string;
    focus: string;
    imageUrl?: string;
  };
}

export interface IEvidenceSentence {
  sentenceId: string;
  text: string;
  status: EvidenceLockStatus;
  sourceCitation?: {
    resourceId: string;
    resourceType: ResourceType;
    resourceTitle: string;
    exactQuoteOrData?: string;
    chunkId?: string;
    pageNumber?: number;
    confidenceScore: number;
  };
  editorNotes?: string;
  verifiedByUserId?: string;
  verifiedAt?: string;
}

export interface IContentDraft {
  _id: string;
  title: string;
  platform: SocialPlatform;
  audience: AudienceType;
  tone: ToneType;
  language: 'en' | 'hi';
  targetLengthWords: number;
  sourceResourceIds: string[];
  sourceResourcesPreview?: Array<{
    id: string;
    type: ResourceType;
    title: string;
    slug?: string;
  }>;
  content: string; // HTML or Markdown
  evidenceSentences: IEvidenceSentence[];
  evidenceSummary: {
    totalSentences: number;
    supportedCount: number;
    editorVerifiedCount: number;
    editorialCount: number;
    unverifiedCount: number;
    isLockedForApproval: boolean; // true if unverifiedCount > 0
  };
  status: DraftStatus;
  campaignId?: string;
  campaignName?: string;
  scheduledPublishAt?: string;
  publishedUrl?: string;
  authorId: string;
  authorName: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewComments?: Array<{
    userId: string;
    userName: string;
    comment: string;
    createdAt: string;
    action?: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ICampaign {
  _id: string;
  slug: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED';
  targetPlatforms: SocialPlatform[];
  associatedStoryId?: string;
  associatedStoryTitle?: string;
  associatedResourceIds: string[];
  draftCount: number;
  publishedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IKnowledgeGraphNode {
  id: string;
  name: string;
  type: ResourceType;
  slug?: string;
  group: string;
  size: number;
  meta?: Record<string, any>;
}

export interface IKnowledgeGraphLink {
  source: string;
  target: string;
  relation: RelationType;
  label?: string;
}

export interface IKnowledgeGraphData {
  nodes: IKnowledgeGraphNode[];
  links: IKnowledgeGraphLink[];
}

export interface IAskResponse {
  question: string;
  answer: string;
  hasSufficientEvidence: boolean;
  confidenceScore: number;
  sources: Array<{
    resourceId: string;
    resourceType: ResourceType;
    title: string;
    slug?: string;
    doi?: string;
    snippet: string;
    relevanceScore: number;
  }>;
  relatedDatasets: Array<{ id: string; title: string; slug: string; doi: string }>;
  relatedPublications: Array<{ id: string; title: string; slug: string; doi: string; year: number }>;
  relatedExpeditions: Array<{ id: string; name: string; slug: string; region: string }>;
  relatedMedia: Array<{ id: string; title: string; url: string; mediaType: string }>;
}

export interface ISearchFilter {
  query?: string;
  resourceTypes?: ResourceType[];
  regions?: string[];
  years?: number[];
  scienceDomains?: ScienceDomain[];
  stations?: string[];
  expeditions?: string[];
  accessRights?: string[];
  licenses?: string[];
  creators?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date_desc' | 'date_asc' | 'title_asc';
}

export interface ISearchResultItem {
  id: string;
  type: ResourceType;
  title: string;
  slug: string;
  abstractOrCaption: string;
  date?: string;
  year?: number;
  region?: string;
  scienceDomains?: ScienceDomain[];
  doi?: string;
  creators?: string[];
  thumbnailUrl?: string;
  highlightSnippets?: string[];
  score?: number;
}

export interface ISearchResponse {
  items: ISearchResultItem[];
  total: number;
  page: number;
  limit: number;
  facets: {
    resourceTypes: Array<{ key: ResourceType; count: number }>;
    scienceDomains: Array<{ key: ScienceDomain; count: number }>;
    regions: Array<{ key: string; count: number }>;
    years: Array<{ key: number; count: number }>;
  };
}

export interface IAuditLog {
  _id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  event: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  aiMetadata?: {
    modelUsed?: string;
    provider?: string;
    sourcesReferenced?: string[];
    tokensUsed?: number;
  };
  timestamp: string;
}

export interface IAnalyticsOverview {
  totalResources: number;
  totalDatasets: number;
  totalPublications: number;
  totalExpeditions: number;
  totalMediaAssets: number;
  totalStories: number;
  totalDownloads: number;
  totalSearches: number;
  knowledgeToOutreach: {
    reportsIndexed: number;
    storiesGenerated: number;
    socialPostsGenerated: number;
    datasetsVisualized: number;
  };
  contentMetrics: {
    draftsInProgress: number;
    awaitingReview: number;
    approved: number;
    publishedThisMonth: number;
  };
  popularSearchTerms: Array<{ term: string; count: number }>;
  zeroResultSearches: Array<{ term: string; count: number }>;
  monthlyGrowth: Array<{ month: string; datasets: number; publications: number; stories: number }>;
}
