# BRIEF.md template

Copy this next to the screenshots and fill it in. Every judge and designer reads it, so anything they need to know goes here once.

```markdown
# <Feature> UI design pass: shared brief

<Two or three sentences: what the product is, what this feature does, and why someone uses these screens.>

| Surface                                                          | URL / route         | Files   |
| ---------------------------------------------------------------- | ------------------- | ------- |
| <Admin list: what's on it>                                       | <url>               | <paths> |
| <Settings section>                                               | <url> (scroll to …) | <paths> |
| <Shared component used by both>                                  | n/a                 | <paths> |
| <Decision screen, plus its loading / error / unavailable states> | see URLs below      | <paths> |

Audience: <who they are, how technical, what they're cautious about>. Copy must be <plain / calm / precise / …>.

## Running app

- App: <url>. Already running; don't start or stop it.
- Log in as `<user>` / `<password>` (<role, and why it can see everything>).
- Open your OWN browser page in an isolated context named after you, log in there, and set the viewport to `1440x1000x1`. Save screenshots under `<writable gitignored folder>`.
- <Quirks: inner scroll containers, slow first load, a feature flag to turn on.>
- How to reach each state: <URLs with query strings, seeded records, a setting to flip>.
- NEVER <click Allow / Submit / Delete on …>: <why: redirects off-site, creates a real record, sends email>. Seed SQL to restore data: `<path>`.
- Shared app state: only <designer name> may change <global setting>, and must restore it right after.

## Product facts the copy must stay true to

- <What each permission or option really allows, checked against code.>
- <What takes effect immediately vs later.>
- <What's configurable per customer (never hardcode these values in copy).>
- <What is logged, reversible or permanent.>

## Constraints

- Stay inside <design system> (`<path>`): its components, layout primitives, tokens and icons. No new UI libraries.
- Repo rules: <link to CLAUDE.md / AGENTS.md / rules folder, and the few rules that matter most>.
- Tests to keep green: <paths>. Run with `<command>`.
- Off-limits: <directories with someone else's uncommitted work>. Don't commit, stash or reset.
- Out of scope: <app-wide changes, new features>.
```
