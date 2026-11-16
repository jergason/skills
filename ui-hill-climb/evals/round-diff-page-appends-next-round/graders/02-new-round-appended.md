---
type: regex
pattern: 'Round 0 → Round 1</h2>[\s\S]*Round 1 → Round 2</h2>[\s\S]*Round 0 → Final</h2>'
match: contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

The new Round 1 → Round 2 section comes after the existing Round 0 → Round 1 section, and the final comparison still comes last.
