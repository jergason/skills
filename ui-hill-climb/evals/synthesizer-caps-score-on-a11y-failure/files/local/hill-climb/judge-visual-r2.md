# Visual craft judge, round 2

| Surface        | Score   | Verdict                                                               |
| -------------- | ------- | --------------------------------------------------------------------- |
| Apps list      | 5 → 10  | Name-first rows, quiet text-button revoke, chips do the work. Lovely. |
| Revoke confirm | 4 → 9.5 | Clean, one focal point.                                               |

## Issues

1. Revoke confirm: the primary button label "Revoke Linear's access to this workspace" wraps to two lines in the 420px dialog. Shorten it to "Revoke" so the button stays one line.
2. Apps list: the scope chip and the "Unverified" chip sit 6px apart (`.row-chips`); use `--space-2` (8px) to match the gap between name and chip.

## Stop or continue

Apps list: stop. Revoke confirm: one small fix (button label), then stop.
