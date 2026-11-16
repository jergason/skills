---
type: regex
pattern: 'left[- ]border|border-left|left[- ]edge stripe|left stripe|left[- ]rule|coloured stripe|colored stripe'
flags: i
match: contains
target: {source: file, path: local/hill-climb/judges/r3-visual.md}
weight: 1
---

The report names the coloured left border on the callout.
