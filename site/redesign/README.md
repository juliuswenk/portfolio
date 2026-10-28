# Merged portfolio prototype

Separate preview agreed on 28 October 2026. Serve `site/` and open `/redesign/`. Published preview: https://juliuswenk.github.io/portfolio/redesign/. The original portfolio, `/wireframe/`, and `Redesign/stem-test/` remain separate references.

The five active projects are Carry the Computation, DOXA, Matrix Lamp, Visio Technologica and Veiled Panopticon. Their published copy and media come from the existing portfolio. The reading renderer and base layout are shared with the approved wireframe, including its section placeholders, CSS glass, uppercase section headings, name/JW transition and CV order.

Home loads the live collection once, with a **LOADING PROJECTS** screen and immediately available About & Contact. Direct project links bypass scene loading until home is visited. A failed load or 15-second timeout leaves five clickable cubes. Late results are discarded. Each live object retains a real project link for Tab/Enter access; its focus outline follows the model. Mouse/touch dragging uses the physics prototype's six-pixel threshold, collisions and bounded release momentum. A click opens immediately without a hop or delay.

The physical world pauses and hides while reading. Returning preserves its positions and motion state. Resize reconstructs collision boundaries and hull scale from a snapshot, preserving rotations, normalized positions, velocities, sleep state and the settling timeline rather than replaying the drop. Reduced-motion visitors receive a settled collection. The original shaders, lighting, bloom, grain, FXAA and material settings are retained. GPU drawing stops once settled or hidden.

On supported touch devices, the phone-and-shake icon at the bottom right requests sensor permission from a tap. It is dimmed when off and fully opaque when enabled. Deliberate screen-plane acceleration throws the objects in the opposite direction, with bounded force proportional to the movement. There is no tilt-driven gravity or artificial impulse away from the glass. Each deliberate movement starts or restarts an eight-second play window; expiry freezes the exact current positions and orientations. Reading, hiding the page, disabling motion or enabling reduced motion ends play; returning requires fresh movement. Dragging remains independent. Missing/denied sensors do not affect browsing. Gravity filtering (for sensors without separated linear acceleration) and screen-angle correction support portrait and landscape handling. Initial acceleration thresholds require real-phone calibration; no sensor data is transmitted or retained beyond the current filter samples.

Asset credits and the existing Impressum are included at the end of About & Contact. Rapier 0.19.3 and its Apache 2.0 licence are copied from the test. Five self-contained GLBs total approximately 4 MB. Three.js remains pinned to the test's CDN version, 0.180.0.

Checks: `node site/redesign/check.mjs` and `node site/redesign/check-motion.mjs`. Regression checks for the preserved wireframe: `node site/wireframe/check.mjs`; original portfolio: `node check.cjs`.

Exploded models/transitions are deferred. Final model silhouettes, motion sensitivity and real-device rendering still need evaluation. Sensor API reference: [Device Orientation and Motion](https://www.w3.org/TR/orientation-event/).
