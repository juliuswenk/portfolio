import RAPIER from './vendor/rapier.mjs';
const ready = RAPIER.init();

export async function createDrop(pointClouds, poses, width, height, random = Math.random, snapshot) {
  await ready;
  if (pointClouds.length !== poses.length || pointClouds.some(points => points.length < 12 || points.length % 3 || !points.every(Number.isFinite))) throw new Error('Every asset needs a valid collision point cloud.');
  const world = new RAPIER.World(snapshot?.gravity || { x: 0, y: 0, z: 14 });
  world.timestep = 1 / 120;
  const floor = world.createCollider(RAPIER.ColliderDesc.cuboid(width + 1, height + 1, 0.1).setTranslation(0, 0, 0.1).setRestitution(0.28).setFriction(0.8));
  world.createCollider(RAPIER.ColliderDesc.cuboid(width + 1, height + 1, 0.1).setTranslation(0, 0, -10));
  for (const sign of [-1, 1]) {
    world.createCollider(RAPIER.ColliderDesc.cuboid(0.1, height + 1, 5).setTranslation(sign * (width + 0.1), 0, -5));
    world.createCollider(RAPIER.ColliderDesc.cuboid(width + 1, 0.1, 5).setTranslation(0, sign * (height + 0.1), -5));
  }
  const entries = poses.map((pose, index) => {
    const points = pointClouds[index];
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(pose.x, pose.y, -6 - index * 0.65)
      .setRotation(pose.rotation).setLinearDamping(0.8).setAngularDamping(2).setCcdEnabled(true));
    const hull = RAPIER.ColliderDesc.convexHull(points);
    if (!hull) throw new Error('Could not create an asset collision hull.');
    const collider = world.createCollider(hull.setRestitution(0.28).setFriction(0.8), body);
    body.setLinvel({ x: (random() - 0.5) * 0.6, y: (random() - 0.5) * 0.6, z: 0 }, true);
    body.setAngvel({ x: (random() - 0.5) * 1.2, y: (random() - 0.5) * 1.2, z: (random() - 0.5) * 0.8 }, true);
    return { body, collider, points, target: pose.rotation, corrected: false };
  });
  let elapsed = snapshot?.elapsed ?? 0, held = null, settleFrom = snapshot?.settleFrom ?? 1.6, settleEnd = snapshot?.settleEnd ?? 2.6;
  let playing = snapshot?.playing || false;
  function playFriction(value) {
    floor.setFriction(value);
    entries.forEach(({ collider }) => collider.setFriction(value));
  }
  if (playing) playFriction(.2);
  function shake({ x, y }) {
    if (held || !Number.isFinite(x) || !Number.isFinite(y)) return false;
    playing = true; playFriction(.2);
    const length = Math.max(1, Math.hypot(x, y) / 3);
    entries.forEach((entry, index) => {
      const { body } = entry;
      entry.corrected = false;
      body.setEnabledRotations(true, true, true, true);
      body.applyImpulse({ x: x / length * body.mass(), y: y / length * body.mass(), z: -.8 * body.mass() }, true);
      body.setAngvel({ x: Math.sin(index + 1) * 2, y: Math.cos(index + 1) * 2, z: (index % 2 ? -1 : 1) * .8 }, true);
    });
    return true;
  }
  function tilt({ x, y }) {
    if (!playing || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const force = value => Math.abs(value) < .8 ? 0 : Math.max(-12, Math.min(12, value * 1.6));
    world.gravity = { x: force(x), y: force(y), z: 14 };
    if (world.gravity.x || world.gravity.y) entries.forEach(({ body }) => body.wakeUp());
  }
  function endMotion() {
    if (!playing) return;
    endDrag(false);
    playing = false; playFriction(.8);
    world.gravity = { x: 0, y: 0, z: 14 };
    entries.forEach(entry => {
      entry.body.setLinvel({ x: 0, y: 0, z: 0 }, false);
      entry.body.setAngvel({ x: 0, y: 0, z: 0 }, false);
      entry.body.setEnabledRotations(false, false, false, false);
      entry.corrected = true;
      entry.body.sleep();
    });
  }
  function restartPhysics() {
    settleFrom = elapsed + 1.3;settleEnd = elapsed + 2.6;
    for (const entry of entries) {
      entry.corrected = false;
      entry.body.setEnabledRotations(true, true, true, true);
      entry.body.wakeUp();
    }
  }
  function tap(index) {
    if (!Number.isInteger(index) || !entries[index]) throw new Error('Unknown tap object.');
    restartPhysics();
    const { body } = entries[index];
    body.setLinvel({ x: .15, y: .2, z: -2.3 }, true);
    body.setAngvel({ x: 2.4, y: -3, z: 1.1 }, true);
  }
  function bounds(entry) {
    const q = entry.body.rotation();
    const lo = { x: Infinity, y: Infinity, z: Infinity }, hi = { x: -Infinity, y: -Infinity, z: -Infinity };
    for (let i = 0; i < entry.points.length; i += 3) {
      const x = entry.points[i], y = entry.points[i + 1], z = entry.points[i + 2];
      const tx = 2 * (q.y * z - q.z * y), ty = 2 * (q.z * x - q.x * z), tz = 2 * (q.x * y - q.y * x);
      const v = { x: x + q.w * tx + q.y * tz - q.z * ty, y: y + q.w * ty + q.z * tx - q.x * tz, z: z + q.w * tz + q.x * ty - q.y * tx };
      for (const k of ['x', 'y', 'z']) { lo[k] = Math.min(lo[k], v[k]);hi[k] = Math.max(hi[k], v[k]); }
    }
    return { lo, hi };
  }
  function beginDrag(index) {
    if (!Number.isInteger(index) || !entries[index]) throw new Error('Unknown drag object.');
    endDrag(false);
    restartPhysics();
    const entry = entries[index];
    entry.body.setRotation(entry.target, true);
    entry.body.setEnabledRotations(false, false, false, true);
    entry.corrected = true;
    held = { entry, ...bounds(entry), velocity: { x: 0, y: 0 } };
    entry.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    moveDrag(entry.body.translation().x, entry.body.translation().y);
  }
  if (snapshot) entries.forEach((entry, index) => {
    const saved = snapshot.entries[index], body = entry.body;
    const sx = width / snapshot.width, sy = height / snapshot.height, sz = snapshot.scaleRatio;
    body.setRotation(saved.rotation, true);
    const { lo, hi } = bounds(entry);
    body.setTranslation({
      x: Math.max(-width - lo.x + .02, Math.min(width - hi.x - .02, saved.position.x * sx)),
      y: Math.max(-height - lo.y + .02, Math.min(height - hi.y - .02, saved.position.y * sy)),
      z: Math.max(-9.9 - lo.z, Math.min(-hi.z - .005, saved.position.z * sz))
    }, true);
    body.setLinvel({ x: saved.velocity.x * sx, y: saved.velocity.y * sy, z: saved.velocity.z * sz }, true);
    body.setAngvel(saved.angularVelocity, true);
    entry.corrected = saved.corrected;
    if (saved.corrected) body.setEnabledRotations(false, false, false, true);
    if (saved.sleeping) body.sleep();
  });
  function moveDrag(x, y) {
    if (!held || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const { entry, lo, hi } = held;
    held.destination = {
      x: Math.max(-width - lo.x + .02, Math.min(width - hi.x - .02, x)),
      y: Math.max(-height - lo.y + .02, Math.min(height - hi.y - .02, y)),
      z: -hi.z - .008
    };
  }
  function endDrag(launch = true) {
    if (!held) return;
    const { body } = held.entry;
    const velocity = held.velocity;
    const speed = Math.hypot(velocity.x, velocity.y);
    const scale = Math.min(1, 5 / Math.max(speed, 1e-6));
    body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    held = null;
    restartPhysics();
    body.setLinvel({ x: launch ? velocity.x * scale : 0, y: launch ? velocity.y * scale : 0, z: launch ? -1.4 : 0 }, true);
    body.setAngvel(launch ? { x: 1.8 + velocity.y * scale * .25, y: -2 + velocity.x * scale * .25, z: .9 } : { x: 0, y: 0, z: 0 }, true);
  }
  function step() {
    elapsed += world.timestep;
    // The plan permits a settling correction: ease into a readable tilted front face.
    if (!playing && !held && elapsed > settleFrom) for (const entry of entries) {
      if (entry.corrected) continue;
      const { body, points, target } = entry;
      const current = body.rotation();
      const sign = current.x * target.x + current.y * target.y + current.z * target.z + current.w * target.w < 0 ? -1 : 1;
      const t = elapsed > settleEnd ? 1 : 0.06;
      const q = Object.fromEntries(['x', 'y', 'z', 'w'].map(key => [key, current[key] * (1 - t) + target[key] * sign * t]));
      const length = Math.hypot(q.x, q.y, q.z, q.w);
      for (const key of ['x', 'y', 'z', 'w']) q[key] /= length;
      body.setRotation(q, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      let front = -Infinity;
      for (let i = 0; i < points.length; i += 3) {
        const x = points[i], y = points[i + 1], z = points[i + 2];
        const tx = 2 * (q.y * z - q.z * y), ty = 2 * (q.z * x - q.x * z), tz = 2 * (q.x * y - q.y * x);
        front = Math.max(front, z + q.w * tz + q.x * ty - q.y * tx);
      }
      const p = body.translation();
      if (p.z + front > -0.005) body.setTranslation({ x: p.x, y: p.y, z: -front - 0.005 }, true);
      if (elapsed > settleEnd) {
        body.setEnabledRotations(false, false, false, true);
        entry.corrected = true;
      }
    }
    if (held?.destination) {
      const current = held.entry.body.translation(), target = held.destination;
      const distance = Math.hypot(target.x - current.x, target.y - current.y, target.z - current.z);
      const t = Math.min(1, .2 / Math.max(distance, 1e-6));
      held.velocity.x = held.velocity.x * .65 + (target.x - current.x) * t / world.timestep * .35;
      held.velocity.y = held.velocity.y * .65 + (target.y - current.y) * t / world.timestep * .35;
      held.entry.body.setNextKinematicTranslation({ x: current.x + (target.x - current.x) * t, y: current.y + (target.y - current.y) * t, z: current.z + (target.z - current.z) * t });
    }
    if (playing) entries.forEach(({ body }) => {
      const velocity = body.linvel(), speed = Math.hypot(velocity.x, velocity.y, velocity.z);
      if (speed > 6) body.setLinvel({ x: velocity.x * 6 / speed, y: velocity.y * 6 / speed, z: velocity.z * 6 / speed }, true);
    });
    world.step();
  }
  const takeSnapshot = () => ({
    width, height, elapsed, settleFrom, settleEnd, playing, gravity: { ...world.gravity },
    entries: entries.map(({ body, target, corrected }) => ({
      position: { ...body.translation() }, rotation: { ...body.rotation() }, target: { x: target.x, y: target.y, z: target.z, w: target.w },
      velocity: { ...body.linvel() }, angularVelocity: { ...body.angvel() }, corrected, sleeping: body.isSleeping()
    }))
  });
  return { world, entries, step, tap, beginDrag, moveDrag, endDrag, shake, tilt, endMotion, snapshot: takeSnapshot, dispose: () => world.free() };
}
