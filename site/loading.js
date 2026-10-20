// Optional media never participates in opening readiness.
(() => {
  const view = document.querySelector('#site-loading');
  const continueButton = document.querySelector('#continue-browsing');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  // app.js initializes Still view from the OS preference and handles explicit overrides.
  const motionAllowed = () => !document.body.classList.contains('still');
  const restricted = () => !motionAllowed() || !!connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType || '');
  let revealed = false, avatarStarted = false, avatarIdle = false;
  let resolveUsable;
  const usable = new Promise(resolve => { resolveUsable = resolve; });
  const avatarButton = document.querySelector('[data-load-avatar]');
  const avatarStatus = document.querySelector('#avatar-status');

  function reveal() {
    if (revealed) return;
    revealed = true;
    const hadFocus = view.contains(document.activeElement);
    view.hidden = true;
    document.body.classList.remove('preparing');
    [...document.body.children].forEach(child => { if (child !== view) child.inert = false; });
    if (hadFocus) {
      const target = /^#(?:overview|about-section|project-\d+)$/.test(location.hash) ? location.hash : '#overview';
      (document.querySelector(target) || document.querySelector('#overview')).focus({preventScroll:true});
    }
    resolveUsable();
    dispatchEvent(new Event('siteusable'));
    scheduleAvatar();
  }
  continueButton.addEventListener('click', reveal);
  view.hidden = false;
  document.body.classList.add('preparing');
  [...document.body.children].forEach(child => { if (child !== view) child.inert = true; });
  setTimeout(() => {
    if (revealed) return;
    document.querySelector('#loading-delay').hidden = false;
    continueButton.hidden = false;
  }, 3000);
  // If application initialization fails, an overlay must never trap the visitor.
  setTimeout(reveal, 10000);

  function hydrate(image) {
    if (!image?.dataset.src) return;
    image.sizes = image.dataset.sizes;
    image.srcset = image.dataset.srcset;
    image.src = image.dataset.src;
    delete image.dataset.src;
  }
  function imageSettled(image) {
    hydrate(image);
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, {once:true});
      image.addEventListener('error', resolve, {once:true});
    });
  }
  function ready() {
    const route = /^#project-\d+$/.test(location.hash) ? document.querySelector(`${location.hash} .reading-hero img`) : null;
    const images = route ? [route] : [...document.querySelectorAll('#nodes .node img')];
    Promise.all(images.map(imageSettled)).then(() => requestAnimationFrame(reveal));
  }

  function loadAvatar() {
    if (avatarStarted || document.hidden) return;
    avatarStarted = true;
    avatarButton.hidden = true;
    avatarStatus.textContent = 'Loading animated avatar…';
    import('./about-model.js?v=about-portrait-3').catch(() => avatarFailed());
  }
  function avatarFailed() {
    avatarStatus.textContent = 'Animation unavailable. You can still explore About.';
  }
  addEventListener('avatarready', () => { avatarStatus.textContent = ''; });
  addEventListener('avatarerror', avatarFailed);
  function scheduleAvatar() {
    avatarButton.hidden = avatarStarted || !restricted();
    if (!revealed || !window.aboutNetworkPose || avatarStarted || restricted() || document.hidden) return;
    if (window.aboutNetworkPose?.focused) { loadAvatar(); return; }
    if (window.aboutNetworkPose?.hidden || avatarIdle) return;
    avatarIdle = true;
    const run = () => {
      avatarIdle = false;
      if (!restricted() && !document.hidden && !window.aboutNetworkPose?.hidden) loadAvatar();
    };
    if ('requestIdleCallback' in window) requestIdleCallback(run, {timeout:2000});
    else setTimeout(run, 500);
  }
  avatarButton.addEventListener('click', loadAvatar);
  addEventListener('networkpose', scheduleAvatar);
  document.addEventListener('visibilitychange', scheduleAvatar);
  preference.addEventListener('change', scheduleAvatar);
  connection?.addEventListener('change', scheduleAvatar);
  window.portfolioLoading = {ready, hydrate, restricted, motionAllowed, usable};
})();
