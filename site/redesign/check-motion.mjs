import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createShakeDetector } from './motion.mjs';
import { createDrop } from './drop-physics.mjs';

const reading = (x = 0, y = 0, z = 0, gravity = [0, 0, 9.8]) => ({ acceleration: { x, y, z }, accelerationIncludingGravity: { x: x + gravity[0], y: y + gravity[1], z: z + gravity[2] } });
const detector = createShakeDetector();
assert.equal(detector.sample({ acceleration: { x: NaN, y: 0, z: 0 } }, 0), null);
for (let time = 0; time <= 1000; time += 20) assert.equal(detector.sample(reading(Math.sin(time) * 3), time).shake, null, 'Normal handling does not trigger play');
assert.ok(detector.sample(reading(20), 1100).shake.x < 0, 'A rightward acceleration immediately throws objects left');
assert.equal(detector.sample(reading(20), 1140).shake, null, 'Sensor frequency does not amplify one movement');
assert.ok(detector.sample(reading(-20), 1220).shake.x > 0, 'A leftward acceleration throws objects right');
assert.equal(detector.sample(reading(20), 1300).shake, null);
detector.reset();
assert.equal(detector.sample(reading(-20), 1400).shake, null, 'Resuming cannot reuse an old peak');
const rotatedDetector = createShakeDetector();
rotatedDetector.sample(reading(), 0, 90); rotatedDetector.sample(reading(), 200, 90);
const rotated = rotatedDetector.sample(reading(12), 300, 90).shake;
assert.ok(Math.abs(rotated.x) < 1e-6 && Math.abs(rotated.y - 12) < 1e-6, 'Acceleration follows the screen rotation');
const vertical = createShakeDetector(); vertical.sample(reading(), 0); vertical.sample(reading(), 200);
assert.ok(vertical.sample(reading(0, 12), 300).shake.y < 0);
assert.ok(vertical.sample(reading(0, -12), 420).shake.y > 0);
for (const gravity of [[0, 9.8, 0], [0, 0, 9.8], [5, 7, 4]]) {
  const stationary = createShakeDetector();
  for (let time = 0; time <= 1000; time += 20) assert.equal(stationary.sample(reading(0, 0, 0, gravity), time).shake, null, 'Holding the phone at any tilt produces no force');
}
assert.equal(vertical.sample(reading(0, 0, 30), 600).shake, null, 'Depth acceleration does not invent a sideways force');
const gravityOnly = createShakeDetector();
for (const time of [0, 100, 200]) assert.equal(gravityOnly.sample({ accelerationIncludingGravity: { x: 0, y: 0, z: 9.8 } }, time).shake, null);
assert.ok(gravityOnly.sample({ accelerationIncludingGravity: { x: 20, y: 0, z: 9.8 } }, 300).shake.x < 0);
assert.ok(gravityOnly.sample({ accelerationIncludingGravity: { x: -20, y: 0, z: 9.8 } }, 420).shake.x > 0, 'Gravity-only sensors use a filtered acceleration signal');

const source = fs.readFileSync(new URL('./motion.mjs', import.meta.url), 'utf8').replace(/^export /gm, '');
function harness({ permission = 'granted', touch = true, secure = true, supports = true } = {}) {
  const target = () => ({ handlers: new Map(), addEventListener(type, handler) { this.handlers.set(type, handler); }, removeEventListener(type) { this.handlers.delete(type); }, emit(type, event) { return this.handlers.get(type)?.(event); } });
  let now = 0, id = 0, permissionCalls = 0, stops = 0;
  const timers = new Map(), shakes = [];
  const button = { ...target(), hidden: true, innerHTML: '<svg></svg>', set textContent(value) { throw new Error('Do not replace the motion icon with text'); }, setAttribute(name, value) { this[name] = value; } };
  const reduced = { ...target(), matches: false };
  const device = permission === 'implicit' ? {} : { requestPermission() { permissionCalls++; if (permission === 'error') throw new Error('Blocked'); return Promise.resolve(permission); } };
  const browser = {
    window: { ...target(), isSecureContext: secure, DeviceMotionEvent: supports ? device : undefined, screen: { orientation: { angle: 0 } } },
    document: { ...target(), hidden: false }, navigator: { maxTouchPoints: touch ? 1 : 0 },
    matchMedia: query => query.includes('reduced-motion') ? reduced : { matches: touch },
    performance: { now: () => now },
    setTimeout(fn, delay) { timers.set(++id, { at: now + delay, fn }); return id; }, clearTimeout(key) { timers.delete(key); },
    config: { button, onShake(value) { shakes.push(value); return true; }, onStop() { stops++; } }
  };
  vm.createContext(browser); vm.runInContext(source, browser);
  const control = vm.runInContext('setupMotion(config)', browser);
  function advance(ms) {
    now += ms;
    for (const [key, timer] of [...timers]) if (timer.at <= now) { timers.delete(key); timer.fn(); }
  }
  const send = (x, delta = 20) => { advance(delta); browser.window.emit('devicemotion', reading(x)); };
  const start = () => { send(0, 0); send(0, 250); send(20, 50); send(-20, 120); };
  return { control, button, browser, reduced, shakes, advance, send, start, enable: () => button.emit('click'), calls: () => permissionCalls, stops: () => stops };
}
const mobile = harness();
mobile.control.setActive(true);
assert.equal(mobile.calls(), 0, 'Permission is never requested on arrival');
await mobile.enable();
assert.equal(mobile.calls(), 1);
assert.equal(mobile.button['aria-pressed'], 'true');
mobile.start();
assert.equal(mobile.shakes.length, 2);
assert.ok(mobile.control.playing);
assert.equal(mobile.button.innerHTML, '<svg></svg>', 'Toggling preserves the icon');
for (let i = 0; i < 50; i++) mobile.send(0);
assert.ok(mobile.control.playing, 'Holding still does not end the play window');
mobile.send(20, 200); mobile.send(-20, 120);
assert.equal(mobile.shakes.length, 4);
mobile.advance(6680);
assert.ok(mobile.control.playing, 'A fresh shake extends beyond the original deadline');
mobile.advance(1319); assert.ok(mobile.control.playing);
mobile.advance(1); assert.equal(mobile.control.playing, false);
assert.equal(mobile.stops(), 1, 'The refreshed eight-second deadline freezes once');
mobile.send(0);
assert.equal(mobile.control.playing, false, 'Ordinary sensor readings cannot restart expired play');

const leave = harness(); leave.control.setActive(true); await leave.enable(); leave.start();
leave.control.setActive(false);
assert.equal(leave.control.playing, false);
assert.equal(leave.stops(), 1);
assert.ok(!leave.browser.window.handlers.has('devicemotion'), 'Reading detaches sensors');
leave.control.setActive(true); leave.send(0, 0);
assert.equal(leave.control.playing, false, 'Return requires a fresh shake');
leave.reduced.matches = true; leave.reduced.emit('change');
assert.equal(leave.button.hidden, true);
assert.ok(!leave.browser.window.handlers.has('devicemotion'));
const reduce = harness(); reduce.control.setActive(true); await reduce.enable(); reduce.start();
reduce.reduced.matches = true; reduce.reduced.emit('change');
assert.equal(reduce.control.playing, false);
assert.equal(reduce.stops(), 1, 'Reduced motion ends an active play window');
const disabled = harness(); disabled.control.setActive(true); await disabled.enable(); disabled.start(); await disabled.enable();
assert.equal(disabled.control.playing, false);
assert.equal(disabled.button['aria-pressed'], 'false');
const implicit = harness({ permission: 'implicit' }); implicit.control.setActive(true); await implicit.enable(); implicit.start();
assert.equal(implicit.calls(), 0);
assert.equal(implicit.control.playing, true, 'Platforms without a permission method still support opt-in motion');
for (const permission of ['denied', 'error']) {
  const denied = harness({ permission }); denied.control.setActive(true); await denied.enable();
  assert.equal(denied.control.playing, false);
  assert.equal(denied.button['aria-label'], 'Device motion unavailable');
}
for (const options of [{ touch: false }, { secure: false }, { supports: false }]) {
  const unsupported = harness(options); unsupported.control.setActive(true);
  assert.equal(unsupported.button.hidden, true);
}
const noData = harness(); noData.control.setActive(true); await noData.enable(); noData.advance(3000);
assert.equal(noData.button['aria-label'], 'Device motion unavailable');
const hidden = harness(); hidden.control.setActive(true); await hidden.enable(); hidden.start();
hidden.browser.document.hidden = true; hidden.browser.document.emit('visibilitychange');
assert.equal(hidden.control.playing, false);
assert.ok(!hidden.browser.window.handlers.has('devicemotion'));
hidden.control.dispose(); assert.ok(!hidden.button.handlers.has('click'));

const points = new Float32Array([-1,-1,-.2, 1,-1,-.2, -1,1,-.2, 1,1,-.2, -1,-1,.2, 1,-1,.2, -1,1,.2, 1,1,.2]);
const poses = [-2, 2].map(x => ({ x, y: 0, rotation: { x: 0, y: 0, z: 0, w: 1 } }));
let physics = await createDrop([points, points], poses, 6, 5, () => .5);
for (let i = 0; i < 1440; i++) physics.step();
assert.equal(physics.shake({ x: NaN, y: 0 }), false);
const restingDepth = physics.entries.map(({ body }) => body.linvel().z);
assert.equal(physics.shake({ x: 30, y: -20 }), true);
assert.deepEqual({ ...physics.world.gravity }, { x: 0, y: 0, z: 14 }, 'Motion never changes gravity');
physics.entries.forEach(({ body }, index) => {
  assert.ok(body.linvel().x > 0 && body.linvel().y < 0);
  assert.equal(body.linvel().z, restingDepth[index], 'Acceleration adds no artificial lift away from the glass');
});
for (let i = 0; i < 40; i++) physics.step();
assert.ok(physics.snapshot().playing && physics.entries.every(entry => !entry.corrected));
const snapshot = { ...physics.snapshot(), scaleRatio: 1 };
const resized = await createDrop([points, points], poses, 6, 5, () => .5, snapshot);
physics.dispose(); physics = resized;
assert.ok(physics.snapshot().playing, 'Resize preserves active acceleration play');
assert.deepEqual({ ...physics.world.gravity }, { x: 0, y: 0, z: 14 });
const pose = () => physics.entries.map(({ body }) => ({ position: { ...body.translation() }, rotation: { ...body.rotation() } }));
const before = pose(); physics.endMotion();
assert.deepEqual(pose(), before, 'Stopping does not reassemble or move objects');
assert.ok(physics.entries.every(({ body }) => body.isSleeping() && Math.hypot(...Object.values(body.linvel())) === 0));
for (let i = 0; i < 1440; i++) physics.step();
assert.deepEqual(pose(), before, 'Frozen objects do not drift or correct their orientation');
assert.equal(physics.shake({ x: -20, y: 10 }), true, 'A fresh shake wakes the frozen collection');
physics.endMotion(); physics.beginDrag(0); physics.moveDrag(0, 0);
for (let i = 0; i < 20; i++) physics.step();
assert.ok(physics.entries[0].body.translation().x > before[0].position.x, 'Dragging still works after motion expires');
physics.endDrag(false); physics.dispose();
console.log('Motion checks passed: directional acceleration, no tilt/lift, filtering, screen rotation, icon preservation, permissions, eight-second restart/freeze, reading/background/reduced-motion stops, resize and independent dragging.');
