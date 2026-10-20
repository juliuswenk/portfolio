# Production handoff

The current site is static. Hosting and the public address have not been chosen; no publication or external configuration was performed.

## Prepared locally

- `site/404.html` is a standalone branded error document. Its styles and motif are inline, and its return link goes to `/#overview`, so nested missing paths cannot break asset URLs. A host must serve this document with HTTP **404**, not redirect every missing URL to a successful homepage response. The simple Python preview server does not perform that custom mapping; preview the document at `/404.html`.
- `site/assets/social-preview.jpg` is 1200×630. It uses the portfolio identity, network, project imagery and DOXA’s photographer credit. Text Open Graph metadata and the large-image card type are prepared in `index.html`.
- The browser title follows the active project, About and Contact. Hash links remain the project navigation scheme; social crawlers generally receive the shared portfolio document rather than separate case-study pages.

## Complete when the public URL and host are known

1. Add a canonical link containing the real homepage URL. Add `og:url`, an absolute HTTPS `og:image` URL pointing to `assets/social-preview.jpg`, its width/height and descriptive image alt text. Add the corresponding `twitter:image`. Do not ship a localhost address or an invented domain.
2. Configure the selected host’s custom 404 mapping. Verify an arbitrary nested missing path returns status 404, shows the branded page and has a working return link. Verify real assets retain their correct MIME types and are not rewritten to HTML.
3. Verify HTTPS, caching and compression of HTML/CSS/JavaScript. Keep deferred videos/models deferred; do not preload the turntable. Set a cache strategy that permits updated scripts/assets to arrive together. The version query strings are updated with each code revision.
4. Fetch the social image anonymously from its public URL and use the target platforms’ preview tools to check the resulting card. Keep the photograph credit intact.

## Performance and accessibility verification

Use the browser’s actual device emulation and compare its reported client width, not just a requested window size. Repeat 320×640, 390×844, 768×1024, 1440×900, 1920×1080 and 844×390.

In a clean browser session, disable cache and record a cold load with network throttling and 4× CPU slowdown. Record requests, transferred bytes, LCP and CLS. Trace a full project transition and interaction separately; inspect long tasks and forced layouts. Observe the heaviest scene for at least 60 seconds on a representative phone. Aspirational plan budgets are LCP <1.5 s, CLS <0.05, opening transfer <3 MB and sustained 60 fps. Record actual results and conditions even when targets are missed. A short scripted interaction is not a field INP measurement.

Verify real iOS Safari and Android Chrome when devices are available. In particular, check Safari’s HEVC-alpha alternative, the smaller VP9-alpha version in Chrome, full rotation, reverse/forward seeking and the loop seam. Source video metadata alone cannot prove browser playback or touch behaviour.

Test OS reduced motion, the site’s Still/Motion control, Data Saver where reported, failed assets, slow media, keyboard-only navigation and a screen reader. Open and cancel the Projects list and photo viewer, check focus restoration, expand the CV and implementation sections, and rotate the device while reading or after selecting a project. Confirm normal scrolling ends automatic arrival correction.

## Current limits

The in-app browser exposes viewport and DOM interaction but no CPU/network profiler, field metrics or physical-device session. Local viewport/interaction checks and the automated suite do not establish production Core Web Vitals, sustained device frame rate, Safari rendering, or a complete accessibility certification. No runtime analytics or new external service has been introduced.
