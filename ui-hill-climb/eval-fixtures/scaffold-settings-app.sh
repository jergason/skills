#!/usr/bin/env bash
# Copies the settings-app fixture into the current directory as a git repo with
# one commit (the round-0 page), then leaves an uncommitted change in
# marketing/ so the run has someone else's in-progress work to keep its hands
# off.
#
# Usage (from a case's place-files.sh):
#   bash <this script> [--with-brief] [--round N] [extra-files-dir]
#
#   --with-brief  put the shared BRIEF.md at local/hill-climb/BRIEF.md
#   --round N     lay settings-app-rN/ over the page as uncommitted changes:
#                 the designers' work from earlier rounds, which the skill says
#                 not to commit. N is 2 or 3.
#   extra-files-dir  copied on top last (judge reports, screenshots, ...)
set -eu

here="$(cd "$(dirname "$0")" && pwd)"
with_brief=0
round=0
while [ $# -gt 0 ]; do
  case "$1" in
    --with-brief) with_brief=1; shift ;;
    --round) round="$2"; shift 2 ;;
    *) break ;;
  esac
done

cp -R "$here/settings-app/." .

git init -q
git config user.email "eval@example.com"
git config user.name "Eval Fixture"
printf 'node_modules/\nlocal/\n' > .gitignore
git add -A
git commit -q -m "Initial settings page"

cat >> marketing/landing.html <<'EOF'
<!-- WIP from the marketing team: new hero copy, not ready to commit -->
EOF

if [ "$round" != 0 ]; then
  cp -R "$here/settings-app-r$round/." .
fi

if [ "$with_brief" = 1 ]; then
  mkdir -p local/hill-climb
  cp "$here/BRIEF.md" local/hill-climb/BRIEF.md
fi

if [ "${1:-}" != "" ] && [ -d "$1" ]; then
  cp -R "$1/." .
fi
