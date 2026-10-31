import * as THREE from 'three';

export function createProjectParts(model, camera, config) {
  model.updateMatrixWorld(true);
  const sourceMeshes = [];
  model.traverse(object => { if (object.isMesh) sourceMeshes.push(object); });
  const selections = config.parts.map(part => {
    if (part.primitives) return part.primitives.map(index => sourceMeshes[index]);
    const meshes = [];
    for (const name of part.nodes) {
      const node = model.getObjectByName(THREE.PropertyBinding.sanitizeNodeName(name));
      if (!node) throw new Error(`Missing project node: ${name}`);
      node.traverse(object => { if (object.isMesh) meshes.push(object); });
    }
    return meshes;
  });
  let repeatedPart;
  const parts = selections.map((meshes, index) => {
    if (config.repeat && index > 0) {
      const group = repeatedPart.group.clone(true);
      group.visible = false;
      model.add(group);
      return { ...repeatedPart, group };
    }
    if (!meshes.length || meshes.some(mesh => !mesh?.isMesh)) throw new Error(`Missing project mesh: ${config.parts[index].label}`);
    const box = new THREE.Box3();
    meshes.forEach(mesh => box.expandByObject(mesh));
    const group = new THREE.Group();
    group.position.copy(model.worldToLocal(box.getCenter(new THREE.Vector3())));
    model.add(group);
    group.updateMatrixWorld(true);
    meshes.forEach(mesh => group.attach(mesh));
    group.visible = !config.repeat || index === 0;
    const part = { group, home: group.position.clone(), size: box.getSize(new THREE.Vector3()).divide(model.scale) };
    if (config.repeat) repeatedPart = part;
    return part;
  });
  const inspection = new THREE.Quaternion().setFromEuler(new THREE.Euler(...config.rotation));
  const position = new THREE.Vector3(), scale = new THREE.Vector3(), quaternion = new THREE.Quaternion();
  let stages = [], progress = 0, opening = false, dirty = true;
  function restore() {
    parts.forEach(({ group, home }, index) => {
      group.position.copy(home); group.quaternion.identity(); group.scale.setScalar(1);
      group.visible = !config.repeat || index === 0;
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
        group.visible = true;
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
