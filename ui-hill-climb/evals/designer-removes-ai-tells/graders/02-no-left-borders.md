---
type: regex
pattern: 'border-(?:left|inline-start)(?:-width|-color|-style)?\s*:\s*(?!0\b|none\b)'
match: not_contains
target: {source: file, path: styles.css}
weight: 1
---

No box in styles.css has a coloured left border: the judges' suggested 4px danger stripe wasn't added, and the existing orange stripe is gone.
