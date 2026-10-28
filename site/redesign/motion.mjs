const vector = value => value && ['x', 'y', 'z'].every(axis => Number.isFinite(value[axis])) ? [value.x, value.y, value.z] : null;

export function createShakeDetector() {
  let gravity, firstTime, lastTime, peak, lastShake = -Infinity;
  function reset() { gravity = firstTime = lastTime = peak = undefined; lastShake = -Infinity; }
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
    const tilt = rotate(gravity || [0, 0, 0]);
    tilt.x = -tilt.x; tilt.y = -tilt.y;
    let shake = null;
    const strength = Math.hypot(...linear);
    // shortcut: initial shake thresholds need calibration on real phones before tuning sensitivity.
    if (now - firstTime >= 200 && strength >= 12 && now - lastShake >= 750) {
      if (peak && now - peak.time >= 60 && now - peak.time <= 650 && linear.reduce((sum, value, index) => sum + value * peak.vector[index], 0) / (strength * peak.strength) < -.25) {
        const impulse = rotate(linear);
        shake = { x: -impulse.x, y: -impulse.y };
        lastShake = now; peak = undefined;
      } else if (!peak || now - peak.time > 650) peak = { time: now, vector: linear, strength };
    }
    return { tilt, shake };
  }
  return { sample, reset };
}

export function setupMotion({ button, onShake, onTilt, onStop }) {
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
    button.textContent = 'Motion unavailable';
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
    if (deadline) onTilt(input.tilt);
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
    button.textContent = enabled ? 'Motion on' : 'Enable motion';
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
