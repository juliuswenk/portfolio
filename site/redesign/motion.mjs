const vector = value => value && ['x', 'y', 'z'].every(axis => Number.isFinite(value[axis])) ? [value.x, value.y, value.z] : null;

export function createShakeDetector() {
  let gravity, firstTime, lastTime, lastImpulse = -Infinity;
  function reset() { gravity = firstTime = lastTime = undefined; lastImpulse = -Infinity; }
  function sample(event, now, angle = 0) {
    const total = vector(event.accelerationIncludingGravity);
    let linear = vector(event.acceleration);
    if ((!total && !linear) || !Number.isFinite(now)) return null;
    if (lastTime !== undefined && (now <= lastTime || now - lastTime > 300)) reset();
    const dt = lastTime === undefined ? 16 : now - lastTime;
    firstTime ??= now;
    lastTime = now;
    let orientationGravity;
    if (total) {
      const estimate = linear ? total.map((value, index) => value - linear[index]) : total;
      const separated = !!linear;
      if (!gravity) gravity = [...estimate];
      else {
        const alpha = 1 - Math.exp(-dt / 250);
        gravity = gravity.map((value, index) => value + alpha * (estimate[index] - value));
      }
      linear ||= total.map((value, index) => value - gravity[index]);
      orientationGravity = separated ? estimate : gravity;
    }
    const radians = (Number.isFinite(angle) ? angle : 0) * Math.PI / 180;
    const rotate = ([x, y]) => ({ x: x * Math.cos(radians) + y * Math.sin(radians), y: -x * Math.sin(radians) + y * Math.cos(radians) });
    const acceleration = rotate(linear);
    let shake = null;
    // shortcut: the acceleration dead zone needs calibration on real phones.
    if (now - firstTime >= 200 && Math.hypot(acceleration.x, acceleration.y) >= 6 && now - lastImpulse >= 120) {
      shake = { x: -acceleration.x, y: -acceleration.y };
      lastImpulse = now;
    }
    return { shake, gravity: orientationGravity };
  }
  return { sample, reset };
}

export function createTiltTracker() {
  let origin, right, up, originAngle, previous, filtered = { x: 0, y: 0 };
  const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);
  function reset() { origin = right = up = previous = undefined; filtered = { x: 0, y: 0 }; }
  function sample(gravity, now, angle = 0) {
    if (!gravity || gravity.length !== 3 || !gravity.every(Number.isFinite) || !Number.isFinite(now)) return null;
    const length = Math.hypot(...gravity);
    if (length < 1) return null;
    const current = gravity.map(value => -value / length);
    angle = (Number.isFinite(angle) ? angle : 0) * Math.PI / 180;
    if (!origin) {
      origin = current; originAngle = angle; previous = now;
      const screenRight = [Math.cos(angle), Math.sin(angle), 0];
      const projection = dot(screenRight, origin);
      right = screenRight.map((value, index) => value - projection * origin[index]);
      if (Math.hypot(...right) < .1) right = [0, 0, 1].map((value, index) => value - origin[2] * origin[index]);
      const magnitude = Math.hypot(...right);
      right = right.map(value => value / magnitude);
      up = [right[1] * origin[2] - right[2] * origin[1], right[2] * origin[0] - right[0] * origin[2], right[0] * origin[1] - right[1] * origin[0]];
      return { ...filtered };
    }
    // The tangent plane gives upright and flat holding positions the same automatic zero.
    const difference = current.map((value, index) => value - origin[index]);
    const x = dot(difference, right), y = dot(difference, up), rotation = angle - originAngle;
    const target = { x: x * Math.cos(rotation) + y * Math.sin(rotation), y: -x * Math.sin(rotation) + y * Math.cos(rotation) };
    const alpha = 1 - Math.exp(-Math.max(0, Math.min(100, now - previous)) / 80);
    previous = now;
    filtered.x += alpha * (target.x - filtered.x);
    filtered.y += alpha * (target.y - filtered.y);
    return { ...filtered };
  }
  return { sample, reset };
}

export function setupMotion({ button, onShake, onTilt, onStop }) {
  const MotionEvent = window.DeviceMotionEvent;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(any-pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const supported = window.isSecureContext && !!MotionEvent && touch;
  const detector = createShakeDetector();
  const tilt = createTiltTracker();
  let active = false, enabled = false, unavailable = false, listening = false, requesting = false, disposed = false;
  let deadline = 0, timer, sampleTimer;
  const eligible = () => supported && active && !document.hidden && !reducedMotion.matches && !unavailable && !disposed;
  function stop() {
    clearTimeout(timer); clearTimeout(sampleTimer);
    if (deadline) { deadline = 0; onStop(); }
    detector.reset();
  }
  function tick(now = performance.now()) { if (deadline && now >= deadline) stop(); }
  function noSensor() {
    unavailable = true; enabled = false;
    refresh();
    button.title = 'Device motion unavailable';
    button.setAttribute('aria-label', 'Device motion unavailable');
    button.hidden = !active || reducedMotion.matches;
    button.disabled = true;
  }
  function receive(event) {
    if (!eligible() || !enabled) return;
    const now = performance.now();
    tick(now);
    const angle = window.screen?.orientation?.angle ?? window.orientation ?? 0;
    const input = detector.sample(event, now, angle);
    if (!input) return;
    const relativeTilt = tilt.sample(input.gravity, now, angle);
    clearTimeout(sampleTimer);
    if (input.shake && onShake(input.shake) !== false) {
      deadline = now + 8000;
      clearTimeout(timer);
      timer = setTimeout(() => tick(), 8000);
    }
    if (deadline) onTilt(relativeTilt || { x: 0, y: 0 });
  }
  function refresh() {
    const canListen = eligible() && enabled;
    if (!canListen) stop();
    if (canListen !== listening) {
      listening = canListen;
      if (listening) {
        window.addEventListener('devicemotion', receive);
        sampleTimer = setTimeout(noSensor, 3000);
      } else window.removeEventListener('devicemotion', receive);
    }
    button.hidden = !eligible();
    button.disabled = requesting;
    button.title = enabled ? 'Disable motion' : 'Enable motion';
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Disable device motion' : 'Enable device motion');
  }
  async function toggle() {
    if (!eligible() || requesting) return;
    if (enabled) { enabled = false; tilt.reset(); refresh(); return; }
    requesting = true;
    button.disabled = true;
    try {
      const permission = typeof MotionEvent.requestPermission === 'function' ? await MotionEvent.requestPermission() : 'granted';
      if (disposed) return;
      if (permission !== 'granted') { noSensor(); return; }
      tilt.reset(); enabled = true;
    } catch { noSensor(); }
    finally { requesting = false; if (!disposed && !unavailable) refresh(); }
  }
  const visibility = () => refresh();
  button.addEventListener('click', toggle);
  document.addEventListener('visibilitychange', visibility);
  reducedMotion.addEventListener('change', visibility);
  refresh();
  return {
    get playing() { return deadline > 0; }, tick, stop,
    setActive(value) { active = value; refresh(); },
    dispose() {
      disposed = true; refresh();
      button.removeEventListener('click', toggle);
      document.removeEventListener('visibilitychange', visibility);
      reducedMotion.removeEventListener('change', visibility);
    }
  };
}
