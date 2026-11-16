---
type: llm
focus: trace
weight: 1
---

The final app no longer hardcodes "90 days"; any duration copy reads `orgConfig.accessDurationDays` or drops the number.
