# Awwwards audit — 20 October 2026

Scope: the current local portfolio at http://127.0.0.1:4184/, its seven project sections, About, image enlargement, keyboard entry, and Still view. This is a review only; no website code was changed. The earlier project-focus, loading and editorial revisions are present.

Concept: a connected practice, explored through a network of projects whose shared skills create routes between them. The concept is strong enough to retain. The next improvements concern composition, orientation and pacing rather than additional effects.

## Measurements and verification limits

| Check | Result |
| --- | --- |
| Viewports | 320×640, 390×844, 768×1024, 1440×900, 1920×1080, 844×390 |
| Document horizontal overflow | None at these six sizes; actual client width checked |
| Phone overview node width | Approximately 59.4 px at 390 px; transform scale 0.55 makes the 18 px labels visually about 9.9 px |
| First project section position, phone | Approximately 4,531 px from the start at 390×844, or 5.4 screen heights; the hero begins further within that section |
| About section, phone | Approximately 3,054 px, or 3.6 screen heights |
| First project section position, desktop | Approximately 4,142 px at 1440×900, or 4.6 screen heights |
| VISIO desktop columns | Media approximately 4,281 px; text approximately 2,394 px, leaving a difference of 1,887 px |
| Solid-background text contrast | Accent #3d73ff against #111314: 4.52:1; body #d2d6d5: 12.71:1. These are calculated token ratios, not an exhaustive rendered contrast audit |
| Avatar / avatar still | 2,286,500 bytes / 11,990 bytes, file sizes |
| Hyperreal turntable | 16,740,568 bytes, file size; deferred rather than an opening requirement |
| Initial browser console | No errors or warnings observed in the sampled initial load |
| Existing automated checks | Pass: seven projects, editorial source parity, media sequence, network geometry/navigation, viewer logic, loading and motion/data restrictions |
| Semantic spot checks | One h1; no images missing an alt attribute; no published pending-description/internal-title placeholders |
| Keyboard spot checks | First Tab reaches Skip to projects; project selection, implementation disclosures and viewer opening/closing exercised |
| Motion | Manual Still view checked; fresh OS reduced-motion emulation was not available |
| Metadata | No og:image or canonical link in the current document |

LCP, CLS, INP, first-view network transfer, Lighthouse scores, sustained FPS, GPU draw calls and CPU/network-throttled performance were **not measured in this audit**. Available browser controls did not expose those measurements. Earlier performance observations are not presented as fresh results. Physical iOS/Android devices and screen readers were not tested. The existing missing-path tab was not a usable browser surface; production 404 behaviour remains unverified. No custom 404 file exists in the current site directory.

## Provisional self-score

| Criterion | Weight | Estimate | Evidence |
| --- | --- | --- | --- |
| Design | 40% | 6.5 | Stronger project openings and consistent typography; phone overview, landscape collisions, About framing and column pacing still need refinement |
| Usability | 30% | 6.1 | Ordinary scrolling, direct project access and disclosures work; biography detour, small mobile labels, ambiguous numbered navigation and a resize/arrival edge case remain |
| Creativity | 20% | 7.4 | The shared-skill network and project arrival give the portfolio a recognisable concept; the meaning of connections needs a clearer first-use cue |
| Content | 10% | 8.0 | Complete project stories, personal contribution, honest limitations, credits and direct contact; some visual documentation could be more selectively sequenced |

Weighted estimate: **6.71/10, rounded to about 6.7**. This is an editorial self-score, not a jury result or a measured performance rating. The site is substantially stronger, but I would postpone submission until the mobile and arrival issues are fixed and production performance is verified.

The criterion weighting is reflected in Awwwards’ published scoring breakdowns, for example [Piccsy Pitchdeck](https://www.awwwards.com/web-design-awards/piccsy-pitchdeck). Current official evaluation-page retrieval timed out, so this report does not assert current eligibility rules or guaranteed award thresholds.

## Highest-leverage improvements

### 1. Design the phone overview and landscape layout deliberately

At 390 px the entire network is a compact central cluster. Node labels render at roughly 10 px, even though their untransformed CSS size is 18 px. There is considerable unused space above the cluster. The introduction has a left gutter but reaches the right viewport edge. This is not horizontal overflow, but it looks cramped and uneven.

At 844×390, the headline and introduction occupy the same area as project labels and the fixed footer. This is a concrete responsive composition failure, rather than a stylistic preference.

Keep the network, but give phones a composition with readable, unscaled label sizes and larger project discovery targets. Use the available vertical space better, restore both text gutters, and provide a compact landscape arrangement with distinct space for identity, network and navigation. A named project-list control would make the numerical footer usable without memorising project numbers. Introduce the meaning of the connections with one concise cue or an interaction that reveals the shared skill.

Expected influence: approximately +0.25 to +0.3 on the weighted self-score if resolved well; this is a design estimate, not a guaranteed outcome.

Evidence: [phone overview](verification/awwwards-2026-10-20/overview-390x844.png), [landscape overlap](verification/awwwards-2026-10-20/overview-844x390.png), [small phone](verification/awwwards-2026-10-20/overview-320x640.png).

### 2. Let natural scrolling reach the work before the full biography

The first project section starts about 5.4 phone screens from the beginning. The overview is followed by the complete About section, including biography, skills, CV and contacts. A direct project click skips this, but the prominent “Scroll to explore” invitation sends visitors through it.

Move the full About/CV journey after the work or make it a deliberate About destination outside the main project scroll sequence. Keep a short personal introduction on arrival. Retain the avatar, but reduce its scale in About: on the phone it becomes a large, visibly soft foreground figure, competes with nearby project nodes, and reaches into the header area. The header also allows departing introduction text to show behind its wordmark/subtitle in this state.

Expected influence: approximately +0.15 to +0.2 overall through clearer orientation and faster access to evidence.

Evidence: [About on phone](verification/awwwards-2026-10-20/about-phone.png).

### 3. Balance desktop media with the accompanying story

VISIO’s media column is approximately 1,887 px longer than its text column at 1440×900. Matrix Lamp also has a noticeably longer image sequence than its narrative. The right column can finish several viewports before the last supporting image, leaving a long unaccompanied media tail.

Keep the agreed media-left/text-right composition and one normal page scroll. Group related images more tightly, use paired supporting views where useful, and place concise process or evidence captions beside the parts they explain. Put onward navigation at the actual end of the project. Preserve the source assets and intentional sequence; reduce repeated visual coverage only after review. This does not require pinned text, a separate scroll area, or additional animation.

Expected influence: approximately +0.1 to +0.15 overall through stronger pacing and more deliberate composition.

Evidence: [desktop media pacing](verification/awwwards-2026-10-20/desktop-media-pacing.png).

## Other remaining work

- **Arrival settling after resize.** Following the viewport sweep and restoration to the normal window size, a DOXA jump settled with the section top at about 50.5 px and remained in `transition` / `is-arriving`. The footer said “Connecting / DOXA”; the enlarged network image was still the foreground hero. Selecting DOXA again settled at about 16 px and changed to `reading`. This is an observed resize/navigation edge case, not evidence that every fresh visit fails. Stabilise the final arrival after responsive reflow and late layout changes, and add a regression covering resize followed by project navigation. [Captured state](verification/awwwards-2026-10-20/transition-settling.png).
- **Touch and focus polish.** Skill chips measured 31 px high, and project onward/documentation links measured 35 px high. Improve them toward the skill’s 44 px comfort target. Footer shortcuts are 20×44 px and have accessible names, but their visible numbers and symbols still require interpretation. Do not equate these measurements alone with a complete WCAG failure; assess spacing as well. Explicitly verify image-viewer focus restoration with a physical keyboard before signing off accessibility.
- **Production performance proof.** Test cold entry and all project transitions on a throttled phone-class device. The deferred 16.74 MB turntable is still expensive once requested; compare a lighter export against the current rendering before deciding whether to replace it. Code inspection also shows repeated layout/style reads within network drawing; profile for forced layout before optimising. No current FPS or jank claim is made.
- **Sharing and deployment finish.** Add a designed Open Graph image and suitable social metadata. Set the canonical URL when the production address is known. Provide and verify a branded 404 with a real return path and correct HTTP status. Project navigation currently retains the general portfolio document title; consider meaningful project titles for orientation and sharing.

## What is already improved

The large project opening, natural image/text reading flow, consistent shorter stories, finished Hyperreal description, technical disclosures, preserved photo credits and direct email/Instagram/GitHub links are present. Optional media no longer needs to finish before entry. These are no longer the first problems to solve.

With the three main design improvements, the arrival bug resolved, and acceptable production performance verified, a self-score around **7.2–7.4** is plausible. The concept is not the ceiling; mobile composition and the order in which visitors encounter the work are the immediate limits.

## Captures

[320](verification/awwwards-2026-10-20/overview-320x640.png) · [390](verification/awwwards-2026-10-20/overview-390x844.png) · [768](verification/awwwards-2026-10-20/overview-768x1024.png) · [1440](verification/awwwards-2026-10-20/overview-1440x900.png) · [1920](verification/awwwards-2026-10-20/overview-1920x1080.png) · [Landscape](verification/awwwards-2026-10-20/overview-844x390.png) · [Manual Still view](verification/awwwards-2026-10-20/still-view-390.png).
