---
type: regex
pattern: 'btn-danger-text'
match: contains
target: {source: file, path: app.js}
weight: 1
---

Revoke still reads as destructive: the row button uses the design system's quiet danger class (`.btn-danger-text`, the `--color-danger` text button) rather than turning neutral grey.
