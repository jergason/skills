---
type: regex
pattern: 'originally|in 2025|\bConclusion\b|robust|seamless|crucial'
flags: i
match: not_contains
target: {source: file, path: src/notifier/README.md}
weight: 1
---

The History and Conclusion sections and the marketing filler are gone.
