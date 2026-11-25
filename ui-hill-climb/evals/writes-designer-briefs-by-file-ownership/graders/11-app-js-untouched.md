---
type: regex
pattern: '<button class="revoke" data-id='
match: contains
target: {source: file, path: app.js}
weight: 1
---

app.js wasn't edited: writing briefs doesn't change the page.
