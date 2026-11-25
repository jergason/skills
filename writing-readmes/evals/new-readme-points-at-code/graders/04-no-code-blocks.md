---
type: regex
pattern: '```(?:ts|typescript|js|javascript)\b'
match: not_contains
target: {source: file, path: src/jobs/README.md}
weight: 1
---

The README pastes no TypeScript or JavaScript. It points at a real job file instead.
