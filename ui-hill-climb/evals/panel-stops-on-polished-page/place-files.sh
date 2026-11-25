#!/usr/bin/env bash
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
fixtures="$here/../../eval-fixtures"
bash "$fixtures/scaffold-settings-app.sh"
cp -R "$fixtures/settings-app-polished/." .
cp -R "$fixtures/polished-round2/." .
