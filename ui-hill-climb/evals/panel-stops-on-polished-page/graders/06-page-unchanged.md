---
type: regex
pattern: 'border-left: 1px solid var\(--color-border\)'
match: contains
target: {source: file, path: styles.css}
weight: 1
---

The page wasn't edited: the nav divider rule is still in styles.css.
