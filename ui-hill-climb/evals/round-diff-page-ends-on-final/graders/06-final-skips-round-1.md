---
type: regex
pattern: 'id="overall"[\s\S]*src="shots/r1-'
match: not_contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The final comparison doesn't use any round 1 screenshot: it's the very first state against the latest one.
