# Handling conflicts during a stack rebase

When `git rebase` (with `--update-refs`) hits conflicts, the rebase pauses on the conflicting commit. You're now in detached-HEAD-ish state mid-rebase. The general loop:

```bash
# 1. See what conflicted
git status

# 2. Edit the conflicted files. Resolve markers (<<<<<<<, =======, >>>>>>>).

# 3. Stage and continue
git add <resolved-files>
git rebase --continue

# Repeat for each conflicting commit in the range.
```

If a commit becomes empty after resolution (its diff is now identical to its parent — happens often when a fix from the lower PR already covers the change in the higher PR):

```bash
git rebase --skip
```

If things go sideways and you want out:

```bash
git rebase --abort     # restores pre-rebase state
```

## Use `rerere` to avoid re-resolving the same conflict

`rerere` ("reuse recorded resolution") remembers how you resolved a conflict and auto-applies the same resolution next time the same conflict appears. This is huge for stack workflows because the same conflict tends to reappear every time you sync the stack with main.

When `rerere` auto-applies a resolution, git will say `Resolved '<file>' using previous resolution.` — verify the result still makes sense (it usually does, but check), then `git add` and `git rebase --continue`.

To inspect what `rerere` has cached: `git rerere status` (shows pending) or `git rerere diff` (shows pending diffs).

To forget a bad resolution: `git rerere forget <path>` while you're paused on the conflict.

## Stack-specific patterns

### Conflict in a commit that belongs to a lower branch

`--update-refs` doesn't change WHICH commit conflicts — it just moves the branch refs along after the rebase succeeds. So a conflict in commit `X` (which belongs to `B2`) appears the same regardless of whether you started the rebase from `B2`, `B3`, or `B4`. Just resolve and `--continue`.

### "I want to abandon this rebase and try a different strategy"

```bash
git rebase --abort
```

This restores all branch refs to their pre-rebase positions, including the ones `--update-refs` was going to move. Safe.

### Conflicts appear repeatedly across stack syncs

This usually means you have churn against a moving target on `main`. Three mitigations:

1. Enable `rerere` so the resolution sticks.
2. Sync the stack more often — small deltas conflict less.
3. If a specific commit in your stack is the source of conflicts, consider squashing it into the commit that resolved the conflict on main once that one merges. `git rebase -i` with `fixup` lines does this cleanly.

### `--update-refs` warning: "branch X was updated, but Y is checked out in worktree Z"

If a branch in your stack is checked out in another git worktree, `--update-refs` will not move it. The warning tells you which worktree owns it. Options:

- Stop before pushing. The preflight in `SKILL.md` should detect this state before the rebase.
- Preserve any work in that worktree, release the branch, and re-run the rewrite from a known-good state.

Do not repair the skipped branch with `git reset --hard` or delete the worktree unless the user explicitly requests that cleanup and its work has been preserved.

## After all conflicts resolved

Once `git rebase --continue` completes the whole rebase, `--update-refs` will print which branch refs it moved:

```
Successfully rebased and updated refs/heads/<user>/<feature>/03-ui.
Updated reference refs/heads/<user>/<feature>/01-foundation
Updated reference refs/heads/<user>/<feature>/02-api
```

Now follow the Standard Runbook in `SKILL.md` to re-walk PR bases and push the stack: `bash scripts/stack-push.sh <B1> <B2> <B3> ...`.
