---
type: regex
pattern: 'Judging…'
match: not_contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

Round 2's scores are filled in, so nothing on the page says "Judging…" any more.
