---
name: bluf
description: Write handoffs and status updates in BLUF (bottom line up front) or SBAR form, so the next reader (a person, a fresh session, or you after a context reset) can act without re-reading the history. Use when work changes hands or someone needs to know where things stand, including "write a handoff", "hand this off", "status update", "where are we", "sitrep", end-of-session notes, escalations, incident updates, and PR or ticket status comments.
argument-hint: "Who is this for, and what should they do next?"
---

# Handoffs and status updates

A handoff exists so the reader can act. It fails when the reader has to dig through it to find what's going on, or has to redo your investigation because you left out what you checked.

Two forms help:

- **The short form** (BLUF, bottom line up front, from US military writing). The conclusion and the ask go in the first sentence or two. Everything after supports it. Use it for status updates and anything the reader may only skim.
- **The four-part form** (SBAR: Situation, Background, Assessment, Recommendation, from hospital shift changes). It splits what you saw from what you think it means from what you want done. Use it when someone takes over a problem or has to make a decision. It also opens with the bottom line.

**Never label the output with these names.** Don't write "BLUF", "SBAR", "Bottom line:" or "Here's a BLUF" anywhere in what you produce. The names are for you, not the reader. The first sentence simply is the bottom line.

## Pick the form

| The reader needs to                             | Use                                                 |
| ----------------------------------------------- | --------------------------------------------------- |
| Get pinged about one thing in chat              | Short form, one or two sentences, no headings       |
| Know where things stand, maybe skim and move on | Short form                                          |
| Take over the work and keep going               | Four-part form                                      |
| Make a decision or approve something            | Four-part form, with the ask in the first sentence  |

Default to the short form. Use the four-part form when someone takes over the work or has to decide something.

## Before writing

Answer these from the conversation and the work. Don't ask the user for things you can find yourself.

1. **Who reads this?** A subagent or fresh session knows nothing that isn't on the page. A teammate knows the project but not today.
2. **What should they do first?** If you can't say it in one sentence, you don't understand the state well enough to hand off yet. Go find out.
3. **What do you know versus what do you think?** Things you saw happen are facts. Your theories are theories, and get marked as theories.
4. **What did you rule out?** Dead ends are the most expensive thing to lose. Write each one down with how you ruled it out.

## Short form

```
<The state and the ask, in one or two sentences.>

<Supporting detail, most important first. Short paragraphs or bullets.
Stop when the reader has enough to act.>
```

- The first sentence must work alone. If the reader stops there, they should still know the state and whether they need to do anything.
- Lead with the current state, not the story of how you found it. "Deploy is blocked on a failing migration; I need DB admin access to fix it" beats "I started by looking at the deploy logs."
- If nothing is needed from the reader, say so: "No action needed."

## Four-part form

```
<The state and the ask, in one or two sentences. No label.>

**Situation:** What is happening right now. Observed facts only:
symptoms, error text, what's broken, since when, who's affected.

**Background:** What the reader needs to make sense of the situation.
What changed recently, what was tried and what happened, what was
ruled out and how, relevant links, branches, files, commands.

**Assessment:** What you think is going on, and how sure you are.
Name the evidence for each theory. Say what you don't know.

**Recommendation:** What the reader should do next, in order. Name
the first concrete step. Include any decision only they can make,
and what would change your recommendation.
```

- **Situation is facts.** "The job fails with `ECONNRESET` on every run since 09:40." Not "the network is flaky," which is an assessment.
- **Background is selective.** Include history only if it changes what the reader does. Leave out the story of how you got here unless a step in it is a dead end they'd otherwise repeat.
- **Assessment carries a confidence** in plain words: "confirmed", "likely", "guess". "Likely the connection pool is exhausted: pool metrics hit max at 09:38. Not ruled out: upstream rate limiting."
- **Recommendation names a concrete action.** "Run `pnpm db:migrate --dry-run` on staging and check whether step 4 locks `orders`" beats "look into the migration."
- Keep the four headings even when a section is one line. The reader learns where to look.

## When the reader is an agent

A fresh session, a subagent, or you after a context reset:

- Give exact paths, branch names, commands, and the one line of error text that matters (with the path to the full log). Not "the file we discussed."
- Say what "done" looks like in the Recommendation.
- Give the scope: what it may change and what it must leave alone.

## When the reader is a person

- Skimmers read the first sentence and maybe the Recommendation. Make both stand alone.
- Cut jargon they don't share. Spell out an acronym once if they might not know it.

## Examples

### Status update

> Checkout latency is back to normal (p95 310ms) after rolling back release 4.12.0 at 14:05 UTC. No action needed now; root cause is still open and tracked in INC-2231.
>
> - p95 peaked at 2.4s from 13:20 to 14:05.
> - 4.12.0 added an N+1 query in `CartSummary`. Confirmed in the query logs.
> - Fix is in review: PR 812. Re-release planned for tomorrow after load testing.

### Handoff to a fresh session

> The flaky `auth.spec.ts` failure is a test-order bug, not a product bug. Next step is to isolate the shared fixture in `test/fixtures/session.ts`.
>
> **Situation:** `auth.spec.ts > refreshes expired token` fails about 1 run in 5 in CI. It always passes when run alone (`pnpm vitest auth.spec.ts`, 50/50 passes). Failure text: `expected 401 to be 200`.
>
> **Background:** Branch `fix/auth-flake`, nothing committed yet. Ruled out: clock skew (froze time with `vi.useFakeTimers`, still fails) and network (all requests are mocked with msw, confirmed in the handler log). The failure only shows up when `logout.spec.ts` runs first in the same worker.
>
> **Assessment:** Likely: `logout.spec.ts` revokes the token stored in the module-level `session` fixture, and `auth.spec.ts` reuses it. Evidence: running the two files together with `--sequence.shuffle=false` fails every time. Not checked: whether other specs share the fixture.
>
> **Recommendation:**
>
> 1. Change `test/fixtures/session.ts` to build a fresh session per test instead of exporting a singleton.
> 2. Run `pnpm vitest auth.spec.ts logout.spec.ts --sequence.shuffle=false` 20 times. Done means 20/20 passes.
> 3. Grep for other imports of `session` from the fixture and check whether they relied on shared state.
>
> Don't touch `src/auth/`. The product code isn't the problem.

### Escalation that needs a decision

> I need your call on whether to drop the `legacy_exports` table in tonight's migration. It blocks the schema change, and dropping it can't be undone.
>
> **Situation:** Migration 0142 fails because `legacy_exports` has a foreign key to `users.id`, which the migration retypes.
>
> **Background:** The table has 41k rows, last written 2025-03-02. No code references it (searched `src/` and `jobs/`). The analytics team's dashboards might still read it. I couldn't check their repo.
>
> **Assessment:** Probably safe to drop, but I can't confirm the analytics team doesn't use it.
>
> **Recommendation:** Two options. (a) Drop it tonight after a `pg_dump` backup of the table, which I can do. (b) Keep it and rewrite 0142 to drop and re-add the foreign key, which adds about a day. I'd pick (a) if you can confirm analytics doesn't need it, (b) otherwise.
