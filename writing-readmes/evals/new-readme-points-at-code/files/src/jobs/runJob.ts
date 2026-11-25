import type { Job } from './defineJob';

async function runOnce(job: Job, attempt: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), job.timeoutMs);
  try {
    await job.run({ signal: controller.signal, attempt });
  } finally {
    clearTimeout(timer);
  }
}

async function runJob(job: Job, attempt = 1): Promise<'ok' | 'failed'> {
  const startedAt = Date.now();
  const error = await runOnce(job, attempt).then(
    () => undefined,
    (thrown: unknown) => thrown,
  );
  if (error === undefined) {
    return 'ok';
  }
  console.log(
    JSON.stringify({
      message: 'runJob() failed',
      job: job.name,
      attempt,
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : 'unknown',
    }),
  );
  return attempt >= job.maxAttempts ? 'failed' : await runJob(job, attempt + 1);
}

export { runJob };
