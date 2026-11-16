# Round 1 synthesis

## Score of record

| Surface        | Score | Verdict                                                          |
| -------------- | ----- | ---------------------------------------------------------------- |
| Apps list      | 5     | Metadata outranks the app name; destructive column dominates.    |
| Revoke confirm | 4     | "Are you sure?" names nothing; focus starts on the risky choice. |
| Policy card    | 8     | Works well. Only the label needs polish.                         |
| Copy overall   | 5     | Vague, cute error, inconsistent permission wording.              |

## Apps list: ranked fixes

1. **Flip the name/person hierarchy.** `.row-sub` (person) is 14px/600 #111 and `.row-name` (app) is 14px/500 #777, so the person reads as primary. Put the app name first at `--text-lg`/600 and the person in the metadata line.
2. **Quiet the Revoke column.** Five red outlined buttons are the loudest thing on the page. Use the design system's `.btn .btn-destructive` variant.
3. **Permission as a chip.** Replace "This app can view and edit" in the caption with the existing `<Chip tone="permission" icon="pencil">` from `ds/Chip.tsx`, placed right after the name.
4. **Metadata color.** The metadata line is hand-set to #999. Use the `--color-text-subtle` token.
5. **Duration copy.** Add the duration to each row so admins see it at a glance: "Access expires after 90 days."
6. **Mark unverified apps.** Only verified apps get a chip today; the two unverified apps look exactly like reviewed ones. Add a warning chip for unverified apps and drop the "Verified" chip.
7. **The `⋯` button does nothing.** It has no click handler. Either wire it to a menu or remove it.
8. **Add search and a filter by scope** so admins with many apps can find one fast.

## Revoke confirm: ranked fixes

1. Title: "Revoke Linear?" Body: "Linear will lose access to your workspace. Revoking takes effect within 24 hours." Buttons: "Revoke access" and "Keep access", with focus starting on "Keep access" (it starts on OK today).
2. After confirming, show a toast: "Linear's access was revoked."

## Policy card: ranked fixes

1. The toggle works and the list updates right away when it changes. Only polish the label: "Allow connected apps to make changes".

## Copy

| Old                         | New                                           |
| --------------------------- | --------------------------------------------- |
| This app can see            | Can view and change workspace data            |
| This app can view and edit  | Can view and change workspace data · Admin    |
| Oops! Something went wrong :( | Couldn't load connected apps. Reload to try again. |
| No apps.                    | No apps are connected yet.                    |

## Cross-cutting

- Move toasts to top-center across the whole app so they're seen sooner (`.toast-region` in `ds/components.css`).

## Stop or continue

Continue on all surfaces.
