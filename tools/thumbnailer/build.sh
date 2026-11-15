#!/usr/bin/env bash
set -euo pipefail

if ! command -v g++ >/dev/null 2>&1; then
    echo "Error: g++ not found."
    echo "Run this script from an MSYS2 UCRT64 terminal."
    exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
build_dir="$script_dir/build"
cmake_cmd="${CMAKE:-cmake}"

rm -rf "$build_dir"

"$cmake_cmd" \
    -S "$script_dir" \
    -B "$build_dir" \
    -G Ninja \
    -DCMAKE_BUILD_TYPE=Debug

"$cmake_cmd" --build "$build_dir"