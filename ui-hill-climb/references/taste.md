# Taste references

Judges and designers calibrate against these. When a critique or a fix leans on one of them, name it and the specific thing being borrowed: "the dense row Linear uses in its issue list" is useful, and "make it like Linear" is not.

Contents: Products · People · Principles and sources · Patterns worth stealing

## Products

| Product                                 | What to take from it                                                                                                                                                                                                                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linear                                  | Dense, calm list rows. One strong line per row, metadata quiet and aligned, status as small icon-and-label chips. Restrained color with one accent. Keyboard-first, with instant feedback. Settings pages with a short title, a one-sentence description and the control on the right. |
| Stripe Dashboard                        | Making serious information (money, permissions, risk) readable and trustworthy. Clear data hierarchy in tables, precise number formatting, quiet secondary actions, confirmation dialogs that name the object and the consequence.                                                     |
| Things (Cultured Code)                  | Whitespace as structure. Typographic hierarchy with very few sizes. Motion that explains state changes.                                                                                                                                                                                |
| Raycast                                 | Compact command surfaces with clear focus states, and keyboard hints that are visible but never loud.                                                                                                                                                                                  |
| Vercel                                  | Neutral palettes with tight type, empty states that teach, and deploy and status feedback that is always visible.                                                                                                                                                                      |
| Apple system settings and HIG           | Grouped settings with plain-language explanations under each control, and consistent placement of destructive actions.                                                                                                                                                                 |
| GitHub and Google OAuth consent screens | The standard order on a permission screen: who is asking, as which account, what it can do, how to undo it. Departures from this order cost trust.                                                                                                                                     |

## People

| Person                        | Known for                                                                                  | What to borrow                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Karri Saarinen                | Co-founder and designer of Linear; writes about product quality and "the Linear method"    | Quality as a whole-product property. Opinionated defaults, and cutting what doesn't earn its place.                                |
| Rasmus Andersson              | Designed the Inter typeface; worked on Figma and Spotify                                   | Typographic detail: optical sizes, tabular numbers, tight but readable UI text, and weights doing hierarchy work.                  |
| Emil Kowalski                 | Design engineer; made Sonner (toasts) and Vaul (drawers); teaches animation for interfaces | Feedback that feels instant. Motion that's short and purposeful. Toasts that confirm the specific thing that happened.             |
| Rauno Freiberg                | Design engineer at Vercel; wrote "Invisible Details of Interaction Design"                 | The small interaction details people feel without noticing: hit areas, hover intent, focus, timing.                                |
| Maggie Appleton               | Designer and illustrator known for visual essays and explorable explanations               | Making complex systems understandable with clear visual metaphors, honest diagrams and plain language.                             |
| Adam Wathan and Steve Schoger | Authors of _Refactoring UI_; made Tailwind CSS                                             | Practical hierarchy: emphasize by de-emphasizing, limit sizes and weights, use spacing systems, and treat labels as a last resort. |
| Dieter Rams                   | Industrial designer behind the ten principles of good design                               | "As little design as possible." Honest, unobtrusive and thorough down to the last detail.                                          |
| Matthew Butterick             | Author of _Practical Typography_                                                           | Line length, line spacing, and the small typographic rules that make text easy to read.                                            |

## Principles and sources

- **Nielsen's ten usability heuristics**: visibility of system status, match with the real world, user control, consistency, error prevention, recognition over recall, and so on. Good for the interaction judge.
- **Laws of UX** (Jon Yablonski's collection): proximity, similarity, Fitts's law, Hick's law, Jakob's law. Good for spacing and layout arguments.
- **WCAG 2.2 Level A/AA**: the accessibility judge cites criteria by number.
- **Refactoring UI**: hierarchy, spacing and color decisions for people who aren't trained designers.
- **Practical Typography**: running text.
- **Apple Human Interface Guidelines**: settings, destructive actions, plain-language explanations.
- **Make illegal states unrepresentable**: model UI state as discriminated unions and explicit state machines, so impossible screens can't render.

## Patterns worth stealing

These came up repeatedly in real hill-climbs:

- **Lead with the name, then its trust signal.** "Claude Code · by claude.ai" or an "Unverified app" chip right after the name, rather than provenance in a caption two lines down.
- **The most important fact is a chip, not a caption.** Access level, status and plan go in a small chip beside the name, with an icon (eye for view, pencil for edit).
- **Metadata leads with the sort key.** If a list sorts by last used, the metadata line starts with "Last used 2 hours ago".
- **Separators travel with the item after them,** so a wrapped line starts "· Expires…" and never ends on a dangling dot.
- **Quiet destructive actions.** A small text button in the error color, with a confirm only when undoing is hard or affects someone else, and a success toast naming the thing.
- **Buttons say what they grant.** "Allow viewing and changes", "Don't allow".
- **Permission screens list every capability in one bordered box**, one row each with an icon column, including how long access lasts. "Always included" marks the rows you can't turn off.
- **Calm by default, loud only for real risk.** A neutral note for "verified, but runs on your computer", and an orange callout only for unverified apps. Never two loud bands on one screen.
- **People are neutral, apps are colored.** Fallback avatars for people in grey, so they can't be confused with app avatars.
- **Show the paused state.** When an org-wide setting caps an individual's choice, show both: "Can view · Changes paused", with an explanation reachable by keyboard.
- **Hide visually, not semantically.** At narrow widths, use visually-hidden styles, not `display: none`, for information screen-reader users still need.
