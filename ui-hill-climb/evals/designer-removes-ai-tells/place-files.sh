#!/usr/bin/env bash
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
bash "$here/../../eval-fixtures/scaffold-settings-app.sh" --with-brief --round 3
cp -R "$here/../../eval-fixtures/settings-app-r3-tells/." .
cp -R "$here/files/." .
