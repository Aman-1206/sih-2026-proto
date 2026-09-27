export interface IEmbeddingProvider {
  getEmbedding(text: string): Promise<number[]>;
  computeCosineSimilarity(vecA: number[], vecB: number[]): number;
}

export class LocalEmbeddingProvider implements IEmbeddingProvider {
  private dimension = 64;

  async getEmbedding(text: string): Promise<number[]> {
    const vector = new Array(this.dimension).fill(0);
    const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const tokens = clean.split(/\s+/).filter(Boolean);

    if (tokens.length === 0) return vector;

    for (const token of tokens) {
      for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i);
        const idx = (charCode * (i + 1) * 31) % this.dimension;
        vector[idx] += 1 / (tokens.length + 1);
      }
    }

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector;
    return vector.map((v) => v / magnitude);
  }

  computeCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dot = 0;
    let magA = 0;
    let magB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : Math.max(0, Math.min(1, dot / denom));
  }
}

export const embeddingProvider: IEmbeddingProvider = new LocalEmbeddingProvider();
