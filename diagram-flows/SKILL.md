---
name: diagram-flows
description: Use when visualizing architecture, code flow, state machines, sequences, entity relationships, or bar and line charts in the terminal. Renders Mermaid diagrams and charts as ASCII/unicode art. Triggers on "draw a diagram", "visualize this flow", "show me the architecture", "sequence diagram", "flowchart", "state machine", "ER diagram", "terminal chart".
allowed-tools: Bash(bun run render.ts *)
---

# Render Mermaid Diagrams as ASCII

Render mermaid diagrams directly in the terminal using beautiful-mermaid. Output unicode box-drawing characters that display correctly in terminals and markdown.

When writing to markdown, include a collapsed section that has the mermaid source code. Do not include this when rendering in the terminal.

Use these to print in the terminal or add in to markdown files you're generating.

## Running the Renderer

Run:

```bash
bun run render.ts "graph LR
A --> B --> C"
```

Use newlines between the header and nodes, not semicolons.

## Supported Diagram Types

- **Flowcharts**: `graph TD` (top-down), `graph LR` (left-right), `graph BT`, `graph RL`
- **State diagrams**: `stateDiagram-v2`
- **Sequence diagrams**: `sequenceDiagram`
- **Class diagrams**: `classDiagram`
- **ER diagrams**: `erDiagram`
- **Charts**: `xychart-beta` — bar, line, or combined charts; use `xychart-beta horizontal` for horizontal charts

## Charts

Use `bar` or `line` for a single series, or combine them. Each series must have one value per x-axis label.

```bash
bun run render.ts 'xychart-beta
  x-axis [Jan, Feb, Mar]
  y-axis "Count" 0 --> 30
  bar [10, 20, 30]
  line [8, 22, 25]'
```

## Options

- `--padding-x N` - horizontal node spacing (default: 5)
- `--padding-y N` - vertical node spacing (default: 5)

## When to Use

- Planning mode: visualize architecture before implementing
- Explaining code flow or data relationships
- Documenting system design
- Quick sketches of state machines, sequences, or entity relationships
- Bar and line charts for comparing values or showing trends in the terminal
