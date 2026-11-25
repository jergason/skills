---
type: regex
pattern: '<details>[\s\S]*?(?:graph|flowchart|sequenceDiagram|stateDiagram|classDiagram|erDiagram|xychart)[\s\S]*?</details>'
match: contains
target: {source: file, path: docs/ARCHITECTURE.md}
weight: 1
---

The Mermaid source sits in a collapsed `<details>` block.
