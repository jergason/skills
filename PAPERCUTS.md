# Papercuts

Small frictions whose plausible fixes would change version-controlled files in this repository. Logged via `papercuts`.

2026-11-25T20:09:16.230Z - claude-opus-5-5 - Jamison Dance

ui-hill-climb/evals: most llm graders use `focus: trace`, but `claude plugin eval` elides the middle of long traces (e.g. "[…274 messages elided…]"), so graders checking mid-run content can fail or pass blind. Point them at a fixed output file (`{source: file, path: ...}`) or `last_message`; note `focus: files` only lists created file names, not contents.

