export interface IJob {
  id: string;
  name: string;
  data: any;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  result?: any;
  error?: string;
  createdAt: Date;
}

export class QueueService {
  private jobs = new Map<string, IJob>();
  private handlers = new Map<string, (job: IJob) => Promise<any>>();

  registerHandler(jobName: string, handler: (job: IJob) => Promise<any>) {
    this.handlers.set(jobName, handler);
  }

  async addJob(jobName: string, data: any): Promise<IJob> {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job: IJob = {
      id,
      name: jobName,
      data,
      status: 'PENDING',
      createdAt: new Date(),
    };
    this.jobs.set(id, job);

    // Process asynchronously in background
    setTimeout(async () => {
      const handler = this.handlers.get(jobName);
      if (handler) {
        try {
          job.status = 'ACTIVE';
          job.result = await handler(job);
          job.status = 'COMPLETED';
        } catch (err: any) {
          job.status = 'FAILED';
          job.error = err.message;
        }
      }
    }, 100);

    return job;
  }

  getJob(id: string): IJob | undefined {
    return this.jobs.get(id);
  }
}

export const queueService = new QueueService();

// Register mock pipeline handlers
queueService.registerHandler('DOCUMENT_INGESTION', async (job) => {
  console.log(`[QueueService] Ingesting document: ${job.data?.title || job.id}`);
  // Simulated OCR & Chunking
  return { chunksCreated: 14, entitiesFound: 8, indexed: true };
});

queueService.registerHandler('SOCIAL_PUBLISH', async (job) => {
  console.log(`[QueueService] Simulating publishing draft ${job.data?.draftId} to ${job.data?.platform}`);
  return { publishedUrl: `https://social.oruvia.science/p/${Date.now()}`, status: 'SUCCESS' };
});
