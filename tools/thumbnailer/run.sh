#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
executable="$script_dir/build/bin/thumbnailer.exe"
sample_image="$script_dir/images/Francis.jpg"
thumbnail_image="$script_dir/images/Francis_thumb.jpg"

if [[ ! -f "$executable" ]]; then
  printf 'Thumbnailer is not built. Run: bash tools/thumbnailer/build.sh\n' >&2
  exit 1
fi

if [[ ! -f "$sample_image" ]]; then
  printf 'Sample image not found: %s\n' "$sample_image" >&2
  exit 1
fi

exec "$executable" "$sample_image" "$thumbnail_image"