---
type: regex
pattern: 'r1-(?:<surface>|[a-z])'
flags: i
match: contains
target: {source: file, path: local/hill-climb/designer-briefs.md}
weight: 1
---

The briefs ask for final screenshots named `r1-<surface>[-<state>].png` (round 1's fixes, per `judge-r1.md`).
