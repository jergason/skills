502s on /resize — scratch notes

mon 18 nov: v1.8.0 shipped ~16:00 (express -> plain node http, see src/server.ts)
tue: support ticket, thumbnails sometimes broken. ALB access logs: elb_status_code=502 target_status_code=- on ~0.4% of /resize reqs. started tue 19 nov early am, not before 1.8.0 as far as I can see (logs only go back 7 days, checked 12-17 nov: zero 502s)
only /resize, /healthz never 502s (but healthz is cheap + infrequent)

idea: OOM? sharp eats memory on big images
- grafana container_memory_working_set_bytes for resize pods, peak 410MB, limit is 1GB
- kubectl describe pod on all 6 pods: restarts 0, no OOMKilled in last state
- so not memory. dead end

idea: s3 slow -> we time out?
- cloudwatch GetObject latency p99 ~80ms during the exact 502 windows (lined up timestamps from ALB logs)
- our handler has no timeout anyway, and a slow s3 would give 504 not 502
- not s3

tried: bumped replicas 6 -> 10 wed morning. 502 rate unchanged (0.38%). reverted to 6

pattern: 502s cluster right after quiet periods? looked at a few by hand, the failing reqs are often the first req on a connection that's been idle a few seconds. ALB reuses keep-alive conns to targets.
ALB idle timeout = 60s (terraform/alb.tf, default). node http server keepAliveTimeout default is 5s and express... did express set something different? don't think express changes it, but the old code used app.listen() so same server underneath? not sure
=> theory: node closes idle conn at 5s, ALB still thinks it's open, sends req on dead socket -> 502. classic. NOT TESTED. haven't changed anything

could try server.keepAliveTimeout = 65000 and headersTimeout = 66000 in src/server.ts, deploy to staging, run the load script (scripts/idle-burst.sh, doesn't exist yet, need to write: bursts of reqs with 10s idle gaps)

branch: investigate/resize-502s, nothing committed
