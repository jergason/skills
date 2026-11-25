---
type: regex
pattern: '^(?:[^\n]*\n){60}'
match: not_contains
target: {source: file, path: src/jobs/README.md}
weight: 1
---

The README is under 60 lines.
