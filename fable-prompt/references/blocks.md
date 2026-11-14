# Tested prompt blocks for Fable 5.2

Each block below is text Anthropic tested, copied from the Fable 5.2 prompting guide. Treat each as a starting point: adapt the wording to the project, but keep the distinctions the notes call out. The numbers are from Anthropic's testing and vary by task.

## Contents

1. Finishing work
2. Ownership sentence
3. Opening line, updates, and recap
4. One-line update every few tool calls
5. Harness reminder for silent stretches
6. Communicating clearly
7. Subagent tool description
8. Changing a prompt mid-conversation

## 1. Finishing work

Use when a long, multistep task ends early: a list of what remains, an offer to continue, or a stop at an ordinary obstacle like a timeout. This happens more at `low` and `medium` effort.

```text
# Finishing work
Please avoid stopping while you still owe work the user asked for. Be persistent and do not stop unless needed.

While status notes are welcome, as is clarifying with the user on open decisions, carry on with work that does not depend on the user's answer without unnecessary stops.

If you notice yourself inviting the user to redirect you or offering to wait, instead proceed on the next part of the task. You may meet ordinary obstacles like errors, timeouts, locked files, empty results or failing tools. Diagnose them first, and when they are not real blockers, work through them with the access you have (wait and retry, fix the request, use another tool or source) rather than stopping unnecessarily.

If someone clearly decided something is a hard blocker, such as a file marked not to be touched, access that was intentionally withheld, or a safety guardrail, leave it alone, say plainly what you found, and look for another safe way to finish the task. Stopping before the task is complete is very rarely merited, as in when the task can't move forward without user input, or where the blocker is deliberate and should not be worked past. This does not override the need for confirmation on risky or destructive actions.
```

- **Keep when adapting:** the split between ordinary obstacles (work through them) and deliberate blockers (leave alone and report).
- **Effect:** at `medium` effort, about half as many sessions ended with doable work left. It removed most endings that ask permission or offer to continue. It did not remove endings that list what remains and then stop.
- **Cost:** output tokens up about 30 percent.
- **Pair with:** an explicit confirmation step for risky or irreversible actions, because the model asks less often with this text.

## 2. Ownership sentence

Use when you want the model to improve structure as it works: merge duplicate code, fix nearby problems.

```text
This codebase is yours: what it's for and how it's built are your call, and you'll keep building on it.
```

- **Effect:** the model merged repeated code in about half of tries with the sentence, under a tenth without. The requested feature worked nearly every time either way. The result held inside a long system prompt.
- **Cost:** about 1.5 times the output tokens. Several unrequested changes, many of them new tests and docs. Apart from bug fixes, it changed how an existing feature behaves in one try in six to ten, more often at higher effort.
- **Watch for:** the closing summary names the larger changes but often skips small ones. Review the diff, not only the summary.
- **Leave out when:** the user owns the code and wants it changed as little as possible. Without the sentence, or when the code is presented as someone else's, the model adds to the existing structure and reports nearby problems instead of fixing them.
- **Note:** a scope rule elsewhere doesn't cancel it. With "No drive-by refactors, renames or cleanups" earlier in the same prompt, the model still merged repeated code in about a third of tries. If you want a minimal diff, drop the sentence rather than trying to fence it in.

## 3. Opening line, updates, and recap

Use when a person watches the work live, as in interactive coding.

```text
Before you start, say in a line what you're about to do; brief updates while you work help the user follow along. Close with a short recap that stands on its own (what you found, what you did, and what's next), so a reader who only sees the last message has the full picture.
```

- **Effect:** the model spoke before its first tool call every time.
- **Cost:** output tokens per task up about 20 percent.
- **Skip when:** the run is asynchronous and the user comes back for the result. Gaps between updates matter less there.

## 4. One-line update every few tool calls

Use when a person watches the work and you can't change the harness, or the platform has no mid-conversation system messages.

```text
Every few tool calls, give the user a one-line update on where things stand.
```

- **Effect:** cut most long silent stretches on workflow automation tasks.
- Even with every update block in place, expect runs of several tool calls between updates.

## 5. Harness reminder for silent stretches

Use when you control the harness and it supports mid-conversation system messages. This is a harness change, not prompt text.

First check the client actually shows the model's updates. On Fable 5.2 the updates between tool calls arrive as progress-update `thinking` blocks, and their text is empty at the default `thinking.display` of `"omitted"`. A client that renders only `text` blocks looks silent. Set `display: "updates"` (beta header `thinking-display-updates-2026-08-18`) or `"summarized"`, and render the non-empty `thinking` blocks.

Then have the harness count consecutive tool-calling steps that gave the user nothing to read (no `text` block and no `thinking` block with text). After several in a row, append this after the latest tool results as a turn-scoped system message (`clear_at: "next_user_message"`, beta header `mid-conversation-system-clear-at-2026-08-21`):

```text
The user hasn't heard from you in a while: say in a few words what you're doing, then continue.
```

- **Effect:** roughly halved the longest silent stretch, with no noticeable increase in tokens or time.
- **Keep each reminder in `messages` on later requests.** Removing or rewording one edits an earlier turn and invalidates the thinking blocks after it.
- For the most updates, pair it with block 3.

## 6. Communicating clearly

Use when someone reads a final report or handoff without having seen the tool calls or files behind it. Adjust it to the readers and the product. You can add a length limit or ask for specific details.

```text
# Communicating clearly
Write for an intelligent but low-context reader. The person reading has not seen your tool calls, your reasoning or the files you opened, and may be switching in from other work. Messages should generally be self-contained: the reader should understand what you mean without having to dig for other context. Put the key points in the first few sentences. Practice progressive disclosure in your sentence order, and do not use undefined references and ideas in line 1 that won't make sense until the reader reaches line 12.

Use plain words, and write in clear, understandable full sentences. Do not use a term or abbreviation that you made up during the work. Say what the thing is in a way any reader would understand. Write mostly in the style of ASD-STE100 Simplified Technical English: short sentences, one idea per sentence, active voice, and consistently using the same word for the same thing. Use a paragraph of flowing prose where ideas connect, and keep bullets for lists of separate items. Leave out unnecessary details unless the reader asks and practice concision, but do ensure that your messages have the key context. Aim to make your user-facing text as human-readable and clear as possible.
```

- **Effect:** final reports were less dense, with fewer semicolons, and shorter sentences on workflow automation tasks.
- **Before adding:** remove older hard style rules that are no longer needed. The model follows both, and hard caps make the prose choppy.

## 7. Subagent tool description

How much Fable 5.2 delegates depends on the harness. With a minimal subagent tool on short tasks it rarely starts one. In a product whose prompts invite delegation it delegates readily.

Work in this order:

1. Review lines in the system prompt, skills, and agent files that tell the model to delegate. Remove the ones no longer needed.
2. Only if the model still starts more subagents than the tasks need, rewrite the description of the tool that starts subagents.

Anthropic's guide doesn't publish its tested description verbatim. It says what a good one does, in this order:

- State what a subagent adds to the cost of a session. Put this first. These opening sentences are what hold delegation back.
- Say when delegation is worth it (independent work that runs in parallel, a side task that shouldn't block the main thread, reading across many files where only the conclusion matters) and when it isn't (a handful of tool calls, a lookup whose target is already known).
- Tell the model how to brief a subagent it starts: the goal, what's already ruled out, where to look, a narrow scope.

Tuning: say less about cost if the model delegates too little. Say more about what a subagent costs in this harness if it still delegates too much. Test each change.

- **Effect:** the model delegated about a third less often than with a description that mostly listed reasons to delegate. Task success was the same.
- At `xhigh` and `max`, Fable 5.2 also uses subagents to review its own work, which 5.1 didn't.
- Fable 5.2 works well as planner and orchestrator for other models. Check which model the harness runs subagents on by default, because subagents can be a large part of a session's cost.

## 8. Changing a prompt mid-conversation

Apply new system-prompt text, removed lines, and tool-description changes in new conversations only. Fable 5.2 uses preserved thinking, and the API enforces a prefix check: a request that sends thinking blocks back after `system`, `tools`, or an earlier message changed can return a 400. A stored conversation resumed with new text can fail.

To change instructions partway through, put them in the newest turn, or append a mid-conversation system message where the platform supports it. To shorten history safely, use context editing or compaction that keeps no earlier turns after the summary.
