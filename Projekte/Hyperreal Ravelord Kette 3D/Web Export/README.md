# Hyperreal web material export

## Files

- `HYPERREAL_RAVELORD-textured.glb`: portable GLB with all six colour/normal textures embedded (4,001,988 bytes).
- `HYPERREAL_RAVELORD-web.blend`: separate Blender copy with baked maps and export-compatible Principled materials.
- `*-color.png`, `*-normal.png`: baked colour and tangent-space normal maps; 1024 px for the pendant, 512 px for the glass links.
- `bake-export.py`: conversion recipe, run against the original Blender source. Its output path is this folder.

The original `.blend` and original `.glb` are untouched. The website uses `site/assets/hyperreal-ravelord-textured.glb`.

## Why the first GLB was white

The original Blender file uses mixed Glass/Diffuse shaders, procedural gradients and Voronoi bump textures. Its metal uses Glossy BSDF with a Layer Weight colour ramp. These networks are not portable glTF materials; the earlier export contained only material names and the double-sided flag.

## Conversion

1. Select the 21 necklace objects; exclude the cylinder, camera and lights.
2. Unwrap the glass objects into UV atlases grouped by material.
3. Bake the original shader normal detail to tangent-space normal maps. Bake the mixed glass/diffuse colour signals to colour maps, without baking lighting.
4. Connect these maps to Principled BSDF materials: glass uses IOR 1.45, roughness 0.5 and transmission 0.9; metal uses metallic 1 and roughness 0.05.
5. Export selected objects as glTF 2.0 Binary (.glb), with Materials enabled. Images are embedded automatically. Cameras, lights and animations are excluded.

For future exports, open the web Blender copy, select the necklace, then use **File → Export → glTF 2.0**, choose **GLB**, enable **Selected Objects**, and export materials. Its textures are packed into the Blender file.

## Fidelity limits

This is a web approximation of the original procedural materials, not an exact Cycles shader conversion. The metal's view-dependent Layer Weight ramp is approximated by a physical metallic material; the glass shader mixture is approximated by Principled transmission. Reflection and refraction therefore differ from Blender.

The original world references `//../Blender and Blender accesories/#assets/HRdis/studio_small_03_1k (1).hdr`, which is missing at that location. The website uses neutral generated studio lighting/reflections instead.

## Checks

- 21 model nodes exported, with no camera or light objects.
- Six embedded PNG images; no external texture links.
- Three glass materials have normal maps, base colour maps, IOR and transmission.
- One metal material has metallic 1 (glTF default) and roughness 0.05.
- Site asset and rotation checks pass.
