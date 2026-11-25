---
tags: [debug-beacon, needs-bun]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

the nightly export started writing out/report.csv with only the header row. data/orders.json definitely has orders after the since date. export.js hands the job to worker.js over IPC and runs it detached with its output thrown away, so I can't see what the worker is doing. before you change anything, show me what the worker actually receives at runtime. i've been burned by guesses from reading the code. then fix it. don't change how export.js launches the worker (detached, stdio ignored), ops depends on that. run it with `node export.js 2026-11-01`
