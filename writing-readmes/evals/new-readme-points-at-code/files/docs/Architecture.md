# Architecture

The app has two processes: the web server, which answers HTTP requests, and the worker, which runs background jobs.

## Web server

`src/server.ts` starts it. Routes live in `src/routes/`, one file per resource.

## Worker

`src/worker.ts` starts the worker. It reads each job's cron expression and runs the job on that schedule, one run at a time per job. The jobs themselves live in `src/jobs/`.

The worker restarts on every deploy. A job that was running when the worker stopped runs again from the start after the restart, so a job has to be safe to run twice.

## Database

Postgres, with migrations in `migrations/`. Both processes share one connection pool size, set by `DATABASE_POOL_SIZE`.
