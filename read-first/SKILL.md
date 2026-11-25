---
name: read-first
description: Before picking a direction on open-ended or creative work, go read real books, essays, papers and talks (including ones from far-off fields) and let them seed the ideas. Use when the user wants ideas, a concept, a design direction, a name, an architecture to explore, a generative or artistic piece, or says "go read something first", "get inspired", "find inspiration", "what would X do", or complains that the ideas are boring, obvious, or samey.
argument-hint: "What are we deciding?"
---

# Read first, then decide

Ideas that come straight out of a prompt tend to be the average of your weights. That's boring. Instead, before choosing a direction, read some real things and steal from the best ones.

The goal isn't a literature review. It's to load a few specific, strange, concrete ideas into context so the directions you propose have a pedigree.

## 1. Pin down the decision

Write one or two sentences: what's being decided, and what the constraints are (medium, audience, tech, time). Keep it short. If the user gave you enough, don't ask.

Then name the problem's _shape_ in a domain-free way. "A UI for browsing a huge archive" is also "how do you make a vast space feel walkable." "A synth patch that evolves" is also "a system that changes slowly without repeating." The shape is what lets you find useful sources outside the obvious field.

## 2. Build a reading list

Aim for 8 to 12 sources, in three rings:

- **Near** (2 to 3): the home field. The best prior work, the classic essay, the paper everyone cites.
- **Adjacent** (3 to 4): neighboring fields that solve a similar problem. Typography for a data viz problem. Game design for an onboarding flow. Architecture for an info hierarchy.
- **Far** (3 to 5): fields with the same shape and nothing else in common. Math, music theory, biology, fiction, cartography, liturgy, textile craft, urban planning. This ring is where the interesting ideas come from, so don't skip it.

Prefer primary sources: papers, essays, book chapters, talks, artist statements, design docs, old manuals. Avoid listicles, SEO blogs, and "top 10 tips" content. Weird is good.

## 3. Actually read them

Open each source and read real content, not just the title or abstract. If a source won't load, swap it for another one rather than pretending.

If the list is long, you can split the reading across a few subagents, each taking one ring. Give each the problem shape and ask for notes in the format below.

For each source, write a short note:

```
### <Title> — <author>, <year>
<link>
- Core idea: one or two sentences in your own words.
- Transferable move: the specific technique, structure, or rule that could apply here.
- Quote (optional, under 15 words): the line that made it click.
```

Only list things you actually opened.

## 4. Cross-pollinate

Now generate 4 to 6 directions. Each one has to come from the reading:

- Name it.
- Say which source (or pair of sources) it borrows from, and what exactly it borrows.
- Describe what it would look like here, concretely.

The best directions usually combine a near source with a far one. If every direction traces back to the near ring, go back to step 2 and push further out.

Include at least one direction that feels too weird. It's often the one worth half-keeping.

## 5. Recommend

Pick one direction (or a blend) and say why it fits the constraints. Then hand back:

1. The reading list, with links, grouped by ring.
2. The notes.
3. The directions, each with its lineage.
4. The recommendation and a first concrete step.

Keep the notes tight. The user should be able to skim the list, click the two that look interesting, and see where each idea came from.

## Things that go wrong

- **Only reading the top search results.** You get the same sources everyone else got, and the same ideas. Search with the problem _shape_, and with far-field terms.
- **Picking sources that confirm the obvious plan.** If you already know the answer, reading is just decoration. Read before deciding, not after.
- **Vibes-only borrowing.** "Inspired by Borges" means nothing. "Borrows the encyclopedia-that-rewrites-the-world structure from Tlön: each saved search quietly reshapes the default view" means something.
