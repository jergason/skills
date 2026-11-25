import { describe, expect, test } from 'vitest';

import { jobs } from './index';
import { schedules } from './schedules';

describe('the job registry', () => {
  test('names are unique', () => {
    const names = jobs.map(job => job.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('every job has a schedule', () => {
    for (const job of jobs) {
      expect(schedules[job.name], `${job.name} has no cron expression in schedules.ts`).toBeDefined();
    }
  });

  test('every schedule belongs to a job', () => {
    const names = new Set(jobs.map(job => job.name));
    expect(Object.keys(schedules).filter(name => !names.has(name))).toEqual([]);
  });
});
