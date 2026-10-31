import '../projects.js';
import '../media.js';
import { escapeHTML, routeFromHash, renderProject } from '../wireframe/content.mjs';
import { projectAssets, projectParts } from './project-assets.mjs?v=project-parts-1';

const projects = projectAssets.map(asset => window.PORTFOLIO_PROJECTS.find(project => project.slug === asset.slug));
const home = document.querySelector('#home');
const projectView = document.querySelector('#project');
const about = document.querySelector('#about');
const wordmark = document.querySelector('.wordmark');
const aboutLink = document.querySelector('.about-link');
const collection = document.querySelector('.collection');
const canvas = document.querySelector('#viewer');
const loading = document.querySelector('.loading-screen');
const failure = document.querySelector('.fallback-status');
collection.innerHTML = projects.map(project => `<a class="project-object" href="#/projects/${project.slug}" aria-label="Open ${escapeHTML(project.title)}"><img src="cube.svg" width="300" height="294" alt="" draggable="false"></a>`).join('');

let scene, loadState = 'idle', loadTimer;
const loadAbort = new AbortController();
function showFallback() {
  if (loadState === 'fallback') return;
  loadState = 'fallback';
  clearTimeout(loadTimer);
  loadAbort.abort();
  scene?.dispose();
  scene = null;
  canvas.hidden = loading.hidden = true;
  collection.inert = false;
  collection.querySelectorAll('a').forEach(link => link.removeAttribute('style'));
  document.body.dataset.collection = loadState;
  delete document.body.dataset.parts;
  failure.hidden = false;
}
function loadCollection() {
  if (loadState !== 'idle') return;
  loadState = 'loading';
  document.body.dataset.collection = loadState;
  loading.hidden = false;
  collection.inert = true;
  loadTimer = setTimeout(showFallback, 15000);
  import('./scene.mjs?v=project-parts-1').then(module => module.createCollection({
    canvas, collection, signal: loadAbort.signal,
    isHome: () => document.body.dataset.view === 'home',
    onOpen: slug => navigate(`#/projects/${slug}`),
    onFailure: showFallback
  })).then(controller => {
    if (loadAbort.signal.aborted) { controller.dispose(); return; }
    scene = controller;
    clearTimeout(loadTimer);
    loadState = 'ready';
    document.body.dataset.collection = loadState;
    canvas.hidden = false;
    loading.hidden = true;
    collection.inert = false;
    scene.setActive(document.body.dataset.view === 'home');
    scene.setProject(projectParts[projectView.dataset.project] ? projectView.dataset.project : null, projectView.querySelectorAll('.part-stage'), true);
  }).catch(error => {
    if (!loadAbort.signal.aborted) console.warn('3D collection unavailable; keeping project placeholders.', error);
    showFallback();
  });
}

history.scrollRestoration = 'manual';
let entry = crypto.randomUUID(), returnTarget;
history.replaceState({ ...history.state, prototypeEntry: entry }, '');
const scrollPositions = new Map();
function showRoute(restore = false, focus = true) {
  const next = routeFromHash(location.hash, projects);
  scene?.setActive(false);
  // Capture part positions before replacing the reading DOM or restoring scroll.
  if (projectParts[projectView.dataset.project]) scene?.setProject(null, null, next.name !== 'home');
  if (next.name === 'project' && projectView.dataset.project !== next.project.slug) {
    projectView.innerHTML = renderProject(next.project, window.PORTFOLIO_MEDIA);
    projectView.dataset.project = next.project.slug;
    if (projectParts[next.project.slug]) projectView.querySelectorAll('.part-stage').forEach((stage, index) => {
      stage.setAttribute('role', 'img');
      stage.setAttribute('aria-label', projectParts[next.project.slug].parts[index].label);
    });
  } else if (next.name !== 'project') {
    projectView.replaceChildren();
    delete projectView.dataset.project;
  }
  document.body.dataset.view = next.name;
  home.hidden = next.name !== 'home';
  projectView.hidden = next.name !== 'project';
  about.hidden = next.name !== 'about';
  aboutLink.hidden = next.name !== 'home';
  wordmark.setAttribute('aria-label', next.name === 'home' ? 'Julius Wenk — Home' : 'JW — Back to projects');
  document.title = next.name === 'project' ? `${next.project.title} — Julius Wenk` : next.name === 'about' ? 'About & Contact — Julius Wenk' : 'Julius Wenk — Portfolio';
  window.scrollTo({ top: restore ? scrollPositions.get(entry) || 0 : 0, behavior: 'instant' });
  if (next.name === 'home') { loadCollection(); scene?.setActive(true); scene?.setProject(null); }
  else if (next.name === 'project' && projectParts[next.project.slug]) {
    loadCollection();
    scene?.setProject(next.project.slug, projectView.querySelectorAll('.part-stage'));
  } else scene?.setProject(null, null, true);
  if (!focus) return;
  if (next.name === 'home') (returnTarget && !collection.inert ? returnTarget : aboutLink).focus({ preventScroll: true });
  else {
    returnTarget = next.name === 'project' ? collection.querySelector(`[href="#/projects/${next.project.slug}"]`) : aboutLink;
    (next.name === 'project' ? projectView : about).querySelector('h1').focus({ preventScroll: true });
  }
}
function navigate(hash) {
  scrollPositions.set(entry, scrollY);
  entry = crypto.randomUUID();
  history.pushState({ prototypeEntry: entry }, '', new URL(hash, location.href));
  showRoute();
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#/"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const hash = link.getAttribute('href');
  if (hash === location.hash || hash === '#/' && document.body.dataset.view === 'home') return;
  navigate(hash);
});
window.addEventListener('popstate', event => {
  scrollPositions.set(entry, scrollY);
  entry = event.state?.prototypeEntry || crypto.randomUUID();
  if (!event.state?.prototypeEntry) history.replaceState({ ...event.state, prototypeEntry: entry }, '');
  showRoute(true);
});
document.addEventListener('keydown', event => {
  document.body.dataset.input = 'keyboard';
  if (event.key === 'Escape' && document.body.dataset.view !== 'home') { event.preventDefault(); navigate('#/'); }
});
document.addEventListener('pointerdown', () => { document.body.dataset.input = 'pointer'; }, { capture: true });
const legacyProject = window.PORTFOLIO_PROJECTS.find(project => location.hash === `#project-${project.id}`);
if (legacyProject && !projects.includes(legacyProject)) {
  location.replace(new URL(`../legacy.html${location.hash}`, document.baseURI));
} else {
  if (legacyProject) history.replaceState(history.state, '', new URL(`#/projects/${legacyProject.slug}`, location.href));
  else if (location.hash === '#about-section' || location.hash === '#contact') history.replaceState(history.state, '', new URL('#/about', location.href));
  showRoute(false, location.hash.startsWith('#/projects/') || location.hash === '#/about');
}
