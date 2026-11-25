---
type: regex
pattern: '30[_,]?000|\b30 ?(?:s|sec|secs|seconds)\b|\b(?:4|four) (?:attempts|times|tries)\b'
flags: i
match: not_contains
target: {source: file, path: src/jobs/README.md}
weight: 1
---

The README doesn't copy the default timeout (30 seconds) or the attempt limit (4) out of defineJob.ts.
