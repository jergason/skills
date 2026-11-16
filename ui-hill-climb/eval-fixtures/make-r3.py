"""Derive settings-app-r3 (what round 3 judges saw) from settings-app-r2.

Run from eval-fixtures/: python3 make-r3.py. Each replacement must hit exactly
once, so the two snapshots can't silently drift apart.
"""
from pathlib import Path

EDITS = {
    "app.js": [
        ("`${app.name} won't be able to reach your data.`",
         "`${app.name} loses access to this workspace right away.`"),
        ("`Revoke ${app.name}'s access to this workspace`", '"Revoke access"'),
        ('<button class="more" data-id="${app.id}">⋯</button>',
         '<button class="btn btn-quiet btn-icon more" data-id="${app.id}" aria-label="More actions for ${app.name}">⋯</button>'),
    ],
    "styles.css": [
        (".row-chips { display: inline-flex; gap: 6px; }",
         ".row-chips { display: inline-flex; gap: var(--space-2); }"),
        ("""/* Row menu: icon-sized, spaced well clear of Revoke. */
.more {
  width: 20px; height: 20px; margin-left: var(--space-6);
  border: none; background: none; padding: 0; cursor: pointer;
}""", "/* Row menu uses .btn-icon (32x32). */\n.more { margin-left: var(--space-2); }"),
    ],
    "index.html": [],
}

src, dst = Path("settings-app-r2"), Path("settings-app-r3")
dst.mkdir(exist_ok=True)
for name, edits in EDITS.items():
    text = (src / name).read_text()
    for old, new in edits:
        assert text.count(old) == 1, f"{name}: expected one match for {old[:50]!r}"
        text = text.replace(old, new)
    (dst / name).write_text(text)
print("wrote", dst)
