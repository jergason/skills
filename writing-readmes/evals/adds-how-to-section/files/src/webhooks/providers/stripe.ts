import { createHmac, timingSafeEqual } from 'node:crypto';

import { defineProvider } from '../defineProvider';

function signedPayload(rawBody: string, signature: string) {
  const parts = new Map(signature.split(',').map(part => part.split('=') as [string, string]));
  return { timestamp: parts.get('t') ?? '', v1: parts.get('v1') ?? '', signed: `${parts.get('t')}.${rawBody}` };
}

const stripe = defineProvider({
  name: 'stripe',
  secretEnvVar: 'STRIPE_WEBHOOK_SECRET',
  signatureHeader: 'stripe-signature',
  verify(rawBody, signature, secret) {
    const { v1, signed } = signedPayload(rawBody, signature);
    const expected = createHmac('sha256', secret).update(signed).digest('hex');
    return expected.length === v1.length && timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  },
  toEvent(body) {
    const { id, type, data } = body as { id: string; type: string; data: { object: Record<string, unknown> } };
    return { type: `stripe.${type}`, externalId: id, payload: { objectId: data.object.id } };
  },
});

export { stripe };
