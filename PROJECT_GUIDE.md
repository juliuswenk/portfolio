# Project stories and skill connections

The portfolio contains seven projects: DOXA, VISIO TECHNOLOGICA, VEILED PANOPTICON, Improving Futurium, Hyperreal Ravelord, Matrix Lamp, and Carry the Computation.

## Shared editorial structure

Use the same sequence wherever it fits, without padding a smaller project:

1. **At a glance:** one overview covering the intention or question, Julius’s contribution, and the actual outcome. Do not append another summary.
2. **Context:** compact format, setting, year and known duration. Add a brief chronology only where useful.
3. **Experience & intention** (installations) or **Intention & design** (personal objects): explain the visitor experience or design intention.
4. **My role & collaborators / assistance / process:** distinguish personal work, collaborators, existing assets and AI assistance.
5. **Outcome & learning / reflection:** state what exists, what was observed, limitations, and what might change next. Identify informal observations and distinguish proposed features from demonstrated ones.
6. **Key design decisions:** retain meaningful turning points where available. Hyperreal’s compact process already covers its smaller scope.
7. **Implementation details:** optional native disclosure, closed initially, for the longer technical projects. Matrix Lamp’s short construction and interaction explanation stays visible; Hyperreal needs no separate technical disclosure.
8. **Skills and credits:** retain evidenced canonical tags, relevant attribution, media credits and documentation links. Avoid repeating the role as a second prose skill list.

Do not publish placeholders or invent duration, audience evaluation, collaborators, or impact. Hyperreal Ravelord is a 2018 independent Blender fan study inspired by BEASTBOY’s album. Its pendant uses an existing SVG logo. The original digital necklace and animated renders are distinct from later portfolio video/export work. Physics-based animation is a future reflection only.

## Copy sources and changes

`site/projects.js` contains the public data. Each project’s `editorialSource` points to a separate `portfolio-editorial.md` alongside the original project description in `Projekte/`. The original descriptions are preserved, including Hyperreal’s historical notes; they are not automatically published. The editorial sources and public data are deliberately synchronized and checked by `node check.cjs`.

The agreed approach and approved examples are in `EDITORIAL_PLAN.md` and `EDITORIAL_COPY_DRAFT.md`. When editing, update the editorial source and corresponding public data together. Keep collaborator, photographer and assistance credits intact. Futurium’s spatial visualisations are Conrad Lischewsky’s; Julius’s 3D work is the character-generation, animation, rendering and display workflow. VEILED PANOPTICON’s projection and visual language are Lennard Lev and Lena Eibel’s.

## Reading layout and media

Desktop uses media left and text right with ordinary page scrolling. Phones use hero, introduction, then relevant narrative and media. `mediaSections` maps each supporting image to a narrative section index; update these whenever sections move. `pairedMedia` lists adjacent collection/index keys that share desktop rows. Keep pairs adjacent in the rendered gallery; phones retain the same individual full-width figures and sequence. Onward navigation sits after both columns. Preserve the selected image order and captions. The same DOM elements move at the breakpoint, keeping one hero and one video player. Native disclosures change the chapter height; the existing layout observer remeasures the network camera and protected reading areas.

DOXA uses the installation photograph credited to Melissa Papafio-Roberts. Carry the Computation uses the printer-and-controller setup, with no pedestal image. Matrix Lamp progresses from early test and assembly through details to finished rear and front views. Its studio backgrounds are presentation edits, not a physical studio shoot. Originals remain local.

Images use responsive variants for the network and reading sizes; enlargement uses the original web asset. Avatar and turntable loading follow `LOADING_PLAN.md`. Do not reintroduce eagerly loaded optional media while changing stories.

## Skill connections and next steps

Shared canonical skill tags create bidirectional connections; they indicate related practice, not chronology or proficiency. Only tags shared by at least two projects become global routes. Hyperreal and Improving Futurium share **3D visualization**, with authorship explained in their stories.

About and the closing invitation offer a primary email action and secondary Instagram and GitHub links. The invitation remains focused on joining a team creating interactive experiences, installations, or exhibitions. A persistent Impressum control in the footer opens a native dialog containing the user-supplied name, postal address and email; it closes via its button or Escape and restores focus to the footer control. Contact destinations are user-supplied; the site does not submit messages or use a contact service.

## Responsive refinement — 20 October 2026

The confirmed Awwwards improvement plan retains About before the work, with biography and skills visible and only the CV initially collapsed. About now reuses the project-reading grid: identical maximum width, column ratio, gap, section gutters, heading/body typography and skill-chip styling. Its portrait is anchored to the left media column, and Explore the projects follows the complete section. The case-study-specific mobile reparenting logic remains scoped to #chapters; About keeps its native stacked content. Do not reinstate its former large minimum height. The later user revision makes the desktop avatar the main focus of the left column: a large knee-up portrait holds within the usable viewport while the biography scrolls. The camera measures the animation’s head/hand and knee landmarks once to preserve the full wave. Entering/leaving About eases the character’s position/size over 650 ms, with a matching camera blend and the wave starting once settled. Still/reduced-motion views settle immediately. Network cards no longer reserve the avatar’s full transparent canvas: background cards can sit behind the figure and dim there, while obscured nodes remain inactive. Caption clearance and reading obstacles stay strict; image bodies can overlap up to 18% of the smaller card area. Keep the compact stacked avatar on phones. A native Projects dialog lists every project; the phone footer identifies the current view rather than asking visitors to memorise numbers. Portrait framing emphasises DOXA, VISIO TECHNOLOGICA and VEILED PANOPTICON while the remaining projects are immediately reachable through that list. Desktop overview framing fits the projected network bounds between the header/footer, with additional image/caption margins, rather than relying on a fixed zoom that can crop the outer network. The overview explains shared skills and shows relevant skills on hover/focus. Touch selection remains direct.

Keep navigation settlement tied to an explicit destination; release it after critical hero readiness and two settled frames, or earlier on user input; never use late image measurements or disclosure toggles to pull someone back during reading. See DEPLOYMENT.md for the prepared sharing/404 assets and production-only checks. No public domain has been chosen.
