---
name: fable-prompt
description: Write the kickoff prompt, system prompt, or agent brief for a big, long-running project on Claude Fable 5.2 or Mythos 5.2, using Anthropic's Fable 5.2 prompting guidance. Use whenever the user wants a prompt for a large or multi-step project, wants to hand a project to an agent, plans a long or unattended run, asks to "write a prompt for", "brief an agent on", or "kick off" some work, wants an existing prompt, CLAUDE.md, skill, or agent file ported from an older model, or complains that Fable stops early, goes quiet, asks for approvals it doesn't need, starts too many subagents, or piles new code on top of old.
argument-hint: "What's the project?"
---

# Fable 5.2 prompts for big projects

You are writing a prompt that another Fable 5.2 session will run, often for hours, often with nobody watching. Fable 5.2 follows instructions closely and literally. That makes a precise prompt very effective and a sloppy one expensive: a vague approval rule blocks routine work, a stale caution stops retries, a missing ownership line gets you bolted-on duplicate code.

The source is Anthropic's guide: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2. If the user asks about something this skill doesn't cover, or the guide may have changed, fetch it again.

The work has five steps. Do them in order, but move fast through the ones the conversation already answers.

## 1. Get the facts that change the prompt

Pull these from the conversation and the repo first. Ask only for what you can't find, in one batch. Each fact switches something in the prompt on or off, so a wrong guess here costs more than a question.

| Fact | What it decides |
| --- | --- |
| The goal, and why it matters | The opening of the prompt. The "why" lets the model make good calls on things you didn't foresee. |
| What "done" looks like, and how to check it | The stop condition. Without one, a long run ends at an arbitrary point. |
| Who owns the code | Whether to include the ownership sentence. |
| Is someone watching, or coming back later? | Whether to include progress-update text. |
| Which actions are risky or can't be undone | The approval rules. These must name exact actions. |
| Does the harness have subagents, and does it push delegation? | Whether to say anything about delegation. |
| Who reads the final report, and what do they already know? | Whether to include the report text, and any length or detail asks. |
| What gets carried in: CLAUDE.md, memory, notes, skills, agent files, an older prompt | What to audit in step 4. |
| Where the prompt goes: system prompt, first user message, CLAUDE.md, a subagent brief | The shape of the output, and whether the harness already says some of this. |

## 2. Pick the effort level

Recommend a level along with the prompt, because effort changes how the model works, not only how long it thinks.

- `low`: well-specified tasks, quick back-and-forth, high-volume subagents.
- `medium`: interactive coding, chat, everyday knowledge work.
- `high`: hard coding, research, agentic work, long unattended runs. This is the default, and where most of the capability already is.
- `xhigh`: the hardest long coding and agentic work, when a gain has been measured. Small score gain, many more tokens.
- `max`: open-ended problems like math or scientific discovery, where time and tokens don't matter.

For a big project the usual answer is `high`. A good pattern is to plan and iterate at `medium`, then raise effort for the long unattended part.

Three things follow from the level:

- At `low` and `medium` the model stops early more often. Agentic work at those levels wants the finishing block.
- At `high` and above the model thinks before nearly every reply. If easy turns are slow, lower the effort for those turns. A line like "answer directly without deliberating" doesn't work at `medium` and above, so don't write one.
- Effort barely changes reply length. Length and tone come from the prompt.

A setting tuned on Fable 5.1 or Opus 5.5 doesn't carry over. Say so if the user is porting one.

## 3. Write the prompt

Start from this skeleton. Drop any section that has nothing real to say. Write it as prose a smart new teammate could act on, not a wall of rules.

```text
# Goal
What to build or change, and why it matters. One short paragraph.

# Done means
The concrete end state, and the checks that prove it (tests, commands, a demo that runs).

# Context
Where things live. Point at files, docs, and prior decisions instead of retyping them.
What has already been tried or ruled out.

# Scope and ownership
Who owns the code. What is in bounds and what is not, each with its reason.

# Approvals
The exact actions that need a go-ahead first. Then the routine steps that don't.

# How to work
Order of work if it matters, how to verify as you go, when to use subagents.

# Keeping people informed
Updates during the run, and what the final report must contain.
```

Then add the tested blocks from `references/blocks.md`. Read that file before you write the prompt: it holds the exact text Anthropic tested, what each block changed, and what it costs in tokens. Use this table to choose. Add a block only when its trigger is true, because each one costs tokens and a block for a problem you don't have is just noise the model will follow anyway.

| Block | Add it when |
| --- | --- |
| Finishing work | The run is long, multistep, or unattended, and especially at `low` or `medium`. |
| Ownership sentence | You want the model to merge duplicate code and fix nearby problems. Leave it out when the user owns the code and wants a minimal diff. |
| Opening line, updates, recap | A person watches the work live. |
| One-line update every few tool calls | A person watches, and the harness can't be changed. |
| Harness reminder | You control the harness and it supports mid-conversation system messages. |
| Communicating clearly | Someone reads a final report or handoff without having seen the work. |
| Subagent tool description | The harness already invites delegation and the model starts more subagents than the task needs. |

Before adding a block, check what the target harness already says. Claude Code, for example, already carries its own finishing and reporting text. Saying it twice adds tokens and nothing else.

### Wording rules

These come from how closely Fable 5.2 reads. They matter more than any single block.

- **Name exact actions in approval rules.** The model applies a rule as written. "Ask before sending messages to people outside this conversation" made it hold back about half its routine requests to colleagues. Write "ask before emailing customers", not "ask before external communication".
- **Put the exception inside the rule.** "Never deploy" plus a separate "approved steps may proceed" line got the approved step taken about one time in ten. "Get a go-ahead before deploying" got it about nine in ten.
- **List the steps that need no approval.** A general "act more freely" changed nothing in testing. A line naming retries among the steps that need no approval did. Name retries only for calls that are safe to repeat.
- **Give every hard rule its scope and its reason.** A bare "never" spreads to cases it wasn't meant for. "Don't touch `migrations/` because another team owns it" stays put.
- **Separate ordinary obstacles from deliberate blockers.** Errors, timeouts, and failing tools are things to work through. A file marked off-limits or withheld access is something to leave alone and report. Keep that split whenever you adapt the finishing block.
- **Keep a confirmation step for risky or irreversible actions.** The finishing block makes the model ask less often, so the prompt must still say what always needs a yes.
- **When nobody is there to approve, turn approval rules into limits.** "Ask before X" stalls an unattended run all night. Write "don't do X; note what you wanted and why, and carry on with the rest", and approve the routine steps up front.
- **Don't ask for reasoning in the response.** "Show your reasoning" or "explain your thinking step by step" in the output can trigger a `reasoning_extraction` refusal. To see reasoning, read summarized thinking blocks instead.
- **Don't write a token budget into the prompt.** The size of a stated budget changes how much the model spends. Removing a large one cut cost with the same results.
- **Don't write hard style caps.** A rule like "20 words or fewer per sentence" makes the prose choppy. Describe the reader instead.
- **Tell the user to answer approvals in full.** "Yes, run the migration on staging" works better than "go".

## 4. Audit what gets carried in

A new prompt sits on top of everything else in context. If the project carries a CLAUDE.md, memory, notes, skills, agent files, or a prompt written for an older model, read them and flag these. This is often worth more than the new prompt.

- **Standing instructions to delegate.** They over-spawn subagents now. Remove the ones no longer needed.
- **Token budgets written into the prompt.** Test without them.
- **"Think less" or "answer directly" lines.** They don't work. Remove them and lower effort.
- **"Treat that answer as done" lines** from Opus 5.5 chat prompts. They cut thinking on follow-ups, but the model also stops pointing out its own earlier mistakes. Leave them out wherever self-correction matters.
- **Hard style rules.** Remove the ones no longer needed before adding the communicating-clearly block.
- **Built-up cautions.** Notes and memories collect "never retry", "stop at the first error", and the like, some written by the model itself. One "never retry" note among a dozen cut retries from nearly always to about four in ten. Delete cautions whose reason is gone. Rewrite the rest with scope and reason.
- **What reviewer agents attach.** A reviewer's "stop at the first error" overrode an explicit allowance to retry about a third of the time.
- **Harness code that edits earlier turns.** Changing the system prompt, tools, or an earlier message mid-conversation invalidates preserved thinking and can return a 400. Keep history append-only, and apply prompt changes in new conversations.

Report what you found and what you'd change. Don't edit or delete the user's memory, notes, or instruction files without a yes, and suggest keeping a copy of the originals.

## 5. Hand it over

Give the user:

1. **The prompt**, in one fenced block they can paste, or written to the file they named.
2. **The effort level** to run it at, with one sentence of why.
3. **What you added and what it costs.** One line per block, with the token cost from `references/blocks.md`.
4. **Cleanup to do first**, from step 4, if any.
5. **What to watch on the first run**: early stops, unneeded approval requests, silence, too many subagents, bolted-on code. Fix each one separately and measure it, because the blocks interact and each adds cost.

For an unattended run, lead the notes with two things a prompt can't do for itself. First, a prompt rule is a request, not a wall: name what can enforce the limits for real (a sandbox, a worktree, a permission mode). Second, check the run won't sit at a permission prompt all night, and suggest watching the first few minutes.

Keep the notes shorter than the prompt, which is the deliverable. Don't repeat findings that are already in the prompt, and don't list blocks you left out unless the reason would surprise the user.

If the project touches security or life-sciences work, mention that benign requests can still trip the `cyber` or `bio` classifiers (`stop_reason: "refusal"`), and that Anthropic's verification programs exist for that.
