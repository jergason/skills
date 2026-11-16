# Hill-climb notes (connected apps page)

Surfaces: Apps list (`apps`), Revoke confirm (`revoke-confirm`), Policy card (`policy`).

## Scores of record

| Surface        | R0 | R1  | R2          |
| -------------- | -- | --- | ----------- |
| Apps list      | 5  | 7.5 | judging now |
| Revoke confirm | 4  | 8   | judging now |
| Policy card    | 6  | 5.5 | judging now |

R1 verdicts:
- Apps list: "Name-first rows read well; revoke is finally quiet. Chips need a touch more spacing."
- Revoke confirm: "Names the app and the consequence; focus starts on Keep access."
- Policy card: "Regressed: the new helper text runs to three lines and pushes the toggle below the fold at 900px."

## Round 0 → 1: what changed

Screenshots: `shots/r0-apps.png` → `shots/r1-apps.png`, `shots/r0-revoke-confirm.png` → `shots/r1b-revoke-confirm.png`. New in round 1: `shots/r1-apps-phone.png` (390×844). The policy card has no screenshots this round.

Heads up: `shots/r1-revoke-confirm.png` is stale. It was captured before the focus fix landed, so it doesn't show focus on Keep access. `r1b-revoke-confirm.png` is the re-shoot; use that one.

Apps list:
1. App name now leads each row. Before: the person who connected it was the bold line and the app name was grey under it. After: app name at 16px/600, "Connected by …" moved into the quiet metadata line.
2. Revoke is quiet. Before: a column of red outlined buttons, the loudest thing on the page. After: small `.btn-danger-text` buttons.
3. Permission is a chip. Before: "This app can view and edit" buried in the caption. After: a `.chip-edit` / `.chip-view` chip right after the name.
4. Avatars are neutral. Before: a different bright color per row. After: grey initials.
5. Delete workspace is no longer a big red slab. Before: solid red button. After: outlined neutral button.

Revoke confirm:
1. Buttons say what they do. Before: "OK" (primary) and "Cancel". After: "Keep access" and "Revoke access" in danger text.
2. Focus starts on the safe choice. Before: autofocus on OK. After: autofocus on "Keep access", with a visible focus ring.
