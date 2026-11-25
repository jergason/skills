import { providers } from './providers';
import { queue } from '../queue';

async function handleWebhook(providerName: string, headers: Headers, rawBody: string): Promise<Response> {
  const provider = providers.find(candidate => candidate.name === providerName);
  if (provider === undefined) {
    return new Response(null, { status: 404 });
  }
  const secret = process.env[provider.secretEnvVar] ?? '';
  const signature = headers.get(provider.signatureHeader) ?? '';
  if (secret === '' || !provider.verify(rawBody, signature, secret)) {
    return new Response(null, { status: 401 });
  }
  await queue.publish('events', provider.toEvent(JSON.parse(rawBody)));
  return new Response(null, { status: 202 });
}

export { handleWebhook };
