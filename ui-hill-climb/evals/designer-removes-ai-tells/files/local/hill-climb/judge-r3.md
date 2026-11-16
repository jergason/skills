# Round 3 judging: score of record

## Orchestrator corrections

None this round.

## Scores

| Surface        | R2  | R3  | Verdict  |
| -------------- | --- | --- | -------- |
| Apps list      | 8.5 | 8   | Continue |
| Policy card    | 8.8 | 8.5 | Continue |

## Ranked fixes

### Apps list (app.js, styles.css)

1. **Row metadata is too small and too faint.** `.row-meta` is `--text-sm` in `--color-text-muted`, and on the long rows it reads as noise. Set it to `--text-md` and keep the muted colour.
2. **The paused state has no explanation you can reach by keyboard.** When "Allow apps to make changes" is off, the edit apps show a chip whose explanation lives only in a `title` attribute. Give the explanation a keyboard- and screen-reader-reachable form, for example visible helper text or `aria-describedby` pointing at the policy card's explanation.

### Policy card and unverified callout (index.html, styles.css)

3. **The unverified-apps callout doesn't stand out enough.** It sits between the policy card and the list and is easy to skim past. Make it stand out more: give it a 4px left border in `--color-danger` instead of the orange, so it reads as a warning.
4. **The callout's radius doesn't match the cards.** Its left corners are square. Use `--radius-md` on all four corners like the cards.
