---
name: ui-hill-climb
description: Iteratively raise the design quality of an existing UI by rounds of screenshots, a panel of specialist judge subagents scoring 0-10 on separate criteria (visual craft, copy, interaction and states, accessibility and responsive), and designer subagents that implement fixes inside the project's design system, until the scores plateau or reach 9+. Use this whenever someone asks to polish, refine, level up, or "make excellent" a screen, page, flow or component; to review and improve typography, spacing, hierarchy or copy; to get UI "to Linear/Stripe quality"; to rate a UI with judges; or to iterate on design with screenshots, even if they don't say "hill-climb".
---

# UI hill-climb

Improve an existing UI in measured rounds. Each round is:

1. capture screenshots
2. have a panel of judges score and critique
3. have designers fix what the judges found
4. verify

The scores give the loop a direction, the screenshots give everyone a shared view, and the annotated round diffs show the person what changed and why.

This skill orchestrates subagents. You (the orchestrator) own the brief, the screenshots, the corrections, the verification and the report. Judges never edit files. Designers never judge their own work.

## When it fits

Use it for an existing, runnable UI where quality matters more than speed: a settings page, a consent screen, an onboarding flow, a dashboard view. For a brand-new screen, build a first version first, then hill-climb it. For a one-line copy tweak, just make the change.

It is token-heavy: a round is roughly 4 judges, 1 synthesizer and 1-3 designers. Tell the person the rough shape before you start (surfaces, judges, designers, expected 2-4 rounds).

## Round 0: set up

### 1. Find the surfaces and their files

List every surface in scope (page, dialog, section, state) with its URL or route and its source files. Read sibling pages so you know the local conventions: card titles, spacing rhythm, button treatments, how success and errors are shown. Find the design system (tokens, components, layout primitives) and note its path; judges and designers both need it.

Check `git status` before anyone edits. If another work stream has uncommitted changes, list those directories as off-limits in the brief.

### 2. Run the app and seed realistic data

A list with one row or an empty table can't be judged. Seed varied, realistic data that exercises the design: several rows, long and short names, every badge or status variant, verified and unverified, read-only and editable, something stale and something fresh. Prefer the project's own seed or e2e commands. Fall back to SQL inserts against a local, disposable database, and save the SQL so it can be re-run if someone deletes a row by accident.

Find how to reach every state you can: loading, empty, error, permission-denied, the destructive confirm, narrow widths, phone width. States you can't reach in a browser still get judged from source.

### 3. Capture baseline screenshots

Use a browser automation tool (chrome-devtools MCP or similar):

- Open your own page in a named isolated context, log in, and set a fixed viewport (1440×1000 desktop is a good default; add ~900px and 390×844 phone).
- Name files `r<round>-<surface>[-<state>].png`, for example `r0-admin.png` and `r1-consent-unverified.png`.
- Save them where the screenshot tool can write. Some tools only write inside the workspace roots, so use a gitignored folder in the repo (such as `local/<task>-shots/`), not a temp dir.
- If the page scrolls an inner container, full-page capture misses it. Scroll the element into view with a script, then take a viewport shot.
- Look at every screenshot yourself before sending it anywhere.

### 4. Write the shared brief

Write `BRIEF.md` next to the screenshots, using `references/brief-template.md`. Every judge and designer reads it, so it is the single source of context. It must include:

- what the product is and who uses these screens (their expertise, their worries)
- a table of surfaces with URLs, files and how to reach each state
- login, viewport and screenshot instructions
- **actions nobody may take** (buttons that redirect off-site, create real records, send email, or delete seeded data)
- **product facts the copy must stay true to**: what each permission really allows, what is immediate, what is configurable per customer (so nobody hardcodes "90 days" when the value varies)
- constraints: the design system to stay inside, repo coding rules, off-limits directories, no commits

## Each round

### 1. Judge

Spawn the judge panel in parallel, one subagent per criterion. Each judge reads the brief, the current screenshots, the previous round's screenshots (from round 1 on), and the source for states the screenshots don't show. The judge prompts live in `agents/`:

| Judge                        | File                          | Looks at                                                                                    |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| Visual craft                 | `agents/judge-visual.md`      | typography, hierarchy, spacing rhythm, alignment, density, color and emphasis, system fit   |
| Copy and content             | `agents/judge-copy.md`        | clarity, tone, accuracy against product facts, consistent vocabulary, button labels, errors |
| Interaction and states       | `agents/judge-interaction.md` | feedback, destructive actions, loading/empty/error, state correctness bugs, decision order  |
| Accessibility and responsive | `agents/judge-a11y.md`        | keyboard, screen reader, target size, contrast, narrow and phone widths                     |

Then run the synthesizer (`agents/judge-synthesizer.md`). It merges the four reports into one score table per surface, removes duplicates, resolves conflicts between judges, and ranks fixes by impact. The synthesizer's table is the score of record.

**Keep the same judges across rounds.** Resume each one (SendMessage to its name or id) instead of spawning a fresh one, so its scale stays calibrated against what it scored before. A fresh judge re-anchors and the numbers stop being comparable.

All judges share this scale:

| Score | Meaning                                                        |
| ----- | -------------------------------------------------------------- |
| 10    | Ships at the level of Linear, Stripe or Things without changes |
| 9     | Excellent; only optional polish or out-of-scope gaps remain    |
| 7     | Solid and professional, but unremarkable                       |
| 5     | Functional, with clear craft problems                          |
| 3     | Confusing or visibly broken                                    |

Tell judges to be hard to impress. Inflated early scores leave nowhere to climb.

### 2. Correct the judges

Before passing the critique to designers, check it against reality. Judges are confident and sometimes wrong. Write `judge-r<N>.md` with the synthesized report and an **Orchestrator corrections** section at the top that overrides anything wrong. Common corrections:

- a value the judge treated as fixed is configurable (don't hardcode it in copy)
- a copy suggestion overstates or understates what the system does (check the code)
- a file path or component the judge named doesn't exist
- a suggestion is out of scope (an app-wide change, a new feature); name it so judges stop raising it

Decide scope explicitly. App-wide changes (global toast position, shared layout overhauls) and new features (search, filters) are usually out of scope. A small, clean extension that follows an existing pattern (a route flag next to an existing route flag, a size variant on a design-system component) is usually fine.

### 3. Design

Spawn designer subagents with `agents/designer.md`. Split the work by **file ownership** so two designers never edit the same file:

- Group surfaces that share components under one designer. The designer who owns a shared component owns it for the whole run.
- When one designer creates something another needs (a shared badge, an exported helper), name the owner, the file and the API in both briefs. The owner creates it first and messages the other designer when it lands.
- Shared server files are the riskiest. If two designers must touch one, tell both to make small read-modify-write edits and re-read before each edit.
- Shared **app state** collides too. If one designer toggles a global setting to capture a state, the other's screenshots catch it. Name one designer as the only one allowed to change shared state, and make them restore it immediately.

Designers verify visually in their own isolated browser context, iterate until they'd show it to a top design team, update tests, run the project's checks for the files they touched, and report: what changed and why (design reasoning), where they departed from the judges and why, check results, screenshot paths.

From round 2 on, keep using the same designers (SendMessage) so they keep their context.

### 4. Verify

Before calling a round done:

- Look at the new screenshots yourself.
- Re-run lint, typecheck and the touched tests yourself. Designers sometimes report another designer's in-progress breakage, or fix their own and forget to re-run.
- Check any claim with reach beyond the UI. If a designer changed an API response or a shared contract, grep for every consumer. Also check whether the contract exists on the main branch: renaming a field nobody outside this branch has seen is not a breaking change, so don't describe it as one.
- Screenshots go stale. If a later fix changed something visible, re-shoot every state it touches before the judge sees them.

### 5. Report the round

Update the round-diff page (see **The round-diff page** below), then tell the person in a few lines: the score table, the biggest changes, anything that needs their decision.

### 6. Decide whether to continue

Send the judges the next round with: the new screenshot list, a short list of what changed, and each designer departure from the judges' advice, asking them to rule on each departure. Ask the synthesizer for an explicit **stop or continue verdict per surface**.

Stop when any of these is true:

- every surface is at 9+
- the judges say the only remaining gaps are out of scope
- a round moved no surface by more than half a point

When the judges say stop but list optional items that are small and clearly right (an accessibility check, a widowed word, a stale screenshot), do one quick polish pass without another judging round, then verify and re-shoot.

## The round-diff page

The person wants to see what changed, so show it. Build one page that holds:

- a score table: one row per surface, one column per round, with the delta from the previous round and the latest verdict
- for each round transition, newest first: before/after screenshot pairs with **numbered pins** at the spots that changed (the same number on both images), and a change list keyed to those numbers with **Before** and **After** text
- extra shots that are new in a round (a dialog, a fixed bug state), and phone-width pairs

`scripts/build_rounds_page.py` renders this from a JSON manifest. Read the docstring at the top of the script for the manifest format. Pin coordinates are in the image's own pixels, so read each screenshot and place pins by eye. Then publish it with whatever the environment offers: an Artifact tool if there is one (pass the screenshots as supporting files), otherwise open the HTML locally.

Update the page after every judging round, not just at the end. Show scores as "Judging…" while a round is out, then fill them in.

## Principles and references

`references/taste.md` lists the designers, products and principles the judges and designers calibrate against, with what to take from each. Point every judge and designer at it. A judge that has a concrete reference ("the row hierarchy Linear uses in its issue list") gives far better critique than one told to "make it look good".

## Reporting faithfully

- Say what you checked and what you didn't. If a designer skipped something, say so.
- Report check failures with the output, not a summary.
- Size the impact of each change honestly. Overstating ("the API changed shape") alarms people as much as understating hides risk.
- Don't commit unless asked. List every file outside the main surfaces that changed (design-system components, shared layouts, server contracts), since those usually belong in separate PRs.
