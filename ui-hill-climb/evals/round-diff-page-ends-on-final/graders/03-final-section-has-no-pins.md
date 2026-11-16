---
type: regex
pattern: 'id="overall"[\s\S]*class="pin"'
match: not_contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

Nothing after the start of the round 0 → final section is a pin: the final comparison is unmarked.
