---
type: regex
pattern: '^(?![\s\S]*notifier sent)[\s\S]*deliver\(\) finished'
match: contains
target: {source: file, path: src/notifier/README.md}
weight: 1
---

The failed-delivery log query stays, and it filters on 'deliver() finished', the message send.ts logs, not the stale 'notifier sent'.
