---
name: writing-readmes
description: Write, update or trim a README or other in-repo doc that describes code, like a project README, a package or module README, a docs/ page or a how-to section. Use when the user asks to write or fix a README, document a package, module or service, add how-to steps, cut down a doc that has grown long, or check docs against the code after a change, even if they don't say "README".
argument-hint: "Which doc, and who reads it?"
---

# Writing READMEs

The purpose of a README is to help readers make better changes to a system. It does this by improving their theory of the program (à la Peter Naur's "Programming as Theory Building"). A reader of the README should be faster and produce better changes (smaller, less risky, or with higher context about side effects) than someone just reading the code. They should understand the system overall better, including side effects, architecture, and how this bit fits in the whole. It shouldn't be exhaustive. Less is more. It shouldn't copy-paste large code snippets or implementation details. Those go out of date. Just point at the code instead!

Good READMEs explain where to start, why this thing exists, what it's for, and why it looks the way it does. They're kinda like product specs but for code. They are a guide, not a complete reference.

## Two kinds of README

Are you writing a project-level README or a code-level README?

A **project README** sits at the top of a repo or a published package. Its reader wants to know what the thing is and how to get it running, and is often reading on GitHub or npm without the code checked out. Give them:

- What it does, in a sentence or two.
- How to install it.
- A small, working, usage example.

A **code README** is a README file in a package or module folder in a larger system. Readers are system operators and maintainers. They have the code open, so point at it instead of copying it.

A small repo's top-level README is often both: the project part first, then a section for contributors that is more like a code README.

## Point at the code

| Instead of copying                                  | Write                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| A code example                                      | The path of a short real file that shows it                      |
| A list of the module's functions, routes or options | The file that lists them                                         |
| The fields a function logs, returns or accepts      | The function's name and file                                     |
| A constant's value, like a timeout or a limit       | Nothing, or the constant's name when the reader needs to find it |
| The cases a validator rejects                       | Nothing, when the error message names the problem                |
| Signatures and types                                | Nothing. The editor shows them                                   |

Include a code snippet when it's not in a file you can point to: a command to run, a log query to paste, or config the reader writes by hand.

## What belongs in a code README

- The purpose of this module, folder, or package. Why does it exist? What job does it do?
- References to other docs. Form a web of docs! Make sure they are still valid and exist, and check their content for duplication, staleness, etc. References to parents (here is the doc for this whole feature) and children (here is the doc for the expression subsystem) are both useful.
- Steps that span files: "To add a report, write it in `reports/`, add it to `reports/registry.ts`, and give it a permission in `roles.yaml`." Number them.
- Rules the code can't explain: what must never happen and why, or why the obvious approach doesn't work. "Exports read from the replica, because a long export on the primary locks the `orders` table."
- Recipes: commands, log queries and dashboard links. Use strings a reader will search for, like the log message, and check them against the code.
- Side effects a reader wouldn't guess, like a read that also records a view.

Diagrams can also be useful to help build models of the system.

## Don't repeat yourself

Repos often have overview docs (the top-level README, `docs/` or a wiki) and READMEs next to the code. They sometimes drift into covering the same ground. Before writing, grep the other docs for the package's path and its main names.

The overview owns broad concepts, rules every part follows, and high-level architecture info. The code README owns how things work inside its package. The other doc links to the owner instead of restating it.

Before renaming or removing a heading, grep for links to it and fix them.

## Check claims against the code

When updating a doc, read each sentence as a claim and check it against the code it describes. Look for stuff in the README that might be stale.

Fix what's wrong and list each fix for the user. Sometimes the code is wrong. When you can't tell whether the doc or the code describes what was intended, leave the doc as it is and ask.

## Shape

- Write headers as plain labels, like "Adding a report" or "Logs".
- Use one name for each thing. Introduce it before a sentence depends on it.
- Describe the code as it is now. How it got that way (what it used to do, what was renamed, what was tried and dropped) goes in the commit message. A reason for the current design isn't history, so keep it.

## Before you finish

1. Grep for the paths, identifiers and quoted strings in the doc to make sure they exist.
2. Grep other docs again for what this one now covers, and cut any overlap.
3. Run the `/declauding` skill on the doc. It includes a newcomer read by a subagent that hasn't seen your work, which catches sentences that only make sense to someone who saw the old code. Without declauding, give the doc to a fresh subagent and ask what a newcomer would trip over.
4. The newcomer will often ask for more, like an inline example or a definition the linked doc already gives. Leave the pointer. Fix the places where your wording was unclear.

Then tell the user what you wrote or cut, which claims were wrong, and where each fact lives now.
