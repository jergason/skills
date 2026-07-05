#!/bin/bash
# Fetch PR titles, descriptions, base branches, and media URLs for a list of PR numbers.
# Usage: ./fetch-pr-details.sh <pr1> <pr2> <pr3> ...
# Output: structured blocks per PR with base branch, title, body excerpt, and media URLs.
#
# Uses a single GitHub GraphQL API call to fetch all PRs at once (batched in groups
# of 25 to stay well under GraphQL complexity limits). This replaces the old approach
# of 3 REST calls per PR.
#
# Media lines are annotated with [BEFORE], [AFTER], or [STANDALONE] based on
# surrounding context (looks for "before"/"after" labels in nearby text).
#
# Base branch is shown per PR — PRs merged into deploy-v* branches shipped in a
# prior release and are flagged with ⚠️.

set -uo pipefail  # no -e: we handle errors per-batch

if [ $# -eq 0 ]; then
  echo "Usage: $0 <pr_number> [pr_number] ..." >&2
  exit 1
fi

ALL_PRS=("$@")
BATCH_SIZE=25

process_pr_json() {
  local number="$1"
  local json="$2"

  local title body base
  title=$(echo "$json" | jq -r '.title // "unknown"')
  body=$(echo "$json" | jq -r '.body // ""')
  base=$(echo "$json" | jq -r '.baseRefName // "unknown"')

  echo "=== PR #$number ==="
  echo "Base: $base"
  if [[ "$base" == deploy-v* ]]; then
    echo "  ⚠️  PRIOR RELEASE — merged into $base, likely already shipped"
  fi
  echo "Title: $title"
  echo "Body: ${body:0:800}"
  echo "---MEDIA---"

  if [ -n "$body" ]; then
    echo "$body" | grep -inE '(https://github.com/user-attachments|!\[|<img|<video|\.png|\.mov|\.mp4|\.gif)' | head -10 | while IFS= read -r line; do
      lineno=$(echo "$line" | cut -d: -f1)
      content=$(echo "$line" | cut -d: -f2-)
      context=$(echo "$body" | head -n "$lineno" | tail -n 4 | tr '[:upper:]' '[:lower:]')
      if echo "$context" | grep -qiE '(\bafter\b|post.fix|new|updated|result)'; then
        echo "  [AFTER] $content"
      elif echo "$context" | grep -qiE '(\bbefore\b|pre.fix|old|original|current|issue|bug|problem)'; then
        echo "  [BEFORE] $content"
      else
        echo "  [STANDALONE] $content"
      fi
    done
  fi
  echo "=== END ==="
  echo
}

# Process PRs in batches using GraphQL
for ((i = 0; i < ${#ALL_PRS[@]}; i += BATCH_SIZE)); do
  batch=("${ALL_PRS[@]:i:BATCH_SIZE}")

  # Build GraphQL query with aliases for each PR
  query='{ repository(owner: "drplt", name: "drplt") {'
  for pr in "${batch[@]}"; do
    query+=" pr${pr}: pullRequest(number: ${pr}) { number title body baseRefName }"
  done
  query+=' } }'

  # Single API call for the whole batch
  result=$(gh api graphql -f query="$query" 2>/dev/null)

  if [ $? -ne 0 ] || [ -z "$result" ]; then
    echo "⚠️  GraphQL batch failed for PRs: ${batch[*]}" >&2
    echo "Falling back to individual REST calls..." >&2
    for pr in "${batch[@]}"; do
      json=$(gh pr view "$pr" --json title,body,baseRefName 2>/dev/null || echo '{"title":"(fetch failed)","body":"","baseRefName":"unknown"}')
      process_pr_json "$pr" "$json"
    done
    continue
  fi

  # Process each PR from the batch result
  for pr in "${batch[@]}"; do
    pr_json=$(echo "$result" | jq ".data.repository.pr${pr}" 2>/dev/null)
    if [ "$pr_json" = "null" ] || [ -z "$pr_json" ]; then
      echo "=== PR #$pr ==="
      echo "  (not found)"
      echo "=== END ==="
      echo
    else
      process_pr_json "$pr" "$pr_json"
    fi
  done
done
