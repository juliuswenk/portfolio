# Rendered interactive turntable

The site now uses the supplied PNG render instead of the live GLB. All original PNG, Blender and GLB files are preserved.

## Sources and outputs

- Source: `../Animation/0000.png` through `0360.png`, 864 × 1080 RGBA.
- Encoded frames: 0000–0359, at 25 fps (14.4 seconds). The duplicate end pose 0360 is omitted from the loop.
- `site/assets/hyperreal-spin-web.webm`: current 512 × 640 VP9-alpha export, CRF 40, 8,671,909 bytes; every frame is a keyframe for forward/backward seeking. Regenerate with `sh site/tools/prepare-turntable.sh` from the repository root.
- `site/assets/hyperreal-spin.webm`: previous 640 × 800, CRF 28 export, 16,740,568 bytes; retained as the comparison/archive source.
- `site/assets/hyperreal-spin.mov`: 640 × 800 HEVC with alpha, encoded through Apple's AVFoundation alpha preset for Safari/iOS.
- `site/assets/hyperreal-spin-poster.png`: untouched first rendered frame used as the loading/error fallback.

The current WebM uses FFmpeg `libvpx-vp9`, `yuva420p`, CRF 40, keyframe interval 1, no alternate reference frames and no audio. Comparisons included 640 px CRF 36 (13.01 MB), 512 px CRF 32 (11.31 MB), and 512 px CRF 40 (8.67 MB). The chosen candidate retained convincing transparent edges, metal highlights and pendant appearance in front, side and back comparisons; metadata verifies 360 keyframe packets, 25 fps and the unchanged 14.4-second turn. The older WebM used CRF 28. The Safari version was encoded from a temporary ProRes 4444 alpha master with AVFoundation's `AVAssetExportPresetHEVCHighestQualityWithAlpha`.

## Interaction

- Overview: muted inline looping playback.
- Entering Hyperreal: restart from frame zero, play once, then pause.
- After that first turn: horizontal mouse movement anywhere on the page scrubs frames. Right moves forward; left moves backward. One viewport-width of travel advances one sequence, wrapping at either end. There is no ongoing playback or inertia after movement stops.
- Touch: drag horizontally on the hero; vertical page scrolling stays available.
- Keyboard: focus the hero and use left/right arrows after the first turn.
- Other projects, About, a hidden tab and Still view pause playback. Re-entering Hyperreal plays one turn again.
- Failed video playback leaves the transparent rendered poster visible.

The original GLB and baked GLB remain available as archived alternatives; their renderer is no longer loaded by the site.

The Safari HEVC-alpha alternative remains 640 × 800 and 8,563,863 bytes. Its metadata is checked, but real Safari/iOS rendering and touch verification remain outstanding; Chrome playback is not proof of that path. These web exports are portfolio presentation work, distinct from the original 2018 Blender study.
