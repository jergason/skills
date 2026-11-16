#!/usr/bin/env python3
"""Tests for build_rounds_page.py. Run: python3 -m unittest scripts/test_build_rounds_page.py (from the skill dir)."""

import os
import re
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import build_rounds_page as page  # noqa: E402


def fig(src, pins=()):
    return {"src": src, "w": 1000, "h": 800, "caption": src, "alt": src, "pins": [list(p) for p in pins]}


def diff(start, end, pins=((1, 100, 100), (2, 500, 400))):
    return {
        "from": start,
        "to": end,
        "lede": f"Round {end} work.",
        "sections": [
            {
                "title": "Apps list",
                "pairs": [{"before": fig(f"shots/r{start}-apps.png", pins), "after": fig(f"shots/r{end}-apps.png", pins)}],
                "changes": [
                    {"n": n, "what": f"Change {n} in round {end}", "before": "Old.", "after": "New."} for n, _x, _y in pins
                ],
            },
            {
                "title": "Revoke confirm",
                "pairs": [{"before": fig(f"shots/r{start}-revoke.png", [(1, 50, 50)]),
                           "after": fig(f"shots/r{end}-revoke.png", [(1, 60, 60)])}],
                "changes": [{"n": 1, "what": "Buttons say what they do"}],
                "extras": [fig(f"shots/r{end}-revoke-phone.png", [(1, 30, 30)])],
            },
        ],
    }


def manifest(diffs, overall=None, rounds=None):
    m = {
        "title": "Connected apps rounds",
        "lede": "Test page.",
        "surfaces": [{"key": "apps", "label": "Apps list"}, {"key": "revoke", "label": "Revoke confirm"}],
        "rounds": rounds
        or [
            {"n": 0, "scores": {"apps": 5, "revoke": 4}},
            {"n": 1, "scores": {"apps": 7, "revoke": 8}},
            {"n": 2, "scores": {"apps": 8.5, "revoke": 9}},
        ],
        "diffs": diffs,
    }
    if overall is not None:
        m["overall"] = overall
    return m


def round_headings(html):
    return re.findall(r'<h2 class="round">([^<]+)</h2>', html)


def overall_html(html):
    start = html.find('id="overall"')
    return html[start:] if start >= 0 else ""


class PinSize(unittest.TestCase):
    def test_pins_are_16px(self):
        rule = re.search(r"\.pin \{[^}]*\}", page.CSS).group(0)
        self.assertIn("width: 16px", rule)
        self.assertIn("height: 16px", rule)
        self.assertIn("10px", rule, "pin number should be 10px")

    def test_pins_shrink_on_phones(self):
        self.assertRegex(page.CSS, r"max-width: 520px\) \{ \.pin \{ width: 14px; height: 14px")


class PinLinks(unittest.TestCase):
    def setUp(self):
        self.html = page.render(manifest([diff(0, 1)]), standalone=False)

    def test_pins_are_links_to_their_change(self):
        pins = re.findall(r'<a class="pin" href="#([^"]+)"[^>]*data-n="(\d+)"', self.html)
        self.assertTrue(pins, "pins should render as <a class=pin>")
        for target, n in pins:
            self.assertTrue(target.endswith(f"-c{n}"), f"pin {n} links to {target}")
        self.assertNotIn('<span class="pin"', self.html)

    def test_change_numbers_link_to_a_pin(self):
        links = re.findall(r'<a class="n" href="#([^"]+)" data-n="(\d+)"', self.html)
        self.assertTrue(links, "pinned change numbers should be links")
        for target, n in links:
            self.assertTrue(target.endswith(f"-p{n}"), f"change {n} links to {target}")

    def test_every_link_resolves_and_ids_are_unique(self):
        ids = re.findall(r'\bid="([^"]+)"', self.html)
        duplicates = {i for i in ids if ids.count(i) > 1}
        self.assertFalse(duplicates, f"duplicate ids: {duplicates}")
        broken = set(re.findall(r'href="#([^"]+)"', self.html)) - set(ids)
        self.assertFalse(broken, f"links with no target: {broken}")

    def test_pin_ids_go_on_the_first_pin_only(self):
        # Pin 1 appears on both images of the first pair; only one of them carries the anchor id.
        self.assertEqual(len(re.findall(r'id="d0-1-0-p1"', self.html)), 1)
        self.assertEqual(len(re.findall(r'class="pin" href="#d0-1-0-c1"', self.html)), 2)

    def test_pins_are_named_by_their_change(self):
        self.assertIn('aria-label="Change 2: Change 2 in round 1"', self.html)

    def test_unpinned_change_has_no_link(self):
        m = manifest([diff(0, 1)])
        m["diffs"][0]["sections"][0]["changes"].append({"n": 9, "what": "Copy only"})
        html = page.render(m, standalone=False)
        self.assertIn('<span class="n">9</span>', html)
        self.assertNotIn('href="#d0-1-0-p9"', html)

    def test_script_scrolls_and_flashes(self):
        self.assertIn("scrollIntoView", page.SCRIPT)
        self.assertIn("'flash'", page.SCRIPT)
        self.assertIn("prefers-reduced-motion", page.SCRIPT)


class RoundOrder(unittest.TestCase):
    def test_diffs_render_oldest_first_whatever_the_manifest_order(self):
        html = page.render(manifest([diff(2, 3), diff(0, 1), diff(1, 2)]), standalone=False)
        rounds = [h for h in round_headings(html) if "Final" not in h]
        self.assertEqual(rounds, ["Round 0 → Round 1", "Round 1 → Round 2", "Round 2 → Round 3"])

    def test_a_new_round_appends_after_the_earlier_ones(self):
        before = round_headings(page.render(manifest([diff(0, 1)]), standalone=False))
        after = round_headings(page.render(manifest([diff(0, 1), diff(1, 2)]), standalone=False))
        self.assertEqual(after[: len(before) - 1], before[:-1], "earlier rounds keep their place")
        self.assertLess(after.index("Round 0 → Round 1"), after.index("Round 1 → Round 2"))

    def test_score_columns_stay_in_round_order(self):
        html = page.render(manifest([diff(0, 1)]), standalone=False)
        self.assertEqual(re.findall(r"<th>Round (\d+)</th>", html), ["0", "1", "2"])


class OverallComparison(unittest.TestCase):
    explicit = {
        "pairs": [
            {"title": "Apps list", "before": fig("shots/r0-apps.png", [(1, 10, 10)]), "after": fig("shots/r2-apps.png", [(1, 10, 10)])},
            {"title": "Revoke confirm", "before": fig("shots/r0-revoke.png"), "after": fig("shots/r2-revoke.png")},
        ]
    }

    def test_overall_renders_last(self):
        html = page.render(manifest([diff(0, 1), diff(1, 2)], self.explicit), standalone=False)
        self.assertEqual(round_headings(html)[-1], "Round 0 → Final")
        self.assertGreater(html.find('id="overall"'), html.rfind('class="round">Round 1 → Round 2'))

    def test_overall_has_no_pins_even_when_the_manifest_gives_some(self):
        ov = overall_html(page.render(manifest([diff(0, 1), diff(1, 2)], self.explicit), standalone=False))
        self.assertTrue(ov)
        self.assertNotIn('class="pin"', ov)

    def test_overall_uses_the_explicit_pairs_in_order(self):
        ov = overall_html(page.render(manifest([diff(0, 1), diff(1, 2)], self.explicit), standalone=False))
        self.assertEqual(re.findall(r'<h2 id="overall-\d+-h">([^<]+)</h2>', ov), ["Apps list", "Revoke confirm"])
        self.assertEqual(re.findall(r'<img src="([^"]+)"', ov),
                         ["shots/r0-apps.png", "shots/r2-apps.png", "shots/r0-revoke.png", "shots/r2-revoke.png"])

    def test_labels_default_to_first_round_and_latest_judged_round(self):
        rounds = [{"n": 0, "scores": {"apps": 5}}, {"n": 1, "scores": {"apps": 7}}, {"n": 2, "scores": None}]
        ov = overall_html(page.render(manifest([diff(0, 1)], self.explicit, rounds), standalone=False))
        self.assertIn(">Round 0</span>", ov)
        self.assertRegex(ov, r">Final\W+round 1\)?</span>", "a round still being judged isn't final yet")

    def test_explicit_from_and_to_win(self):
        ov = overall_html(page.render(manifest([diff(0, 1)], {**self.explicit, "from": 1, "to": 4}), standalone=False))
        self.assertIn("Round 1 → Final", ov)
        self.assertRegex(ov, r">Final\W+round 4\)?</span>")

    def test_fallback_derives_first_before_and_last_after(self):
        html = page.render(manifest([diff(1, 2), diff(0, 1)]), standalone=False)
        ov = overall_html(html)
        self.assertEqual(round_headings(html)[-1], "Round 0 → Final")
        self.assertEqual(re.findall(r'<img src="([^"]+)"', ov),
                         ["shots/r0-apps.png", "shots/r2-apps.png", "shots/r0-revoke.png", "shots/r2-revoke.png"])
        self.assertNotIn('class="pin"', ov)

    def test_no_screenshots_means_no_overall_section(self):
        empty = {"from": 0, "to": 1, "sections": [{"title": "Policy card", "changes": [{"n": 1, "what": "Copy"}]}]}
        html = page.render(manifest([empty]), standalone=False)
        self.assertNotIn('id="overall"', html)


class Standalone(unittest.TestCase):
    def test_standalone_wraps_a_document(self):
        html = page.render(manifest([diff(0, 1)]), standalone=True)
        self.assertTrue(html.startswith("<!doctype html>"))
        self.assertIn("<script>", html)


if __name__ == "__main__":
    unittest.main()
