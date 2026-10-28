export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const prose = text => text.split(/\n\s*\n/).map(paragraph => `<p>${escapeHTML(paragraph).replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^\w])[_*]([^_*\n]+)[_*](?=\W|$)/g, '$1<em>$2</em>')}</p>`).join('');

export function routeFromHash(hash, projects) {
  const project = projects.find(project => hash === `#/projects/${project.slug}`);
  return project ? { name: 'project', project } : { name: hash === '#/about' ? 'about' : 'home' };
}

export function renderProject(project, variants) {
  const p = project;
  const placeholder = section => `<div class="part-stage"><img class="part-placeholder" src="cube.svg" width="300" height="294" alt="Placeholder for the ${escapeHTML(section)} part of ${escapeHTML(p.title)}"></div>`;
  const figure = (photo, paired = false) => {
    const sources = variants[photo.src] || [{ src: photo.src, width: photo.width }];
    return `<figure${paired ? ' class="paired"' : ''}><img src="../${escapeHTML(sources[0].src)}" srcset="${sources.map(source => `../${escapeHTML(source.src)} ${source.width}w`).join(', ')}" sizes="${paired ? '(min-width: 700px) 440px, ' : ''}(min-width: 1000px) 920px, calc(100vw - 40px)" width="${photo.width}" height="${photo.height}" alt="${escapeHTML(photo.title)}" loading="lazy" decoding="async"><figcaption>${escapeHTML(photo.title)}${photo.credit ? ` <span>${escapeHTML(photo.credit)}</span>` : ''}</figcaption></figure>`;
  };
  const media = [
    ...p.detailImages.map((photo, index) => ({ photo, index, collection: 'detailImages' })),
    ...p.photos.map((photo, index) => ({ photo, index, collection: 'photos' })).filter(({ photo }) => !p.detailImages.some(detail => detail.src === photo.src))
  ];
  const sections = p.caseStudy.map((section, sectionIndex) => {
    const images = media.filter(({ collection, index }) => (p.mediaSections?.[collection]?.[index] ?? Math.max(0, p.caseStudy.length - 2)) === sectionIndex);
    return `<section class="project-part" aria-labelledby="section-${p.id}-${sectionIndex}">${placeholder(section.title)}<div class="glass"><h2 id="section-${p.id}-${sectionIndex}">${escapeHTML(section.title)}</h2>${prose(section.text)}</div>${images.length ? `<div class="media-group">${images.map(({ photo, collection, index }) => figure(photo, p.pairedMedia?.includes(`${collection}:${index}`))).join('')}</div>` : ''}</section>`;
  });
  return `<article class="case-study" aria-labelledby="project-title"><section class="project-part">${placeholder('overview')}<div class="glass project-introduction"><h1 id="project-title" tabindex="-1">${escapeHTML(p.title)}</h1><div class="project-context">${prose(p.context)}</div><h2>At a glance</h2>${prose(p.atAGlance)}</div><div class="media-group">${figure(p.hero)}</div></section>${sections.join('')}${p.video ? `<figure class="project-film"><iframe src="https://player.vimeo.com/video/${escapeHTML(p.video)}?dnt=1" title="${escapeHTML(p.title)} — project film" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe><figcaption>${escapeHTML(p.title)} — project film</figcaption></figure>` : ''}${p.credits || p.documentation ? `<section class="glass project-credits" aria-label="Credits"><h2>Credits</h2>${prose(p.credits || '')}${p.documentation ? `<p><a href="${escapeHTML(p.documentation)}">Project documentation</a></p>` : ''}</section>` : ''}</article>`;
}
