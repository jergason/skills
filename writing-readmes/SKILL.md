---
name: writing-readmes
description: Write, revise, trim or check a README or other in-repo doc that describes code, such as a package README, a docs/ page or a how-to section. It points the reader at the code instead of copying it, keeps only what the code can't say, gives each fact one home across docs, and checks every claim against the code. Use whenever the user asks to write or update a README, document a package, module or service, add a how-to section to a doc, clean up, shorten or de-slop a doc, check whether docs still match the code, or fix docs after a rename or refactor, even if they don't say "README".
---

# Writing READMEs

Two kinds of reader open a README: a person about to change the code, and an agent that loads it into context before doing the same. Both need what the code can't tell them: where to start, the steps that span files, and the reasons behind constraints that look odd. The code already says everything else, and says it correctly.

A copy of the code in prose goes wrong the first time someone edits the code and not the doc. A stale README is worse than none, because the reader trusts it. For an agent, every copied line also costs tokens and can steer it toward an API that no longer exists. So a short README that points at the code beats a long one that restates it.

In one 98-line package README, six claims no longer matched the code, and all six sat in content copied from it: an example calling a function that didn't exist, "three kinds" of rejected input where the validator had four, a table row describing checks in the wrong order, a log query filtering on a renamed message, a field list missing a field, and a quote of the code's wording that the code spelled differently. Pointing at the code took it to 42 lines and removed every one of those.

## Point at the code

| Instead of copying                                                             | Write                                                                                                                  |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| A code example                                                                 | The path of the shortest real file that shows it: "`jobs/purgeSessions.ts` is a short example."                        |
| A table of the module's functions, routes, tools or options and what each does | The file that lists them: "`tools/index.ts` lists every tool, and each tool's file has its endpoints and description." |
| The fields a function logs, returns or accepts                                 | The function's name and file                                                                                           |
| A constant's value, such as a timeout, limit or default                        | Nothing, or the constant's name when the reader has to find it                                                         |
| The cases a validator rejects                                                  | Nothing, when the error message names the problem. The reader is told at the moment they need it                       |
| Signatures, parameter lists and types                                          | Nothing. The editor shows them                                                                                         |

A snippet is still right when no source file shows the thing: a command to run, a query to paste into a log viewer, or config the reader writes by hand. Those are recipes, and the next section covers them.

## Keep what the code can't say

- **Steps that span files.** "To add a job, write it in `jobs/`, add it to `jobs/index.ts`, and add its schedule to `schedules.ts`." Number them. When a test fails if a step is skipped, name the test, so the reader knows the list is enforced and where the check lives.
- **Policy.** What must never happen, and why: "Message bodies are never logged, because they can hold personal data."
- **Recipes.** Commands, log queries and dashboard links. Use the exact strings a reader will search for, such as the log message and the log group, and check each one against the code, because a rename breaks a recipe without anyone noticing.
- **Constraints and their reasons.** Why the obvious approach doesn't work: "SMS goes through the batch endpoint because the single-send endpoint returns no delivery receipt." This describes the current design, so it isn't history.
- **Side effects a reader wouldn't guess,** such as a read that records a view.

## Give each fact one home

Repos often have an overview doc (in `docs/`, a wiki, or the top-level README) and a README next to the code, and the two drift into covering the same ground. Before writing, search the other docs for the package's path and its main names, for example `grep -rn "src/jobs\|defineJob" --include='*.md' .`.

Then decide which doc owns each fact. The overview owns concepts, the rules every part follows, and how the pieces fit together. The package README owns how to work inside the package. The other doc links to the owner without restating it. When you cut a duplicate, check whether it held a detail the owner lacks, such as a concrete example, and move that detail into the owner first.

Before renaming or removing a heading, search for links to it (`grep -rn "README.md#"`) and fix them.

## Check every claim against the code

When revising, treat each sentence of the existing doc as a claim to verify, not as background. Open the code it describes. These drift first:

- counts, such as "three kinds of"
- order, such as "before calling anything"
- quoted strings: log messages, error text, config keys and environment variables
- lists of fields, options or cases
- examples

Fix what's wrong, and list each fix in your summary to the user. They need to know their doc disagreed with the code, and sometimes the code is the thing that's wrong.

## Describe the code as it is now

Leave out how the code got here: "we used to", "originally", "now uses", "no longer", "was renamed from", and approaches that were tried and dropped. That belongs in the commit message or changelog. Readers come to a README for the current state.

A doc written right after a change tends to lean on the old version without saying so, with words like "instead" or "the new X". Read it as someone who never saw the old version.

## Shape

- Keep it short. A package README that points at the code usually fits in 30 to 60 lines. If yours is longer, look for copies.
- Make headers plain labels, such as "Adding a job" or "Logging", not claims.
- Use numbered lists for steps, and tables only for items that share the same fields.
- Give each thing one name and keep using it.
- Introduce a name before any sentence leans on it.

## Before you finish

1. Check that every path, identifier and quoted string in the doc exists in the repo. One grep per name is enough.
2. Search the other docs for overlap again, now that you know what this one says.
3. Get a newcomer read. Give the doc to a subagent that hasn't seen your work and ask what a newcomer would trip over. Fix what's about your wording. A newcomer will also ask for more, such as an inline example or a definition the linked doc already gives. Don't put copies back to answer that, because the pointer is the answer.
4. If a prose-cleanup skill such as declauding is available, run it on the result.

Then tell the user what you cut, what was wrong, and where each fact now lives.
