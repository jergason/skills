import { createHmac, timingSafeEqual } from 'node:crypto';

import { defineProvider } from '../defineProvider';

const github = defineProvider({
  name: 'github',
  secretEnvVar: 'GITHUB_WEBHOOK_SECRET',
  signatureHeader: 'x-hub-signature-256',
  verify(rawBody, signature, secret) {
    const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`;
    return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  },
  toEvent(body) {
    const { action, repository } = body as { action: string; repository: { id: number; full_name: string } };
    return { type: `github.${action}`, externalId: String(repository.id), payload: { repository: repository.full_name } };
  },
});

export { github };
