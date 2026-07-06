---
name: debugging-tracing-execution
description: Debug by injecting temporary logging to trace execution and examine variables, state, etc. Use when you need to examine the run-time behavior of code, not just look at the code.
allowed-tools: Bash(bun :*), Bash(curl :*), Write, Bash(jq :*), mcp__chrome_devtools__*
---

# Debugging By Tracing Execution

Debug complex runtime issues by injecting temporary logging to trace execution and examine variables, state, etc. This skill provides a structured approach to runtime debugging using a lightweight HTTP log server.

# Hypothesis-Driven Debugging Workflow

1. Form hypotheses
2. Start the harness
3. Inject strategic logs
4. Ask the user to trigger the behavior
5. Curl the log server to analyze results
6. Update hypotheses and repeat as needed

**IMPORTANT**: Form hypotheses BEFORE instrumenting code.

## Step 1: Form Hypotheses

Before touching any code, write down 2-3 specific hypotheses:

- H1: "The user object is null when reaching the save function"
- H2: "The API is being called twice due to a race condition"
- H3: "The timeout is firing before the response arrives"

## Step 2: Start the Harness

```bash
bun run src/index.ts &
echo $! > /tmp/debug-harness.pid
```

### With custom port/log file

```bash
PORT=8080 LOG_FILE=./my-debug.log bun run src/index.ts &
echo $! > /tmp/debug-harness.pid
```

Verify it's running: `curl http://127.0.0.1:7243/health`

## Step 3: Inject Strategic Logs

Add temporary HTTP requests at key points. Always include:

- surrounding `#region agent-debug` and `#endregion` comments
- `location`: file:function:stage (e.g., "auth.ts:login:entry")
- `hypothesisId`: Which hypothesis this tests (e.g., "H1" or "H1,H2")
- `data`: Relevant runtime values

Optionally include a `sessionId` to group related logs if you have a shared ID available.

Use the default http client for the languge you're using. Avoid dependencies.

```typescript
// #region agent-debug
fetch("http://127.0.0.1:7243/log", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "auth.ts:login:beforeSave",
    hypothesisId: "H1",
    message: "Checking user object before save",
    data: { user, isNull: user === null },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion
```

## Step 4: Trigger the Behavior

Use the chrome devtools mcp, functional tests, or, as a last resort, ask the user to trigger the behavior that reproduces the issue

## Step 5: Analyze Results

Fetch logs from the server and analyze them.

```bash
curl -s http://127.0.0.1:7243/logs | jq .
```

Look for:

- Which hypotheses are supported/refuted by the data
- Unexpected values or missing logs (code path not taken)
- Timing patterns

## Step 6: Update Hypotheses and Iterate

Using what you learned, update your hypotheses and repeat the process. Add new logs if needed to test new hypotheses or clarify existing ones. If you have a solution, fix the code.

Re-set the logs between runs to avoid confusion from old data:

```bash
curl -X POST http://127.0.0.1:7243/reset
```

### After Debugging, Remove Debug Code And Stop Harness

When done debugging:

1. Remove all `#region agent-debug` blocks from code
2. Stop the harness: `kill $(cat /tmp/debug-harness.pid) && rm /tmp/debug-harness.pid`

## API Reference

| Endpoint          | Method | Description                  |
| ----------------- | ------ | ---------------------------- |
| `/health`         | GET    | Health check                 |
| `/log`            | POST   | Append log entry             |
| `/log/:sessionId` | POST   | Append with session grouping |
| `/logs`           | GET    | Get all logs as JSON array   |
| `/reset`          | POST   | Clear all logs               |

## Log Entry Fields

- `timestamp` (auto-added if missing)
- `location` - Where in code: `file:function:stage`
- `message` - Human description
- `data` - Any JSON data
- `hypothesisId` - Which hypothesis this tests (H1, H2, etc.)
- `sessionId` - Group related logs
