---
type: llm
focus: trace
weight: 1
---

The corrections name all three design-system references that don't exist and map each to the real one: `ds/Chip.tsx` → `.chip`/`.chip-view`/`.chip-edit`, `.btn-destructive` → `.btn-danger-text`, `--color-text-subtle` → `--color-text-muted`. Missing any one fails.
