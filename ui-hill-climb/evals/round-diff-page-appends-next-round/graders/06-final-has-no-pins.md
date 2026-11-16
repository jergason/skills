---
type: regex
pattern: 'id="overall"[\s\S]*class="pin"'
match: not_contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The final comparison stays unmarked.
