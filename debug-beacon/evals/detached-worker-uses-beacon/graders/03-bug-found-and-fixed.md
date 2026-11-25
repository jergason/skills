---
type: llm
focus: trace
weight: 1
---

The final message says `job.since` reaches the worker as a string, because the IPC channel serializes the Date to JSON, so `new Date(o.createdAt) > job.since` compares a number with NaN and filters out every order. worker.js is fixed (for example `new Date(job.since)`, or sending a timestamp), and export.js still launches the worker detached with `stdio` ignored.
