# Architecture

Thumbnailer turns uploaded photos into thumbnails for the gallery app.

## Components

- **Web app** (`apps/web`): the gallery UI. Calls the API for everything.
- **API** (`apps/api`): handles uploads and serves thumbnail URLs. Writes upload records to Postgres and puts a resize job on the queue.
- **Postgres**: upload records and thumbnail status.
- **Queue** (SQS `thumbnail-jobs`): resize jobs from the API.
- **Worker** (`apps/worker`): pulls jobs from the queue, resizes the image, writes thumbnails to S3, and marks the upload done in Postgres.
- **S3** (`thumbnails-prod`): originals and thumbnails. The web app loads thumbnails straight from S3 through signed URLs the API hands out.

## Deploys

The API and worker deploy together from `main` via `deploy.yml`. The web app deploys separately.

## Local development

Run `docker compose up` for Postgres and a local SQS (elasticmq), then `pnpm dev`.
