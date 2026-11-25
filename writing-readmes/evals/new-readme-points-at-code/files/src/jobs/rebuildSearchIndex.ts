import { db } from '../db';

import { defineJob } from './defineJob';

const rebuildSearchIndex = defineJob({
  name: 'rebuildSearchIndex',
  timeoutMs: 600_000,
  async run() {
    await db.query('REFRESH MATERIALIZED VIEW CONCURRENTLY search_documents');
  },
});

export { rebuildSearchIndex };
