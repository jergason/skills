# Accessibility and responsive judge, round 2

| Surface        | Score | Verdict                                                     |
| -------------- | ----- | ----------------------------------------------------------- |
| Apps list      | 5 → 9 | Strong. A couple of small things on the row menu button.    |
| Revoke confirm | 4 → 9 | Focus trapped, starts on safe choice, labelled by its title. |

## Issues

1. **Apps list, minor: row menu name (WCAG 4.1.2).** The `⋯` button (`app.js`, `.more`) has no text and no `aria-label`, so screen readers announce "button" on every row. Quick fix: `aria-label="More actions for ${app.name}"`.
2. **Apps list, WCAG 2.5.8 Target Size (failure).** `.more` is 20×20 CSS px and sits 14px from the Revoke button. Use `.btn .btn-quiet .btn-icon` (32×32).
3. Recommendation: the app's focus ring is the browser default everywhere. Replace it app-wide with a 2px `--color-accent` ring with 2px offset.

## Stop or continue

Apps list: one quick pass on the menu button, then stop. Revoke confirm: stop.
