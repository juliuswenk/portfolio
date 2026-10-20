# Awwwards improvements — implementation plan

Status: implemented and verified locally on 20 October 2026. All ten design decisions and the consolidated plan were confirmed before implementation. Production setup and unavailable device/performance checks remain explicitly deferred below. Scope covers the remaining issues in AWWWARDS_AUDIT_2026-10-20.md.

## Objective and retained decisions

Improve mobile composition, access to the work, desktop media pacing, navigation reliability, accessibility, optional-media efficiency, and deployment finish. Preserve the network as the connecting idea, the selected hero’s arrival into its reading position, the frozen network during project reading, continuous ordinary scrolling, the shared editorial structure, original media and credits, and the existing loading/data/motion preferences.

Desktop remains media left / text right. Phones retain hero → introduction → relevant narrative and evidence. No pinned text, separate column scrolling, forced pauses, invented project claims, or removal of source assets.

## Audit evidence

- At 390×844, overview project nodes are about 59 px wide and labels visually about 10 px; the introduction reaches the right viewport edge.
- At 844×390, introduction and project labels collide.
- The first project section starts roughly 5.4 phone screens from the beginning; the full About/CV journey precedes it.
- At 1440×900, VISIO’s media column is about 1,887 px longer than its text column.
- A project jump after viewport changes was observed to remain in the arrival state until reselected.
- Skill chips and onward links are below the desired 44 px touch comfort target.
- The deferred turntable remains 16.74 MB. Current throttled Core Web Vitals and sustained frame rate have not been measured.
- Social-preview metadata and a production-verified branded 404 remain unfinished.

## Design tree

1. **Reading journey**
   - Settled: keep About before the projects. Do not move it after the work or outside the main scroll journey.
   - Settled: keep biography and skills visible; collapse only the CV in a native disclosure. Retain contact links and Explore the projects. Reduce avatar dominance and enforced empty scroll space without trimming the biography.
2. **Mobile overview and navigation**
   - Settled: prioritise readable network nodes, even when not all seven fit in the opening viewport; provide a complete named Projects list.
   - Settled: a named Projects list is available at every size. On phones replace the numbered strip with the current project name, Projects and Still/Motion view. Desktop retains numbered shortcuts plus access to the named list.
   - Settled: introduction above a larger stable network view in portrait, beside it in short landscape. DOXA, VISIO TECHNOLOGICA and VEILED PANOPTICON are the prominent initial projects. Other nodes can extend outside the frame; the named list always exposes all seven.
   - Settled: explain shared skills briefly and reveal relevant skills on hover/focus. Touch taps still open projects directly.
3. **Desktop media pacing**
   - Settled: related supporting-image groups and readable paired views are allowed on desktop. Retain every selected image, the generous hero, two columns and one normal page scroll. Phones retain full-width images in the existing sequence.
   - Apply grouping beside relevant story blocks and put onward navigation after the complete project content. Preserve captions and credits; do not invent new evidence.
4. **Correctness and accessibility**
   - Required by the request: stabilise project arrivals after responsive and late-content layout changes; preserve user scroll while reading; make comfortable touch areas; verify visible focus, dialog return focus and keyboard navigation.
   - Implementation details follow inspection; these are not additional product features.
5. **Media and performance**
   - Facts confirmed: original RGBA frame sequence and local encoders are available; current every-frame keyframes support scrubbing.
   - Settled: compare smaller exports and permit modest resolution reduction only if transparency, metallic appearance, full rotation and responsive scrubbing remain convincing at actual display size. Keep the current version if candidates fail comparison. Do not promise an arbitrary file size.
6. **Sharing and deployment**
   - Facts confirmed: no public domain or hosting configuration was found in tracked project files.
   - Settled: prepare social-preview and branded 404 assets locally; defer real public URLs and host-specific routing/status verification until hosting is chosen.
   - Settled: a composed static preview with Julius Wenk — New Media Designer, the existing dark/blue network language and selected project imagery; retain applicable photo credits.

## Confirmed implementation constraints

- The site is static HTML/CSS/JavaScript with no build or deployment configuration found. No production domain was found in tracked code or documentation; the private backup repository is not evidence of hosting. The user confirmed that hosting is not yet chosen; production-only URL wiring and routing verification are explicitly deferred. Never use localhost as a public canonical or social-image URL.
- About remains before the projects, matching existing section order. Shortening it still requires remeasuring scene stops and testing direct links/history. The final project currently remains the active reading scene through the ending; document and verify the intended closing state while changing navigation.
- Desktop media grouping must preserve individual enlargement controls, captions/credits, the single turntable player, and the mobile reading order. Onward navigation must follow both columns rather than finish inside the shorter text column.
- Arrival correction belongs in the shared navigation and layout measurement path. Preserve the intended destination through late layout/reflow, without snapping visitors who have begun scrolling. Do not mask the observed drift with a broad tolerance.
- The original 361 RGBA necklace frames and local encoders are available. The current 640×800, 25 fps alpha WebM uses every-frame keyframes intentionally for reverse/forward scrubbing. Compare lighter variants for transparent edges, materials, playback and seek response; retain the current file as a fallback until the replacement passes. Preserve the Safari alternative and all intent/data/motion restrictions.
- Extend existing checks for new section geometry, responsive reflow followed by navigation, media grouping/order, named navigation, focus and media budgets. Keep the established editorial, loading and network checks.

## Round 1 — confirmed

- Q1: **Keep About before the projects.** This overrides the audit’s relocation recommendation.
- Q2: **Readable phone network plus complete Projects list.** All seven nodes need not fit in the first screen.
- Q3: **Group supporting desktop media; retain every image.** Keep the existing phone image sequence.

## Round 2 — confirmed

- Q4: **Keep biography and skills visible; collapse only CV.** Keep About before the projects and remove unnecessary empty spacing. Do not hide the biography or skills in disclosures.
- Q5: **Named list on all sizes; simpler phone footer.** Show the current project name, Projects and Still/Motion view on phones. Selecting a project name opens it directly.
- Q6: **Prepare locally; hosting is not chosen.** Public canonical/social URLs, production routing and actual production measurements remain an explicit later deployment task.

## Round 3 — confirmed

- Q7: **Portrait introduction above; first three projects prominent.** Landscape introduction beside the network. Keep the existing project order and ordinary scroll into About.
- Q8: **Brief cue and skills on hover/focus.** Touch selection remains direct; connections remain available in the reading view.
- Q9: **Optimise while preserving appearance and scrubbing.** Modest resolution reduction is allowed when comparison passes; otherwise retain the current export and report its remaining cost.
- Q10: **Name, network and project imagery.** Prepare a composed static preview in the existing visual identity with applicable photo credits.

## Implementation sequence

1. **Phone opening and responsive network:** use separate space for identity, the network and fixed controls. Put the short introduction above the network on portrait phones, and beside it on short landscape screens. Frame the first three project nodes prominently without squeezing all seven into the viewport. Separate image/depth scaling from label sizing so visible labels render at least 14 px and exposed targets remain comfortably usable. Preserve both text gutters, sensible line lengths and safe-area space; allow ordinary vertical flow where necessary. Keep the network stable until scrolling or selection changes the view. Place the concise shared-skills cue in the overview and show relevant skills with hover/focus without moving the map or requiring a first preview tap.
2. **About and framing:** retain the existing main section order. Remove excessive minimum heights/blank padding from About; keep the current biography and skills visible, use a smaller bounded avatar, and wrap the existing CV in native details/summary. Keep contact and project-entry actions available outside the disclosure. Make the fixed header reliably protect its wordmark and controls from departing content.
3. **Named project navigation:** generate names from the existing shared project data. Use a small accessible dialog with ordinary project anchors, a clear close action, keyboard focus management and return to its trigger on cancellation. Selection closes the list and uses the existing project navigation path, leaving focus at the selected project. Keep Overview and About reachable, and label the closing invitation as contact/ending rather than a new project. Keep the current project title readable, including long names, with the full name available in the named list. Do not create duplicate project content or an additional selection/reveal step. Make the phone current-project label accommodate long names without crowding controls.
4. **Supporting-image groups:** retain individual figures, captions, credits and enlargement controls. Prefer simple desktop grid pairing of adjacent figures in the left column, rather than nested viewers or extra scrolling containers. Initial candidates are VISIO’s adjacent development/tower views, Matrix Lamp’s detail/profile views and its rear/front finished views. Preserve every selected image and the existing phone order. Keep images standalone where pairing makes them too small or the columns already balance. Do not pad stories to match image height. Move the onward action after the complete project content across both columns, while retaining skill routes near the narrative.
5. **Arrival stability:** track the intended destination during an explicit navigation. Remeasure after responsive reparenting and late layout changes; settle that destination at its reading pose, then release correction. Stop correcting once the visitor deliberately scrolls or navigates elsewhere. Disclosure changes during reading must update geometry and protected areas without pulling the visitor back to a project opening. Maintain direct links, history, reverse scroll, Still view and the single reading hero.
6. **Touch and focus:** enlarge skill and onward/documentation targets toward 44 px in both dimensions or provide sufficient spacing where a compact link is retained. Keep focus visible and clear of fixed chrome. Verify the named list, CV, technical disclosures, photo viewer and turntable with keyboard and touch; explicitly restore viewer/list focus appropriately on close and preserve vertical scrolling on the turntable.
7. **Lighter turntable:** derive a small set of VP9-alpha candidates from the original PNG sequence. Compare compression at the existing size before trying a modest size reduction; retain frame cadence, complete rotation and responsive reverse/forward seeking. Check representative still frames at actual hero size, transparent edges on the site background, metallic highlights and the loop seam, then test playback and repeated scrubbing. Keep the Safari alpha alternative functional and verify its behaviour rather than assuming the WebM comparison proves it. Promote only a candidate that is smaller and passes the visual and interaction checks; keep sources and the previous export recoverable. Preserve the still poster, one-turn reading behaviour, single player, intent/approach loading and explicit loading on constrained data/motion.
8. **Performance measurement:** retain deferred initialization and the existing responsive media. Verify loading on a fresh entry and intent/approach, error fallbacks and restricted-data/Still behaviour. Profile the network draw path before changing it; if repeated style/layout reads are expensive, cache geometry outside the draw loop and refresh it on actual layout changes. Measure with a permitted browser profiler/throttling tool when available; report missing tool/device coverage rather than inventing metrics or replacing FPS with code inspection.
9. **Local release assets:** prepare a branded static 404 with a return-to-network link, a 1200×630 composed social-preview image and descriptive project document titles. Use Julius Wenk — New Media Designer, the existing dark background/blue network, and a small set of actual project images with applicable credits. Keep important text legible at preview size. The local 404 document must render without the portfolio application and its links/assets must resolve even from a nested missing path. Write a short deployment checklist for absolute public metadata, canonical URL, correct 404 response and production verification. Keep localhost and invented domains out of public metadata. No hosting purchase, new service or publishing is included.
10. **Documentation and checks:** extend the existing check suite rather than introduce a new framework. Update PROJECT_GUIDE.md, README.md and video/export notes for the final accepted behaviour. Preserve original descriptions, media and existing assets until replacements pass comparison.

## Acceptance checks

| Area | Required local result |
| --- | --- |
| Phone opening | Verify 320×640 and 390×844 with real client dimensions. First three project names are legible at a rendered size of at least 14 px; introduction has both gutters; controls and content do not collide. The named list exposes all seven projects, including offscreen nodes. |
| Landscape and larger screens | Verify 844×390, 768×1024, 1440×900 and 1920×1080. No horizontal document overflow, clipped controls, overlapping identity/project labels or header bleed. Preserve desktop composition and safe-area clearance. |
| About | It remains before the work. The entire existing biography and skills are visible. Only the CV starts collapsed. Expanding it retains the reader’s position; contacts and project entry remain available. Avatar does not obscure identity, copy or controls. Remove forced empty scrolling and compare the first-project distance with the audit’s 4,531 px phone baseline; report the actual improvement without imposing a one-screen About target. |
| Named navigation | All seven names open the corresponding project in one action. Keyboard focus, Escape, cancellation return, selection focus and history work. Phone footer remains readable with long titles. Overview, About and the closing invitation have accurate labels. |
| Reading and media | Keep one reading hero, all selected images and credits, current phone image sequence and one turntable player. Pair only readable adjacent supporting views on desktop. Measure VISIO’s media/text difference against the approximately 1,887 px audit baseline and reduce long tails without shrinking evidence into thumbnails or padding the text. Onward navigation follows the complete content. |
| Camera and arrival | Direct links, normal/reverse scrolling, browser back/forward, resize/orientation followed by navigation, delayed images and disclosure toggles all leave the intended project in its proper reading state. No persistent Connecting label, duplicate hero or automatic snap after the visitor starts scrolling. Network stays fixed during reading and returns visibly between projects. |
| Accessibility | Comfortable 44 px targets for new controls and expanded chip/onward actions; visible focus, logical order and no dialog traps. Named list and enlarged-image viewer restore focus appropriately. CV and technical details use native accessible disclosures. Verify OS reduced-motion when supported and equivalent usable Still view; no essential hover-only access. |
| Media | Compare current and candidate file sizes, alpha edges, materials, representative frames, complete turn and seam at actual display size. Verify forward/reverse scrubbing, playback and vertical touch scroll. Confirm motion/data restrictions, poster/error fallback and Safari alternative. A smaller file alone is not a pass. |
| Loading and stability | Fresh opening becomes usable independently of optional motion media. Loading escape, failed assets and slow responses remain usable. Profile rather than guess whether the draw path needs caching. Retain existing loading checks. |
| Sharing/404 | Social artwork is readable locally and uses confirmed identity/imagery/credits. Document titles follow the active project. Branded 404 has working home/navigation assets independently of the main application. No invented domain or localhost canonical/social URL is published. |
| Regression | Run the existing check suite and extend focused coverage for geometry, named navigation, grouping/mobile order, focus, metadata and asset behaviour. Save before/after captures and update the guide, README and export notes. |

## Performance verification and reporting

When permitted profiling/throttling tools are available, measure cold entry, project arrivals and the heaviest network interaction on a phone-class profile. The Awwwards skill’s aspirational budgets are LCP below 1.5 seconds, CLS below 0.05 and first-view transfer below 3 MB; target 60 fps during the signature movement. Assess interaction responsiveness as well; do not mislabel a short scripted interaction test as field INP. Treat budgets as test targets, never as achieved results without evidence.

Distinguish file size, local resource transfer, lab performance, sustained device frame rate and production/field results. If tooling or a physical device is unavailable, state which verification is missing and provide a repeatable handoff. Do not add runtime analytics, a new framework or a new service just to claim measurement coverage.

## Explicitly deferred until hosting is chosen

- Set the real canonical URL and absolute Open Graph/social-image URLs; verify that the public image is fetchable and a preview renders correctly.
- Configure the selected host’s 404 response and nested-path asset handling, then verify a genuine missing URL returns HTTP 404 and the branded page.
- Verify HTTPS, caching/compression, production cold-load transfer and performance, and cross-browser/physical iOS and Android behaviour with the available devices/tools.

Local preparation is included. Buying hosting, choosing a domain on the user’s behalf, publishing, changing external services or asserting production readiness is not part of this implementation.

## Final confirmation

All interview branches are settled. In Q11 the user confirmed: “Yes — the plan captures my intent.” The plan preserves the user’s About-first decision and visible biography/skills, rather than silently substituting the audit’s work-first recommendation. The interview is complete and this document is the confirmed implementation specification. No website changes have been made during the interview.


## Implementation record — 20 October 2026

The local implementation is complete. About remains before all seven projects, with the complete biography and skills visible and only the CV collapsed. The avatar is bounded, excess spacing is removed, and contact/project-entry actions remain outside the disclosure. Portrait phone/tablet openings give the first three projects readable 14 px labels; short landscape places the introduction beside them. A named Projects dialog exposes all seven projects at every size. Desktop retains its numbered shortcuts; compact layouts show the current title, Projects and Still/Motion.

Shared skills appear on overview hover or keyboard focus. Supporting figures use simple desktop pairing for VISIO and Matrix Lamp, preserving every individual image, caption, credit, enlargement control and phone sequence. Onward navigation follows both complete columns. Project jumps settle through critical hero readiness and two layout frames, then release; user input cancels correction earlier. Lazy reading images reserve their full display area before their sources arrive. The header, focus feedback, viewer/list return focus and touch target sizes were improved without adding dependencies.

### Local evidence

- Six requested viewports were checked: 320×640, 390×844, 768×1024, 1440×900, 1920×1080 and 844×390. Their actual document client widths were 305, 375, 753, 1425, 1905 and 829 px respectively because the desktop browser reserved a 15 px scrollbar. None had horizontal document overflow. The first three compact project labels render at 14 px without scale reduction.
- At the requested 390×844 viewport, the first project now starts at about 3,029 px, compared with the audit’s approximately 4,531 px: about one-third less scrolling, with biography and skills retained. This is a local geometry comparison, not a timing metric; the scrollbar/client-width difference is reported above.
- At desktop size, VISIO’s reserved media column measured about 3,219 px and text about 2,401 px: a difference of about 818 px, down from the audit’s approximately 1,887 px. Unloaded images already occupied their intended boxes; their dimensions did not collapse to zero. Onward navigation followed the taller column.
- Explicit project selection after resizing settled at approximately 16 px from the viewport top. Matrix Lamp also returned to that position through browser back/forward. Still view project navigation, direct links, reverse scroll and finite correction release are covered by the existing/extended checks. CV open/close left its visible summary at the same measured position after scrolling settled. Escape returned focus to the Projects trigger and to the original image-enlargement control.
- The new 512×640 VP9-alpha turntable is 8,671,909 bytes versus 16,740,568 bytes previously: **48.2% smaller**. Front/side/back comparisons retained transparent edges and metallic appearance at the displayed size, with modest softening of fine detail. All 360 frames remain keyframes at 25 fps over 14.4 seconds. Browser playback completed one turn and paused; forward and reverse keyboard seeking changed the rendered pose/time. The original WebM, PNG sources and 8,563,863-byte Safari HEVC alternative remain intact. Export instructions are in the project’s VIDEO.md and site/tools/prepare-turntable.sh.
- The standalone /404.html rendered independently and its return link opened the network. The 1200×630 social artwork uses existing project imagery and retains the DOXA photographer credit. Active document titles follow projects, About and Contact. No placeholder public URL was added.
- The focused automated suite (node check.cjs) passes, including geometry settlement/release, responsive media order, all seven named routes, image preservation, single turntable, optional-media restrictions/fallbacks, CV/metadata/404 and asset-budget checks. git diff --check passes. The live browser reported no warnings or errors during the final navigation pass.

Captures are saved in verification/awwwards-implementation/: the six overview sizes, project-menu-phone.png, desktop-media-groups.png, 404-phone.png and final-overview.png. The source descriptions and selected media remain intact.

### Remaining verification and deployment

No permitted browser CPU/network profiler or physical-device session was available. The network draw path was therefore not rewritten on an unmeasured performance assumption. No new LCP, CLS, INP, sustained FPS or cold-transfer result is claimed. Real Safari HEVC-alpha playback, physical iOS/Android touch, OS-level preference testing and screen-reader review remain outstanding; the Still/Motion control and simulated motion/data restrictions are covered locally. Local desktop keyboard seeking does not establish real-device touch performance.

Hosting, canonical/absolute social URLs, public preview fetching and genuine missing-path HTTP 404 mapping remain deferred as agreed. The current Python preview server does not map arbitrary missing paths to the branded document; /404.html is its direct local preview. DEPLOYMENT.md contains the concrete handoff checks. No publishing, hosting purchase or external service change was performed.


## Later About revision — confirmed directly by the user

The user requested the character as the dominant left-side element on desktop, with the waving hand near the top and the knees near the lower edge. This supersedes the earlier small desktop avatar decision. The new portrait holds between the fixed header/footer while the biography scrolls, without adding section height or pinning the text. Its camera measures the head/hand positions through the full wave and knee positions once at model readiness. The overview avatar and compact phone layout remain as before; existing motion/data preferences are retained. The still fallback uses a matching large crop when the model is unavailable or not loaded.

Verified locally at 1440×900 and 2048×1228: the portrait has margins below the header/above the footer, remains clear of the biography, holds its position during About scrolling, and renders the wave without cropping the hand. At 390×844 the compact 100×140 avatar remains above the biography without horizontal overflow. The focused regression suite covers desktop portrait sizing/scroll stability, compact layout and the model's required framing landmarks; loading checks still pass. Captures: verification/awwwards-implementation/about-portrait-wave-19.png and about-portrait-2048.png. No model/source assets or download sizes were changed.


## Follow-up — About arrival and overlap policy

The user reported a sudden small-to-large character jump and asked whether all image overlap needed to be prevented. The About phase had switched both its DOM frame and camera frustum instantly, and the collision solver had treated the entire transparent portrait canvas as a solid obstacle.

The character frame now eases its position, width and height over 650 ms in either direction. The model camera blends independently, the wave begins once nearly settled, and leaving the reading stage fades the character rather than abruptly hiding it. WebGL allocates for the destination dimensions rather than reallocating on each intermediate CSS animation frame. Still/reduced-motion views use immediate settled geometry.

The portrait canvas is no longer a card-placement obstacle. Images may remain behind the character; covered images dim instead of disappearing, while their obscured controls are inactive. The interaction protection uses a narrower figure region rather than all transparent canvas space. Background card image bodies may overlap by up to 18% of the smaller card area when their actual caption bounds remain clear. Caption/image interference and case-study reading obstacles remain strict. This preserves the network’s depth and avoids pushing everything into artificial empty-space columns.

Local browser checks observed intermediate widths and positions on forward and reverse arrival, a settled large portrait, no animation in Still view, and no console warnings/errors. Automated coverage includes permissible image-edge overlap, caption collision, hard reading obstacles and existing network/arrival/loading checks. No sustained frame-rate or physical-device performance claim is made.
