const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 4;

type JobContext = { signal: AbortSignal; attempt: number };

type JobDefinition = {
  name: string;
  timeoutMs?: number;
  run: (context: JobContext) => Promise<void>;
};

type Job = Required<Pick<JobDefinition, 'timeoutMs'>> & JobDefinition & { maxAttempts: number };

const jobNamePattern = /^[a-z][a-zA-Z0-9]*$/;

function defineJob(definition: JobDefinition): Job {
  if (!jobNamePattern.test(definition.name)) {
    throw new Error(`Job name "${definition.name}" must be camelCase`);
  }
  return { ...definition, timeoutMs: definition.timeoutMs ?? DEFAULT_TIMEOUT_MS, maxAttempts: MAX_ATTEMPTS };
}

export type { Job, JobContext };
export { defineJob };
