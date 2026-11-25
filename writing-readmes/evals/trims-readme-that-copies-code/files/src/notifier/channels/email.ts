import { defineChannel } from '../defineChannel';

const email = defineChannel({
  name: 'email',
  rateLimitPerMinute: 120,
  maxAttempts: 3,
  logFacts: message => ({ bodyLength: message.body.length }),
  async deliver({ recipient, message, provider }) {
    const { id } = await provider.sendEmail(recipient.address, message.subject ?? '', message.body);
    return { providerMessageId: id };
  },
});

export { email };
