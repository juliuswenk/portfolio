# Julius Wenk — Portfolio

The website lives in `site/`. No build step or package installation is required.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000 in your browser. The 3D renderer loads Three.js from a CDN, and embedded Vimeo films require internet access.

## Check the website

With Node.js installed, run:

```sh
node check.cjs
```

The original project descriptions in `Projekte/` remain intact. The published stories live in `site/projects.js`; separate local editorial notes, when present, are checked against them. Only `site/` needs to be served or deployed.

## Project stories and contact

All seven projects follow one opening overview and compact context, then intention, contribution, outcome and learning, design decisions where useful, and optional implementation depth. The smaller Hyperreal Ravelord study combines sections without adding filler. Five longer stories use native, initially closed Implementation details disclosures. About and the closing invitation include the supplied email, Instagram and GitHub links.

Local editorial verification at 390×844 with images loaded and disclosures closed measured DOXA’s complete section at 8,473.6 px before and 4,974.5 px after (about 10.0 to 5.9 screens; 41% shorter). All six figures retain their order and combined 1,758.9 px height. Rendered article text, including captions and navigation, fell from 1,085 to 448 words. Keyboard opening and closing retained the summary’s position; desktop and 320/390px layouts, contact destinations and existing network/media checks passed. Contact apps were not opened, and physical devices/screen readers were not tested.

## Media preparation and loading

The opening uses responsive WebP images and a 12 KB transparent avatar still. The seven overview heroes total 69 KB at 240px, or 176 KB at 480px; their previous sources totaled 5.06 MB. The avatar export is 2.29 MB instead of 10.90 MB. These are file sizes, not guaranteed network transfers.

The branded loading view waits for layout and opening images, including their error outcomes. It offers Continue browsing after three seconds and has a ten-second fail-open fallback. Project links wait for that project's hero rather than all overview images. Optional media does not gate entry.

Three.js and the avatar load after entry during idle time, or when About is opened. Hyperreal's 8.67 MB WebM / 8.56 MB alternate HEVC movie (previous WebM: 16.74 MB) loads on overview hover/focus or within roughly one viewport of its project. Reading images and Vimeo films receive sources near their visible sections; hidden preview media waits for interaction. Data Saver, reported 2G connections, and Still view require explicit motion loading. Still view starts from the OS reduced-motion preference; its Motion view control is an explicit override. An explicit loading action alone does not enable motion.

To regenerate image variants after changing published media, run from the repository root (Python with Pillow required only for preparation):

```sh
python3 site/tools/prepare-images.py
```

This writes `site/assets/responsive/` and `site/media.js`, retaining original assets and natural proportions. Small variants serve the network and temporary previews; reading variants upgrade the arriving hero; the enlargement dialog uses the full-size source. DOXA's hero is the supplied `2 DOXA © Melissa Papafio-Roberts.png`, exported as `doxa-installation-melissa.webp` at its original 3000×2000 dimensions with its credit.

To reproduce the avatar export with Blender installed:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python site/tools/prepare-avatar.py
```

The export uses 1024px JPEG textures, a decimated mesh, and four skin influences. It retains the Head bone, skin, and wave clip without an extra browser decoder. `site/tools/avatar-preview.html` compares the original/export under the site's camera and lights, including a paused mid-wave comparison. Save its compressed still and convert that PNG to WebP at quality 90 to regenerate `avatar-still.webp`. The prepared assets are included; deployment still requires no build or package installation.

Verification on 20 October 2026 included desktop/phone layouts, direct links, loader escape with deliberately delayed images, failed images/model, explicit loading under simulated Data Saver, avatar appearance/wave comparison, and turntable loading/playback. That earlier pass covered frame scrubbing in automated checks; the later Awwwards implementation pass also confirmed rendered forward/backward keyboard seeking in the browser. One unthrottled in-app browser run at 1280×720, using fresh local paths and `Cache-Control: no-store` for local assets, observed 37.70 MB of resource transfer before versus 2.61 MB after (including the idle-loaded avatar). The new run requested no turntable or Vimeo iframe on arrival; the avatar request began after entry. External CDN caching and local transport limit this comparison: it is not a production speed result, Lighthouse score, or Core Web Vitals measurement. Real-device Safari/Android and bandwidth-throttled production measurements remain outstanding.

## Responsive navigation and composition

The layout keeps About before the projects, its complete biography and skills visible, and only the CV collapsed. Excess scroll spacing is removed. Following the later About revision, desktop uses a large knee-up avatar portrait that holds beside the scrolling biography; its camera includes the full wave with margins below the header and above the footer. Phones retain the compact stacked avatar. Portrait phones show the introduction above a readable framing of the first three projects; short landscape uses a side-by-side arrangement. The named Projects dialog exposes all seven projects even when their network nodes are offscreen. Phones use the current title, Projects and Still/Motion controls; desktop retains numbered shortcuts.

`pairedMedia` in `site/projects.js` identifies adjacent supporting figures that can share a desktop row. All images, their captions, enlargement actions and the existing phone sequence remain. Onward navigation follows the complete project rather than the shorter column. Explicit project navigation remeasures through critical hero readiness and two settled frames, then releases correction; real user input cancels it earlier. Reading media reserves its display area before lazy images arrive. Disclosure changes update geometry without pulling the reader back.

The smaller all-keyframe alpha turntable is generated with `sh site/tools/prepare-turntable.sh`. The original frames, previous WebM and Safari alternative are retained. Metadata checks verify 360 keyframe packets, 25 fps and 14.4 seconds. Representative front/side/back frames were compared at actual display size before promotion. Browser playback and keyboard rotation checks supplement the existing controller tests; physical Safari and touch checks remain a deployment task.

The local social image and standalone 404 are prepared. Public canonical/social URLs, custom 404 status/routing and production performance checks still depend on the eventual host. No placeholder public domain is included in the site.

## Embedded image attribution

Published project images, their responsive variants, the avatar still and social card carry embedded XMP metadata: image creator/credit, title, project context, portfolio publisher, rights notice and links back to Julius Wenk’s repository/Instagram. Julius’s own images also include the public portfolio contact email. Melissa Papafio-Roberts’s photography and Conrad Lischewsky’s visualisations retain their image credits separately from Julius’s project contribution. Hyperreal retains the existing-logo reference. No reuse licence is assigned by this metadata.

Run `python3 site/tools/image_attribution.py` after replacing exported images; `prepare-images.py` also calls it after creating variants. The tool updates metadata without re-encoding image pixels and verifies decoded pixels, metadata and idempotence before replacing each file. It leaves project source files untouched. The tool also generates a local `site/IMAGE_CREDITS.md` companion credit list. Metadata adds approximately 1–2 KB per image; copies or third-party re-exports can strip it. This is attribution, not a watermark or copy restriction.

## What is backed up

Git tracks the website code, its currently referenced images, videos and animated model, the checks, the project descriptions, this README, and `.gitignore`. Other Markdown notes remain local and are ignored by Git.

Original project media, design source files, preview screenshots, local notes and settings, and 11 unused web assets are excluded by `.gitignore`. They remain on the computer and need a separate backup if you want to preserve them. No files were deleted to prepare this repository.

The unused asset exclusions reflect the current website. If a later change uses one of those files, remove its entry from `.gitignore` before committing.

## GitHub backup

The private backup repository is [juliuswenk/portfolio-website](https://github.com/juliuswenk/portfolio-website).

To restore it on another computer, authenticate with GitHub and run:

```sh
gh repo clone juliuswenk/portfolio-website
```

## Save future changes

From the repository root:

```sh
git status --short
git add .
git diff --cached --stat
git commit -m "Update portfolio"
git push
```

Review the staged file list before committing. Newly added files at the repository root are excluded by default; add an exception to `.gitignore` when one should be backed up. Changes become an off-computer backup only after a successful push.
