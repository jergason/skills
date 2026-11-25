# Notifier

The notifier is a robust, flexible service that seamlessly delivers messages to people across email, SMS and push. It plays a crucial role in how our services talk to users.

## Overview

A channel is one way to reach a person. Each channel lives in `channels/` and is registered in `channels/index.ts`. Channels never see the full person record, only a recipient with the address they need.

Channels build the provider payload field by field instead of passing the message through. This ensures a template can't send fields it wasn't meant to.

## Writing a channel

Use `defineChannel` to create a channel:

```ts
const email = defineChannel({
  name: 'email',
  rateLimit: 120,
  retries: 3,
  async deliver(ctx) {
    await ctx.send(ctx.recipient.address, ctx.message);
  },
});
```

`defineChannel` rejects three kinds of channel:

- names that aren't snake_case
- channels without a rate limit, because the provider suspends accounts that send in bursts
- channels that retry more than 10 times

Then add the channel to the list in `channels/index.ts`.

## Logging

Each delivery writes one log line with:

- the channel
- the recipient id
- the outcome (`sent` or `failed`)
- the duration in milliseconds
- whatever the channel's `logFacts` returns

Message bodies are never logged, because they can hold personal data. That's why `logFacts` exists: it lets a channel log numbers about a message, such as its length, without logging the message.

To find failed deliveries, run this in the log viewer:

```
fields @timestamp, channel, recipientId
| filter message = 'notifier sent' and outcome = 'failed'
| sort @timestamp desc
```

## Channels

| Channel | Rate limit | Attempts | Provider call  |
| ------- | ---------- | -------- | -------------- |
| `email` | 120/min    | 3        | `sendEmail`    |
| `sms`   | 30/min     | 3        | `sendSmsBatch` |
| `push`  | 600/min    | 2        | `sendPush`     |

### Why SMS uses the batch endpoint

The provider's single-send SMS endpoint returns no delivery receipt, so the notifier couldn't tell a delivered text from a dropped one. `sms` sends a batch of one through `sendSmsBatch`, which returns a receipt per message, and treats a missing receipt as a failed attempt.

## History

The notifier originally sent SMS through a separate queue worker. We moved SMS inline in 2025 because the worker added up to a minute of delay and made retries hard to reason about. Push was added later, in the same shape as email.

## Conclusion

With these building blocks, the notifier provides a reliable foundation for reaching users across every channel.
