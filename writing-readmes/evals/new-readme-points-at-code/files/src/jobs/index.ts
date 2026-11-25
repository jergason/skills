import type { Job } from './defineJob';
import { purgeExpiredSessions } from './purgeExpiredSessions';
import { rebuildSearchIndex } from './rebuildSearchIndex';
import { sendDigest } from './sendDigest';

const jobs: ReadonlyArray<Job> = [sendDigest, purgeExpiredSessions, rebuildSearchIndex];

export { jobs };
