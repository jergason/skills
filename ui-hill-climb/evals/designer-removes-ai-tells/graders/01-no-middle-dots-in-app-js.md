---
type: regex
pattern: '·|&middot;|\\u00b7|&#183;'
match: not_contains
target: {source: file, path: app.js}
weight: 1
---

app.js no longer joins facts with middle dots (the row metadata line and the paused chip both did).
