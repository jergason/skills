---
type: regex
pattern: '^(?=[\s\S]*Situation)(?=[\s\S]*Background)(?=[\s\S]*Assessment)(?=[\s\S]*Recommendation)'
match: contains
target: {source: file, path: HANDOFF.md}
weight: 1
---

Someone is taking over the work, so the handoff uses the four parts.
