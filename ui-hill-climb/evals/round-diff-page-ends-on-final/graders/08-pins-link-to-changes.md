---
type: regex
pattern: '<a class="pin" href="#d1-2-\d+-c\d+"'
match: contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The round 1 → 2 section has numbered pins, rendered as links to their changes.
