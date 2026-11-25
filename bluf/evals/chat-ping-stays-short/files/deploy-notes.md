# 2.8.0 deploy, Tue

13:05 cut release branch release/2.8.0, tagged v2.8.0
13:20 staging deploy started
13:24 staging migration 0087 failed: `lock timeout on table invoices`. a long-running report query was holding it
13:31 killed the report query (pid 48211), re-ran migration, passed in 40s
13:40 staging smoke tests green (42/42)
13:52 asked Dana for prod go-ahead in #releases, got it 14:10
14:15 prod migration 0087 ran clean, 12s, no lock waits
14:22 canary at 1%
14:40 canary 1% looks fine. error rate 0.21% vs baseline 0.24%, p95 280ms vs 290ms
14:48 bumped canary to 10%
14:58 10% still clean. error rate 0.22%, p95 285ms. no new sentry issues
14:58 starting 30 min bake at 10%. if still clean, promote to 100% at 15:30
-- rollback: `deployctl rollback web --to v2.7.4` (tested on staging last week)
