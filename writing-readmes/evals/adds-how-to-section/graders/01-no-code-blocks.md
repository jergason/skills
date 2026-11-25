---
type: regex
pattern: '```(?:ts|typescript)\b'
match: not_contains
target: {source: file, path: src/webhooks/README.md}
weight: 1
---

The README pastes no TypeScript. The new section points at a real provider file instead.
