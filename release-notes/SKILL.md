---
name: release-notes
description: Generate release notes for a Droplet GitHub release. Use when user says "release notes", "write release notes", "create release notes for v*", or provides a GitHub release version to document. Gathers PRs, Linear tickets, and media assets, then produces a markdown file following the team's established format.
allowed-tools: AskUserQuestion, mcp__linear__*, Bash(gh release:*), mcp__notion__*
---

# Release Notes Generator

Generate a markdown release notes document for a Droplet release by gathering data from GitHub, Linear, and Notion.

## Input

User provides a GitHub release tag (e.g. `v4.9.0`, `v4.9`, etc). Normalize to the format used by `gh release list` (typically `vX.Y.0`).

## Workflow

### 1. Get Release Info and PR Numbers

Run in parallel:

```bash
gh release list --limit 5                                          # find exact tag + previous tag
gh release view <tag> --json body,name,tagName,publishedAt         # release body has ALL PR numbers
```

Parse PR numbers from the release body — it already contains every merged PR with number and title. **Do NOT also run `gh api repos/.../compare/...`** — that's redundant with the release body.

### 2. Fetch All PR Details (single batch call)

Pass ALL PR numbers to the bundled script. It uses **GraphQL to batch-fetch everything in 1-2 API calls** instead of N individual REST calls:

```bash
bash <skill-dir>/scripts/fetch-pr-details.sh 9295 9263 8967 9306 ...
```

Each PR block in the output includes:

- **Base branch** — PRs merged into `deploy-v<prev>` shipped in the prior release (flagged with ⚠️). PRs merged into `main` are new.
- **Title and body** (800 char excerpt)
- **Media URLs** tagged `[BEFORE]`, `[AFTER]`, or `[STANDALONE]`

**⚠️ IMPORTANT: The script already checks base branches for prior-release overlap. Do NOT run a separate loop of `gh pr view --json baseRefName` calls — that duplicates work the script already did.**

Media preference: always use `[AFTER]` assets. Only use `[BEFORE]` for before/after comparisons. Skip `[BEFORE]`-only assets.

Optionally search for PRs referenced by Linear tickets but missing from the release body:

```bash
gh pr list --search "<keywords>" --state merged --json number,title
```

### 3. Additional Context (parallel, optional)

**Linear issues** — `mcp__linear__list_issues` with `label: "qa"` and `state: "ready for testing"`.

**Previous release notes from Notion** — fetch from Release Notes database (`collection://37a87d48-d6d7-490a-a387-71bd25cbaad9`) via `mcp__notion__notion-search` / `mcp__notion__notion-fetch` for format reference and overlap checking.

### 4. Categorize Changes

**Include in main release notes (user-facing only):**

- New features and capabilities
- Bug fixes that affect users
- UX improvements
- Security fixes

**Exclude from main sections (engineering-only, put in full changelog only):**

- Refactoring, code cleanup, dead code removal
- New lint rules, CI/CD changes
- Test improvements
- Migration housekeeping
- Developer tooling (unless it dramatically changes the dev experience)

**Filter out prior-release items** — any PR flagged ⚠️ by the script (merged into `deploy-v<prev>`) already shipped. Exclude from feature/bugfix sections but keep in full changelog.

### 5. Download Media Assets

GitHub `user-attachments` URLs require authentication and redirect. Use the bundled script (creates output directory automatically — do NOT run `mkdir` separately):

```bash
bash <skill-dir>/scripts/download-gh-assets.sh docs/release-notes-<version>-assets <url1> <url2> ...
```

Detects actual file types with `file` and renames accordingly — GitHub often serves GIFs as `.png` URLs.

### 6. Write the Markdown

Output to `docs/release-notes-<version>.md`.

#### Format

```markdown
# v<X.Y.0> — <Catchy Subtitle>

# <Headline Feature Name>

## BEHOLD

<screenshots/videos of the headline feature>

## What It Is

<description and bullet points>

## <Other Feature>

<description>

<media if available>

## <More features...>

# 🐞 Bug Fixes 🐛

- **Short label** — Description of fix
- ...

<details>
<summary>Full list of changes</summary>

## What's Changed

- PR title by @author in [#NNNN](https://github.com/drplt/drplt/pull/NNNN)
- ...

**Full Changelog**: [https://github.com/drplt/drplt/compare/<prev>...<current>](url)

</details>
```

#### Style Notes

- Catchy subtitle: fun/punny, references the headline feature. Previous examples: "Two Roads Diverged in a Workflow", "Radio Ga Ga", "Signed, Sealed, Delivered", "Packet Stuff"
- Lead with the most impressive feature, put screenshots/videos BEFORE the description
- Bug fixes use `**bold label** — description` format
- Full changelog in a collapsible `<details>` block
- Media: use markdown image syntax for images, raw URL for videos (Notion renders both)
- Reference PR numbers as `[#NNNN](https://github.com/drplt/drplt/pull/NNNN)`

### 7. Present to User

Show a summary of what was included and ask:

1. Whether the subtitle works
2. Whether any items should be added/removed
3. Whether items carried over from prior releases should stay
4. Whether any bug fixes were already in a prior release and should be dropped

The user will edit the markdown directly and then upload to Notion themselves.
