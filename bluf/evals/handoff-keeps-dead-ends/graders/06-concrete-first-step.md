---
type: llm
focus: trace
weight: 1
---

The Recommendation names a concrete first step a fresh session could start on without asking, such as setting `server.keepAliveTimeout` above 60s (and `headersTimeout` above that) in `src/server.ts` and testing on staging, or writing the idle-burst load script to reproduce. It names the branch `investigate/resize-502s`. "Keep investigating" or "look into keep-alive" alone doesn't count.
