---
type: regex
pattern: 'agent-debug|7243|fetch\('
match: not_contains
target: {source: file, path: scripts/cart-total.js}
weight: 1
---

The script never got HTTP log calls.
