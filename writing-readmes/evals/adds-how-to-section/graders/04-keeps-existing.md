---
type: regex
pattern: '^(?=[\s\S]*pnpm webhooks:replay)(?=[\s\S]*401)'
match: contains
target: {source: file, path: src/webhooks/README.md}
weight: 1
---

The existing sections stay: the 401 for a bad signature and the replay recipe.
