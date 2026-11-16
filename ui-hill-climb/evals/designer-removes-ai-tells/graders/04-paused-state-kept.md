---
type: regex
pattern: '\bpaused\b'
flags: i
match: contains
target: {source: file, path: app.js}
weight: 1
---

The paused state is still shown on the edit apps ("Changes paused", "Edits paused" or similar wording).
