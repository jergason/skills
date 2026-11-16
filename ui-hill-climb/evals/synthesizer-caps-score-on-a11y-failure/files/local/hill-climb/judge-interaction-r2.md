# Interaction and states judge, round 2

| Surface        | Score   | Verdict                                                                 |
| -------------- | ------- | ----------------------------------------------------------------------- |
| Apps list      | 5 → 9.5 | Policy toggle re-renders the list; "Changes paused" shows. Toast confirms revoke. Explicit view states. |
| Revoke confirm | 4 → 9.5 | Focus starts on "Keep access". Escape cancels.                          |

## Issues

1. Optional: the toast disappears after 3s; 5s would be calmer for a destructive action.

## Rulings on departures

- Designer kept the confirm for every revoke instead of only for edit apps: right call, revoking is immediate and affects the whole workspace.

## Stop or continue

Both surfaces: stop.
