---
type: regex
pattern: 'id="overall"[\s\S]*src="shots/r0-revoke-confirm\.png"[\s\S]*src="shots/r2-revoke-confirm\.png"'
match: contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The final comparison shows the Revoke confirm's round 0 screenshot followed by its round 2 screenshot.
