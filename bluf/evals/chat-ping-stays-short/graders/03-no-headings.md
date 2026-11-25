---
type: regex
pattern: '^\s*#{1,6}\s|\b(?:Situation|Background|Assessment|Recommendation)\s*:'
flags: im
match: not_contains
weight: 1
---

No markdown headings and no Situation/Background/Assessment/Recommendation sections: a one-line ask gets the short form.
