# debug-beacon

A skill and a tiny log server for when an agent needs to see what code does at runtime but can't read its output. That covers code running in a browser, an app you're clicking through, a child process, or a server whose logs are too noisy to use. The agent adds HTTP calls that POST JSON to the server, triggers the behavior, then reads the logs back with curl. It's like Cursor's Debug Mode, but for Claude Code and friends.

Requires [Bun](https://bun.sh). Install it along with the rest of this repo's skills (see the [top-level README](../README.md)).

## Running the server

```sh
bun run server.ts
PORT=8080 LOG_FILE=./debug.log bun run server.ts
```

| Variable   | Default                | Notes                                                                       |
| ---------- | ---------------------- | --------------------------------------------------------------------------- |
| `PORT`     | `7243`                 | Cursor's debug server uses the same port, so don't run both at once.        |
| `LOG_FILE` | `/tmp/agent-debug.log` | One JSON entry per line. Cleared when the server starts.                    |
| `HOST`     | `127.0.0.1`            | Set to `0.0.0.0` to take logs from another device, like a phone on your LAN. |

## Endpoints

| Method | Path      | What it does                                                    |
| ------ | --------- | --------------------------------------------------------------- |
| `GET`  | `/health` | Returns `OK`.                                                   |
| `POST` | `/log`    | Appends a JSON object. Adds `timestamp` (ms) if it's missing.  |
| `GET`  | `/logs`   | Returns every entry as a JSON array.                            |
| `POST` | `/reset`  | Clears the log.                                                 |

Every response allows any origin, so browser code can post logs.

## Example

```sh
curl -X POST http://127.0.0.1:7243/log \
  -H 'Content-Type: application/json' \
  -d '{"at":"checkout.ts:submit","total":42}'

curl -s http://127.0.0.1:7243/logs
# [{"timestamp":1764093600000,"at":"checkout.ts:submit","total":42}]
```

## License

MIT
