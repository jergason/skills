# Notifier

The notifier sends email, SMS and push messages for the other services. A caller names a channel, a recipient and a rendered message, and the notifier delivers it through our messaging provider.

## Concepts

- **Channel.** One way to reach a person: email, SMS or push. Each one is a file in `src/notifier/channels/`.
- **Recipient.** An id plus the one address a channel needs. Channels never see the full person record.
- **Attempt.** One call to the provider. A channel retries a failed delivery up to its `maxAttempts`.

## Rules every channel follows

- A channel builds the provider payload field by field instead of passing the message through, so a template can't send fields it wasn't meant to.
- `defineChannel` rejects a channel without a positive rate limit, because the provider suspends accounts that send in bursts.
- Message bodies are never logged, because they can hold personal data. A channel's `logFacts` can log numbers about a message, such as its length.

See the [notifier README](../src/notifier/README.md) for the list of channels and more implementation details.
