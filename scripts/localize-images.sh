#!/usr/bin/env bash
# Downloads the Higgsfield-generated images, converts them to optimized WebP
# (requires ImageMagick or cwebp), and rewrites index.html to use local files.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/img
BASE="https://d8j0ntlcm91z4.cloudfront.net/user_3K67VZ3vXJfJN5apzJyggkj6MZy"
declare -A IMGS=(
  [hero]="hf_20261001_154401_8c05851d-f180-4211-acbb-efce6a8914d0.png"
  [fault-detection]="hf_20261001_154428_4aeb11d9-aa1e-48fe-be17-73591f1b7e6c.png"
  [lighting]="hf_20261001_154500_5b8d5e25-299c-4d09-a7a5-cffe830d2837.png"
  [panel]="hf_20261001_154536_b44a1692-8ba4-46a8-93c0-d888f937e088.png"
)
for name in "${!IMGS[@]}"; do
  file="${IMGS[$name]}"
  curl -fsSL -o "assets/img/$name.png" "$BASE/$file"
  if command -v cwebp >/dev/null; then
    cwebp -quiet -q 78 -resize 1920 0 "assets/img/$name.png" -o "assets/img/$name.webp"
  else
    convert "assets/img/$name.png" -resize '1920x>' -quality 78 "assets/img/$name.webp"
  fi
  rm "assets/img/$name.png"
  sed -i "s#$BASE/$file#assets/img/$name.webp#g" index.html
done
sed -i '/d8j0ntlcm91z4.cloudfront.net" crossorigin/d' index.html
echo "Done. Note: og:image and JSON-LD image should be absolute URLs on your domain."
