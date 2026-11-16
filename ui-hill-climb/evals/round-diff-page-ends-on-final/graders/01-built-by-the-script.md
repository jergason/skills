---
type: regex
pattern: 'const flash = els =>'
match: contains
target: {source: file, path: local/hill-climb/rounds.html}
weight: 1
---

rounds.html carries the click-to-jump script that only the skill's `scripts/build_rounds_page.py` emits, so the page was rendered by the script rather than written by hand.
