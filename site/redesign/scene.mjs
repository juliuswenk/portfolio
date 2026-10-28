import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { createDrop } from './drop-physics.mjs?v=acceleration-1';
import { applyCobaltScattering } from './cobalt-sss.mjs';
import { projectAssets } from './project-assets.mjs';
import { assetFootprint, collectionLayout } from './collection-layout.mjs';
import { setupMotion } from './motion.mjs?v=acceleration-1';

export async function createCollection({ canvas, collection, signal, isHome, onOpen, onFailure }) {
  signal.throwIfAborted();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#080908');
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.18, 0.25, 0.85);
  composer.addPass(bloom);
  composer.addPass(new FilmPass(0.035, false));
  composer.addPass(new OutputPass());
  const antialias = new ShaderPass(FXAAShader);
  composer.addPass(antialias);
  const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.45;
  room.dispose(); pmrem.dispose();
  const light = new THREE.DirectionalLight(0xfff6e6, 1.25);
  light.position.set(-4, 5, 8);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, far: 30 });
  light.shadow.normalBias = 0.01;
  light.shadow.bias = -0.0001;
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xe7efff, 0.5);
  fill.position.set(4, -3, 6); scene.add(fill);

  let models = [], simulation, layout, layoutKey, footprints, hullPoints, baseScales, localCorners;
  let active = false, disposed = false, pointer, frameId, previous = performance.now(), accumulator = 0, needsRender = true;
  let resizing = false, resizePending = false, motion;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const links = projectAssets.map(asset => collection.querySelector(`[href="#/projects/${asset.slug}"]`));
  const events = new AbortController();
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    motion?.dispose();
    events.abort();
    signal.removeEventListener('abort', dispose);
    observer.disconnect();
    simulation?.dispose();
    for (const model of models) model.traverse(object => {
      object.geometry?.dispose();
      if (!object.material) return;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
        material.dispose();
      }
    });
    for (const pass of composer.passes) pass.dispose?.();
    composer.dispose(); environment.dispose(); light.shadow.dispose(); renderer.dispose();
  }
  const observer = new ResizeObserver(() => { resizePending = true; });
  signal.addEventListener('abort', dispose, { once: true });

  try {
    const loader = new GLTFLoader();
    const loaded = await Promise.all(projectAssets.map(async asset => {
      const response = await fetch(new URL(`./assets/${asset.file}.glb`, import.meta.url), { signal });
      if (!response.ok) throw new Error(`Could not load ${asset.name}: ${response.status}`);
      return loader.parseAsync(await response.arrayBuffer(), '');
    }));
    signal.throwIfAborted();
    const vertex = new THREE.Vector3();
    hullPoints = [];
    models = loaded.map((gltf, index) => {
      const model = gltf.scene;
      model.userData.projectIndex = index;
      model.scale.multiplyScalar(projectAssets[index].scale);
      applyCobaltScattering(model, THREE.ShaderChunk, { value: 0.12 });
      model.updateMatrixWorld(true);
      const points = [];
      model.traverse(object => {
        if (!object.isMesh) return;
        object.castShadow = object.receiveShadow = true;
        const positions = object.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          vertex.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld);
          points.push(vertex.x, vertex.y, vertex.z);
        }
      });
      hullPoints.push(new Float32Array(points));
      scene.add(model);
      return model;
    });
    baseScales = models.map(model => model.scale.clone());
    footprints = hullPoints.map((points, index) => assetFootprint(points, projectAssets[index].rotation));
    localCorners = hullPoints.map(points => {
      const box = new THREE.Box3().setFromArray(points), corners = [];
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));
      return corners;
    });
    canvas.hidden = false;
    await resize();
    signal.throwIfAborted();
    syncModels();
    composer.render(0);

    const raycaster = new THREE.Raycaster(), screenPoint = new THREE.Vector2(), dragPoint = new THREE.Vector3(), dragPlane = new THREE.Plane();
    function ray(event) {
      const rect = canvas.getBoundingClientRect();
      screenPoint.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(screenPoint, camera);
    }
    function pick(event) {
      ray(event);
      let object = raycaster.intersectObjects(models, true)[0]?.object;
      while (object && object.userData.projectIndex === undefined) object = object.parent;
      return object?.userData.projectIndex ?? -1;
    }
    function cancelPointer(launch = false) {
      if (!pointer) return;
      const { id, dragging } = pointer;
      pointer = undefined;
      if (dragging) simulation.endDrag(launch);
      if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
      canvas.style.cursor = 'default';
      needsRender = true;
    }
    function listen(target, type, handler) { target.addEventListener(type, handler, { signal: events.signal }); }
    listen(canvas, 'pointerdown', event => {
      if (!active || resizing || !event.isPrimary || event.button !== 0 || pointer) return;
      const index = pick(event);
      if (index < 0) return;
      const p = simulation.entries[index].body.translation();
      dragPlane.set(new THREE.Vector3(0, 0, 1), -p.z);
      if (!raycaster.ray.intersectPlane(dragPlane, dragPoint)) return;
      pointer = { id: event.pointerId, index, x: event.clientX, y: event.clientY, offsetX: p.x - dragPoint.x, offsetY: p.y - dragPoint.y, dragging: false };
      canvas.setPointerCapture(event.pointerId);
      links[index].focus({ preventScroll: true });
      event.preventDefault();
    });
    listen(canvas, 'pointermove', event => {
      if (!active || resizing) return;
      if (pointer) {
        if (pointer.id !== event.pointerId) return;
        if (!pointer.dragging && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 6) {
          pointer.dragging = true; simulation.beginDrag(pointer.index); canvas.style.cursor = 'grabbing';
        }
        if (pointer.dragging) {
          ray(event);
          if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) simulation.moveDrag(dragPoint.x + pointer.offsetX, dragPoint.y + pointer.offsetY);
          needsRender = true;
        }
      } else if (event.pointerType === 'mouse') canvas.style.cursor = pick(event) < 0 ? 'default' : 'grab';
    });
    listen(canvas, 'pointerup', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const { index, dragging } = pointer;
      cancelPointer(!reducedMotion.matches);
      if (!dragging) onOpen(projectAssets[index].slug);
    });
    listen(canvas, 'pointercancel', () => cancelPointer());
    listen(canvas, 'lostpointercapture', () => cancelPointer());
    listen(window, 'blur', () => cancelPointer());
    listen(document, 'visibilitychange', () => { cancelPointer(); previous = performance.now(); accumulator = 0; });
    listen(canvas, 'webglcontextlost', event => { event.preventDefault(); onFailure(); });
    listen(reducedMotion, 'change', () => {
      motion?.stop();
      if (reducedMotion.matches) settle();
      needsRender = true;
    });
    observer.observe(canvas);
    observer.observe(collection);
    motion = setupMotion({
      button: document.querySelector('#motion-toggle'),
      onShake(impulse) {
        if (!active || resizing || pointer) return false;
        needsRender = true;
        return simulation.shake(impulse);
      },
      onStop() {
        cancelPointer(); simulation.endMotion();
        accumulator = 0; needsRender = true;
      }
    });
    function setActive(value) {
      active = value;
      motion.setActive(value);
      if (!active) cancelPointer();
      else resizePending = true;
      previous = performance.now(); accumulator = 0; needsRender = true;
    }
    function frame(now) {
      if (disposed) return;
      motion.tick(now);
      const delta = Math.min((now - previous) / 1000, .05); previous = now;
      if (active && isHome() && !document.hidden && !resizing) {
        if (resizePending && !pointer) { resizePending = false; resize().catch(onFailure); }
        if (!resizing) {
          const moving = simulation.entries.some(({ body }) => !body.isSleeping());
          if (moving && reducedMotion.matches && !pointer?.dragging) settle();
          else if (moving || pointer?.dragging) {
            accumulator += delta;
            while (accumulator >= 1 / 120) { simulation.step(); accumulator -= 1 / 120; }
          }
          if (moving || pointer?.dragging || needsRender) { syncModels(); composer.render(delta); needsRender = false; }
        }
      }
      frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);
    return { setActive, dispose };
  } catch (error) {
    dispose();
    throw error;
  }

  function settle() { for (let i = 0; i < 720; i++) simulation.step(); }
  function syncModels() {
    const width = renderer.domElement.width / renderer.getPixelRatio(), height = renderer.domElement.height / renderer.getPixelRatio();
    const style = getComputedStyle(collection), left = parseFloat(style.left), top = parseFloat(style.top);
    const point = new THREE.Vector3();
    simulation.entries.forEach(({ body }, index) => {
      models[index].position.copy(body.translation()); models[index].quaternion.copy(body.rotation());
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const corner of localCorners[index]) {
        point.copy(corner).multiplyScalar(layout.scale).applyQuaternion(models[index].quaternion).add(models[index].position).project(camera);
        const x = (point.x + 1) * width / 2, y = (1 - point.y) * height / 2;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      Object.assign(links[index].style, { left: `${minX - left}px`, top: `${minY - top}px`, width: `${maxX - minX}px`, height: `${maxY - minY}px` });
    });
    scene.updateMatrixWorld(true);
  }
  async function resize() {
    if (resizing || disposed) return;
    const width = innerWidth, height = innerHeight, style = getComputedStyle(collection);
    const area = { width, height, left: parseFloat(style.left), right: width - parseFloat(style.right), top: parseFloat(style.top), bottom: height - parseFloat(style.bottom) };
    const key = Object.values(area).join('|');
    if (key === layoutKey) return;
    resizing = true;
    try {
      const nextLayout = collectionLayout(area, footprints);
      const snapshot = simulation ? { ...simulation.snapshot(), scaleRatio: nextLayout.scale / layout.scale } : undefined;
      const clouds = hullPoints.map(points => Float32Array.from(points, value => value * nextLayout.scale));
      const poses = projectAssets.map((asset, index) => ({
        x: nextLayout.positions[index].x + (Math.random() - .5) * 2 * nextLayout.jitter,
        y: nextLayout.positions[index].y + (Math.random() - .5) * 2 * nextLayout.jitter,
        rotation: snapshot?.entries[index].target || new THREE.Quaternion().setFromEuler(new THREE.Euler(...asset.rotation)).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), (Math.random() - .5) * .12))
      }));
      const next = await createDrop(clouds, poses, nextLayout.halfWidth, nextLayout.halfHeight, Math.random, snapshot);
      if (disposed) { next.dispose(); return; }
      simulation?.dispose(); simulation = next; layout = nextLayout; layoutKey = key;
      if (snapshot?.playing && !motion?.playing) simulation.endMotion();
      if (reducedMotion.matches) settle();
      models.forEach((model, index) => model.scale.copy(baseScales[index]).multiplyScalar(layout.scale));
      renderer.setSize(width, height, false); composer.setSize(width, height);
      bloom.setSize(Math.ceil(width * renderer.getPixelRatio() * .5), Math.ceil(height * renderer.getPixelRatio() * .5));
      antialias.uniforms.resolution.value.set(1 / (width * renderer.getPixelRatio()), 1 / (height * renderer.getPixelRatio()));
      camera.aspect = width / height; camera.position.set(layout.cameraX, layout.cameraY, 16); camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
      const extent = Math.max(8, layout.halfWidth + 2, layout.halfHeight + 2);
      Object.assign(light.shadow.camera, { left: -extent, right: extent, top: extent, bottom: -extent });
      light.shadow.camera.updateProjectionMatrix();
      syncModels(); needsRender = true;
    } finally { resizing = false; }
  }
}
