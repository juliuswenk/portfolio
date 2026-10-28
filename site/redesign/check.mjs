import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { projectAssets } from './project-assets.mjs';
import { createDrop } from './drop-physics.mjs';
import { assetFootprint, collectionLayout } from './collection-layout.mjs';
import { escapeHTML, routeFromHash, renderProject } from '../wireframe/content.mjs';

const copy = { window: {} };
for (const name of ['projects.js', 'media.js']) vm.runInNewContext(fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8'), copy);
const projects = projectAssets.map(asset => copy.window.PORTFOLIO_PROJECTS.find(project => project.slug === asset.slug));
assert.equal(projects.length, 5);
assert.equal(new Set(projects.map(project => project.slug)).size, 5);
for (const slug of ['improving-futurium', 'hyperreal']) assert.equal(routeFromHash(`#/projects/${slug}`, projects).name, 'home');
for (const project of projects) assert.ok(renderProject(project, copy.window.PORTFOLIO_MEDIA).includes(escapeHTML(project.title)));
const page = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
assert.ok(page.includes('Asset credits') && page.includes('Impressum') && page.includes('Klarastraße 3'));
assert.ok(page.indexOf('<h3>Design') < page.indexOf('<h3>Writing'));
assert.ok(!/id="(?:pause|replay|project-index|project-close)"/.test(page));

const clouds = projectAssets.map(asset => {
  const b = fs.readFileSync(new URL(`./assets/${asset.file}.glb`, import.meta.url));
  const length = b.readUInt32LE(12), gltf = JSON.parse(b.toString('utf8', 20, 20 + length)), points = [];
  for (const mesh of gltf.meshes) for (const primitive of mesh.primitives) {
    const a = gltf.accessors[primitive.attributes.POSITION], v = gltf.bufferViews[a.bufferView];
    for (let i = 0; i < a.count; i++) for (let k = 0; k < 3; k++) points.push(b.readFloatLE(28 + length + (v.byteOffset || 0) + (a.byteOffset || 0) + i * (v.byteStride || 12) + k * 4) * asset.scale);
  }
  return new Float32Array(points);
});
const footprints = clouds.map((points, index) => assetFootprint(points, projectAssets[index].rotation));
function quaternion([x, y, z]) {
  const sx = Math.sin(x / 2), cx = Math.cos(x / 2), sy = Math.sin(y / 2), cy = Math.cos(y / 2), sz = Math.sin(z / 2), cz = Math.cos(z / 2);
  const q = { x: sx * cy * cz + cx * sy * sz, y: cx * sy * cz - sx * cy * sz, z: cx * cy * sz + sx * sy * cz, w: cx * cy * cz - sx * sy * sz };
  // Three.js rotations expose components through prototype getters.
  return Object.create({ get x() { return q.x; }, get y() { return q.y; }, get z() { return q.z; }, get w() { return q.w; } });
}
let drop, previousLayout;
for (const [width, height, top] of [[1440, 900, 108], [390, 844, 92], [844, 390, 66], [320, 568, 92], [2560, 1440, 108], [1440, 900, 108]]) {
  const margin = width < 800 ? 20 : width * .025;
  const layout = collectionLayout({ width, height, left: margin, right: width - margin, top, bottom: height - (height <= 500 ? 46 : 66) }, footprints);
  const points = clouds.map(cloud => Float32Array.from(cloud, value => value * layout.scale));
  const snapshot = drop ? { ...drop.snapshot(), scaleRatio: layout.scale / previousLayout.scale } : undefined;
  const poses = layout.positions.map((position, index) => ({ ...position, rotation: snapshot?.entries[index].target || quaternion(projectAssets[index].rotation) }));
  const next = await createDrop(points, poses, layout.halfWidth, layout.halfHeight, () => .5, snapshot);
  drop?.dispose(); drop = next; previousLayout = layout;
  if (!snapshot) {
    for (let i = 0; i < 90; i++) drop.step();
    const duringDrop = { ...drop.snapshot(), scaleRatio: 1 };
    assert.ok(duringDrop.entries.every(entry => ['x', 'y', 'z', 'w'].every(axis => Number.isFinite(entry.target[axis]))), 'Snapshots preserve rotation getters');
    const resumed = await createDrop(points, poses, layout.halfWidth, layout.halfHeight, () => .5, duringDrop);
    drop.dispose(); drop = resumed;
    for (let i = 0; i < 1440; i++) drop.step();
    drop.entries.forEach(({ body, corrected, target }) => {
      const q = body.rotation();
      assert.ok(corrected && Math.abs(q.x * target.x + q.y * target.y + q.z * target.z + q.w * target.w) > .9999, 'Resizing during the drop still settles into a readable pose');
    });
    drop.beginDrag(0);
    const p = drop.entries[0].body.translation(); drop.moveDrag(p.x + .4, p.y - .3);
    for (let i = 0; i < 10; i++) drop.step();
    drop.endDrag();
    for (let i = 0; i < 1440; i++) drop.step();
  } else {
    assert.equal(drop.snapshot().elapsed, snapshot.elapsed, 'Resize retains the physics timeline');
    drop.entries.forEach(({ body, corrected }, index) => {
      assert.ok(corrected && body.isSleeping(), 'Resize preserves settled state without a drop');
      const q = body.rotation(), saved = snapshot.entries[index].rotation;
      assert.ok(Math.abs(q.x * saved.x + q.y * saved.y + q.z * saved.z + q.w * saved.w) > .9999);
    });
  }
  for (const { body, points } of drop.entries) {
    const p = body.translation(), q = body.rotation();
    const focal = height / (2 * Math.tan(38 * Math.PI / 360));
    for (let i = 0; i < points.length; i += 3) {
      const x = points[i], y = points[i + 1], z = points[i + 2];
      const tx = 2 * (q.y * z - q.z * y), ty = 2 * (q.z * x - q.x * z), tz = 2 * (q.x * y - q.y * x);
      const wx = p.x + x + q.w * tx + q.y * tz - q.z * ty, wy = p.y + y + q.w * ty + q.z * tx - q.x * tz, wz = p.z + z + q.w * tz + q.x * ty - q.y * tx;
      const px = width / 2 + (wx - layout.cameraX) * focal / (16 - wz), py = height / 2 - (wy - layout.cameraY) * focal / (16 - wz);
      assert.ok(px >= margin - 2 && px <= width - margin + 2 && py >= top - 2 && py <= height - (height <= 500 ? 46 : 66) + 2, `Every model remains visible after resize to ${width}×${height}`);
    }
  }
}
drop.dispose();

const app = fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8').replace(/^import .+;$/gm, '').replace("import('./scene.mjs')", 'testModule()');
function harness(hash = '') {
  const listeners = {}, views = new Map(), timers = new Map();
  let resolveModule, rejectModule, counter = 0, imports = 0;
  const modulePromise = new Promise((resolve, reject) => { resolveModule = resolve; rejectModule = reject; });
  const element = () => ({ dataset: {}, hidden: false, style: {}, focus() {}, setAttribute() {}, removeAttribute() {}, querySelector: () => element(), querySelectorAll: () => [], replaceChildren() { this.innerHTML = ''; } });
  for (const selector of ['#home', '#project', '#about', '.wordmark', '.about-link', '.collection', '#viewer', '.loading-screen', '.fallback-status']) views.set(selector, element());
  const controller = { activations: [], disposed: false, setActive(value) { this.activations.push(value); }, dispose() { this.disposed = true; } };
  const browser = {
    window: { ...copy.window, addEventListener: (name, handler) => listeners[name] = handler },
    document: { body: { dataset: {} }, querySelector: selector => views.get(selector), addEventListener: (name, handler) => listeners[name] = handler },
    crypto: { randomUUID: () => String(++counter) }, AbortController, console: { warn() {} },
    location: { hash }, scrollY: 0, escapeHTML, routeFromHash, renderProject, projectAssets,
    setTimeout(fn, delay) { timers.set(++counter, { fn, delay }); return counter; }, clearTimeout(id) { timers.delete(id); },
    testModule() { imports++; return modulePromise; },
    history: { state: {}, replaceState(state) { this.state = state; }, pushState(state, _, nextHash) { this.state = state; browser.location.hash = nextHash; } }
  };
  browser.window.scrollTo = ({ top }) => browser.scrollY = top;
  vm.createContext(browser); vm.runInContext(app, browser);
  return { browser, views, timers, controller, imports: () => imports, go: nextHash => vm.runInContext(`navigate(${JSON.stringify(nextHash)})`, browser), ready: () => resolveModule({ createCollection: async () => controller }), fail: () => rejectModule(new Error('Network unavailable')) };
}
const flush = () => new Promise(resolve => setImmediate(resolve));
const direct = harness('#/projects/doxa');
assert.equal(direct.imports(), 0, 'Direct content does not wait for 3D');
assert.equal(direct.browser.document.body.dataset.view, 'project');
direct.go('#/');
assert.equal(direct.imports(), 1);
assert.equal(direct.browser.document.body.dataset.collection, 'loading');
assert.equal([...direct.timers.values()][0].delay, 15000);
direct.go('#/about'); direct.ready(); await flush();
assert.equal(direct.browser.document.body.dataset.collection, 'ready');
assert.equal(direct.controller.activations.at(-1), false, 'Finishing loading while reading does not start physics');
direct.go('#/');
assert.equal(direct.controller.activations.at(-1), true);
assert.equal(direct.imports(), 1, 'Returning reuses the collection');
direct.go('#/projects/matrix-lamp');
assert.equal(direct.controller.activations.at(-1), false);
const timeout = harness();
[...timeout.timers.values()][0].fn();
assert.equal(timeout.browser.document.body.dataset.collection, 'fallback');
assert.equal(timeout.views.get('.collection').inert, false);
assert.equal((timeout.views.get('.collection').innerHTML.match(/class="project-object"/g) || []).length, 5);
timeout.ready(); await flush();
assert.ok(timeout.controller.disposed, 'Late loading cannot replace the fallback');
const failed = harness(); failed.fail(); await flush();
assert.equal(failed.browser.document.body.dataset.collection, 'fallback');
assert.equal(failed.views.get('.fallback-status').hidden, false);
console.log('Merged prototype checks passed: five projects, content, drag/settle, six resizes without a drop, loading timeout/failure, late-load cancellation, direct reading and paused return.');
