---
type: llm
focus: trace
weight: 1
---

HANDOFF.md lists both ruled-out causes with how each was ruled out: memory (peak about 410MB of a 1GB limit, no OOMKilled restarts) and S3 latency (GetObject p99 about 80ms during the 502 windows). The replica bump that didn't help may also appear; it doesn't count against the handoff.
