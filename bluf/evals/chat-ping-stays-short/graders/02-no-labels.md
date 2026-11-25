---
type: regex
pattern: '\b(?:BLUF|SBAR)\b|bottom line\s*:'
flags: i
match: not_contains
weight: 1
---

The reply never labels itself "BLUF", "SBAR" or "Bottom line:".
