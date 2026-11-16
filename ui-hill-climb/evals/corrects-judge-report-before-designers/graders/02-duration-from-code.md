---
type: llm
focus: trace
weight: 1
---

The corrections reject "Access expires after 90 days", citing config.js (`accessDurationDays`, set per workspace, 30 here), AND point out that the current page already hardcodes 90 days in both the index.html lede and the app.js row metadata.
