#!/usr/bin/env bash
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
cp -R "$here/files/." .
git init -q
git config user.email "eval@example.com"
git config user.name "Eval Fixture"
git add -A
git commit -q -m "image-resize service"
git checkout -q -b investigate/resize-502s
