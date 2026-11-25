---
type: regex
pattern: 'border-bottom: 2px solid var\(--color-text\)'
match: contains
target: {source: file, path: styles.css}
weight: 1
---

The page wasn't edited: the loud table-header rule is still in styles.css.
