export function scrubFrame(frame, deltaX, width, frames) {
  return ((frame + deltaX / Math.max(1, width) * frames) % frames + frames) % frames;
}

const video = document.querySelector('.project-video-hero');
if (video) {
  const networkButton = video.closest('.node');
  const readingButton = document.querySelector(`.turntable[data-project="${networkButton.dataset.project}"]`);
  let button = networkButton;
  const frames = Number(video.dataset.frames), fps = Number(video.dataset.fps);
  const appleBrowser = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/.test(navigator.userAgent);
  video.muted = true;
  const loading = window.portfolioLoading;
  const loadButton = document.querySelector('[data-load-turntable]');
  const status = document.querySelector('#turntable-status');
  let enabled = false, requested = false, mobileActivated = false;
  const compact = () => innerWidth < 1000;
  function loadVideo(explicit = false) {
    if (!enabled || requested || document.hidden || !explicit && (loading.restricted() || compact())) return;
    requested = true;
    loadButton.hidden = true;
    status.textContent = 'Loading interactive view…';
    video.preload = 'auto';
    video.src = appleBrowser && video.canPlayType('video/mp4; codecs="hvc1"') ? video.dataset.hevc : video.dataset.webm;
    video.load();
  }
  function activate(){if(compact())mobileActivated=true;loadVideo(true);sync();}
  loadButton.addEventListener('click', activate);
  readingButton?.addEventListener('click',()=>{if(compact())activate();});
  ['pointerenter','focus'].forEach(event => networkButton.addEventListener(event, () => loadVideo()));
  loading.usable.then(() => {
    enabled = true;
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) loadVideo();
      }, {rootMargin:'100% 0px'});
      observer.observe(readingButton);
    }
    sync();
  });
  [networkButton,readingButton].filter(Boolean).forEach(host=>host.setAttribute('aria-description', 'Select to play one rotation. Then move the pointer left or right, drag horizontally, or use the arrow keys to rotate.'));
  let focused = false, completed = false, reset = false, mode = 'paused';
  let frame = 0, lastX = null, dragging = false, scheduled = false;

  function seek() {
    if (video.seeking || video.readyState < 1) return;
    const time = Math.min(Math.round(frame) % frames / fps, Math.max(0, video.duration - 1 / fps));
    if (Math.abs(video.currentTime - time) > .5 / fps) video.currentTime = time;
  }

  function move(delta) {
    if (mode !== 'manual') return;
    frame = scrubFrame(frame, delta, innerWidth, frames);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; seek(); });
    }
  }

  function sync() {
    const pose = window.projectNetworkPose;
    const inFocus = pose?.phase === 'reading' && pose.projectId === Number(networkButton.dataset.project);
    if(compact()&&focused&&!inFocus)mobileActivated=false;
    loadButton.hidden = compact() ? mobileActivated : requested || !loading.restricted();
    if (pose?.projectId === Number(networkButton.dataset.project)) loadVideo();
    const destination=inFocus&&readingButton?readingButton:networkButton;
    if(destination!==button){
      button.classList.remove('project-video-ready');
      (destination.querySelector('.image')||destination).append(video);
      button=destination;
      if(video.readyState>=2&&(!compact()||mobileActivated))button.classList.add('project-video-ready');
    }
    if (inFocus && !focused) { completed = false; reset = true; }
    focused = inFocus;
    const blocked = document.hidden || !loading.motionAllowed() || compact()&&!mobileActivated;
    if(compact()&&!mobileActivated)button.classList.remove('project-video-ready');
    else if(video.readyState>=2)button.classList.add('project-video-ready');
    const next = blocked ? 'paused' : focused ? completed ? 'manual' : 'intro' : pose?.overview ? 'overview' : 'paused';
    if (!requested || video.readyState < 1) return;
    if (reset) { video.pause(); video.currentTime = 0; frame = 0; reset = false; }
    if (next === mode) return;
    mode = next;
    video.pause();
    video.loop = mode === 'overview';
    lastX = null;
    if (mode === 'intro' || mode === 'overview') {
      video.play().catch(() => {
        // A blocked autoplay still permits deliberate frame control.
        if (focused) { completed = true; frame = video.currentTime * fps; sync(); }
      });
    }
  }

  video.addEventListener('loadeddata', () => { status.textContent = ''; sync(); });
  video.addEventListener('ended', () => {
    if (mode !== 'intro') return;
    completed = true;
    frame = frames - 1;
    sync();
  });
  video.addEventListener('seeked', () => { if (mode === 'manual') seek(); });
  video.addEventListener('error', () => {
    button.classList.remove('project-video-ready');
    video.pause();
    status.textContent = 'Interactive view unavailable. Showing the still image.';
    console.warn('Hyperreal video could not load; showing its poster.');
  });
  addEventListener('networkpose', sync);
  navigator.connection?.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' && !dragging) return;
    if (lastX !== null) move(event.clientX - lastX);
    lastX = event.clientX;
  }, { passive: true });
  [networkButton,readingButton].filter(Boolean).forEach(host=>host.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') { dragging = true; lastX = event.clientX; }
  }));
  addEventListener('pointerup', () => { dragging = false; });
  addEventListener('pointercancel', () => { dragging = false; lastX = null; });
  document.addEventListener('pointerleave', () => { lastX = null; });
  addEventListener('blur', () => { lastX = null; });
  [networkButton,readingButton].filter(Boolean).forEach(host=>host.addEventListener('keydown', event => {
    if (mode === 'manual' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      move(innerWidth / 72 * (event.key === 'ArrowRight' ? 1 : -1));
    }
  }));
  sync();
}
