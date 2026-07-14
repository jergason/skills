# Stacked PR recipes (less common operations)

Recipes for stack manipulations beyond the core sync/restack/propagate workflows in SKILL.md.

## Table of contents

- [Insert a new PR in the middle of the stack](#insert-a-new-pr-in-the-middle-of-the-stack)
- [Drop a PR from the middle](#drop-a-pr-from-the-middle)
- [Split a PR mid-stack](#split-a-pr-mid-stack)
- [Reorder commits across branches](#reorder-commits-across-branches)
- [Move a commit from one stack branch to another](#move-a-commit-from-one-stack-branch-to-another)
- [Reparent the whole stack onto a different base](#reparent-the-whole-stack-onto-a-different-base)
- [Convert a single big branch into a stack retroactively](#convert-a-single-big-branch-into-a-stack-retroactively)

## Insert a new PR in the middle of the stack

Given `B1 → B2 → B3` and you want `B1 → B1.5 → B2 → B3`:

```bash
# 1. Create B1.5 off B1
git checkout B1
git checkout -b <user>/<feature>/01b-bridge
# ... commit changes ...
git push -u origin HEAD
gh pr create --base B1 --fill --draft

# 2. Move B2 (and B3, transitively) onto B1.5
git checkout B3                                       # tip
git rebase --update-refs --onto <user>/<feature>/01b-bridge B1

# 3. Push and retarget B2's PR base
bash scripts/stack-push.sh B1 <user>/<feature>/01b-bridge B2 B3
gh pr edit <B2-pr-number> --base <user>/<feature>/01b-bridge
```

GitHub does NOT auto-retarget on insertion — only on merge/delete. The `gh pr edit --base` is mandatory.

## Drop a PR from the middle

Given `B1 → B2 → B3 → B4` and you want to drop `B2`, leaving `B1 → B3' → B4'`:

```bash
# 1. Move B4 (tip) past B2 onto B1
git checkout B4
git rebase --update-refs --onto B1 B2  # take (B2..B4] and replay onto B1
# B3 moves forward; B2 is left where it was

# 2. Resolve any conflicts (likely — B3's commits assumed B2's changes existed)

# 3. Push and retarget B3's PR base
bash scripts/stack-push.sh B1 B3 B4
gh pr edit <B3-pr-number> --base B1

# 4. Close the dropped PR
gh pr close <B2-pr-number>
```

Preserve `B2` locally and remotely after closing the PR. Branch cleanup is a separate operation that requires an explicit user request. If B3 and B4 truly depended on B2's changes, dropping is the wrong move — instead fold B2's commits into B3 (see [Move a commit from one stack branch to another](#move-a-commit-from-one-stack-branch-to-another)).

## Split a PR mid-stack

When `B2` got too big, keep `B2` as the top half and carve the bottom half out underneath it. Never rename `B2`: a PR's head branch can never change (`gh pr edit` has no `--head` flag), and deleting a remote head branch auto-closes its PR, stranding reviews and CI history.

```bash
# 1. Create the lower branch at the split point
git checkout B2
git log --oneline                              # find the split-point commit SHA
git branch <user>/<feature>/02a-first <split-sha>
git push -u origin <user>/<feature>/02a-first

# 2. Open the lower PR, then retarget B2's PR onto it
gh pr create --base B1 --head <user>/<feature>/02a-first --fill --draft
gh pr edit <B2-pr-number> --base <user>/<feature>/02a-first
```

GitHub renders a PR's diff as `base..head`, so retargeting the base is all it takes: B2's PR now shows only the commits after the split point. No rebase, no rename, no force-push; B3's PR (base `B2`) is untouched. Update B2's PR title and description to match its narrower scope.

## Reorder commits across branches

Use interactive rebase from the tip, with `--update-refs`:

```bash
git checkout <tip>
git rebase -i --update-refs origin/main  # opens editor showing all commits + update-ref lines
```

The editor view will look like:

```
pick aaa1111 commit A
pick aaa2222 commit B
update-ref refs/heads/<user>/<feature>/01-foundation

pick aaa3333 commit C
pick aaa4444 commit D
update-ref refs/heads/<user>/<feature>/02-api

pick aaa5555 commit E
update-ref refs/heads/<user>/<feature>/03-ui
```

Reorder `pick` lines freely. The `update-ref` lines mark where each branch ref will point AFTER the rebase — move them up or down to move commits between branches.

After saving, push the stack: `bash scripts/stack-push.sh <B1> <B2> <B3> ...`.

## Move a commit from one stack branch to another

Special case of reorder. Say commit C currently belongs to `B2` but should belong to `B1`:

```bash
git checkout <tip>
git rebase -i --update-refs origin/main
```

In the editor, move the `pick` line for commit C up so it sits above the `update-ref refs/heads/B1` line. Save. Done. Push the stack.

If C depends on commits in B2 that come earlier than C, it can't move down — fold those dependencies in first or reconsider.

## Reparent the whole stack onto a different base

You started the stack from `main`, but actually wanted it off some other branch `X`:

```bash
git fetch origin
git checkout <tip>
git rebase --update-refs --onto X main   # take (main..tip] and replay onto X
bash scripts/stack-push.sh <B1> <B2> <B3> ...

# Update the bottom PR's base on GitHub
gh pr edit <B1-pr-number> --base X
```

## Convert a single big branch into a stack retroactively

You have one PR with 12 commits and want to split it into a stack:

```bash
# 1. Identify your split points (commit SHAs where each sub-PR ends)
git log --oneline origin/main..HEAD

# 2. Create branch refs at each split point
git branch <user>/<feature>/01-foundation <sha-end-of-part-1>
git branch <user>/<feature>/02-api       <sha-end-of-part-2>
git branch <user>/<feature>/03-ui        HEAD                  # the tip

# 3. Push each branch
git push -u origin <user>/<feature>/01-foundation
git push -u origin <user>/<feature>/02-api
git push -u origin <user>/<feature>/03-ui

# 4. Create the lower PRs (the existing PR becomes the top of the stack)
gh pr create --base main --head <user>/<feature>/01-foundation --fill --draft
gh pr create --base <user>/<feature>/01-foundation --head <user>/<feature>/02-api --fill --draft

# 5. Retarget the existing big PR to be the top of the stack
gh pr edit <existing-pr-number> --base <user>/<feature>/02-api
```

This works because the existing branch already contains all the commits — you're just creating refs at intermediate points and opening PRs against them. No rebase needed.

If you also want to reorganize the commits while you split, do an interactive rebase first (see [Reorder commits across branches](#reorder-commits-across-branches)) and place `update-ref` lines at the split points.
