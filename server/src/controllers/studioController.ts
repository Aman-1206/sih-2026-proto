import { Request, Response } from 'express';
import { ContentDraft } from '../models/ContentDraft';
import { Campaign } from '../models/Campaign';
import { Notification } from '../models/AuditLog';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/errorHandler';
import { UpdateDraftContentSchema, ReviewActionSchema } from '@oruvia/shared';

export async function getDrafts(req: AuthRequest, res: Response): Promise<void> {
  const { status, platform, campaignId } = req.query;
  const query: any = {};
  if (status) query.status = status;
  if (platform) query.platform = platform;
  if (campaignId) query.campaignId = campaignId;

  const drafts = await ContentDraft.find(query).sort({ updatedAt: -1 });
  res.json({ drafts, total: drafts.length });
}

export async function getDraftById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const draft = await ContentDraft.findById(id);

  if (!draft) {
    res.status(404).json({ error: 'Draft not found.' });
    return;
  }

  res.json({ draft });
}

export async function createDraft(req: AuthRequest, res: Response): Promise<void> {
  const draftData = req.body;
  const authorId = req.user?.id || 'demo_contributor';
  const authorName = req.user?.name || 'Contributor Demo';

  const created = await ContentDraft.create({
    ...draftData,
    authorId,
    authorName,
    status: draftData.status || 'DRAFT',
  });

  await logAudit(req, 'CREATE_DRAFT', 'ContentDraft', created._id.toString());
  res.status(201).json({ draft: created });
}

export async function updateDraft(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const parsed = UpdateDraftContentSchema.parse(req.body);

  const draft = await ContentDraft.findById(id);
  if (!draft) {
    res.status(404).json({ error: 'Draft not found.' });
    return;
  }

  const oldDraft = draft.toObject();

  if (parsed.title !== undefined) draft.title = parsed.title;
  if (parsed.content !== undefined) draft.content = parsed.content;
  if (parsed.scheduledPublishAt !== undefined) draft.scheduledPublishAt = parsed.scheduledPublishAt;
  if (parsed.campaignId !== undefined) draft.campaignId = parsed.campaignId;
  if (parsed.status !== undefined) draft.status = parsed.status;

  if (parsed.evidenceSentences) {
    draft.evidenceSentences = parsed.evidenceSentences as any;
    const supportedCount = draft.evidenceSentences.filter((s) => s.status === 'SUPPORTED').length;
    const editorVerifiedCount = draft.evidenceSentences.filter((s) => s.status === 'EDITOR_VERIFIED').length;
    const editorialCount = draft.evidenceSentences.filter((s) => s.status === 'EDITORIAL').length;
    const unverifiedCount = draft.evidenceSentences.filter((s) => s.status === 'UNVERIFIED').length;

    draft.evidenceSummary = {
      totalSentences: draft.evidenceSentences.length,
      supportedCount,
      editorVerifiedCount,
      editorialCount,
      unverifiedCount,
      isLockedForApproval: unverifiedCount > 0,
    };
  }

  await draft.save();
  await logAudit(req, 'UPDATE_DRAFT', 'ContentDraft', draft._id.toString(), oldDraft, draft.toObject());

  res.json({ draft });
}

export async function submitForReview(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const draft = await ContentDraft.findById(id);

  if (!draft) {
    res.status(404).json({ error: 'Draft not found.' });
    return;
  }

  if (draft.evidenceSummary.unverifiedCount > 0) {
    res.status(400).json({
      error: 'Evidence Lock Warning: Cannot submit for approval with unverified sentences. Please verify or mark as editorial.',
    });
    return;
  }

  draft.status = 'NEEDS_REVIEW';
  await draft.save();

  await Notification.create({
    userId: 'reviewer_broadcast',
    title: 'New Content Awaiting Review',
    message: `"${draft.title}" for ${draft.platform} has been submitted for evidence-locked review.`,
    type: 'APPROVAL',
    link: `/studio/review`,
  });

  await logAudit(req, 'SUBMIT_FOR_REVIEW', 'ContentDraft', draft._id.toString());
  res.json({ draft, message: 'Submitted for editorial review.' });
}

export async function reviewAction(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { action, comment } = ReviewActionSchema.parse(req.body);

  const draft = await ContentDraft.findById(id);
  if (!draft) {
    res.status(404).json({ error: 'Draft not found.' });
    return;
  }

  const reviewerName = req.user?.name || 'Reviewer Dr. Sen';
  const reviewerId = req.user?.id || 'demo_reviewer';

  if (!draft.reviewComments) {
    draft.reviewComments = [];
  }

  draft.reviewComments.push({
    userId: reviewerId,
    userName: reviewerName,
    comment,
    createdAt: new Date().toISOString(),
    action: action as any,
  });

  if (action === 'APPROVE') {
    if (draft.evidenceSummary.unverifiedCount > 0) {
      res.status(400).json({
        error: 'Evidence Lock Violation: Cannot approve draft with unverified scientific statements.',
      });
      return;
    }
    draft.status = 'APPROVED';
    draft.reviewerId = reviewerId;
    draft.reviewerName = reviewerName;
  } else if (action === 'REQUEST_CHANGES') {
    draft.status = 'CHANGES_REQUESTED';
  } else if (action === 'REJECT') {
    draft.status = 'ARCHIVED';
  }

  await draft.save();

  await Notification.create({
    userId: draft.authorId,
    title: `Draft ${action === 'APPROVE' ? 'Approved' : 'Updated'}: "${draft.title}"`,
    message: `${reviewerName}: ${comment}`,
    type: action === 'APPROVE' ? 'SUCCESS' : 'WARNING',
    link: `/studio/content/${draft._id}`,
  });

  await logAudit(req, `REVIEW_${action}`, 'ContentDraft', draft._id.toString(), null, { action, comment });
  res.json({ draft });
}

export async function getCampaigns(_req: Request, res: Response): Promise<void> {
  const campaigns = await Campaign.find({}).sort({ startDate: -1 });
  res.json({ campaigns, total: campaigns.length });
}

export async function createCampaign(req: AuthRequest, res: Response): Promise<void> {
  const campaign = await Campaign.create(req.body);
  await logAudit(req, 'CREATE_CAMPAIGN', 'Campaign', campaign._id.toString());
  res.status(201).json({ campaign });
}

export async function getCalendarEvents(_req: Request, res: Response): Promise<void> {
  const scheduledDrafts = await ContentDraft.find({
    $or: [{ scheduledPublishAt: { $exists: true, $ne: null } }, { status: 'SCHEDULED' }, { status: 'PUBLISHED' }],
  }).lean();

  const events = scheduledDrafts.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    platform: d.platform,
    status: d.status,
    date: d.scheduledPublishAt || d.createdAt,
    author: d.authorName,
  }));

  res.json({ events });
}
