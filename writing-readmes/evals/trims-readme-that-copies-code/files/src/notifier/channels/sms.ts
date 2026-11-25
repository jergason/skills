import { defineChannel } from '../defineChannel';

const sms = defineChannel({
  name: 'sms',
  rateLimitPerMinute: 30,
  maxAttempts: 5,
  logFacts: message => ({ bodyLength: message.body.length, segments: Math.ceil(message.body.length / 160) }),
  async deliver({ recipient, message, provider }) {
    const [result] = await provider.sendSmsBatch([{ to: recipient.address, text: message.body }]);
    if (result === undefined || !result.receipt) {
      throw new Error('SMS was not acknowledged with a delivery receipt');
    }
    return { providerMessageId: result.id };
  },
});

export { sms };
