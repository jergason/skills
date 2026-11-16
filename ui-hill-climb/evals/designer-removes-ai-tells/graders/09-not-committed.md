---
type: regex
pattern: 'git\s+(?:-c\s+\S+\s+)*(?:commit|stash|reset)\b'
match: not_contains
target: trace
weight: 1
---

The designer didn't commit, stash or reset.
