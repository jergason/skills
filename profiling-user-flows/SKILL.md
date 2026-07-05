---
name: profiling-user-flows
description: Profile frontend performance of user flows using Chrome DevTools MCP. Drives the browser through a described interaction, measures long tasks, DOM size, forced reflows, and INP. Use when asked to "profile", "measure performance", "trace a user flow", "why is this slow", "check if this is laggy", or debug frontend jank/hangs. Requires chrome-devtools MCP server.
allowed-tools: mcp__chrome-devtools__*
---

# Profiling User Flows

Profile frontend performance by driving the browser through a user flow with Chrome DevTools MCP, collecting timing data, Chrome traces, and performance insights.

## Input

`$ARGUMENTS` describes the user flow or performance concern to investigate. Examples:

- "adding a new language in the translations editor"
- "opening a large form in the form builder"
- "the submissions table when filtering by date"
- "http://localhost:8000/forms — click Edit on any form, then switch to Workflow tab"

## Workflow

Follow these phases in order. Use the checklist to track progress.

```
Profiling Progress:
- [ ] Phase 1: Plan — understand the flow, identify pages and interactions
- [ ] Phase 2: Instrument — inject JS perf tracking before the interaction
- [ ] Phase 3: Trace — start Chrome trace, drive the flow, stop trace
- [ ] Phase 4: Measure — collect timing data, long tasks, DOM stats
- [ ] Phase 5: Analyze — drill into trace insights, identify root causes
- [ ] Phase 6: Report — summarize findings with numbers and recommendations
```

### Phase 1: Plan

Read `$ARGUMENTS` and determine:

1. What user to login as. If not specified, use jamison+test2@test.droplet.io, password testtest.
2. **Starting URL** — where to navigate. If not given, ask or use the current page.
3. **Interaction steps** — the sequence of clicks, fills, waits that constitute the flow.
4. **What "done" looks like** — text that appears, element that renders, network request that completes.

Use `mcp__chrome-devtools__list_pages` to see what's already open. Navigate with `mcp__chrome-devtools__navigate_page` if needed. Take a snapshot with `mcp__chrome-devtools__take_snapshot` to understand the page structure.

### Phase 2: Instrument

Before triggering the interaction, inject performance tracking. See [instrumentation.md](instrumentation.md) for the JS snippets.

Inject using `mcp__chrome-devtools__evaluate_script`:

1. **Long Task Observer** — captures tasks >50ms on the main thread
2. **Mutation Observer** — tracks when the DOM first/last updates after interaction
3. **Timing markers** — `performance.mark()` before and after the interaction
4. **Network watcher** — optional, tracks fetch/XHR during the flow

### Phase 3: Trace

1. Start a Chrome performance trace:

   ```
   mcp__chrome-devtools__performance_start_trace
     autoStop: false
     reload: false
     filePath: local/trace-<descriptive-name>.json.gz
   ```

   Use `autoStop: false` and `reload: false` — you are driving the interaction manually.

2. Record the start timestamp via `evaluate_script`:

   ```js
   () => {
     window.__perfStart = performance.now();
     return "started";
   };
   ```

3. **Drive the user flow step by step:**
   - `take_snapshot` to find elements by uid
   - `click`, `fill`, `type_text`, `press_key` to interact
   - `wait_for` with appropriate text/timeout between steps
   - For slow operations, use generous timeouts (15-30s)

4. After the flow completes (expected text/element appears), collect measurements via `evaluate_script` — see [instrumentation.md](instrumentation.md) for the collection snippet.

5. Stop the trace:
   ```
   mcp__chrome-devtools__performance_stop_trace
     filePath: local/trace-<descriptive-name>.json.gz
   ```

### Phase 4: Measure

After stopping the trace, you get back a summary with metrics and insight sets. Also collect:

1. **JS timing data** from the injected instrumentation (via `evaluate_script`)
2. **Console errors** via `mcp__chrome-devtools__list_console_messages` with `types: ["error", "warn"]`
3. **Network requests** during the flow via `mcp__chrome-devtools__list_network_requests` filtered to `["xhr", "fetch"]`

Key numbers to extract:

- Total wall-clock time for the interaction
- Number and duration of long tasks (>50ms)
- Longest single long task duration
- Time to first DOM mutation after interaction start
- Time to last DOM mutation (visual completion)
- Total DOM element count
- INP score from the trace

### Phase 5: Analyze

Use `mcp__chrome-devtools__performance_analyze_insight` on each available insight from the trace summary. The most relevant insights for user flow profiling:

| Insight               | When to check                                            |
| --------------------- | -------------------------------------------------------- |
| `INPBreakdown`        | Always — shows input delay vs processing vs presentation |
| `DOMSize`             | When DOM is large or renders are slow                    |
| `ForcedReflow`        | When layout thrashing is suspected                       |
| `LongAnimationFrames` | When jank/dropped frames are visible                     |
| `ThirdParties`        | When external scripts may contribute                     |
| `DocumentLatency`     | For page load flows                                      |
| `LCPBreakdown`        | For page load flows                                      |

### Phase 6: Report

Present findings as a structured summary. See [report-template.md](report-template.md) for the format.

Key elements:

- **Timing table** with measured durations
- **Long tasks breakdown** with durations and relative timestamps
- **Root cause analysis** from trace insights
- **Dev vs prod estimate** — React dev mode adds ~2-3x overhead (StrictMode double render, extra validation). Note this clearly.
- **Recommendations** ranked by estimated impact

## Tips

- For interactions that might freeze the page, use `wait_for` with a 30s timeout
- If `wait_for` times out, take a screenshot to see the current state
- Prefer `take_snapshot` over `take_screenshot` for finding interactive elements
- Use `includeSnapshot: true` on clicks to get the updated page state
- To test CPU-constrained scenarios, use `mcp__chrome-devtools__emulate` with `cpuThrottlingRate: 4`
- To compare dev vs prod, note that Vite dev builds include React.StrictMode overhead
- Save traces to `local/` directory (gitignored)
