---
type: llm
focus: {source: file, path: src/notifier/README.md}
weight: 1
---

The README does not restate the two rules docs/Notifier.md owns: that a channel builds the provider payload field by field, and that defineChannel requires a positive rate limit because the provider suspends accounts that send in bursts. The README links to docs/Notifier.md (any relative link to Notifier.md passes).
