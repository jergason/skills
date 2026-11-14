#!/usr/bin/env python3
"""Render the hill-climb round-diff page from a JSON manifest.

Usage:
    python build_rounds_page.py manifest.json out.html [--standalone]

The output is an HTML fragment with its own <title> and <style>, ready to
publish as an Artifact (which wraps it in a document skeleton). Pass
--standalone to add <!doctype html>, <head> and <body> for opening locally.

Image paths in the manifest are written into the page as-is, so make them
relative to where the page will be served (for an Artifact, map each one to
its source file in the publish call's `files`).

Manifest format:

{
  "title": "Settings design rounds",           # 2-4 word page name
  "lede": "One or two sentences of context.",
  "surfaces": [ {"key": "admin", "label": "Admin page"}, ... ],
  "rounds": [
    {"n": 0, "scores": {"admin": 5, ...}, "verdicts": {"admin": "...", ...}},
    {"n": 1, "scores": null}                    # null or missing = "Judging…"
  ],
  "diffs": [                                    # any order; rendered newest first
    {
      "from": 0, "to": 1,
      "lede": "What this round was about.",
      "sections": [
        {
          "title": "Admin page",
          "pairs": [ {"before": FIGURE, "after": FIGURE} ],
          "changes": [
            {"n": 1, "what": "Short headline",
             "before": "What it was.", "after": "What it is now.",
             "body": "Optional extra sentence."}
          ],
          "extras": [ FIGURE, ... ],            # optional: new dialogs, phone shots
          "note": "Optional closing sentence."
        }
      ]
    }
  ]
}

FIGURE:
  {"src": "shots/r1-admin.png", "w": 1440, "h": 1000,
   "caption": "/organization/settings", "alt": "Describe the screenshot",
   "kind": "after",                 # "before" or "after"; pairs set this for you
   "label": "Round 1",              # optional; defaults to "Round <n>"
   "pins": [[1, 580, 255], [2, 465, 352]]}   # [number, x, y] in image pixels

Use the same pin number on both images of a pair for the spot that changed,
and the same number on the change that explains it. Text fields are escaped;
wrap code in backticks to render it as <code>.
"""

import html
import json
import re
import sys

CSS = """
:root {
  --bg: #f6f7fb; --surface: #ffffff; --fg: #171a2b; --muted: #5d6382; --line: #e1e4ef;
  --accent: #3b4fe0; --accent-soft: #e8ebff; --before: #c2410c; --before-soft: #fff1e8; --good: #15803d;
  --font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0f1120; --surface: #171a2e; --fg: #e8eaf6; --muted: #a0a6c6; --line: #2a2f4a;
    --accent: #8b9bff; --accent-soft: #232a55; --before: #fb923c; --before-soft: #3a2316; --good: #4ade80;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg: #0f1120; --surface: #171a2e; --fg: #e8eaf6; --muted: #a0a6c6; --line: #2a2f4a;
  --accent: #8b9bff; --accent-soft: #232a55; --before: #fb923c; --before-soft: #3a2316; --good: #4ade80;
  color-scheme: dark;
}
body { background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: 15px; line-height: 1.55; }
.wrap { max-width: 1180px; margin: 0 auto; padding-block: 40px 80px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: grid; gap: 56px; }
h1, h2 { font-family: var(--font-display); text-wrap: balance; margin: 0; letter-spacing: -0.01em; }
h1 { font-size: 34px; font-weight: 600; }
h2 { font-size: 24px; font-weight: 600; }
h2.round { font-size: 28px; }
p { margin: 0; max-width: 68ch; }
.lede { color: var(--muted); }
header, .round-head { display: grid; gap: 8px; }
.round-head { padding-top: 24px; border-top: 2px solid var(--line); }
.scores { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; }
th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--line); vertical-align: top; }
tr:last-child td { border-bottom: 0; }
th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); font-weight: 600; }
td.num { font-family: var(--font-display); font-size: 20px; font-weight: 600; white-space: nowrap; }
td.pending { color: var(--muted); font-size: 14px; font-family: var(--font-body); font-weight: 500; }
td.verdict { color: var(--muted); font-size: 14px; min-width: 260px; }
.delta { font-size: 13px; font-weight: 600; color: var(--good); margin-left: 6px; }
.delta.flat { color: var(--muted); }
.delta.down { color: var(--before); }
.bar { display: block; height: 4px; border-radius: 2px; background: var(--line); margin-top: 6px; width: 96px; }
.bar > span { display: block; height: 100%; border-radius: 2px; background: var(--accent); }
section.surface { display: grid; gap: 20px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 820px) { .pair { grid-template-columns: 1fr; } }
figure { margin: 0; display: grid; gap: 8px; min-width: 0; align-content: start; }
figcaption { font-size: 13px; font-weight: 600; color: var(--muted); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 999px; }
.tag.before { background: var(--before-soft); color: var(--before); }
.tag.after { background: var(--accent-soft); color: var(--accent); }
.shot { position: relative; border-radius: 10px; overflow: hidden; border: 1px solid var(--line); background: var(--surface); max-width: 100%; }
.shot img { display: block; width: 100%; height: auto; }
.pin { position: absolute; transform: translate(-50%, -50%); width: 24px; height: 24px; border-radius: 50%;
  display: grid; place-items: center; font: 600 12px/1 var(--font-body); color: #fff; background: var(--accent);
  box-shadow: 0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,.25); transition: transform .15s ease; }
.before .pin { background: var(--before); }
.pin.hot { transform: translate(-50%, -50%) scale(1.35); }
@media (max-width: 520px) { .pin { width: 18px; height: 18px; font-size: 10px; } }
ol.changes { list-style: none; padding: 0; margin: 0; display: grid; background: var(--surface);
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
ol.changes li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--line); }
ol.changes li:last-child { border-bottom: 0; }
ol.changes li:hover, ol.changes li:focus-within { background: var(--accent-soft); }
.n { width: 24px; height: 24px; border-radius: 50%; background: var(--accent); color: #fff; display: grid; place-items: center; font: 600 12px/1 var(--font-body); }
.ba { color: var(--muted); font-size: 14px; display: grid; gap: 2px; min-width: 0; }
.ba b { font-weight: 600; color: var(--fg); }
.what { font-weight: 600; color: var(--fg); font-size: 15px; }
.extras { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.note { font-size: 14px; color: var(--muted); }
code { font-size: 0.92em; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .pin { transition: none; } }
"""

SCRIPT = """
document.querySelectorAll('section[data-group]').forEach(section => {
  const pinsFor = n => section.querySelectorAll('.pin[data-n="' + n + '"]');
  section.querySelectorAll('ol.changes li').forEach(li => {
    const on = () => pinsFor(li.dataset.n).forEach(p => p.classList.add('hot'));
    const off = () => pinsFor(li.dataset.n).forEach(p => p.classList.remove('hot'));
    li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
    li.addEventListener('focus', on); li.addEventListener('blur', off);
  });
});
"""


def text(value):
    escaped = html.escape(value or "")
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)


def fmt_score(value):
    return f"{value:g}"


def score_cell(score, previous):
    if score is None:
        return '<td class="num pending">Judging…</td>'
    delta = ""
    if previous is not None:
        diff = score - previous
        if diff > 0:
            delta = f'<span class="delta">+{fmt_score(diff)}</span>'
        elif diff < 0:
            delta = f'<span class="delta down">{fmt_score(diff)}</span>'
        else:
            delta = '<span class="delta flat">±0</span>'
    bar = f'<span class="bar"><span style="width:{score * 10:g}%"></span></span>'
    return f'<td class="num">{fmt_score(score)}{delta}{bar}</td>'


def scores_table(surfaces, rounds):
    ordered = sorted(rounds, key=lambda r: r["n"])
    head = "".join(f'<th>Round {r["n"]}</th>' for r in ordered)
    judged = [r for r in ordered if r.get("scores")]
    latest_verdicts = judged[-1].get("verdicts", {}) if judged else {}
    rows = []
    for surface in surfaces:
        key = surface["key"]
        cells, previous = [], None
        for r in ordered:
            score = (r.get("scores") or {}).get(key)
            cells.append(score_cell(score, previous))
            if score is not None:
                previous = score
        verdict = text(latest_verdicts.get(key, ""))
        rows.append(f'<tr><td>{text(surface["label"])}</td>{"".join(cells)}<td class="verdict">{verdict}</td></tr>')
    min_width = 360 + 120 * len(ordered)
    return (
        f'<div class="scores"><table style="min-width:{min_width}px"><thead><tr><th>Surface</th>{head}'
        f'<th>Latest verdict</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
    )


def figure(fig, kind, default_label):
    w, h = fig["w"], fig["h"]
    pins = "".join(
        f'<span class="pin" data-n="{n}" style="left:{x / w * 100:.1f}%;top:{y / h * 100:.1f}%">{n}</span>'
        for n, x, y in fig.get("pins", [])
    )
    label = text(fig.get("label") or default_label)
    return (
        f'<figure class="{kind}"><figcaption><span class="tag {kind}">{label}</span> {text(fig.get("caption", ""))}'
        f'</figcaption><div class="shot"><img src="{html.escape(fig["src"])}" alt="{html.escape(fig.get("alt", ""))}" '
        f'width="{w}" height="{h}">{pins}</div></figure>'
    )


def change_item(change):
    parts = [f'<span class="what">{text(change["what"])}</span>']
    if change.get("before"):
        parts.append(f'<span><b>Before:</b> {text(change["before"])}</span>')
    if change.get("after"):
        parts.append(f'<span><b>After:</b> {text(change["after"])}</span>')
    if change.get("body"):
        parts.append(f"<span>{text(change['body'])}</span>")
    n = change["n"]
    return f'<li tabindex="0" data-n="{n}"><span class="n">{n}</span><div class="ba">{"".join(parts)}</div></li>'


def section(sec, diff, index):
    group = f"d{diff['from']}-{diff['to']}-{index}"
    before_label, after_label = f"Round {diff['from']}", f"Round {diff['to']}"
    out = [f'<section class="surface" aria-labelledby="{group}-h" data-group="{group}">',
           f'<h2 id="{group}-h">{text(sec["title"])}</h2>']
    for pair in sec.get("pairs", []):
        out.append('<div class="pair">' + figure(pair["before"], "before", before_label)
                   + figure(pair["after"], "after", after_label) + "</div>")
    if sec.get("changes"):
        out.append('<ol class="changes">' + "".join(change_item(c) for c in sec["changes"]) + "</ol>")
    if sec.get("extras"):
        out.append('<div class="extras">' + "".join(
            figure(fig, fig.get("kind", "after"), after_label) for fig in sec["extras"]) + "</div>")
    if sec.get("note"):
        out.append(f'<p class="note">{text(sec["note"])}</p>')
    out.append("</section>")
    return "".join(out)


def diff_block(diff):
    head = (f'<div class="round-head"><h2 class="round">Round {diff["from"]} → Round {diff["to"]}</h2>'
            f'<p class="lede">{text(diff.get("lede", ""))} Orange pins mark round {diff["from"]}, '
            f'blue pins mark round {diff["to"]}. Hover a change to find its pins.</p></div>')
    return head + "".join(section(sec, diff, i) for i, sec in enumerate(diff.get("sections", [])))


def render(manifest, standalone):
    diffs = sorted(manifest.get("diffs", []), key=lambda d: d["to"], reverse=True)
    body = (
        '<div class="wrap">'
        f'<header><h1>{text(manifest["title"])}</h1><p class="lede">{text(manifest.get("lede", ""))}</p></header>'
        f'<section class="surface" aria-labelledby="scores-h"><h2 id="scores-h">Scores</h2>'
        f'{scores_table(manifest["surfaces"], manifest["rounds"])}</section>'
        + "".join(diff_block(d) for d in diffs)
        + "</div>"
    )
    head = (
        f"<title>{html.escape(manifest['title'])}</title>\n"
        '<meta name="claude:viewport-fit-sides" content="cover">\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600'
        '&family=Space+Grotesk:wght@500;600&display=swap">\n'
        f"<style>{CSS}</style>\n"
    )
    page = f"{head}{body}\n<script>{SCRIPT}</script>\n"
    if standalone:
        page = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
                '<meta name="viewport" content="width=device-width, initial-scale=1">'
                f"{head}</head><body>{body}<script>{SCRIPT}</script></body></html>\n")
    return page


def main(argv):
    args = [a for a in argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        print(__doc__)
        return 2
    with open(args[0], encoding="utf-8") as f:
        manifest = json.load(f)
    with open(args[1], "w", encoding="utf-8") as f:
        f.write(render(manifest, "--standalone" in argv))
    print(f"Wrote {args[1]}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
