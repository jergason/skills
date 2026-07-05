# Report Template

Use this structure when presenting profiling results.

## Format

```markdown
## Performance Profile: <flow description>

**Environment**: <dev/prod> | <URL> | <browser>
**Trace file**: `local/trace-<name>.json.gz`

### Timing Summary

| Metric                    | Value |
| ------------------------- | ----- |
| Total wall-clock time     | Xms   |
| Time to first DOM update  | Xms   |
| Time to visual completion | Xms   |
| INP (from trace)          | Xms   |
| DOM elements              | X     |
| DOM depth                 | X     |

### Long Tasks

| #   | Duration | Starts at | Likely cause  |
| --- | -------- | --------- | ------------- |
| 1   | Xms      | +Xms      | <description> |
| 2   | Xms      | +Xms      | <description> |

Total long task time: Xms across N tasks
Longest single task: Xms

### Network Requests During Flow

| URL      | Duration | Status |
| -------- | -------- | ------ |
| /api/... | Xms      | 200    |

### Trace Insights

Summarize findings from `performance_analyze_insight` calls:

- **INP Breakdown**: input delay Xms, processing Xms, presentation Xms
- **DOM Size**: X elements, depth X, largest parent has X children
- **Forced Reflows**: Xms total, top offenders: ...
- etc.

### Dev vs Prod Estimate

React dev mode adds ~2-3x overhead from StrictMode double-rendering and
extra validation. Estimated prod timings:

- Longest task: ~Xms (dev) → ~Xms (prod estimate)
- Total long task time: ~Xms (dev) → ~Xms (prod estimate)

Note: this is a rough estimate. Profile a prod build for accurate numbers.

### Root Causes

1. **<cause>** — <explanation with supporting data>
2. **<cause>** — <explanation with supporting data>

### Recommendations

Ranked by estimated impact:

1. **<recommendation>** — <expected improvement>. <effort estimate if obvious>.
2. **<recommendation>** — <expected improvement>.
3. **<recommendation>** — <expected improvement>.
```

## Guidelines

- Lead with numbers, not opinions
- Every claim needs a measurement to back it up
- Distinguish between "measured" and "estimated" numbers
- Note when something is a dev-mode artifact vs a real prod issue
- Don't recommend optimizations unless the numbers justify it
- For interactions under 200ms, the flow is fine — say so and move on
