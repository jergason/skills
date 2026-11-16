---
type: regex
pattern: 'id="overall"[\s\S]*src="shots/r0-apps\.png"[\s\S]*src="shots/r2-apps\.png"'
match: contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The final comparison shows the Apps list's round 0 screenshot followed by its round 2 screenshot.
