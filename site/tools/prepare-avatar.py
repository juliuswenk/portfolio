"""Run with Blender --background --python site/tools/prepare-avatar.py."""
from pathlib import Path
import bpy

root = Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(root / 'assets/waving-textured.glb'))
for image in bpy.data.images:
    if image.type == 'IMAGE':
        image.scale(1024, 1024)
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        modifier = obj.modifiers.new('Web display reduction', 'DECIMATE')
        modifier.ratio = 0.35
        bpy.context.view_layer.objects.active = obj
        # Apply only decimation; the armature and its weights remain live.
        bpy.ops.object.modifier_apply(modifier=modifier.name)
bpy.ops.export_scene.gltf(
    filepath=str(root / 'assets/avatar-web.glb'), export_format='GLB',
    export_image_format='JPEG', export_jpeg_quality=85, export_animations=True,
    export_animation_mode='ACTIONS', export_force_sampling=True,
    export_influence_nb=4, export_all_influences=False,
)
