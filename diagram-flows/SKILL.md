---
name: diagram-flows
description: Use when visualizing architecture, code flow, state machines, sequences, entity relationships, or bar and line charts in the terminal. Renders Mermaid diagrams and charts as ASCII/unicode art. Triggers on "draw a diagram", "visualize this flow", "show me the architecture", "sequence diagram", "flowchart", "state machine", "ER diagram", "terminal chart".
allowed-tools: Bash(bun run ${CLAUDE_SKILL_DIR}/render.ts *)
---

# Render Mermaid diagrams as ASCII

## Render

Write the Mermaid source to a `.mmd` file (in your scratchpad or temp directory, not the user's project), then run:

```bash
bun run ${CLAUDE_SKILL_DIR}/render.ts --file <path>/diagram.mmd
```

Put each statement on its own line, not separated by semicolons:

```
graph LR
  A --> B --> C
```

Bash output isn't always shown to the user, so paste the rendered diagram into your reply in a code block.

When you add a diagram to a markdown file, put the rendered diagram in a code block and the Mermaid source in a collapsed `<details>` block right after it. Don't add the `<details>` block when you only show the diagram in the terminal.

## Supported diagram types

- **Flowcharts**: `graph TD` (top-down), `graph LR` (left-right), `graph BT`, `graph RL`
- **State diagrams**: `stateDiagram-v2`
- **Sequence diagrams**: `sequenceDiagram`
- **Class diagrams**: `classDiagram`
- **ER diagrams**: `erDiagram`
- **Charts**: `xychart-beta` — bar, line, or combined charts; use `xychart-beta horizontal` for horizontal charts

## Charts

Use `bar` or `line` for a single series, or combine them. Each series must have one value per x-axis label.

```
xychart-beta
  x-axis [Jan, Feb, Mar]
  y-axis "Count" 0 --> 30
  bar [10, 20, 30]
  line [8, 22, 25]
```

## Options

- `--padding-x N` - horizontal node spacing (default: 5)
- `--padding-y N` - vertical node spacing (default: 5)
