#!/usr/bin/env python3
"""Filter bird bookmarks by timeframe with proper timezone handling."""

import json
import sys
from datetime import datetime, timedelta, timezone

TWITTER_DATE_FMT = "%a %b %d %H:%M:%S %z %Y"

TIMEFRAME_MAP = {
    "24h": timedelta(hours=24),
    "3d": timedelta(days=3),
    "week": timedelta(weeks=1),
    "7d": timedelta(days=7),
}


def parse_timeframe(spec: str) -> timedelta:
    """Parse timeframe like '24h', '3d', '7d', 'week'."""
    if spec in TIMEFRAME_MAP:
        return TIMEFRAME_MAP[spec]
    if spec.endswith("h"):
        return timedelta(hours=int(spec[:-1]))
    if spec.endswith("d"):
        return timedelta(days=int(spec[:-1]))
    raise ValueError(f"unknown timeframe: {spec}")


def filter_bookmarks(bookmarks: list, timeframe: str = "24h") -> list:
    """Filter bookmarks to those within the given timeframe."""
    cutoff = datetime.now(timezone.utc) - parse_timeframe(timeframe)
    return [
        b for b in bookmarks
        if datetime.strptime(b["createdAt"], TWITTER_DATE_FMT) > cutoff
    ]


if __name__ == "__main__":
    timeframe = sys.argv[1] if len(sys.argv) > 1 else "24h"
    bookmarks = json.load(sys.stdin)
    filtered = filter_bookmarks(bookmarks, timeframe)
    json.dump(filtered, sys.stdout, indent=2)
