import * as THREE from 'three';
import { createXray, createXrayMaterial } from './xray.mjs';
import { createProjectStills } from './project-stills.mjs';

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
  const inverse = model.matrixWorld.clone().invert();
  const bounds = new THREE.Box3();
  const sources = sourceMeshes.map(mesh => {
    const matrix = new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld);
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(matrix));
    return { mesh, matrix };
  });
  const center = bounds.getCenter(new THREE.Vector3());
  const contextMaterial = createXrayMaterial(0);
  contextMaterial.name = 'Faint assembled X-ray';
  const highlights = [], contextMeshes = [];
  const parts = selections.map((meshes, index) => {
    if (!meshes.length || meshes.some(mesh => !mesh?.isMesh)) throw new Error(`Missing project mesh: ${config.parts[index].label}`);
    const group = new THREE.Group();
    group.name = `Section model: ${config.parts[index].label}`;
    group.position.copy(center);
    model.add(group);
    group.updateMatrixWorld(true);
    for (const source of sources) {
      if (meshes.includes(source.mesh)) {
        let mesh = source.mesh;
        if (config.repeat && index > 0) {
          mesh = new THREE.Mesh(source.mesh.geometry, source.mesh.material);
          mesh.castShadow = source.mesh.castShadow;
          mesh.receiveShadow = source.mesh.receiveShadow;
          mesh.applyMatrix4(source.matrix);
          mesh.position.sub(center);
          group.add(mesh);
        } else group.attach(mesh);
        highlights.push(mesh);
      } else {
        const mesh = new THREE.Mesh(source.mesh.geometry, contextMaterial);
        mesh.applyMatrix4(source.matrix);
        mesh.position.sub(center);
        mesh.visible = false;
        // Faint context must not intercept picking when the collection returns home.
        mesh.raycast = () => {};
        group.add(mesh);
        contextMeshes.push(mesh);
      }
    }
    group.visible = !config.repeat || index === 0;
    return group;
  });
  const xray = createXray(highlights);
  const stills = createProjectStills(camera);
  const homeRotation = new THREE.Quaternion();
  const size = new THREE.Vector3();
  const position = new THREE.Vector3(), scale = new THREE.Vector3(), quaternion = new THREE.Quaternion();
  let stages = [], progress = 0, opening = false, dirty = true;
  function restore() {
    xray.update(0);
    contextMeshes.forEach(mesh => { mesh.visible = false; });
    parts.forEach((group, index) => {
      group.position.copy(center); group.quaternion.identity(); group.scale.setScalar(1);
      group.visible = !config.repeat || index === 0;
    });
  }
  return {
    dispose() {
      stills.clear();
      restore(); xray.dispose();
      contextMeshes.forEach(mesh => mesh.removeFromParent());
      contextMaterial.dispose();
    },
    get visible() { return opening || progress > 0; },
    get settled() { return opening && progress === 1; },
    get static() { return stills.visible; },
    showStills(renderer) { return this.settled && stills.show(renderer, model, parts, stages); },
    setProject(nextStages, immediate = false) {
      stills.clear();
      opening = Boolean(nextStages);
      if (nextStages) {
        stages = Array.from(nextStages);
        if (!progress) {
          homeRotation.copy(model.quaternion);
          bounds.clone().applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(homeRotation)).getSize(size);
        }
      }
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
      xray.update(eased);
      contextMaterial.uniforms.xrayGain.value = .045 * eased;
      contextMeshes.forEach(mesh => { mesh.visible = true; });
      quaternion.copy(model.quaternion).invert().multiply(homeRotation);
      const units = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / innerHeight;
      model.updateMatrixWorld(true);
      parts.forEach(group => { group.visible = true; });
      parts.forEach((group, index) => {
        const rect = stages[index].getBoundingClientRect();
        position.set(camera.position.x + (rect.left + rect.width / 2 - innerWidth / 2) * units,
          camera.position.y + (innerHeight / 2 - rect.top - rect.height / 2) * units, 0);
        model.worldToLocal(position);
        group.position.lerpVectors(center, position, eased);
        group.quaternion.identity().slerp(quaternion, eased);
        const pixels = Math.min(285, rect.width * .8, rect.height * .82);
        const modelScale = pixels * units / Math.max(size.x, size.y, size.z);
        scale.setScalar(modelScale).divide(model.scale);
        group.scale.set(1, 1, 1).lerp(scale, eased);
      });
      return true;
    }
  };
}
