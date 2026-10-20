# Opening performance and loading feedback

Status: confirmed by the user on 20 October 2026; implemented on 20 October 2026. Verification results below.

## Goal

Make the first screen useful before optional media finishes. Keep the connected project network and the existing project-reading journey. Loading feedback should explain preparation without turning optional downloads into an entrance requirement.

## Verified baseline

Source file sizes, not measured browser transfer or loading times:

| Asset | Current size | Current request behavior |
| --- | ---: | --- |
| Seven overview heroes | 5,056,517 B | All eagerly requested; no responsive variants |
| Animated avatar | 10,898,164 B | Model and Three.js loader requested at startup |
| Hyperreal WebM turntable | 16,740,568 B | Source attached at startup; preload auto |

Apple browsers can receive the alternate HEVC movie. The avatar contains approximately 6.89 MB of geometry, 3.92 MB of embedded textures, and 45.5 KB of animation. It has 74,301 vertices, two 2048-square textures, a skinned Head bone, and one wave clip. The turntable is 360 frames at 25 fps, with transparency. Supporting images and Vimeo frames currently rely on native lazy loading, which does not guarantee that hidden or nearby media stays unrequested.

## Confirmed decisions

1. Show a brief branded loading view while preparing the layout and small opening images. Reveal the usable site without waiting for the avatar or video. Provide an escape if preparation takes longer; no invented percentage.
2. Show a lightweight avatar still immediately. Load the animated model after the opening view is usable, or immediately on opening About. Preserve the wave and pointer-driven head tracking.
3. Start Hyperreal with its existing still. Attach its movie source on overview hover/keyboard focus or when scrolling approaches its project. Preserve the rotation introduction and interactive scrubbing.

4. Use Julius Wenk, a small network motif, and “Preparing the project network…” in the loading view. Exit immediately on readiness, without an artificial minimum duration. After about three seconds, add “Taking a little longer. You can start browsing while images arrive” and a Continue browsing button. Failed images cannot keep it open. The motif is static under reduced motion.
5. Match image quality to display size: small network variants, larger reading variants, existing full-size enlargement sources. Reduce avatar textures first; simplify geometry only if comparisons preserve the face, silhouette, wave, and head tracking. Keep source files intact.
6. Under Data Saver or a reported very slow connection, keep motion as stills until an explicit “Load animated avatar” or “Load interactive view” action. Still view and reduced-motion preferences prevent automatic motion downloads and playback. Loading explicitly must not silently turn Still view off or override reduced motion. Browsers without connection information use the normal intent/approach behavior.

## Proposed implementation sequence

### 1. Record an actual browser baseline

Capture cold-cache requests, transfer, and the point at which the network can be navigated on desktop and phone-sized views, with a throttled connection where tooling permits. Separate overview loads from direct links into projects and About. Retain file-size reporting separately from transferred bytes. Record cache and browser conditions so before/after comparisons mean something.

### 2. Deliver images at their display size

Generate static variants with locally installed Pillow; retain aspect ratios and transparency. Reuse the shared picture helper, with explicit network, reading, and enlargement contexts and appropriate srcset/sizes. Account for the network hero growing into the left-column opening during transitions: upgrade its source before that transition, rather than keeping it blurry or requesting reading-resolution versions for all seven nodes on arrival. Preserve dimensions to prevent layout shifts.

Audit every image consumer: overview heroes, preview satellites, reading heroes/supporting media, the turntable poster, video preview still, and the enlargement dialog. Do not change project ordering or copy. Keep original media intact. Aim for at least a 70% reduction in the aggregate small overview hero files, subject to visual comparison; report achieved sizes rather than promising transfer savings from file sizes alone.

### 3. Reduce and defer the avatar

Create a transparent still from the existing model, matching its framing. Compress embedded textures first, then trial rig-preserving geometry reduction only if needed. Use the installed Blender/Pillow tools; preserve joints, weights, Head bone, the wave clip, materials, and the original head pose. Compare the face and silhouette at overview and About sizes, including a high-density screen. Start with a target model size of 3 MB or less, conditional on visual and animation quality.

Defer importing the renderer and GLTFLoader as well as fetching the model. Use a single initialization path so idle loading and an About action cannot create two renderers or requests. A failed model leaves the still and functional About navigation. Do not let late initialization miss the current network pose or replay the wave incorrectly.

On ordinary connections, schedule avatar loading only after the opening view has been revealed, using idle time with a fallback. Opening About takes priority over that schedule. Under the restrictive preferences above, opening About exposes the explicit loading action instead. Avoid starting optional work in a hidden tab.

### 4. Attach optional media sources only when needed

Use preload none and leave turntable src unset until a confirmed trigger. Initialize once; retain WebM/HEVC selection, alpha, frame count/timing, single-player reparenting, poster fallback, keyboard/touch controls, and the project's one-turn introduction. Starting playback after a delayed load must respect the current project, Still view, and document visibility.

Approaching means roughly one viewport before the project opening; use the existing overview node for hover/focus intent. Touch navigation opens the project directly and begins loading through that approach/opening path, without an extra preview tap. Restrictive preferences replace these automatic triggers with the explicit loading action; the poster and reading content remain usable throughout.

Apply the same source-deferral principle to the background Vimeo preview: request it only when that preview is actually revealed. Load case-study Vimeo frames when approaching their visible section. Native lazy loading alone must not be the only protection for hidden network media.

### 5. Add loading feedback

The loader waits for application layout and the opening small image set to settle through success or failure. It never waits for Three.js, the model, turntable, Vimeo, or all case-study images. Direct project links prioritize their opening media and layout instead of forcing overview downloads first.

After about three seconds, expose the agreed longer-wait message and keyboard-accessible Continue browsing action. Continue browsing reveals the functional site while remaining images load. An image error counts as settled, not a reason to wait indefinitely. Do not impose a minimum display time or replay the loader during project navigation. Expose a concise live status, manage any focus moved into the loading view on dismissal, honor reduced motion, and ensure failed JavaScript cannot leave an opaque permanent overlay.

### 6. Verify and document the result

- Extend check.cjs for source deferral, initialization once, success/failure readiness, Continue browsing, responsive source selection, delayed video state, and the existing model/turntable contracts.
- Browser-check cold overview and direct links, slow/failed images, failed model/video, keyboard access, mobile layouts, transition hero sharpness, transparent edges, and full-size enlargement.
- Verify no model, Three.js, turntable, or Vimeo preview request is required before the opening view becomes usable. Verify intent/approach triggers and restrictive preferences separately.
- Compare before/after requests and transfer under matching conditions. Report any measurement unavailable in this environment and avoid claiming Lighthouse or Core Web Vitals results without measuring them.
- Update README with asset-generation/reproduction steps and achieved budgets. Preserve the static deploy with no mandatory runtime build or package installation.

## Scope boundaries

No redesign of the network, reading columns, navigation, project copy, or media order. No deletion of original source media. No progress percentage that pretends to measure total site readiness. No added analytics, service worker, or framework.

## Final approval

The user confirmed this consolidated plan and subsequently instructed implementation. During implementation, the user also supplied a replacement DOXA hero; it is published with the supplied photographer credit and responsive variants.

## Implementation results

- All published project images have WebP variants at up to 240, 480, 960, and 1600 pixels wide, without upscaling. Small overview heroes total 68,906 B (240px) or 176,138 B (480px). The earlier 5,056,517 B baseline predates the new DOXA hero. Image enlargement retains the full-size published sources, and all source originals remain intact.
- Avatar: 2,286,500 B, down from 10,898,164 B, plus an 11,990 B transparent still. Texture reduction alone would leave the original 6.89 MB geometry above budget, so the export also simplifies the mesh and retains four skin influences. The export has 32,076 vertices, a skinned Head bone, and one wave clip. The face, silhouette, and mid-wave pose were compared in the browser with identical camera/lighting.
- The renderer/model import follows entry or About intent. The turntable has no source on arrival and initializes once on intent/approach. Existing alpha, Apple source selection, frame timing, single-player handoff, and scrubbing remain. Data Saver/2G/Still view expose explicit load actions; loading explicitly does not switch motion on.
- The branded loading view exits on opening readiness, offers Continue browsing after three seconds, treats image failures as settled, and fails open after ten seconds if initialization stalls. Background content is inert while the loader is active; dismissal restores browsing and moves focus out of the loader if needed.
- Reading media and Vimeo iframe sources are deferred. Hidden preview players load only during an allowed preview and are unloaded when hidden or motion/data preferences restrict them.
- Browser verification found that native focus and fractional anchor positions could place an opening hero back in the transition. Reading-control scroll margins and a one-CSS-pixel landing tolerance keep those controls usable.

### Evidence and limits

`node check.cjs` covers the existing seven-project network/media contracts plus responsive asset existence/budgets, original enlargement, DOXA credit, compressed model Head/skin/clip, deferred turntable source attachment, loading readiness/errors/escape, direct links, initialization once, and restrictive preferences.

Browser checks cover desktop and narrow phone layouts, direct DOXA/Hyperreal/About links, new hero/credit/full-size viewer, delayed-image escape, failed images/model, Data Saver simulation, avatar comparison, and turntable playback/controls. A temporary local test server records Resource Timing into a test-only DOM output; this instrumentation is not shipped in the site. A fresh-path unthrottled 1280×720 run observed 37,704,731 B before versus 2,612,877 B after, including the idle-loaded avatar. The new avatar request started after entry, and the turntable/Vimeo were absent from arrival requests. Local assets used no-store; external CDN caches were not controlled. These are browser resource-transfer observations, separate from the source file-size budgets, and do not establish real-world speed or Core Web Vitals.

Physical Safari/Android, screen-reader speech, OS-level reduced-motion emulation, and bandwidth-throttled production timings were not tested. Reduced motion/data behavior has deterministic checks; Data Saver and Still view were also exercised in the browser.

The browser connection became unavailable during the final turntable seek check. Explicit loading and one-turn playback were observed, and the keyboard event reached manual mode; the final rendered seek could not be confirmed before disconnection. Frame arithmetic and keyboard/pointer state behavior pass the deterministic checks. Temporary diagnostic logging was removed.
