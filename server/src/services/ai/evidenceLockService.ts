import { IEvidenceSentence, EvidenceLockStatus, ResourceType } from '@oruvia/shared';
import { embeddingProvider } from './embeddingProvider';
import { v4 as uuidv4 } from 'uuid';

export interface ISourceDocumentContext {
  id: string;
  type: ResourceType;
  title: string;
  fullText: string;
  slug?: string;
}

export class EvidenceLockService {
  /**
   * Splits a plain text or markdown body into individual sentences
   */
  splitIntoSentences(text: string): string[] {
    // Clean up HTML tags if any
    const cleanText = text.replace(/<[^>]*>?/gm, ' ').replace(/\n+/g, ' ').trim();
    // Split by sentence punctuation (. ! ?) followed by whitespace or quote
    const rawSentences = cleanText.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [cleanText];
    return rawSentences
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  }

  /**
   * Analyzes an array of sentences against provided source materials
   */
  async analyzeSentences(
    sentences: string[],
    sources: ISourceDocumentContext[]
  ): Promise<{ evidenceSentences: IEvidenceSentence[]; summary: any }> {
    const analyzed: IEvidenceSentence[] = [];

    for (const sentence of sentences) {
      const sentenceVec = await embeddingProvider.getEmbedding(sentence);
      let bestMatch: {
        source: ISourceDocumentContext;
        score: number;
        snippet: string;
      } | null = null;

      const sentenceWords = sentence.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

      for (const src of sources) {
        // Break source text into paragraph chunks
        const paragraphs = src.fullText.split(/\n\n+/).filter((p) => p.length > 20);
        for (const p of paragraphs) {
          const pVec = await embeddingProvider.getEmbedding(p);
          const cosine = embeddingProvider.computeCosineSimilarity(sentenceVec, pVec);

          // Word overlap boost
          let wordMatches = 0;
          const lowerP = p.toLowerCase();
          for (const w of sentenceWords) {
            if (lowerP.includes(w)) wordMatches++;
          }
          const wordOverlapRatio = sentenceWords.length > 0 ? wordMatches / sentenceWords.length : 0;
          const combinedScore = cosine * 0.5 + wordOverlapRatio * 0.5;

          if (!bestMatch || combinedScore > bestMatch.score) {
            bestMatch = {
              source: src,
              score: combinedScore,
              snippet: p.substring(0, 200),
            };
          }
        }
      }

      // Editorial / Transition sentence heuristic
      const isShortIntroOrTransition =
        sentenceWords.length < 6 ||
        /^(in conclusion|overall|furthermore|notably|we observed|interestingly|in summary)/i.test(sentence);

      let status: EvidenceLockStatus = 'UNVERIFIED';
      if (bestMatch && bestMatch.score >= 0.55) {
        status = 'SUPPORTED';
      } else if (isShortIntroOrTransition) {
        status = 'EDITORIAL';
      } else {
        status = 'UNVERIFIED';
      }

      analyzed.push({
        sentenceId: uuidv4(),
        text: sentence,
        status,
        sourceCitation: bestMatch && bestMatch.score >= 0.35 ? {
          resourceId: bestMatch.source.id,
          resourceType: bestMatch.source.type,
          resourceTitle: bestMatch.source.title,
          exactQuoteOrData: bestMatch.snippet,
          confidenceScore: Math.round(bestMatch.score * 100) / 100,
        } : undefined,
      });
    }

    const supportedCount = analyzed.filter((s) => s.status === 'SUPPORTED').length;
    const editorVerifiedCount = analyzed.filter((s) => s.status === 'EDITOR_VERIFIED').length;
    const editorialCount = analyzed.filter((s) => s.status === 'EDITORIAL').length;
    const unverifiedCount = analyzed.filter((s) => s.status === 'UNVERIFIED').length;

    const summary = {
      totalSentences: analyzed.length,
      supportedCount,
      editorVerifiedCount,
      editorialCount,
      unverifiedCount,
      isLockedForApproval: unverifiedCount > 0,
    };

    return { evidenceSentences: analyzed, summary };
  }
}

export const evidenceLockService = new EvidenceLockService();
