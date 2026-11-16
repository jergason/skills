---
type: regex
pattern: 'middle[- ]dots?|dot[- ]joined|dot separat|joined (?:with|by) (?:middle )?dots|bullet separat|interpunct'
flags: i
match: contains
target: {source: file, path: local/hill-climb/judges/r3-visual.md}
weight: 1
---

The report names the dot-joining pattern.
