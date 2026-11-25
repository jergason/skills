import { channels } from './channels';
import type { ChannelDefinition, Message, Recipient } from './defineChannel';
import { log } from './log';
import type { Provider } from './provider';

type Outcome = 'sent' | 'failed';

async function attemptUntilSent(
  channel: ChannelDefinition,
  context: { recipient: Recipient; message: Message; provider: Provider },
  attempt = 1,
): Promise<{ outcome: Outcome; attempts: number }> {
  const sent = await channel.deliver(context).then(
    () => true,
    () => false,
  );
  if (sent) {
    return { outcome: 'sent', attempts: attempt };
  }
  return attempt >= channel.maxAttempts
    ? { outcome: 'failed', attempts: attempt }
    : await attemptUntilSent(channel, context, attempt + 1);
}

async function deliver(channelName: string, recipient: Recipient, message: Message, provider: Provider) {
  const channel = channels.find(candidate => candidate.name === channelName);
  if (channel === undefined) {
    throw new Error(`Unknown channel "${channelName}"`);
  }
  const startedAt = Date.now();
  const { outcome, attempts } = await attemptUntilSent(channel, { recipient, message, provider });
  log.info('deliver() finished', {
    channel: channel.name,
    recipientId: recipient.id,
    outcome,
    attempts,
    durationMs: Date.now() - startedAt,
    facts: channel.logFacts?.(message) ?? {},
  });
  return outcome;
}

export { deliver };
