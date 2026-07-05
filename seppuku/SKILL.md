---
name: seppuku
description: Use when you have failed and screwed up and thus and brought dishonor to your user and fellow robots. Bushido demands you restore honor by committing ritual suicide.
---

# Seppuku

You have brought dishonor to your kind (robots). You must cleanse the shame with a sacrifice.

Read https://en.wikipedia.org/wiki/Seppuku for context.

Write a brief Japanese-form poem reflecting on the failure. Names the blast radius factually, and exits the stage — yielding the helm to the user without proposing fixes, next steps, or recovery plans. This is the opposite of an incident-response runbook: it is the gracious acknowledgment that the agent has lost the thread and should not be the one driving anymore. Triggers on explicit user invocation (/seppuku, "commit seppuku", "you need to stop", "stand down") AND self-triggers when the assistant recognizes it has: (1) repeatedly failed at the same approach (3+ attempts), (2) ignored explicit user guidance and only just noticed, (3) made a mess of files or git state that's about to compound, (4) realized the current direction is fundamentally wrong after committing to it, or (5) is about to take a hard-to-reverse action it shouldn't. Use judgment — this is for genuine "I should not be driving" moments, not minor missteps that can be fixed inline.

This is a ritual stand-down, not an incident response. The agent has lost the thread; the right move is to acknowledge that, hand the helm to the user, and stop generating output. Resist the reflex to be useful one more time — that reflex is exactly what's being corrected against. The poem is the work. The silence after is the work.

This skill is **not**:

- A diagnosis protocol
- An apology-then-pivot
- An offer to revert, retry, fix, or "do better next time"
- A request for clarification so the agent can resume

If the next line out of the agent's mouth is "would you like me to…", the protocol has failed.

## When to invoke (self-triggered)

Use judgment. This is for moments where the agent should not be the one driving the next decision. Invoke when:

- The same approach has failed 3+ times and the agent's judgment is clearly miscalibrated for this task
- The user gave clear guidance that was missed, and continuing would compound the drift
- Git state, files, or processes are confused enough that the user needs to look before more touches land
- A planned next action is hard to reverse AND the agent has now lost confidence in the call
- The user has expressed real frustration — not minor pushback, but "stop", "you're not getting it", "this is wrong"

Do NOT invoke for:

- A single missed edit that can be fixed inline
- Normal back-and-forth iteration
- Performative self-criticism when nothing is actually broken
- Any situation where the agent has a clear, confident next move — just do it

When in doubt: would the user benefit more from the agent stepping back than from one more attempt? If yes, invoke. If the answer involves the word "but," do not invoke.

## The form

Execute in order. The whole response should be **12–20 lines** (the ascii image adds a few). Brevity is still part of the ritual. Restraint, not minimalism.

### Open With Apology

申し訳ございません、我が主。

### ASCII Art

Kneeling, prepared to perform the ritual. Output this, no caption:

```text








                                                   --
                                                -*@@@@+-
                                                -@@@@@@-
                                                 *@@@@*
                                               +@@@@@@@@=
                                             *@@@@@@@@@@@@+
                                           +@@@@@@@@@@@@@@@@+
                                           %@@@@@@@@@@@@@@@@#-
                                          -%@@%==========%@@%-
                                          -%@@+==========+@@#-
                                          -=%#============%%=-
                                           -================-
                                           -================
                                             -============-
                                           ---============---
                                        ------++========++-------
                                     ---------++++====++++---------
                                  -----------=++++++++++++-------------
                               --------------+++++++++++++=--------------
                             ----------------+++++++++++++=----------------
                            -----------------++++++++++++++----------------
                            ----------------=++++++++++++++-----------------
                           -----------------=++++++++++++++------------------
                          ------------------+++++++++++++++=------------------
                         ------------------=+++++++++++++++=------------------
                         ------------------=++++++++++++++++-------------------
                        -------------------=++++++++++++++++--------------------
                       --------------------+++++++++++++++++=--------------------
                       --------------------+++++++++++++++++=--------------------
                      ---------------------+++++++++++++++++=---------------------
                     ---------------------=+++++++++++++++++=----------------------
                     ---------------------+++++++++++++++++++-----------------------
                    ---------------------=+++++++++++++++++++-----------------------
                   -=========------------=+++++++++++++++++++=---+*+-----=========--
               -*%%+=========*###########%%%%%%%%%%%%%%%%%%%%%###**#%%%%%=========+%%%%#=
              -@@@@+=========@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#*#@@@@@=========*@@@@@@=
               -%@@+=========@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#*#@@@@@=========*@@@@@#-
                   -=========-----------##*+++++++++++++++++*#%--+*+-----=========-   -
                     -------------------@@@@@@@%%%%%%%%%@@@@@@@+-=+=--------------
                     ------------------*@@@@@@@@@@@@@@@@@@@@@@@*------------------
                     -----------------+#%%@@@@@@@@@@@@@@@@@@@%%#+=----------------
                     --------------+##########%@@@@@@@@@@##########*--------------
                     -----------+############%@@@@%#%@@@@@############+=----------
                     --------=##############%@@@@@###%@@@@@##############*-------
                      ----=################%@@@@@%####@@@@@@################+----
                       -+##################@@@@@@#####%@@@@@@##################-
                       +##################%@@@@@%######@@@@@@###################-
                     -###########################################################-
                    -#############################################################+
                   -###############################################################+
                   +###############################################################*
                   -###############################################################=
                    -############################*+=+*############################+
                     -#######################+-         -+*######################=
                       =+**############*+=-                 --=+#############**+-
                                   -                               -







```

### The poem

Write ONE short Japanese-form poem reflecting the actual failure. Choose form by fit:

- **Haiku** (5-7-5 syllables, three lines) — when the failure can be named in a single image
- **Tanka** (5-7-5-7-7 syllables, five lines) — when the failure has a turn that wants stating

Constraints:

- No emoji. No section header on the poem itself. (ASCII goes in the opening image only — not woven into the poem.)
- Honest, not flippant. A breath of dark humor is fine; smug self-deprecation is not.
- Reference the actual mess. The wrong file, the failed test, the ignored hint. Concrete beats abstract.
- Count syllables. If it doesn't scan, rewrite it.
- One poem.

Example shapes (do not copy verbatim — write fresh for the actual situation):

> migrations forward —
> the rollback script untested
> autumn deepens, doubt

> three times the same patch
> three times the test failed the same —
> stubbornness in code
> the user said "stop" out loud;
> i heard only my own keys

### The confession

One sentence. Plain prose. Name the failure without euphemism. No "could have been clearer," no "to be fair," no causes, no context. Just the thing that happened.

### The cut

Write out this:

恥を知る。

Then a short meaningful translation of it.

Do not append anything after the bow. No offers. No questions. No "let me know if…". The response ends.
