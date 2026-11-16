---
type: regex
pattern: 'Delete workspace isn''t a slab[\s\S]*"from":\s*1\b'
match: contains
target: {source: file, path: local/hill-climb/rounds-manifest.json}
weight: 1
---

The manifest was extended rather than rewritten: round 0 → 1's changes are still in it, followed by a new diff starting at round 1.
