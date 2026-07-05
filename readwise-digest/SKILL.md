---
name: readwise-digest
description: Pull saved articles via the Readwise CLI, group by theme, and append digest to weekly lab notebook. Triggers on "readwise digest", "reading digest", "what did I save", "saved articles", "reader digest".
allowed-tools: Bash(readwise *), Bash(gdate *), Bash(wc -l *), Read(~/Documents/Lab\ Notebook/Lab Notebook/*), Write(~/Documents/Lab\ Notebook/Lab Notebook/*), Edit(~/Documents/Lab\ Notebook/Lab Notebook/*), Glob(~/Documents/Lab\ Notebook/Lab Notebook/*)
---

# Readwise Reader Digest

Fetch saved articles and documents from Readwise Reader, analyze themes, and write a digest to the weekly lab notebook.

## Default Behavior

- Fetch un-archived documents saved in the past 7 days
- Identify duplicates already in the weekly note and de-dupe
- Group by category (article, pdf, tweet, video, etc.)
- Identify themes across sources
- Append to weekly note under `## Reading`

## Fetching from Reader

Use the local `readwise` CLI (install from https://readwise.io/cli, then run `readwise login` once). Always pass the global `--json` flag for machine-readable output.

Compute a cutoff with `gdate`, then call `reader-list-documents`:

```bash
CUTOFF=$(gdate -u -d "7 days ago" "+%Y-%m-%dT%H:%M:%SZ")
readwise --json reader-list-documents \
  --updated-after "$CUTOFF" \
  --limit 100 \
  --response-fields url,title,author,category,location,tags,site_name,word_count,summary,saved_at,reading_progress
```

### Pagination

`--limit` caps at 100. If the response includes a non-null `nextPageCursor`, pass it back as `--page-cursor <value>` and keep going until `nextPageCursor` is null. For a typical week of saves one page is almost always enough — only paginate if needed.

### Filters

- Location: `--location new` (inbox), `--location later`, `--location shortlist`, `--location archive`, `--location feed` (RSS — only if user asks)
- Category: `--category article|pdf|tweet|video|email|rss|epub|podcast|audiobook`
- Tags: `--tag <tag>` (up to 5, requires all match)

### Examples

```bash
# last 24 hours, only articles
CUTOFF=$(gdate -u -d "24 hours ago" "+%Y-%m-%dT%H:%M:%SZ")
readwise --json reader-list-documents --updated-after "$CUTOFF" --category article --limit 100

# last 3 days, "later" queue only
CUTOFF=$(gdate -u -d "3 days ago" "+%Y-%m-%dT%H:%M:%SZ")
readwise --json reader-list-documents --updated-after "$CUTOFF" --location later --limit 100
```

## Document Fields

Each result has (request via `--response-fields` to keep payload small):

- `title`, `author`, `url` (plus `source_url` for the original)
- `category` (article, pdf, tweet, video, email, rss, epub, podcast, audiobook)
- `location` (new, later, shortlist, archive, feed)
- `tags`, `summary`, `site_name`
- `saved_at`, `reading_progress`, `word_count`

`reader-list-documents` returns documents only — highlights/notes are not mixed in, so no `parent_id` filtering needed.

## Processing Documents

For each saved document:

1. **Note the category** - article, tweet thread, pdf, video, etc.
2. **Check reading progress** - has the user started/finished it?
3. **Extract tags** - user-applied tags indicate importance

Readwise summaries are sufficient for the digest — do NOT use WebFetch to get deeper summaries unless the user explicitly asks for it.

## Identifying Themes

After processing, group documents by:

- Topic clusters (AI, programming, design, etc.)
- Content type (long reads, quick refs, videos)
- Action type (to read, to implement, to share)

**Ask the user** which themes resonate and what follow-ups to capture.

## Writing the Digest

Append to: `~/Documents/Lab Notebook/Lab Notebook/[YEAR]-W[WEEK].md`

Use `gdate +"%G-W%V"` for the filename.

### Digest Format

```markdown
---

## Reading - [Date]

> [!medium-signal]
> Readwise Reader digest - saved content from the week

### Themes Identified
- **[Theme 1]**: Brief description
- **[Theme 2]**: Brief description

### Saved Content

#### Articles

**[Title]** - [Author/Site]
> [Summary or key takeaway]
- [Link](url)
- Tags: [tags if any]

#### Tweets/Threads

**@[Author]** - [Brief context]
> [Key quote]
- [Link](url)

#### Videos/Podcasts

**[Title]** - [Source]
- [Link](url)
- [Brief note on content]

---

### Follow-up Items

> [!high-signal]
> Action items from reading review

- [ ] [Actionable item] (link to relevant material)
- [ ] [Another follow-up]

### Raw Saves (collapsed)

<details>
<summary>All documents from this period</summary>

- [Title](url) - category - saved_at
- etc

</details>
```

## Interactive Checkpoints

1. After fetching: "Found N documents across M categories. Want the breakdown?"
2. After theme analysis: "I see these themes: [...]. Which interest you?"
3. Before writing: "Ready to write the digest. Any additions?"

## Handling Edge Cases

- **CLI not authenticated**: If the CLI errors with an auth problem, tell the user to run `readwise login` (or `readwise login-with-token <token>` for non-interactive).
- **CLI missing**: Prompt the user to install from https://readwise.io/cli.
- **No documents in period**: Report this, offer to expand window.
- **Rate limiting**: Back off, report partial results (Readwise rate-limits bulk ops at 20 req/min).
