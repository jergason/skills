---
type: regex
pattern: 'id="overall"[\s\S]*src="shots/r1-'
match: not_contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The final comparison no longer shows round 1 screenshots.
