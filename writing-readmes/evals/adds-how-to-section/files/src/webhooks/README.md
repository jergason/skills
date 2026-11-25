# Webhooks

This package receives webhooks from outside services at `POST /webhooks/:provider`, checks each one's signature, and turns it into an internal event on the `events` queue.

## Signatures

A request whose signature doesn't verify gets a `401` and is never parsed or queued. Each provider's secret comes from the environment variable its definition names, so secrets never live in the code. Rotating a secret means updating that variable and restarting, with no deploy.

## Replaying a webhook locally

Save the raw request body and headers as JSON, then run:

```sh
pnpm webhooks:replay path/to/request.json
```

It signs the body with your local secret and posts it to your running server, so you can debug a handler without the outside service.
