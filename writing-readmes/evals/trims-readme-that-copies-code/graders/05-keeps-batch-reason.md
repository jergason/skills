---
type: regex
pattern: 'receipt'
flags: i
match: contains
target: {source: file, path: src/notifier/README.md}
weight: 1
---

The reason SMS uses the batch endpoint (the single-send endpoint returns no delivery receipt) stays, because it's a constraint the code doesn't explain.
