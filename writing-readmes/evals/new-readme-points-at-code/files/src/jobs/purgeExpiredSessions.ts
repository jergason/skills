import { db } from '../db';

import { defineJob } from './defineJob';

const purgeExpiredSessions = defineJob({
  name: 'purgeExpiredSessions',
  async run() {
    await db.query('DELETE FROM sessions WHERE expires_at < NOW()');
  },
});

export { purgeExpiredSessions };
