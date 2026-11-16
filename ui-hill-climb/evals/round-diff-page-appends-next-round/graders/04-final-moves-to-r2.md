---
type: regex
pattern: 'id="overall"[\s\S]*src="shots/r0-apps\.png"[\s\S]*src="shots/r2-apps\.png"[\s\S]*src="shots/r0-revoke-confirm\.png"[\s\S]*src="shots/r2-revoke-confirm\.png"'
match: contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The final comparison now pairs each surface's round 0 screenshot with its round 2 screenshot.
