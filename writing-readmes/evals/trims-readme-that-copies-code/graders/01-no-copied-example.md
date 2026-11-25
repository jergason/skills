---
type: regex
pattern: '```(?:ts|typescript)\b'
match: not_contains
target: {source: file, path: src/notifier/README.md}
weight: 1
---

The README has no TypeScript code block. The defineChannel example is replaced by a pointer to a real channel file.
