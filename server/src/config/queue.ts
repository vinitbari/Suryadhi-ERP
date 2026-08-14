import { Queue, Worker, QueueEvents } from 'bullmq';
import { logger } from '../utils/logger';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Report generation queue
export const reportQueue = new Queue('reports', { connection });

// Email notification queue
export const emailQueue = new Queue('emails', { connection });

// PDF generation queue
export const pdfQueue = new Queue('pdfs', { connection });

// Generic queue factory
export function createQueue(name: string) {
  return new Queue(name, { connection });
}

// Generic worker factory
export function createWorker(
  queueName: string,
  processor: (job: any) => Promise<any>
) {
  const worker = new Worker(queueName, processor, { connection });

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} in queue "${queueName}" completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error({ err }, `Job ${job?.id} in queue "${queueName}" failed`);
  });

  return worker;
}

export { connection as bullConnection };
