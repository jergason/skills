#!/usr/bin/env bash
# stack-push.sh — force-push every branch given as an argument with --force-with-lease.
# Full documentation: run with --help.

set -euo pipefail

usage() {
  cat <<'EOF'
stack-push.sh — force-push every branch given as an argument with --force-with-lease.

Usage:
  stack-push.sh <branch1> <branch2> ...       # push the named branches in order
  stack-push.sh --dry-run <branch1> ...       # print what would be pushed without pushing
  stack-push.sh --allow-missing <branch1> ... # skip missing local branches
  stack-push.sh --help

The caller (typically an agent that just detected the stack) is responsible for
passing the correct branches in bottom→top order. This script is a deterministic
loop — it makes no decisions about which branches belong to the stack.

Branches without a matching local ref fail by default because stack updates should
materialize every branch locally before rewriting or pushing. Use --allow-missing
only for cleanup cases where a branch was intentionally deleted. Push failures are
reported but don't abort the loop — partial pushes are fine and can be retried.
Exits non-zero if any branch is missing, any push failed, or no branch args were given.
EOF
}

dry_run=0
allow_missing=0
branches=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=1 ;;
    --allow-missing) allow_missing=1 ;;
    -h|--help)
      usage
      exit 0
      ;;
    --) ;;
    -*)
      echo "stack-push: unknown flag: $arg" >&2
      exit 2
      ;;
    *) branches+=("$arg") ;;
  esac
done

if [[ "${#branches[@]}" -eq 0 ]]; then
  echo "stack-push: no branch arguments given" >&2
  echo "usage: stack-push.sh [--dry-run] [--allow-missing] <branch1> [<branch2> ...]" >&2
  exit 2
fi

echo "Pushing ${#branches[@]} branch(es):"
printf '  %s\n' "${branches[@]}"
echo

failed=0
for b in "${branches[@]}"; do
  if ! git show-ref --verify --quiet "refs/heads/$b"; then
    if [[ "$allow_missing" -eq 1 ]]; then
      echo "  skip $b (no local branch)"
      continue
    fi
    echo "  missing local branch: $b" >&2
    failed=1
    continue
  fi
  if [[ "$dry_run" -eq 1 ]]; then
    echo "  [dry-run] git push --force-with-lease origin $b"
    continue
  fi
  echo "  → pushing $b"
  if ! git push --force-with-lease origin "$b"; then
    echo "  ✗ push failed for $b" >&2
    failed=1
  fi
done

if [[ "$failed" -eq 1 ]]; then
  exit 1
fi
