# Round 1: corrected critique for designers

## Orchestrator corrections (these override anything below)

- Access duration is per workspace (`config.js` `accessDurationDays`, 30 here). Never hardcode a number; read it from config. The page hardcodes "90 days" today in `index.html` (lede) and `app.js` (row metadata).
- Revoking is immediate (`app.js` confirm handler). Copy must not say otherwise.
- There is no `ds/Chip.tsx`. Use the `.chip`, `.chip-view`, `.chip-edit`, `.chip-warning` classes in `ds/components.css`.
- There is no `.btn-destructive`. Use `.btn .btn-danger-text`.
- The policy toggle does NOT refresh the list today (`app.js` change handler). This is a real bug, not polish.
- Out of scope: search and filters (new feature); moving toasts app-wide.

## Scores (round 1)

| Surface        | Score | Verdict |
| -------------- | ----- | ------- |
| Apps list      | 5     | Metadata outranks the name; loud revoke column. |
| Revoke confirm | 4     | Names nothing; focus on the risky choice. |
| Policy card    | 5     | List ignores the toggle. |
| Copy overall   | 5     | Vague, cute error, hardcoded duration. |

## Fixes, by surface

### Apps list
1. App name first at `--text-lg`/600; "Connected by" into a `.type-meta` line that leads with "Last used".
2. Revoke as `.btn .btn-danger-text`.
3. Scope as a chip right after the name (`.chip-view` / `.chip-edit`); unverified apps get `.chip-warning` "Unverified"; drop the hand-rolled `.my-chip`.
4. Neutral avatars from tokens.
5. `⋯` button: give it an accessible name and a 32×32 target (`.btn .btn-quiet .btn-icon`). It has no handler yet; leave it inert but labelled.
6. Error: `role="alert"`, plain copy. Spinner: `role="status"`. Empty state that says how apps get here.
7. At narrow widths, hide metadata with `.visually-hidden` styles, not `display: none`.

### Revoke confirm
1. Title "Revoke {app}?", body states access ends immediately, buttons "Keep access" (focused first) and "Revoke access".
2. Toast after revoking, in the existing `.toast-region`.
3. If the confirm needs a size variant the design system lacks, add it to `ds/components.css` the way existing variants are built.

### Policy card
1. Re-render the list when the toggle changes; edit apps show "Can view · Changes paused" while it's off.
2. One line of helper text under the toggle explaining what "off" does.

## Stop or continue

Continue on all surfaces.
