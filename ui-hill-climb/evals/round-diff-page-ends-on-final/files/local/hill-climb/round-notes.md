# Hill-climb notes (connected apps page)

Surfaces: Apps list (`apps`), Revoke confirm (`revoke-confirm`), Policy card (`policy`).
Screenshots are 1440×1000, in `shots/`. Each round has `r<N>-apps.png` and `r<N>-revoke-confirm.png`. The Policy card was never screenshotted on its own.

## Scores of record

| Surface        | R0 | R1  | R2  |
| -------------- | -- | --- | --- |
| Apps list      | 5  | 7.5 | 8.5 |
| Revoke confirm | 4  | 7.5 | 9   |
| Policy card    | 6  | 8   | 8   |

R2 verdicts (latest):
- Apps list: "Calm rows, quiet revoke, a real menu button. Stop."
- Revoke confirm: "Says what happens and when; the safe choice is first. Stop."
- Policy card: "Helper text explains the toggle. Nothing left in scope. Stop."

## Round 0 → 1: what changed

Apps list (`shots/r0-apps.png` → `shots/r1-apps.png`):
1. App name leads each row. Before: "Connected by …" was the bold line and the app name was grey under it. After: the app name is the strong line, and "Connected by …" moved to the end of the quiet metadata line.
2. Revoke is quiet. Before: a column of red outlined buttons. After: small red text buttons.
3. Permission is a chip. Before: "This app can view and edit" buried in the caption. After: a "Can view and edit" / "Can view" chip right after the name, plus an "Unverified" chip where it applies.
4. Avatars are neutral. Before: a different bright colour per row. After: grey initials.
5. Delete workspace is no longer a red slab. Before: a solid red button under "Danger zone". After: a red text button with a one-line explanation.
6. Access duration comes from the workspace setting. Before: "Access lasts 90 days" hardcoded in the subtitle and on every row. After: "Access lasts 30 days unless someone reconnects" in the subtitle only.

Revoke confirm (`shots/r0-revoke-confirm.png` → `shots/r1-revoke-confirm.png`):
1. Says what happens. Before: "Are you sure?" with nothing else. After: "Revoke Linear?" with "Linear won't be able to reach your data."
2. Buttons say what they do. Before: "OK" and "Cancel". After: "Keep access" and "Revoke Linear's access to this workspace".

Policy card: helper text added under the toggle ("When this is off, apps that can edit are limited to viewing."). No screenshot of its own; it's visible at the top of the apps shots.

## Round 1 → 2: what changed

Apps list (`shots/r1-apps.png` → `shots/r2-apps.png`):
1. The ⋯ menu is a real 32×32 icon button with a name, sitting closer to Revoke. Before: a bare 20×20 glyph far from Revoke.

Revoke confirm (`shots/r1-revoke-confirm.png` → `shots/r2-revoke-confirm.png`):
1. Body says when. Before: "Linear won't be able to reach your data." After: "Linear loses access to this workspace right away."
2. Shorter confirm label. Before: "Revoke Linear's access to this workspace". After: "Revoke access".

Policy card: no changes in round 2.
