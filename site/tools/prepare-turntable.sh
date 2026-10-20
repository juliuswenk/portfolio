#!/bin/sh
# Run from the repository root; retain the original frames and previous export.
set -eu
ffmpeg -y -framerate 25 -start_number 0 -i 'Projekte/Hyperreal Ravelord Kette 3D/Animation/%04d.png' -frames:v 360 -vf scale=512:640 -c:v libvpx-vp9 -pix_fmt yuva420p -crf 40 -b:v 0 -g 1 -auto-alt-ref 0 -row-mt 1 -threads 4 -cpu-used 4 -an site/assets/hyperreal-spin-web.webm
