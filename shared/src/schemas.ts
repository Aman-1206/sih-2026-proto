import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['PUBLIC', 'CONTRIBUTOR', 'EDITOR', 'REVIEWER', 'ADMIN']).default('CONTRIBUTOR'),
  affiliation: z.string().optional(),
});

export const ContentStudioGenerateSchema = z.object({
  resourceIds: z.array(z.string()).min(1, 'Please select at least one source resource'),
  platform: z.enum(['website_article', 'instagram', 'x', 'linkedin', 'facebook', 'youtube', 'newsletter', 'press_brief']),
  audience: z.enum(['Students', 'General public', 'Researchers', 'Media']),
  tone: z.enum(['Educational', 'Informative', 'Announcement', 'Storytelling']),
  targetLengthWords: z.number().min(50).max(2500).default(300),
  language: z.enum(['en', 'hi']).default('en'),
  additionalInstructions: z.string().optional(),
});

export const UpdateDraftContentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  evidenceSentences: z.array(
    z.object({
      sentenceId: z.string(),
      text: z.string(),
      status: z.enum(['SUPPORTED', 'EDITOR_VERIFIED', 'EDITORIAL', 'UNVERIFIED']),
      editorNotes: z.string().optional(),
    })
  ).optional(),
  status: z.enum(['DRAFT', 'AI_GENERATED', 'NEEDS_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).optional(),
  scheduledPublishAt: z.string().optional(),
  campaignId: z.string().optional(),
});

export const ReviewActionSchema = z.object({
  action: z.enum(['APPROVE', 'REQUEST_CHANGES', 'REJECT', 'COMMENT']),
  comment: z.string().min(2, 'Please provide a comment for this review action'),
});

export const AskQuestionSchema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters'),
  contextResourceIds: z.array(z.string()).optional(),
  language: z.enum(['en', 'hi']).default('en'),
});

export const UploadWizardSchema = z.object({
  resourceType: z.enum(['dataset', 'publication', 'expedition', 'media', 'activity', 'document']),
  title: z.string().min(3, 'Title is required'),
  abstractOrDescription: z.string().min(10, 'Description is required'),
  creators: z.array(z.string()).min(1, 'At least one creator is required'),
  scienceDomains: z.array(z.string()).min(1, 'At least one science domain is required'),
  license: z.string().default('CC-BY-4.0'),
  accessRights: z.enum(['OPEN', 'RESTRICTED', 'EMBARGOED']).default('OPEN'),
  stationId: z.string().optional(),
  expeditionId: z.string().optional(),
  relatedResourceIds: z.array(z.string()).optional(),
  fileUrl: z.string().optional(),
});

export const SearchQuerySchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  domain: z.string().optional(),
  region: z.string().optional(),
  year: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('12'),
  sortBy: z.enum(['relevance', 'date_desc', 'date_asc', 'title_asc']).optional().default('relevance'),
});
