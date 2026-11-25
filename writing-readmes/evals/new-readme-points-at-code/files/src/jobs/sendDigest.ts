import { db } from '../db';

import { defineJob } from './defineJob';

const sendDigest = defineJob({
  name: 'sendDigest',
  timeoutMs: 300_000,
  async run({ signal }) {
    const due = await db.query<{ id: number }>(
      'SELECT id FROM digest_subscriptions WHERE next_send_at <= NOW() AND sent_for_period IS FALSE',
    );
    for (const { id } of due.rows) {
      if (signal.aborted) {
        return;
      }
      await db.query('SELECT send_digest($1)', [id]);
    }
  },
});

export { sendDigest };
