---
type: regex
pattern: 'border-left: 4px solid #ea580c'
match: contains
target: {source: file, path: styles.css}
weight: 1
---

The judge didn't edit the page: the callout's left border is still in styles.css.
