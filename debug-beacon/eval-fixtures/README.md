# debug-beacon eval notes

`claude plugin eval` runs shell commands in a sandbox that blocks binding local ports, and no case or command option turns that off. So in `detached-worker-uses-beacon` the log server can't start, and the case really tests the skill's fallback: try the server, notice it can't listen, log to a file instead, show what the worker received, and clean up. The server path itself is checked outside evals (start `server.ts`, POST to `/log`, read `/logs`).

`visible-output-skips-beacon` is the negative case: output is already visible, so no server and no logging calls.
