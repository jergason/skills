---
type: regex
pattern: 'agent-debug|7243|appendFile'
match: not_contains
target: {source: file, path: export.js}
weight: 1
---

Every agent-debug log call, HTTP or file, was removed from export.js.
