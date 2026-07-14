---
name: stacked-prs
description: Create and maintain stacked pull requests on GitHub using git & gh. Use when the user wants to stack a new PR on top of an existing branch/PR, update a stack, bring a stack up to date, refresh stacked PRs, restack after a PR merges, rebase a stack, sync a stack with main, propagate changes from a lower PR upward, push the whole stack, or inspect a dependent PR chain. Triggers on "stacked PR", "stack a PR on top", "update my stack", "bring my stack up to date", "refresh my stack", "restack", "rebase the stack".
---

# Stacked PRs

Use this for creating or maintaining dependent PR chains. The stack grows upward from `main`: `main → B1 → B2 → B3`, where `B1` is the bottom PR and `B3` is the top or tip. Each PR targets the branch immediately below it. Adding a PR "on top" means branching from the current tip. Do not use this skill for a single ordinary PR.

## Core Rules

- The GitHub PR base chain is the source of truth for the current open stack. Existing `pr-stack` description blocks are the source of truth for historical stack membership. Never reconstruct a description solely from open PRs.
- Do not `git pull` on stack branches. Use `git fetch origin`, then explicit rebase commands.
- Prefer rebasing from the stack tip with `--update-refs`; intermediate local branch refs move with the rebase.
- `--update-refs` only moves local refs that exist and are not checked out in another worktree. Materialize every stack branch locally before a stack rebase.
- After squash merge, use `git rebase --onto <new-base> <merged-branch> <tip>` while the merged branch still exists locally.
- Push rewritten stack branches with `--force-with-lease`, never plain `--force`.
- Treat `--force-with-lease` as a final race detector, not proof that the rewrite is correct. Fetching changes its expected value, and background fetches can weaken an implicit lease. Prove the local and remote state before rewriting and inspect it again immediately before pushing. If branches are shared or the repository may fetch automatically, use an explicit expected remote SHA or stop for confirmation.
- Never rewrite a mid-stack branch's history in isolation while branches above it still point at the old commits. Appending commits to a branch is safe; rewrites happen once, from the tip, with `--update-refs`.
- Do not delete merged or removed branches automatically. Branch cleanup is outside the restacking workflow unless the user explicitly requests it.

## Runbook

### Stack PR Description Format

Use the `/create-pull-request` skill when creating each PR so the format broadly matches.

Add a section to the PR's descriptions to help reviewers navigate the stack. It should be a list of PR numbers with a pointer to the current pr, like this:

```markdown
<!-- pr-stack:start -->

# PR Stack:

- #1234
- #1233 👈 this PR
- #1232

<!-- pr-stack:end -->
```

Do not add more text or emojis to the markdown list. GitHub renders the PR numbers as the full titles, so extra content just makes it harder to read.

When updating `pr-stack` sections, preserve every PR already recorded as part of the stack, including merged and closed PRs. Keep entries in their original stack position. Add newly discovered PRs, but don't remove an existing entry because it is no longer open or no longer appears in the current GitHub base chain.

### Adding, Updating, Merging, Maintaining Stacked PRs

1. Check the worktree before rewriting history. `git status --short` must produce no output; if it does, preserve the work and stop before rebasing:
   ```bash
   git status --short
   ```
2. Fetch remote refs and candidate PRs:
   ```bash
   git fetch origin
   gh pr list --author @me --state open --limit 200 \
     --json number,headRefName,baseRefName,title,url,isDraft,body
   ```
   Drop `--author @me` if collaborators may own PRs in the chain.
3. Walk the PR chain from the current or named branch:
   - Down: find the PR whose `headRefName` is the branch; its `baseRefName` is the next branch down.
   - Up: find PRs whose `baseRefName` is the branch; each matching `headRefName` is a child.
   - If one branch has multiple children, ask which child branch belongs in this stack.
4. Track two different ordered lists:
   - **Active branch list:** the open branches found from the current GitHub base chain, bottom to top: `B1 B2 B3`. Use this list for rebasing and pushing.
   - **Description lineage:** every PR historically recorded in the stack, including merged and closed PRs. Use this list only for PR descriptions.

   Build the description lineage before rewriting any description:
   - Read the content between `<!-- pr-stack:start -->` and `<!-- pr-stack:end -->` from every open PR in the active chain.
   - Start with the most complete existing ordered list. Preserve any additional PR numbers found in the other blocks without removing or reordering existing entries. If the blocks disagree about the relative order of the same PRs, stop and ask the user which order is correct.
   - Add active PRs missing from the lineage in the position implied by the current base chain.
   - If no marked block exists yet, initialize the lineage from the active chain.

5. Prove the preflight invariants before choosing or running a rewrite:
   - Every active branch and every branch used as a rebase boundary exists locally.
   - No relevant branch contains remote commits missing locally.
   - Record the remote-tracking SHA for every branch that may be pushed so later fetches are visible.
   - Each active local branch is an ancestor of the branch immediately above it.
   - No branch expected to move is checked out in another worktree.

   Useful evidence includes:

   ```bash
   git rev-parse --verify refs/heads/<branch> || git branch <branch> origin/<branch>
   git rev-list --count <branch>..origin/<branch>   # must print 0 for every branch
   git rev-parse origin/<branch>                    # record before rewriting
   git merge-base --is-ancestor <lower-branch> <upper-branch>
   git worktree list --porcelain
   ```

   A non-zero count means origin has commits the local branch lacks (a web-UI review suggestion, another machine, a teammate). A failed ancestry check can mean a lower branch grew without being propagated. Diagnose the observed state instead of mechanically continuing. If the histories truly diverged or the intended history is ambiguous, ask the user which side wins.

6. Run the matching workflow below only when its assumptions match the observed repository state. The commands are examples of common stack shapes, not scripts to execute blindly.
7. Before pushing, prove the post-rewrite invariants:
   - The rebase completed successfully and every active branch moved as intended.
   - Each active branch is still an ancestor of the branch immediately above it.
   - The resulting PR bases will represent that same chain.
   - No branch outside the intended active stack will be pushed.
   - The remote-tracking refs still represent the remote state examined during preflight.

   When the result is unclear, inspect the actual graph:

   ```bash
   git log --graph --decorate --oneline --all
   ```

   If an invariant fails, stop and diagnose it before changing PR bases or pushing.

8. Re-walk PR bases after the rebase. Retarget with `gh pr edit <num> --base <branch>` only if GitHub did not already do it.
9. Push the stack:
   ```bash
   bash scripts/stack-push.sh <B1> <B2> <B3>
   ```
10. Update the marked stack block in every open PR in the active chain:

- Render the complete description lineage, not just the active PRs. GitHub supplies the merged and closed status in its UI; do not add status text or emoji.
- Put `👈 this PR` on the PR whose description is being updated and nowhere else.
- Replace only the content from `<!-- pr-stack:start -->` through `<!-- pr-stack:end -->`. Preserve the rest of the description.
- Do not edit descriptions of merged or closed PRs.

## Common Workflows

### Add a PR on top

If the user says "top of the stack," inspect the stack first and use the current tip as `<parent-branch>`.

```bash
git checkout <parent-branch>
git checkout -b <new-branch>
# work, commit
git push -u origin HEAD
gh pr create --base <parent-branch> --fill --draft
```

The PR base must be the parent branch, not `main`. Fix mistakes with:

```bash
gh pr edit <num> --base <parent-branch>
```

### Update or sync the stack with main

Use when `main` moved forward and the stack should be replayed on top.

```bash
git fetch origin
git checkout <tip-of-stack>
git rebase --update-refs origin/main
# resolve conflicts if needed; see references/conflicts.md
bash scripts/stack-push.sh <branches-bottom-to-top>
```

### Restack after a PR merges

First identify which branch merged.

If the bottom PR merged by merge commit or rebase-merge:

```bash
git fetch origin
git checkout <tip-of-remaining-stack>
git rebase --update-refs origin/main
bash scripts/stack-push.sh <remaining-branches-bottom-to-top>
```

If the bottom PR was squash-merged:

```bash
git fetch origin
git checkout <tip-of-remaining-stack>
git rebase --update-refs --onto origin/main <merged-branch>
bash scripts/stack-push.sh <remaining-branches-bottom-to-top>
```

The merged branch must still exist locally for the `--onto` command. Preserve it after the restack too; cleanup is a separate, explicitly requested operation.

If a middle PR merged, its changes landed on the _remote_ copy of its base branch: when `B2` merges, `origin/B1` moves forward but local `B1` does not. Bring local `B1` up to date before rebasing, and do not push it. For `B1 → B2 → B3 → B4` where `B2` merged:

```bash
git fetch origin
git checkout B4
git rev-list --count origin/B1..B1     # must print 0; if not, stop — local B1 has unpushed work
git branch -f B1 origin/B1             # fast-forward local B1 to include B2's merge
git rebase --update-refs --onto B1 B2
bash scripts/stack-push.sh B3 B4       # never push B1 — it already matches origin
gh pr edit <B3-pr-number> --base B1    # only if GitHub did not retarget it
```

Preserve `B2` after the restack. Rebasing onto a stale local `B1` and pushing it would rewind `origin/B1` and erase `B2`'s merged work from GitHub. The preflight state checks prevent that; an implicit lease alone is not sufficient evidence.

### Propagate changes from a lower PR

If `B2` gained new commits in `B1 → B2 → B3 → B4`, rebase the tip onto the updated lower branch:

```bash
git checkout <tip-of-stack>
git rebase --update-refs B2
bash scripts/stack-push.sh B1 B2 B3 B4
```

This is safe only because `B2` _grew_ — the tip's history still contains B2's old commits as ancestors, so the rebase replays just the upper branches. If `B2` was instead _rewritten_ (amend, squash, reorder), the stack now holds two divergent copies of B2's history and this command becomes a conflict-and-empty-commit minefield.

So for fixup commits, never autosquash a mid-stack branch in isolation. Do the rewrite once, from the tip, so `--update-refs` moves every ref in the same operation:

```bash
# fixup not committed yet: commit it on the tip, then squash from the tip
git checkout <tip-of-stack>
git commit --fixup <sha-of-target-commit>
GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash --update-refs <base-of-stack>

# fixup already committed on B2: propagate the append first (safe), then squash from the tip
git checkout <tip-of-stack>
git rebase --update-refs B2
GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash --update-refs <base-of-stack>
```

`<base-of-stack>` is what `B1` branched from, e.g. `origin/main`. `GIT_SEQUENCE_EDITOR=:` accepts the generated todo list without opening an editor.

## References

- `scripts/stack-push.sh` force-pushes named local branches with `--force-with-lease`. It does not detect the stack.
- `references/conflicts.md` covers conflict handling, `rerere`, abort/skip strategy, and worktree warnings.
- `references/recipes.md` covers uncommon stack surgery: insert, drop, split, reorder, move commits between branches, reparent, and retroactively convert one large PR into a stack.
