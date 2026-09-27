import { Router } from 'express';
import multer from 'multer';
import * as authCtrl from '../controllers/authController';
import * as searchCtrl from '../controllers/searchController';
import * as datasetCtrl from '../controllers/datasetController';
import * as expCtrl from '../controllers/expeditionController';
import * as pubCtrl from '../controllers/publicationController';
import * as mediaCtrl from '../controllers/mediaController';
import * as actCtrl from '../controllers/activityController';
import * as stationCtrl from '../controllers/stationController';
import * as atlasCtrl from '../controllers/atlasController';
import * as graphCtrl from '../controllers/graphController';
import * as storyCtrl from '../controllers/storyController';
import * as learnCtrl from '../controllers/learnController';
import * as aiCtrl from '../controllers/aiController';
import * as studioCtrl from '../controllers/studioController';
import * as analyticsCtrl from '../controllers/analyticsController';
import * as auditCtrl from '../controllers/auditController';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const router = Router();

// Auth Routes
router.post('/auth/login', authCtrl.login);
router.post('/auth/register', authCtrl.register);
router.post('/auth/logout', authCtrl.logout);
router.post('/auth/refresh', authCtrl.refreshToken);
router.get('/auth/me', authenticate, authCtrl.me);

// Global Search
router.get('/search', searchCtrl.searchAll);
router.get('/search/suggestions', searchCtrl.getSuggestions);
router.post('/search/semantic', searchCtrl.semanticSearch);
router.get('/search/saved', authenticate, searchCtrl.getSavedSearches);
router.post('/search/saved', authenticate, searchCtrl.createSavedSearch);

// Datasets
router.get('/datasets', datasetCtrl.getDatasets);
router.get('/datasets/:slug', datasetCtrl.getDatasetBySlug);
router.get('/datasets/:id/download', datasetCtrl.downloadDatasetData);
router.post('/datasets', authenticate, requireRole('CONTRIBUTOR'), datasetCtrl.createDataset);

// Expeditions
router.get('/expeditions', expCtrl.getExpeditions);
router.get('/expeditions/:slug', expCtrl.getExpeditionBySlug);

// Publications
router.get('/publications', pubCtrl.getPublications);
router.get('/publications/:slug', pubCtrl.getPublicationBySlug);

// Media
router.get('/media', mediaCtrl.getMedia);
router.get('/media/:id', mediaCtrl.getMediaById);
router.post('/media/upload', authenticate, upload.single('file'), mediaCtrl.uploadMedia);

// Activities
router.get('/activities', actCtrl.getActivities);
router.get('/activities/:slug', actCtrl.getActivityBySlug);

// Stations
router.get('/stations', stationCtrl.getStations);
router.get('/stations/:slug', stationCtrl.getStationBySlug);
router.get('/stations/:slug/weather', stationCtrl.getStationWeather);

// Atlas & Knowledge Graph
router.get('/atlas/layers', atlasCtrl.getAtlasLayers);
router.get('/graph', graphCtrl.getKnowledgeGraph);

// Stories
router.get('/stories', storyCtrl.getStories);
router.get('/stories/:slug', storyCtrl.getStoryBySlug);
router.post('/stories', authenticate, requireRole('EDITOR'), storyCtrl.createStory);

// Learn
router.get('/learn', learnCtrl.getLearnTopics);
router.get('/learn/:slug', learnCtrl.getLearnTopicBySlug);

// AI & RAG
router.post('/ai/ask', aiCtrl.askQuestion);
router.post('/ai/generate-content', authenticate, aiCtrl.generateContent);
router.post('/ai/extract-metadata', aiCtrl.extractMetadata);
router.post('/ai/suggest-tags', aiCtrl.suggestTags);

// Studio & Content Management
router.get('/studio/drafts', authenticate, studioCtrl.getDrafts);
router.get('/studio/drafts/:id', authenticate, studioCtrl.getDraftById);
router.post('/studio/drafts', authenticate, studioCtrl.createDraft);
router.patch('/studio/drafts/:id', authenticate, studioCtrl.updateDraft);
router.post('/studio/drafts/:id/submit', authenticate, studioCtrl.submitForReview);
router.post('/studio/drafts/:id/review', authenticate, requireRole('REVIEWER'), studioCtrl.reviewAction);
router.get('/studio/campaigns', authenticate, studioCtrl.getCampaigns);
router.post('/studio/campaigns', authenticate, requireRole('EDITOR'), studioCtrl.createCampaign);
router.get('/studio/calendar', authenticate, studioCtrl.getCalendarEvents);

// Analytics
router.get('/analytics/overview', analyticsCtrl.getAnalyticsOverview);

// Audit & Notifications
router.get('/audit', authenticate, requireRole('ADMIN'), auditCtrl.getAuditLogs);
router.get('/notifications', authenticate, auditCtrl.getNotifications);
router.patch('/notifications/:id/read', authenticate, auditCtrl.markNotificationRead);

export default router;
