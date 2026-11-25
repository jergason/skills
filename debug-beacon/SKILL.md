---
name: debug-beacon
description: See what code does at runtime when you can't examine its output directly. Run a tiny local HTTP log server, instrument code to post to the server, read logs by querying the server. Use when trying to trace execution of code, debug, examine data flowing through the program, and you don't have direct access to a debugger or more immediate tool.
allowed-tools: Bash(bun :*), Bash(curl :*), Write, Bash(jq :*), mcp__chrome_devtools__*
---

# Debug by tracing execution

If you can run the code and read its output, just add prints. You don't need this skill. It's for when the output lands somewhere you can't see, like a browser console, the user's terminal, or a process you didn't start. Anything that can make an HTTP request can send logs to a place you can read.

## Start the server

Run it in the background:

```bash
bun run <this skill's directory>/server.ts   # env: PORT=7243, LOG_FILE=/tmp/agent-debug.log, HOST=127.0.0.1
curl -s http://127.0.0.1:7243/health        # OK
```

## Send logs

POST a JSON object to `/log` using the language's built-in HTTP client, so you don't add a dependency. Swallow errors so logging can't break the app. Tag each call with an `agent-debug` comment so you can find and delete them later. The server adds a `timestamp` if you leave it out.

```ts
// agent-debug
fetch("http://127.0.0.1:7243/log", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ at: "auth.ts:login", user }),
}).catch(() => {});
```

## Read and reset

```bash
curl -s http://127.0.0.1:7243/logs | jq .     # every entry, as a JSON array
curl -s -X POST http://127.0.0.1:7243/reset   # clear before the next run
```

Trigger the behavior yourself when you can (a test, a script, browser automation) before asking the user to click around.

## Clean up

Delete every `agent-debug` call and stop the server.
