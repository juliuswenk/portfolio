# Julius Wenk — Portfolio

A portfolio of interactive experiences, installations, and physical objects by Julius Wenk, a New Media Designer based in Berlin. The work explores how technological systems shape perception, behaviour, and the social structures around us.

## A connected collection of work

The main page presents five projects as a collection of draggable 3D objects:

- **DOXA** — an interactive installation exploring how information changes across a simulated social network.
- **VISIO TECHNOLOGICA** — a VR journey through Berlin that explores technological perception using the ICAROS.
- **VEILED PANOPTICON** — an installation prototype that makes concealed presence affect a projected figure through WiFi sensing.
- **Matrix Lamp** — a layered, repairable LED lamp with animated ambient light.
- **Carry the Computation** — an installation that makes a language model’s operation depend on visitors’ physical labour.

## Website experience

The [main portfolio](https://juliuswenk.github.io/portfolio/) now uses the physics collection and exploded project pages developed in the redesign. The former `/redesign/` address redirects to the main page while preserving project links. The earlier seven-project network portfolio remains at [legacy.html](https://juliuswenk.github.io/portfolio/legacy.html), including Improving Futurium and Hyperreal Ravelord.

Objects drop onto a dark surface and can be dragged before opening their projects. Carry the Computation, DOXA and VISIO TECHNOLOGICA separate into six component groups while reading. Matrix Lamp repeats its complete LED above every section. Returning reassembles the selected object and preserves the collection's arrangement. About & Contact includes the biography, CV, contact links, asset credits and Impressum.

The full name contracts to JW while reading. JW and Escape return home. Project addresses and browser history preserve reading positions. Reduced motion disables animated travel and sensor play. Optional phone tilt and shake interactions are enabled from the motion button; ordinary dragging and keyboard project links remain available independently. Failed 3D leaves clickable cube placeholders and readable content.

## Source, preview and checks

`site/index.html` is the main document. Its base URL keeps shared scripts, styles, models and media in their existing locations under `site/redesign/` and `site/assets/`. The old `site/redesign/index.html` redirects home; `site/legacy.html` retains the previous portfolio. Serve `site/` and open `/` for local preview.

Run `node site/redesign/check.mjs` and `node site/redesign/check-motion.mjs`. Browser geometry checks live at `/redesign/check-project-parts.html`. The preserved wireframe uses `node site/wireframe/check.mjs`; `node check.cjs` checks the previous site at `legacy.html`. Implementation details and model groupings are documented in `site/redesign/README.md`.

GitHub Actions publishes `site/` to GitHub Pages when website changes reach `main`.

## Credits

Project authorship, collaborators, and assistance are credited within each case study. DOXA photography is credited to **Melissa Papafio-Roberts**. The spatial visualisations for Improving Futurium are by **Conrad Lischewsky**. Hyperreal Ravelord is an independent fan project with a pendant based on an existing logo.

Published images include embedded attribution metadata, distinguishing image creators from Julius’s project contribution. Attribution does not grant a reuse licence.

## Contact

Julius is looking to join a team creating interactive experiences, installations, or exhibitions.

- [Email — wenk.julius@gmail.com](mailto:wenk.julius@gmail.com)
- [Instagram — @juliuswenk](https://www.instagram.com/juliuswenk/)
- [GitHub — juliuswenk](https://github.com/juliuswenk)

The main website includes an Impressum on About & Contact; the previous site retains its footer link.
