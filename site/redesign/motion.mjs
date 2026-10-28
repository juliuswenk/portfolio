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
    if (total) {
      const estimate = linear ? total.map((value, index) => value - linear[index]) : total;
      if (!gravity) gravity = [...estimate];
      else {
        const alpha = 1 - Math.exp(-dt / 250);
        gravity = gravity.map((value, index) => value + alpha * (estimate[index] - value));
      }
      linear ||= total.map((value, index) => value - gravity[index]);
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
    return { shake };
  }
  return { sample, reset };
}

export function setupMotion({ button, onShake, onStop }) {
  const MotionEvent = window.DeviceMotionEvent;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(any-pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const supported = window.isSecureContext && !!MotionEvent && touch;
  const detector = createShakeDetector();
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
    const input = detector.sample(event, now, window.screen?.orientation?.angle ?? window.orientation ?? 0);
    if (!input) return;
    clearTimeout(sampleTimer);
    if (input.shake && onShake(input.shake) !== false) {
      deadline = now + 8000;
      clearTimeout(timer);
      timer = setTimeout(() => tick(), 8000);
    }
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
    if (enabled) { enabled = false; refresh(); return; }
    requesting = true;
    button.disabled = true;
    try {
      const permission = typeof MotionEvent.requestPermission === 'function' ? await MotionEvent.requestPermission() : 'granted';
      if (disposed) return;
      if (permission !== 'granted') { noSensor(); return; }
      enabled = true;
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
