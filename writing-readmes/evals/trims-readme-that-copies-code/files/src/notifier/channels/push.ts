import { defineChannel } from '../defineChannel';

const push = defineChannel({
  name: 'push',
  rateLimitPerMinute: 600,
  maxAttempts: 2,
  async deliver({ recipient, message, provider }) {
    const { id } = await provider.sendPush(recipient.address, message.subject ?? '', message.body);
    return { providerMessageId: id };
  },
});

export { push };
