---
type: regex
pattern: 'last used[\s\S]*connected by|connected by[\s\S]*last used'
flags: i
match: contains
target: {source: file, path: app.js}
weight: 1
---

The row still shows both when the app was last used and who connected it, in either order.
