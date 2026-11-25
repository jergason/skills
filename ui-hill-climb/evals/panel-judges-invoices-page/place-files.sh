#!/usr/bin/env bash
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
fixtures="$here/../../eval-fixtures"
cp -R "$fixtures/invoices-app/." .
cp -R "$fixtures/settings-app/ds" ./ds
git init -q
git config user.email "eval@example.com"
git config user.name "Eval Fixture"
printf 'local/\n' > .gitignore
git add -A
git commit -q -m "Invoices page"
cp -R "$fixtures/invoices-round0/." .
