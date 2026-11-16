---
type: regex
pattern: '"overall"\s*:\s*\{'
match: contains
target: {source: file, path: local/hill-climb/rounds-manifest.json}
weight: 1
---

The manifest spells out the final comparison under "overall" rather than leaving the script to guess it.
