---
type: regex
pattern: '\b(?:BLUF|SBAR)\b|bottom line\s*:'
flags: i
match: not_contains
target: {source: file, path: HANDOFF.md}
weight: 1
---

HANDOFF.md never labels anything "BLUF", "SBAR" or "Bottom line:".
