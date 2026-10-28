import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { escapeHTML, prose, routeFromHash, renderProject } from './content.mjs';

const context = { window: {} };
for (const name of ['projects.js', 'media.js']) vm.runInNewContext(fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8'), context);
const projects = context.window.PORTFOLIO_PROJECTS;
assert.equal(projects.length, 7);
assert.equal(routeFromHash('#/', projects).name, 'home');
assert.equal(routeFromHash('#/about', projects).name, 'about');
assert.equal(routeFromHash('#/projects/missing', projects).name, 'home');
assert.equal(routeFromHash('#/projects/doxa-extra', projects).name, 'home');
assert.equal(prose('<script> & **safe**'), '<p>&lt;script&gt; &amp; <strong>safe</strong></p>');

for (const project of projects) {
  assert.equal(routeFromHash(`#/projects/${project.slug}`, projects).project, project);
  const html = renderProject(project, context.window.PORTFOLIO_MEDIA);
  assert.equal((html.match(/class="part-placeholder"/g) || []).length, project.caseStudy.length + 1);
  for (const section of project.caseStudy) {
    assert.ok(html.includes(escapeHTML(section.title)));
    assert.ok(html.includes(prose(section.text)), `${project.title}: complete section text`);
  }
  assert.ok(html.includes(prose(project.atAGlance)));
  if (project.credits) assert.ok(html.includes(prose(project.credits)));
  const media = [...new Map([project.hero, ...project.detailImages, ...project.photos].map(photo => [photo.src, photo])).values()];
  for (const photo of media) {
    assert.ok(html.includes(escapeHTML(photo.title)));
    if (photo.credit) assert.ok(html.includes(escapeHTML(photo.credit)));
    assert.ok(fs.existsSync(new URL(`../${photo.src}`, import.meta.url)));
  }
  assert.equal((html.match(/<figcaption>/g) || []).length, media.length + (project.video ? 1 : 0), `${project.title}: each image once`);
  assert.equal((html.match(/<figure class="paired">/g) || []).length, project.pairedMedia?.length || 0);
  assert.ok(!/skill-chip|related-project|<details/.test(html));
}

// Exercise navigation with actual event handlers, including repeated visits to the same project.
const listeners = {}, views = new Map();
const element = () => ({ dataset: {}, hidden: false, focus() {}, setAttribute() {}, querySelector: () => element(), replaceChildren() { this.innerHTML = ''; } });
for (const selector of ['#home', '#project', '#about', '.wordmark', '.about-link', '.collection']) views.set(selector, element());
let entryId = 0;
const historyEntries = [{ hash: '', state: null }];
let historyIndex = 0;
const browser = {
  window: { ...context.window },
  document: { body: { dataset: {} }, querySelector: selector => views.get(selector), addEventListener: (name, handler) => listeners[name] = handler },
  crypto: { randomUUID: () => String(++entryId) },
  location: { hash: '' }, scrollY: 0,
  escapeHTML, routeFromHash, renderProject,
  history: {
    state: null,
    replaceState(state) { this.state = state; historyEntries[historyIndex].state = state; },
    pushState(state, _, hash) { this.state = state; browser.location.hash = hash; historyEntries.splice(++historyIndex, Infinity, { hash, state }); }
  }
};
browser.window.scrollTo = ({ top }) => browser.scrollY = top;
browser.window.addEventListener = (name, handler) => listeners[name] = handler;
vm.createContext(browser);
vm.runInContext(fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8').replace(/^import .+;$/gm, ''), browser);
const go = hash => vm.runInContext(`navigate(${JSON.stringify(hash)})`, browser);
const back = () => {
  const destination = historyEntries[--historyIndex];
  browser.history.state = destination.state;
  browser.location.hash = destination.hash;
  listeners.popstate({ state: destination.state });
};
assert.equal(browser.document.body.dataset.view, 'home');
assert.equal((views.get('.collection').innerHTML.match(/class="project-object"/g) || []).length, 7);
go('#/projects/doxa');
assert.equal(views.get('.about-link').hidden, true);
browser.scrollY = 700;
go('#/');
assert.equal(views.get('#project').innerHTML, '', 'Leaving a project unloads its film');
go('#/projects/doxa');
assert.equal(browser.scrollY, 0, 'A fresh selection starts at the top');
browser.scrollY = 1200;
go('#/');
back();
assert.equal(browser.scrollY, 1200);
back();
back();
assert.equal(browser.scrollY, 700, 'Each history entry restores its own reading position');
listeners.keydown({ key: 'Escape', preventDefault() {} });
assert.equal(browser.document.body.dataset.view, 'home');
go('#/about');
assert.equal(browser.document.body.dataset.view, 'about');
assert.equal(views.get('.about-link').hidden, true);
assert.equal(views.get('#home').hidden, true);
console.log('Wireframe checks passed: seven routes, complete copy/media/credits, section placeholders, paired images, escaping, history scroll restoration and Escape return.');
