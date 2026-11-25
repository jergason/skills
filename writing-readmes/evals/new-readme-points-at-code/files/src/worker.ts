import { schedule } from 'node-cron';

import { jobs } from './jobs';
import { runJob } from './jobs/runJob';
import { schedules } from './jobs/schedules';

const running = new Set<string>();

for (const job of jobs) {
  schedule(schedules[job.name] ?? '', async () => {
    if (running.has(job.name)) {
      return;
    }
    running.add(job.name);
    await runJob(job).finally(() => running.delete(job.name));
  });
}
