# Taste references

Judges and designers calibrate against these. When a critique or a fix leans on one of them, name it and the specific thing being borrowed: "the dense row Linear uses in its issue list" is useful, and "make it like Linear" is not.

For permission, consent or connected-apps screens, also read `references/consent-screens.md`.

## Products

| Product                       | What to take from it                                                                                                                                                                                                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linear                        | Dense, calm list rows. One strong line per row, metadata quiet and aligned, status as small icon-and-label chips. Restrained color with one accent. Keyboard-first, with instant feedback. Settings pages with a short title, a one-sentence description and the control on the right. |
| Stripe Dashboard              | Making serious information (money, permissions, risk) readable and trustworthy. Clear data hierarchy in tables, precise number formatting, quiet secondary actions, confirmation dialogs that name the object and the consequence.                                                     |
| Things (Cultured Code)        | Whitespace as structure. Typographic hierarchy with very few sizes. Motion that explains state changes.                                                                                                                                                                                |
| Raycast                       | Compact command surfaces with clear focus states, and keyboard hints that are visible but never loud.                                                                                                                                                                                  |
| Vercel                        | Neutral palettes with tight type, empty states that teach, and deploy and status feedback that is always visible.                                                                                                                                                                      |
| Apple system settings and HIG | Grouped settings with plain-language explanations under each control, and consistent placement of destructive actions.                                                                                                                                                                 |

## People

| Person                        | What to borrow                                                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Karri Saarinen                | Quality as a whole-product property. Opinionated defaults, and cutting what doesn't earn its place.                                |
| Rasmus Andersson              | Typographic detail: optical sizes, tabular numbers, tight but readable UI text, and weights doing hierarchy work.                  |
| Emil Kowalski                 | Feedback that feels instant. Motion that's short and purposeful. Toasts that confirm the specific thing that happened.             |
| Rauno Freiberg                | The small interaction details people feel without noticing: hit areas, hover intent, focus, timing.                                |
| Maggie Appleton               | Making complex systems understandable with clear visual metaphors, honest diagrams and plain language.                             |
| Adam Wathan and Steve Schoger | Practical hierarchy: emphasize by de-emphasizing, limit sizes and weights, use spacing systems, and treat labels as a last resort. |
| Dieter Rams                   | "As little design as possible." Honest, unobtrusive and thorough down to the last detail.                                          |
| Matthew Butterick             | Line length, line spacing, and the small typographic rules that make text easy to read.                                            |

## Principles to cite

Nielsen's usability heuristics for interaction. Laws of UX (proximity, similarity, Fitts's, Hick's, Jakob's) for spacing and layout. WCAG 2.2 Level A/AA criteria, by number, for accessibility.

## Patterns worth stealing

- **Metadata leads with the sort key.** If a list sorts by last used, the metadata line starts with "Last used 2 hours ago".
- **The most important fact is a chip, not a caption.** Status, plan or role goes in a small chip beside the name, not in a caption two lines down.
- **Quiet destructive actions.** A small text button in the error color, with a confirm only when undoing is hard or affects someone else, and a success message naming the thing.
- **Calm by default, loud only for real risk.** Routine information gets a neutral note. A warning color appears only where something can actually go wrong. Never two loud bands on one screen.
- **Hide visually, not semantically.** At narrow widths, use visually-hidden styles, not `display: none`, for information screen-reader users still need.

## Patterns to avoid

These two are strong tells of AI-generated UI. Judges flag every one as an issue to fix, not optional polish. Designers never add them, and they remove any they find in a component they touch, even when a judge suggests one.

- **Facts joined by dots or bullets on one line.** For example "v14 · Published · Oct 2", or a chip reading "3 matches · Draft". Give each fact its own structure instead: a chip for a status, a labelled pair ("Modified Oct 2"), a second line, a table column, or a sentence with words or commas ("Published Oct 2"). If the facts only make sense together, write them as words.
- **A coloured stripe down one side of a box.** A card, notice, callout, quote, list item or diff block marked with a coloured border on one edge. Show the kind of box with a full subtle border, a background tint, an icon, or a visible label ("Before", "Warning") instead.

These are not tells: bullets that mark the items of a real list, a 1px divider in the ordinary border color between panes, columns or table cells, and characters inside user-entered data that the UI only displays.
