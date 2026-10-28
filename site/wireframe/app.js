import '../projects.js';
import '../media.js';
import { escapeHTML, routeFromHash, renderProject } from './content.mjs';

const projects = window.PORTFOLIO_PROJECTS;
const home = document.querySelector('#home');
const projectView = document.querySelector('#project');
const about = document.querySelector('#about');
const wordmark = document.querySelector('.wordmark');
const aboutLink = document.querySelector('.about-link');
const collection = document.querySelector('.collection');
collection.innerHTML = projects.map(project => `<a class="project-object" href="#/projects/${project.slug}" aria-label="Open ${escapeHTML(project.title)}"><img src="cube.svg" width="300" height="294" alt="" draggable="false"></a>`).join('');

history.scrollRestoration = 'manual';
let entry = crypto.randomUUID(), returnTarget;
history.replaceState({ ...history.state, wireframeEntry: entry }, '');
const scrollPositions = new Map();

function showRoute(restore = false, focus = true) {
  const next = routeFromHash(location.hash, projects);
  const key = next.name === 'project' ? next.project.slug : next.name;
  if (next.name === 'project' && projectView.dataset.project !== key) {
    projectView.innerHTML = renderProject(next.project, window.PORTFOLIO_MEDIA);
    projectView.dataset.project = key;
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
  if (!focus) return;
  if (next.name === 'home') {
    (returnTarget || aboutLink).focus({ preventScroll: true });
  } else {
    returnTarget = next.name === 'project' ? collection.querySelector(`[href="#/projects/${next.project.slug}"]`) : aboutLink;
    (next.name === 'project' ? projectView : about).querySelector('h1').focus({ preventScroll: true });
  }
}

function navigate(hash) {
  scrollPositions.set(entry, scrollY);
  entry = crypto.randomUUID();
  history.pushState({ wireframeEntry: entry }, '', hash);
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
  entry = event.state?.wireframeEntry || crypto.randomUUID();
  if (!event.state?.wireframeEntry) history.replaceState({ ...event.state, wireframeEntry: entry }, '');
  showRoute(true);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.dataset.view !== 'home') {
    event.preventDefault();
    navigate('#/');
  }
});

showRoute(false, location.hash.startsWith('#/projects/') || location.hash === '#/about');
