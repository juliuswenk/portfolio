import * as THREE from 'three';
import { switchParts } from './project-assets.mjs?v=switch-parts-1';

export function createSwitchParts(model, camera) {
  model.updateMatrixWorld(true);
  const parts = switchParts.map(part => {
    const meshes = part.nodes.map(name => model.getObjectByName(THREE.PropertyBinding.sanitizeNodeName(name)));
    if (meshes.some(mesh => !mesh?.isMesh)) throw new Error(`Missing switch mesh: ${part.label}`);
    const box = new THREE.Box3();
    meshes.forEach(mesh => box.expandByObject(mesh));
    const group = new THREE.Group();
    group.position.copy(model.worldToLocal(box.getCenter(new THREE.Vector3())));
    model.add(group);
    group.updateMatrixWorld(true);
    meshes.forEach(mesh => group.attach(mesh));
    return { group, home: group.position.clone(), size: box.getSize(new THREE.Vector3()).divide(model.scale) };
  });
  const inspection = new THREE.Quaternion().setFromEuler(new THREE.Euler(.35, -.55, -.12));
  const position = new THREE.Vector3(), scale = new THREE.Vector3(), quaternion = new THREE.Quaternion();
  let stages = [], progress = 0, opening = false, dirty = true;
  function restore() {
    parts.forEach(({ group, home }) => {
      group.position.copy(home); group.quaternion.identity(); group.scale.setScalar(1);
    });
  }
  return {
    get visible() { return opening || progress > 0; },
    setProject(nextStages, immediate = false) {
      opening = Boolean(nextStages);
      if (nextStages) stages = Array.from(nextStages);
      // Retain the last screen positions after the reading DOM is removed on return.
      else stages = stages.map(stage => {
        const rect = stage.getBoundingClientRect();
        return { getBoundingClientRect: () => rect };
      });
      if (immediate) { progress = opening ? 1 : 0; if (!opening) restore(); }
      dirty = true;
    },
    invalidate() { dirty = true; },
    update(delta, reducedMotion) {
      const target = opening ? 1 : 0, before = progress;
      progress = reducedMotion ? target : THREE.MathUtils.clamp(progress + (opening ? 1 : -1) * delta / .85, 0, 1);
      if (!dirty && progress === before) return false;
      dirty = false;
      if (!progress) { restore(); return true; }
      const eased = progress * progress * (3 - 2 * progress);
      const inverse = model.quaternion.clone().invert();
      const units = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / innerHeight;
      model.updateMatrixWorld(true);
      parts.forEach(({ group, home, size }, index) => {
        const rect = stages[index].getBoundingClientRect();
        position.set(camera.position.x + (rect.left + rect.width / 2 - innerWidth / 2) * units,
          camera.position.y + (innerHeight / 2 - rect.top - rect.height / 2) * units, 0);
        model.worldToLocal(position);
        group.position.lerpVectors(home, position, eased);
        quaternion.copy(inverse).multiply(inspection);
        group.quaternion.identity().slerp(quaternion, eased);
        const pixels = Math.min(240, rect.width * .65, rect.height * .7);
        const partScale = pixels * units / Math.max(size.x, size.y, size.z);
        scale.setScalar(partScale).divide(model.scale);
        group.scale.set(1, 1, 1).lerp(scale, eased);
      });
      return true;
    }
  };
}
