#!/bin/bash
# Download GitHub user-attachments assets from PR bodies.
# Usage: ./download-gh-assets.sh <output-dir> <url1> [url2] ...
#
# GitHub user-attachments URLs require auth and redirect,
# so plain curl doesn't work. This uses `gh api` with the
# Accept: application/octet-stream header instead.
#
# Detects file type after download and renames with correct extension.

set -euo pipefail

OUTPUT_DIR="${1:?Usage: $0 <output-dir> <url1> [url2] ...}"
shift
mkdir -p "$OUTPUT_DIR"

for url in "$@"; do
  # Extract the asset ID for a filename base
  asset_id=$(basename "$url")
  temp_file="$OUTPUT_DIR/$asset_id.tmp"

  echo "Downloading $url ..."
  gh api -H "Accept: application/octet-stream" "$url" > "$temp_file" 2>/dev/null

  # Detect actual file type
  filetype=$(file -b "$temp_file")
  case "$filetype" in
    *GIF*)    ext="gif" ;;
    *PNG*)    ext="png" ;;
    *JPEG*)   ext="jpg" ;;
    *MP4*|*ISO\ Media*|*QuickTime*) ext="mp4" ;;
    *WebM*)   ext="webm" ;;
    *)        ext="bin" ;;
  esac

  final_file="$OUTPUT_DIR/$asset_id.$ext"
  mv "$temp_file" "$final_file"
  echo "  -> $final_file ($(du -h "$final_file" | cut -f1 | xargs))"
done

echo "Done. Downloaded ${#} asset(s) to $OUTPUT_DIR"
