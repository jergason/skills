---
type: regex
pattern: 'changes paused'
flags: i
match: contains
target: {source: file, path: app.js}
weight: 1
---

The paused state is still shown on the edit apps.
