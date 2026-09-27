import { Request, Response } from 'express';
import { aiProvider } from '../services/ai/aiProvider';
import { AskQuestionSchema, ContentStudioGenerateSchema } from '@oruvia/shared';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/errorHandler';

export async function askQuestion(req: Request, res: Response): Promise<void> {
  const { question, contextResourceIds, language } = AskQuestionSchema.parse(req.body);
  const result = await aiProvider.ask(question, contextResourceIds, language as 'en' | 'hi');
  res.json(result);
}

export async function generateContent(req: AuthRequest, res: Response): Promise<void> {
  const parsed = ContentStudioGenerateSchema.parse(req.body);
  const result = await aiProvider.generateStudioContent(parsed);

  await logAudit(
    req,
    'AI_CONTENT_GENERATION',
    'ContentStudio',
    parsed.resourceIds[0],
    null,
    { platform: parsed.platform, audience: parsed.audience },
    { modelUsed: 'oruvia-earth-rag-v1', sourcesReferenced: parsed.resourceIds }
  );

  res.json(result);
}

export async function extractMetadata(req: Request, res: Response): Promise<void> {
  const { fileName = 'document.pdf', mimeType = 'application/pdf' } = req.body;
  const result = await aiProvider.extractMetadataFromDoc(fileName, mimeType);
  res.json(result);
}

export async function suggestTags(req: Request, res: Response): Promise<void> {
  const { text = '' } = req.body;
  const tags = await aiProvider.suggestTags(text);
  res.json({ tags });
}
