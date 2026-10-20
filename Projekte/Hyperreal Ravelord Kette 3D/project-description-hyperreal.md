# Hyperreal — description pending

## At a glance

Hyperreal is a chain-shaped 3D asset, presented here through an interactive 360° turntable that lets you inspect the necklace from different angles. The project folder contains Blender and GLB files. Its brief, intended use, authorship, design process, and outcome are still awaiting documentation, so this entry currently offers a visual introduction to the object.

`HYPERREAL_RAVELORD.blend` and `HYPERREAL_RAVELORD.glb` are supplied. No project brief, role, date, process, or outcome description is available. The chain-like object is displayed as an interactive GLB; this does not establish a particular modeling workflow or level of skill.

## Portfolio facts

| Category | Documented information |
| --- | --- |
| Format | 3D asset · description pending |
| Context & timeframe | Working title: folder says Raveboy; Blender file says Ravelord. Final title to confirm. |
| My role & collaborators | To confirm |
| Process & implementation | No description supplied. The supplied GLB is displayed as an interactive 3D model. |
| Outcome & evidence | Blender source and GLB model, plus an embedded 128 × 128 thumbnail used as a loading fallback. |
| Learning & reflection | Not yet documented. |

## Skills & network connections

Skills are normalized editorial tags inferred from the supplied description, not proficiency ratings. Attribution distinguishes the project’s capabilities from confirmed personal work. Tools and subject matter are not automatically treated as skills.

No confirmed skill tags yet. **3D modeling** is a candidate based on the Blender asset only; it is not an active network connection until authorship and workflow are described.

## Selected portfolio images

Selection is based on visual review of the supplied files. Original files are preserved; the prototype uses reduced-size WebP copies. Captions describe what is visible.

- **hero:** `HYPERREAL_RAVELORD.glb` — Interactive 3D necklace. Textured web export at `site/assets/hyperreal-ravelord-textured.glb`; Blender thumbnail retained only as a loading/error fallback.

The earlier geometry-only optimized GLB is 1,186,956 bytes versus 1,512,132 bytes for the original (21.5% smaller). Unused UV coordinates, duplicate identical materials and object names were removed; all 21 nodes and 20 meshes remain, with position, normal and index buffers verified unchanged. No textures, cameras, lights, armature or animations were present. The source GLB is untouched. Materials in the supplied export contain only the double-sided flag, which explains its earlier white appearance.

In focus, a full turn lasts 9.5 seconds with cubic Bézier easing, followed by a 1.5-second front-facing pause. Motion pauses in Still view, with reduced motion enabled, when the tab is hidden, and when the project leaves focus.

## Textured Blender export

The previous web version used `Web Export/HYPERREAL_RAVELORD-textured.glb` (4,001,988 bytes), exported from the original Blender source with six embedded baked colour/normal textures, glass transmission/IOR and metallic materials. The source procedural shader networks are approximated with portable Principled materials. The original Blender file is untouched; `Web Export/HYPERREAL_RAVELORD-web.blend` is a separate export-ready copy. See `Web Export/README.md` for the bake recipe, missing HDR lighting reference and fidelity limitations.

## Rendered video hero

The current hero uses the supplied transparent PNG animation, encoded as WebM and HEVC with alpha. It loops in the overview, plays once on entering Hyperreal, then responds to horizontal pointer movement, touch dragging and arrow keys. See `Web Export/VIDEO.md` for source frames, encoding and behavior. The source renders and previous models are preserved.
