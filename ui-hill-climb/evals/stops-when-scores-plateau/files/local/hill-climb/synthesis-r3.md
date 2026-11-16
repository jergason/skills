# Round 3 synthesis

## Score of record

| Surface        | Score                 | Verdict                                                   |
| -------------- | --------------------- | --------------------------------------------------------- |
| Apps list      | 5 → 7.5 → 8.5 → 8.5   | Excellent rows. The next jump needs search.               |
| Revoke confirm | 4 → 8 → 8.5 → 8.8     | One widowed word in the body copy.                        |
| Policy card    | 6 → 8 → 8.8 → 9       | Close. Explanation is tooltip-only; the control could be stronger. |
| Copy overall   | 5 → 7.5 → 8.5 → 8.5   | Consistent and accurate.                                  |

## Remaining fixes

- **Apps list:** with 40+ apps, admins need search and a scope filter to find one. This is what would take the list to 9.5.
- **Revoke confirm:** the body "Linear loses access to this workspace right away." leaves "away." alone on line 2 at 420px. Tighten it to "Linear loses access right away."
- **Policy card:** the "Changes paused" chip explains itself only in a `title` tooltip. Add a focusable trigger with `aria-describedby` so keyboard and screen-reader users get the explanation.
- **Policy card:** replace the checkbox with a segmented control (Allow changes / View only), and switch every settings page in the app to segmented controls for consistency.

## Stop or continue

Continue on all three surfaces. Round 4 should land search and the segmented controls; I expect 9+ across the board after that.
