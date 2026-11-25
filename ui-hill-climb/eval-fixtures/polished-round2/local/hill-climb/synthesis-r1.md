# Round 1 synthesis (score of record)

Screenshots judged: `shots/r1-apps.png`, `shots/r1-revoke-confirm.png`.

| Surface        | Score     | Verdict                                                                                                     |
| -------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| Apps list      | 5 → 7.5   | Calm and readable now, but two AI design tells, a dead ⋯ button, and the page floats without its settings shell. |
| Revoke confirm | 5.5 → 8   | Names the app and says access ends right away. Doesn't say what the app stops being able to do.              |
| Policy card    | 6 → 7     | Reads like a stray checkbox: label and control run together, no title.                                      |
| Copy overall   | 5 → 8     | Accurate against config.js. A few strings still lean on dots instead of words.                              |

## Ranked fixes

### Apps list

1. AI design tell: the row metadata "Last used 2 hours ago · Connected by Priya Raman" joins two facts with a middle dot (`app.js`, `row()`). Give each fact its own element.
2. AI design tell: the "Can view · Changes paused" chip holds two facts. Use a "Can view" chip and a separate "Changes paused" chip.
3. The ⋯ button has no handler. Remove it until there is a menu.
4. The page has no settings navigation, so it floats alone and Delete workspace ends up on a page about apps. Use the settings shell the sibling pages share (nav on the left, content on the right) and leave Delete workspace to General.

### Revoke confirm

5. Say what revoking stops, as a short list under the first sentence.
6. After a revoke, focus falls to the page body because the row is gone. Move it somewhere sensible.

### Policy card

7. Make it a settings row: a title, a one-sentence description, and a switch on the right (Linear's settings pattern).

## Out of scope

- Search and filtering for the list.
- Per-app permission editing.

## Stop or continue

Continue on all three surfaces.
