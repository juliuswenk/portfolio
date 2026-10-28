# Portfolio wireframe

Local, buildless prototype of the navigation agreed on 27 October 2026. The existing portfolio and `Redesign/stem-test/` remain separate.

Serve the parent `site/` directory and open `/wireframe/`. For example, from the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory site
```

Home shows all seven static cube links, the full name and About & Contact. Project and About views use fixed JW navigation, ordinary scrolling and individual hash addresses. Browser history preserves each visit's reading position. Project content and responsive image variants come directly from `../projects.js` and `../media.js`. The static About/CV/contact copy matches the existing portfolio.

Each project section has a cube image in place of its future exploded part, followed by a CSS glass description window and the section's existing media. The original media mappings, paired desktop images, proportions, captions, films and credits are retained. All text is expanded for this wireframe. Skill controls, related projects and the project index are omitted.

No physics, motion sensors, model loading or exploded-view choreography is included. The glass material uses CSS; final refraction can be evaluated against the real models later. Inter is loaded from Google Fonts, with a system fallback when offline.

Run `node site/wireframe/check.mjs` from the repository root for content, route and history checks. Run `node check.cjs` for the existing portfolio's regression checks.
