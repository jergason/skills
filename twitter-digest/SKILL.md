---
name: twitter-digest
description: Use when user wants to review Twitter/X bookmarks, analyze recent saves, extract themes, explore linked content, or write a bookmark digest. Triggers on "review bookmarks", "what did I bookmark", "bookmark digest", "analyze my bookmarks", "bird bookmarks", "twitter bookmarks".
allowed-tools: Bash(bird bookmarks *), Bash(gdate *), Bash(date *), Bash(bird read *), Bash(bird thread *), Bash(bird --help*), Bash(python3 *filter_bookmarks.py*), Bash(wc *), Bash(ls *), WebFetch, Read(~/Documents/Lab Notebook/**), Write(~/Documents/Lab Notebook/**), Edit(~/Documents/Lab Notebook/**)
---

# Reviewing Twitter Bookmarks

Analyze recent Twitter/X bookmarks using the `bird` CLI, explore linked content, identify themes, and write a digest to the weekly lab notebook.

Include links to any referenced material. Prefer over-including links to under-including them.

Handle bookmarks that are part of a thread correctly by reading the whole thread and including context, summarizing the full conversation and including links in the thread.

Use `bird --help` to explore available commands.

## Default Behavior

- Fetch bookmarks from the past 24 hours
- Resolve shortened URLs to canonical URLs
- Fetch and summarize linked content
- Group by themes. Use the AskUserQuestions skill to confirm themes of interest
- Identify follow-up actions. Use the AskUserQuestions skill to confirm follow-ups
- Append digest to weekly lab notebook

## Fetching Bookmarks

```bash
bird bookmarks --author-chain --json -n 50 | python3 filter_bookmarks.py 24h
```

If fewer than expected bookmarks returned, paginate with `--all --max-pages 5`.

## Timeframe Options

- `24h` (default) - past 24 hours
- `3d` - past 3 days
- `7d` or `week` - past week
- `Nh` - past N hours (e.g. `48h`)
- `Nd` - past N days (e.g. `5d`)

## Processing Each Bookmark

For each bookmark:

1. **Extract URLs** from tweet text
2. **Resolve canonical URL** - follow redirects to get final destination
3. **Fetch page content** - use WebFetch to get title and summarize
4. **Note the tweet context** - why was this bookmarked? what did the author say?

## Identifying Themes

After processing, group bookmarks by:

- Topic clusters (AI, programming, design, etc.)
- Content type (articles, threads, tools, papers)
- Action type (to read, to try, to research further)

**Ask the user** which themes resonate and what follow-ups they want to capture.

## Writing the Digest

Append to: `~/Documents/Lab Notebook/Lab Notebook/[YEAR]-W[WEEK].md`

Use `gdate +"%G-W%V"` for the filename.

### Digest Format

```markdown
---

## Bookmark Review - [Date]

> [!medium-signal]
> Twitter bookmark digest - curated content and follow-ups

### Themes Identified
- **[Theme 1]**: Brief description
- **[Theme 2]**: Brief description

### Bookmarks

#### [Theme 1]

**@[Author] - [Brief context]**
> [Key quote or summary from tweet]

Links:
- [Page Title](canonical-url) - [1-2 sentence summary]

---

### Follow-up Items

> [!high-signal]
> Action items from bookmark review

- [ ] [Actionable item based on bookmark] (include links to relevant material)
- [ ] [Another follow-up]

### Raw Bookmarks (collapsed)

<details>
<summary>All bookmarks from this review</summary>

- @[Author] - [Tweet text with links]
  - [Canonical URL]
- etc

</details>
```

## Handling Edge Cases

- **No bookmarks in timeframe**: Report this, offer to expand window
- **Failed URL resolution**: Note the t.co link, skip content fetch
- **Rate limiting**: Back off, process what we have
- **Large bookmark count**: Process in batches, summarize incrementally

## Interactive Checkpoints

1. After theme analysis: "I see these themes: [...]. Which interest you?"
2. Before writing: "Here's the draft digest. Want me to add/change anything?"
3. After writing: "Here are the follow-up items. Anything you want to dive into?"
