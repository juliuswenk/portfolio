// A lightweight 3D projection keeps this sketch dependency-free.
const $ = selector => document.querySelector(selector);
const tau = Math.PI * 2;
const projects = window.PORTFOLIO_PROJECTS.map((p,i,all)=>({...p,angle:i/all.length*tau}));
const count=projects.length;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageSizes={network:'(max-width:759px) 108px, 155px',preview:'88px',reading:'(min-width:1280px) 600px, (min-width:1000px) 50vw, 92vw'};
function imageSource(photo,context){
  if(context==='full')return `src="${escapeHTML(photo.src)}"`;
  const available=window.PORTFOLIO_MEDIA?.[photo.src]||[{src:photo.src,width:photo.width}];
  const small=available.filter(item=>item.width<=480);
  const variants=['network','preview'].includes(context)&&small.length?small:available;
  return `src="${escapeHTML(variants[0].src)}" srcset="${variants.map(item=>`${escapeHTML(item.src)} ${item.width}w`).join(', ')}" sizes="${imageSizes[context]}"`;
}
function picture(photo,context='reading',loading='lazy'){
  const source=imageSource(photo,context);
  return `<img ${(['reading','preview'].includes(context)||context==='network'&&innerWidth<1000)?source.replace(/(src|srcset|sizes)=/g,'data-$1='):source} data-original="${escapeHTML(photo.src)}" alt="${escapeHTML(photo.title)}" ${context==='reading'?`style="aspect-ratio:${photo.width}/${photo.height}"`: ""} width="${photo.width}" height="${photo.height}" loading="${loading}" decoding="async">`;
}
const caption=photo=>escapeHTML(photo.title)+(photo.credit?` <span class="credit">${escapeHTML(photo.credit)}</span>`:'');
const sharedSkills=(a,b)=>a.skills.filter(skill=>b.skills.includes(skill));
const connections=projects.flatMap((p,i)=>projects.slice(i+1).map((q,k)=>({a:i,b:i+k+1,skills:sharedSkills(p,q)}))).filter(edge=>edge.skills.length);
const routeSkills=[...new Set(connections.flatMap(edge=>edge.skills))].sort();
let selectedSkill='',previewProject=-1,previewTimer;
$('#project-total').textContent=String(count).padStart(2,'0');
$('#nodes').innerHTML=projects.map(p=>`<button class="node" data-project="${p.id}" aria-label="View ${escapeHTML(p.title)}"><span class="image">${picture(p.hero,'network','eager')}${p.hero.motion?`<video class="project-video-hero" data-webm="${escapeHTML(p.hero.motion.webm)}" data-hevc="${escapeHTML(p.hero.motion.hevc)}" data-frames="${p.hero.motion.frames}" data-fps="${p.hero.motion.fps}" muted playsinline preload="none" aria-hidden="true"></video>`:''}</span><span class="label"><small>${String(p.id).padStart(2,'0')}</small>${escapeHTML(p.title)}</span></button>`).join('');
const prose=text=>text.split(/\n\s*\n/).map(paragraph=>`<p>${escapeHTML(paragraph).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^\w])[_*]([^_*\n]+)[_*](?=\W|$)/g,'$1<em>$2</em>')}</p>`).join('');
const galleryImages=p=>[...p.detailImages.map((photo,index)=>({photo,index,collection:'detailImages'})),...p.photos.map((photo,index)=>({photo,index,collection:'photos'})).filter(({photo})=>!p.detailImages.some(detail=>detail.src===photo.src))];
function projectChapter(p) {
  const media=[], text=[];
  const figure=(photo,collection,index,order,hero=false)=>`<figure data-reading-order="${order}"${photo.transparent?' data-transparent="true"':''} class="reading-figure${hero?' reading-hero':p.pairedMedia?.includes(collection+':'+index)?' reading-paired':''}"><button class="detail-image${photo.motion?' turntable':''}" ${photo.motion?`data-project="${p.id}"`:`data-detail-project="${p.id-1}" data-detail-image="${index}" data-detail-collection="${collection}"`} aria-label="${photo.motion?'Rotate':'Enlarge'} ${escapeHTML(photo.title)}"><span class="image" style="aspect-ratio:${photo.width}/${photo.height}">${picture(photo)}</span></button><figcaption>${caption(photo)}</figcaption>${photo.motion?'<button class="optional-load" data-load-turntable hidden>Load interactive view</button><p class="media-status" id="turntable-status" role="status"></p><p class="media-hint">After one turn, move your pointer, drag, or use ← → to rotate.</p>':''}</figure>`;
  media.push(figure(p.hero,'hero',0,0,true));
  text.push(`<div class="project-introduction" data-reading-order="1"><p class="eyebrow">Selected work / ${String(p.id).padStart(2,'0')}</p><h2 id="title-${p.id}">${escapeHTML(p.title)}</h2><section class="project-section"><h3>At a glance</h3>${prose(p.atAGlance)}</section><div class="project-context">${prose(p.context)}</div></div>`);
  const narrative=p.caseStudy;
  narrative.forEach((section,i)=>text.push(`<section class="project-section" data-reading-order="${10+i*10}">${section.expandable?`<details><summary>${escapeHTML(section.title)}</summary><div class="implementation-copy">${prose(section.text)}</div></details>`:`<h3>${escapeHTML(section.title)}</h3>${prose(section.text)}`}</section>`));
  galleryImages(p).forEach(({photo,index,collection},i)=>{
    const section=p.mediaSections?.[collection]?.[index] ?? Math.max(0,narrative.length-2);
    media.push(figure(photo,collection,index,15+section*10+i/100));
  });
  if(p.video)media.push(`<figure class="reading-figure" data-reading-order="66"><div class="project-video"><iframe data-src="https://player.vimeo.com/video/${escapeHTML(p.video)}?dnt=1" title="${escapeHTML(p.title)} project film" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><figcaption>${escapeHTML(p.title)} — project film</figcaption></figure>`);
  media.sort((a,b)=>Number(a.match(/data-reading-order="([^"]+)/)[1])-Number(b.match(/data-reading-order="([^"]+)/)[1]));
  text.push(`<div class="project-extras" data-reading-order="1000"><h3 class="section-title">Skills</h3><div class="project-skills" aria-label="Skills in ${escapeHTML(p.title)}">${p.skills.map(skill=>routeSkills.includes(skill)?`<button class="skill-chip" data-skill="${escapeHTML(skill)}" aria-pressed="false">${escapeHTML(skill)}</button>`:`<span class="skill-chip">${escapeHTML(skill)}</span>`).join('')}</div>${p.credits?`<div class="project-description project-credits">${prose(p.credits)}</div>`:''}${p.documentation?`<a class="project-next" href="${escapeHTML(p.documentation)}">Project documentation</a>`:''}<div class="related-projects" id="related-${p.id}"></div></div>`);
  const onward=p.id===count?'<div class="project-onward" data-reading-order="2000"><a class="project-next" href="#overview">Return to overview</a></div>':'';
  return `<div class="network-passage" aria-hidden="true"></div><section class="chapter project-chapter" tabindex="-1" id="project-${p.id}" aria-labelledby="title-${p.id}"><article class="project-reading"><div class="reading-media">${media.join('')}</div><div class="reading-text">${text.join('')}</div>${onward}</article></section>`;
}
$('#chapters').innerHTML=projects.map(projectChapter).join('');
function loadFrame(frame){if(frame.dataset.src){frame.src=frame.dataset.src;delete frame.dataset.src;}}
const readingMedia=[...document.querySelectorAll('#chapters img,#chapters iframe')];
if(typeof IntersectionObserver!=='undefined'){
  const mediaObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    if(entry.target.tagName==='IFRAME')loadFrame(entry.target);
    else window.portfolioLoading?.hydrate(entry.target);
    mediaObserver.unobserve(entry.target);
  }),{rootMargin:'100% 0px'});
  readingMedia.forEach(media=>mediaObserver.observe(media));
}else readingMedia.forEach(media=>media.tagName==='IFRAME'?loadFrame(media):window.portfolioLoading?.hydrate(media));

// Move the same elements at the breakpoint so visual and assistive reading order agree.
const readingLayouts=[...document.querySelectorAll('#chapters .project-reading')].map(article=>{
  const media=article.querySelector('.reading-media'),text=article.querySelector('.reading-text');
  return {article,media,text,onward:article.querySelector('.project-onward'),images:[...media.children],copy:[...text.children],stacked:false};
});
let portraitStacked=false;
function layoutReading() {
  const stacked=innerWidth<1000;
  if(portraitStacked!==stacked){
    const character=$('#about-node'),controls=$('#avatar-controls');
    if(stacked)$('#opening-portrait').append(character,controls);
    else{$('#world').append(character);$('#about-avatar-controls').append(controls);}
    $('#return-overview').textContent=stacked?'Back to top':'Back to the network';
    $('#menu-overview').textContent=stacked?'Overview':'Network overview';
    portraitStacked=stacked;
  }
  readingLayouts.forEach(layout=>{
    if(layout.stacked===stacked)return;
    if(stacked){
      [...layout.images,...layout.copy,layout.onward].filter(Boolean).sort((a,b)=>Number(a.dataset.readingOrder)-Number(b.dataset.readingOrder)).forEach(item=>layout.article.append(item));
      layout.media.remove();layout.text.remove();
    }else{
      layout.images.forEach(item=>layout.media.append(item));layout.copy.forEach(item=>layout.text.append(item));
      layout.article.append(...[layout.media,layout.text,layout.onward].filter(Boolean));
    }
    layout.stacked=stacked;
  });
}
$('#project-index').innerHTML='<a href="#overview" aria-label="Network overview">○</a><a href="#about-section" aria-label="About me">●</a>'+projects.map(p=>`<a href="#project-${p.id}" aria-label="View ${escapeHTML(p.title)}">${String(p.id).padStart(2,'0')}</a>`).join('');
const cards=[...document.querySelectorAll('.node')],chapters=[...document.querySelectorAll('#chapters .chapter')],aboutChapter=$('#about-section'),chapterSections=[aboutChapter,...chapters],links=[...$('#project-index').children];
history.scrollRestoration='manual';
let pendingNavigation=null;
function cancelNavigation(){pendingNavigation=null;}
function settleNavigation(){
  if(!pendingNavigation)return;
  const target=$(pendingNavigation.hash);if(!target){cancelNavigation();return;}
  const anchor=innerWidth<1000?(target.querySelector('.reading-hero')||target):target;
  const top=Math.max(0,anchor.getBoundingClientRect().top+scrollY-(pendingNavigation.hash==='#overview'?0:innerWidth<1000?$('header').getBoundingClientRect().bottom+16:16));
  if(Math.abs(top-scrollY)>.5)window.scrollTo({top,behavior:'instant'});
  history.replaceState({portfolioScroll:scrollY},'');
}
function goTo(hash){
  const target=$(hash);if(!target)return;
  history.replaceState({portfolioScroll:scrollY},'');
  if(location.hash!==hash)history.pushState(null,'',hash);
  const navigation={hash};pendingNavigation=navigation;
  window.portfolioLoading?.hydrate(target.querySelector('.reading-hero img'));
  resize();target.focus?.({preventScroll:true});
  history.replaceState({portfolioScroll:scrollY},'');
  const finish=()=>requestAnimationFrame(()=>{
    if(pendingNavigation!==navigation)return;
    resize();
    requestAnimationFrame(()=>{
      if(pendingNavigation!==navigation)return;
      resize();pendingNavigation=null;
    });
  });
  const hero=target.querySelector('.reading-hero img');
  if(hero&&!hero.complete){hero.addEventListener('load',finish,{once:true});hero.addEventListener('error',finish,{once:true});}
  else finish();
}
// Layout may settle after navigation; real user input ends destination correction.
['wheel','touchstart','pointerdown','keydown'].forEach(name=>addEventListener(name,cancelNavigation,{passive:true}));
addEventListener('popstate',event=>{
  cancelNavigation();
  if(Number.isFinite(event.state?.portfolioScroll))window.scrollTo({top:event.state.portfolioScroll,behavior:'instant'});
  else if(/^#(?:overview|about-section|contact|project-\d+)$/.test(location.hash))goTo(location.hash);
  draw();
});
const impressum=$('#impressum');
$('#impressum-trigger').addEventListener('click',()=>impressum.showModal());
const projectMenu=$('#project-menu');
let menuTrigger,menuDestination=false;
$('#project-names').innerHTML=projects.map(p=>`<a href="#project-${p.id}"><span>${String(p.id).padStart(2,'0')}</span>${escapeHTML(p.title)}</a>`).join('');
document.querySelectorAll('.projects-trigger').forEach(button=>button.addEventListener('click',()=>{
  menuTrigger=button;menuDestination=false;projectMenu.showModal();button.setAttribute('aria-expanded','true');
}));
projectMenu.addEventListener('close',()=>{
  document.querySelectorAll('.projects-trigger').forEach(button=>button.setAttribute('aria-expanded','false'));
  if(!menuDestination){
    const trigger=menuTrigger?.getClientRects().length?menuTrigger:document.querySelector('header .projects-trigger');
    trigger?.focus({preventScroll:true});
  }
  menuDestination=false;
});
cards.forEach((card,i)=>card.addEventListener('click',()=>goTo(`#project-${i+1}`)));
document.addEventListener('click',event=>{
  const hash=event.target.closest?.('a')?.getAttribute('href');
  if(!/^#(?:overview|about-section|contact|project-\d+)$/.test(hash)||event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  if(projectMenu.open){menuDestination=true;projectMenu.close();}
  goTo(hash);
});
function setSkill(skill){
  const reading=active>=0?chapters[active]:null,previousTop=reading?.getBoundingClientRect().top;
  selectedSkill=skill;
  document.querySelectorAll('button[data-skill]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.skill===skill)));
  projects.forEach(p=>{const related=projects.filter(q=>q!==p&&sharedSkills(p,q).some(s=>!skill||s===skill));$('#related-'+p.id).innerHTML=related.length?'<h3>Continue through shared skills</h3>'+related.map(q=>`<a href="#project-${q.id}">${escapeHTML(q.title)}<span>${escapeHTML(sharedSkills(p,q).filter(s=>!skill||s===skill).join(' · '))}</span></a>`).join(''):'';});
  if(reading)window.scrollBy({top:reading.getBoundingClientRect().top-previousTop,behavior:'instant'});
  resize();
}
document.querySelectorAll('button[data-skill]').forEach(button=>button.addEventListener('click',()=>setSkill(selectedSkill===button.dataset.skill?'':button.dataset.skill)));
const networkMedia=projects.flatMap((p,projectIndex)=>[...p.photos.map((photo,photoIndex)=>({photo,projectIndex,photoIndex})),...(p.video?[{video:p.video,projectIndex,photoIndex:p.photos.length}]:[])]);
$('#supporting-images').innerHTML=networkMedia.map(({photo,video,projectIndex})=>video?`<button class="satellite video-preview" aria-label="View ${escapeHTML(projects[projectIndex].title)} video">${picture(projects[projectIndex].hero,'preview')}<iframe data-src="https://player.vimeo.com/video/${escapeHTML(video)}?background=1&amp;autopause=0&amp;dnt=1" title="${escapeHTML(projects[projectIndex].title)} video preview" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" tabindex="-1" aria-hidden="true"></iframe></button>`:`<button class="satellite" aria-label="Open ${escapeHTML(projects[projectIndex].title)}, ${escapeHTML(photo.title)}">${picture(photo,'preview')}</button>`).join('');
const photoCards=[...document.querySelectorAll('.satellite')];
cards.forEach((card,i)=>{
  let previous=card;
  photoCards.forEach((photo,k)=>{if(networkMedia[k].projectIndex===i){previous.after(photo);previous=photo;}});
});
function preview(index){
  clearTimeout(previewTimer);previewProject=index;
  $('#network-skills').textContent=index<0?'':projects[index].title+' · '+[...new Set(connections.filter(edge=>edge.a===index||edge.b===index).flatMap(edge=>edge.skills))].join(' · ');
  if(index>=0)photoCards.forEach((card,k)=>{
    if(networkMedia[k].projectIndex!==index)return;
    window.portfolioLoading?.hydrate(card.querySelector('img'));
  });
  draw();
}
function closePreview(){previewTimer=setTimeout(()=>{
  const focused=document.activeElement;
  if(focused===cards[previewProject]||photoCards.some((card,k)=>card===focused&&networkMedia[k].projectIndex===previewProject))return;
  preview(-1);
},250);}
[...cards,...photoCards].forEach((card,k)=>{
  const index=k<cards.length?k:networkMedia[k-cards.length].projectIndex;
  card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&matchMedia('(hover: hover)').matches)preview(index);});
  card.addEventListener('pointerleave',closePreview);
  card.addEventListener('focus',()=>preview(index));
  card.addEventListener('blur',closePreview);
});

let galleryProject=0,galleryPhoto=0,galleryPhotos=[],photoTrigger;
function renderPhoto(){const photo=galleryPhotos[galleryPhoto];$('#photo-project').textContent=projects[galleryProject].title;$('#photo-title').textContent=photo.title;$('#photo-large').innerHTML=picture(photo,'full','eager');$('#photo-credit').textContent=photo.credit||'';$('#photo-count').textContent=`${galleryPhoto+1} / ${galleryPhotos.length}`;}
function openPhoto(projectIndex,collection,index,trigger=document.activeElement){photoTrigger=trigger;galleryProject=projectIndex;galleryPhotos=collection==='hero'?[projects[projectIndex].hero]:projects[projectIndex][collection];galleryPhoto=index;renderPhoto();$('#photo-viewer').showModal();}
photoCards.forEach((card,i)=>card.addEventListener('click',event=>{const item=networkMedia[i];if(item.video)document.querySelector(`#project-${projects[item.projectIndex].id} .project-video`).scrollIntoView({behavior:'smooth',block:'center'});else openPhoto(item.projectIndex,'photos',item.photoIndex,event.currentTarget);}));
document.querySelectorAll('[data-detail-project]').forEach(button=>button.addEventListener('click',()=>openPhoto(Number(button.dataset.detailProject),button.dataset.detailCollection,Number(button.dataset.detailImage),button)));
$('#photo-viewer').addEventListener('close',()=>{
  const target=photoTrigger?.isConnected&&photoTrigger.getAttribute('aria-hidden')!=='true'?photoTrigger:$(active>=0?'#project-'+(active+1):'#overview');
  target?.focus({preventScroll:true});
});
$('#photo-prev').addEventListener('click',()=>{galleryPhoto=(galleryPhoto-1+galleryPhotos.length)%galleryPhotos.length;renderPhoto();});
$('#photo-next').addEventListener('click',()=>{galleryPhoto=(galleryPhoto+1)%galleryPhotos.length;renderPhoto();});
document.querySelectorAll('.about-trigger').forEach(button=>button.addEventListener('click',()=>goTo('#about-section')));
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let still = preference.matches;
function setStill(value) {still=value; document.body.classList.toggle('still',still); $('#motion').setAttribute('aria-pressed', String(still)); $('#motion').textContent=still?'Motion view':'Still view'; draw();}
$('#motion').addEventListener('click', () => setStill(!still));
preference.addEventListener('change', e => setStill(e.matches));
const canvas=$('#network'), ctx=canvas.getContext('2d');
let width=innerWidth,height=innerHeight,active=-2,aboutActive=false,chapterStops=[];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=t=>t*t*(3-2*t);
let seed=27;
const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const points=Array.from({length:260},()=>{const u=random()*tau,v=random()*tau,tube=22+random()*56,r=310+Math.cos(v)*tube;return {x:Math.cos(u)*r,y:Math.sin(v)*tube+(random()-.5)*35,z:Math.sin(u)*r};});
// ponytail: bounded pair scan for 260 points; use a spatial grid if node counts grow substantially.
const edges=[];
points.forEach((p,i)=>{for(let j=i+1;j<points.length;j++){const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z);if(d<95)edges.push([i,j]);}});
const anchors=projects.map(p=>({x:Math.cos(p.angle)*315,y:Math.sin(p.angle*3)*27,z:Math.sin(p.angle)*315}));
const about={x:0,y:105,z:0};
function rotate(p,yaw,pitch=.54){
  const x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw);
  const y=p.y*Math.cos(pitch)-z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+z*Math.cos(pitch);
  const side=.16,roll=.12,turnedX=x*Math.cos(side)-depth*Math.sin(side);
  return {x:turnedX*Math.cos(roll)-y*Math.sin(roll),y:turnedX*Math.sin(roll)+y*Math.cos(roll),z:x*Math.sin(side)+depth*Math.cos(side)};
}
let projectEntries=[],protection=[],aboutFrame=null,desktopOverview=null,endingStart=Infinity;
let networkPlacement=[];
const mix=(a,b,t)=>a+(b-a)*t;
function screenPoint(point,pose){
  const q=rotate(point,pose.yaw),scale=1000/Math.max(300,1000+q.z)*pose.zoom;
  return {x:pose.x+q.x*scale,y:pose.y-q.y*scale,s:scale,z:q.z};
}
function fitDesktopOverview(){
  const projected=[...points,...anchors,about].map(point=>screenPoint(point,{x:0,y:0,yaw:.33,zoom:1}));
  const xs=projected.map(point=>point.x),ys=projected.map(point=>point.y);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const left=width*.28,right=width*.96,top=$('header').getBoundingClientRect().bottom+24,bottom=$('footer').getBoundingClientRect().top-24;
  // Include room for project images and captions beyond the network's outer points.
  const zoom=Math.max(.05,Math.min((right-left-160)/(maxX-minX),(bottom-top-160)/(maxY-minY)));
  return {x:(left+right)/2-(minX+maxX)/2*zoom,y:(top+bottom)/2-(minY+maxY)/2*zoom,yaw:.33,zoom};
}
function registeredPose(index){
  const entry=projectEntries[index],yaw=-Math.PI/2-projects[index].angle;
  const pose={x:0,y:0,yaw,zoom:Math.min(width/1050,height/700)*1.2};
  const point=screenPoint(anchors[index],pose);
  pose.x=entry.x-point.x;pose.y=entry.y-point.y;
  return pose;
}
function blendPose(a,b,t){return {x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),yaw:mix(a.yaw,b.yaw,t),zoom:mix(a.zoom,b.zoom,t)};}
function networkScene(y){
  if(width<1000){
    const current=projectEntries.findLastIndex(entry=>y+$('header').getBoundingClientRect().bottom>=entry.open-1);
    const phase=y>=endingStart?'ending':current>=0?'reading':y>=chapterStops[0]?'about':'overview';
    return {phase,current,progress:1,pose:{x:0,y:0,yaw:.33,zoom:1}};
  }
  const overview=desktopOverview||{x:width*.59,y:height*.46,yaw:.33,zoom:Math.min(width/1120,height/720)};
  const aboutPose={x:width*(width<1000?.5:.34),y:height*.63,yaw:.33,zoom:Math.min(width/1000,height/720)};
  // Native anchor scrolling can settle a fraction of a CSS pixel before the stop.
  let current=projectEntries.findLastIndex(entry=>y>=entry.open-1);
  const incoming=projectEntries.findIndex(entry=>y<entry.open-1);
  if(incoming>=0&&y>=projectEntries[incoming].start){
    const entry=projectEntries[incoming],progress=clamp((y-entry.start)/(entry.open-entry.start));
    const from=incoming?registeredPose(incoming-1):aboutPose,to=registeredPose(incoming);
    const middle={x:width*.5,y:height*.48,yaw:mix(from.yaw,to.yaw,.5),zoom:Math.min(width/1350,height/950)};
    const pose=still?to:progress<.5?blendPose(from,middle,smooth(progress*2)):blendPose(middle,to,smooth(progress*2-1));
    return {phase:'transition',current:incoming,progress,pose};
  }
  if(current>=0)return {phase:y>=endingStart?'ending':'reading',current,progress:1,pose:registeredPose(current)};
  const aboutStart=chapterStops[0],t=still?1:smooth(clamp((y-aboutStart)/(height*.5)));
  return {phase:y>=aboutStart?'about':'overview',current:-1,progress:t,pose:y>=aboutStart?blendPose(overview,aboutPose,t):overview};
}
function cardSize(card){
  const css=getComputedStyle(card),image=card.querySelector('.image'),imageCss=image&&getComputedStyle(image);
  return {w:parseFloat(css.width)||card.offsetWidth,h:parseFloat(css.height)||card.offsetHeight,imageW:parseFloat(imageCss?.width)||card.offsetWidth,imageH:parseFloat(imageCss?.height)||card.offsetHeight};
}
function drawCompact(scene){
  const {phase,current}=scene,character=$('#about-node');
  const rect=character.getBoundingClientRect(),headerBottom=$('header').getBoundingClientRect().bottom;
  const visible=rect.bottom>headerBottom&&rect.top<height;
  document.body.dataset.networkPhase=phase;
  document.body.classList.toggle('reading-project',phase==='reading');
  document.body.classList.remove('network-transition','previewing-project');
  character.classList.remove('about-portrait');
  character.style.width='';character.style.height='';character.style.transform='';character.style.opacity='1';character.style.visibility='visible';
  character.tabIndex=-1;character.setAttribute('aria-hidden','true');
  [...cards,...photoCards].forEach(card=>{card.tabIndex=-1;card.setAttribute('aria-hidden','true');});
  chapters.forEach(chapter=>{chapter.classList.remove('is-arriving');const hero=chapter.querySelector('.reading-hero');if(hero)hero.inert=false;});
  window.aboutNetworkPose={yaw:.33,focused:visible,portrait:true,compact:true,hidden:!visible};
  window.projectNetworkPose={...scene.pose,projectId:current>=0?projects[current].id:null,overview:phase==='overview',phase,progress:1,compact:true};
  active=current;aboutActive=phase==='about';
  document.title=(current>=0&&phase!=='ending'?projects[current].title+' — ':phase==='about'?'About — ':phase==='ending'?'Contact — ':'')+'Julius Wenk: Portfolio';
  dispatchEvent(new Event('networkpose'));
}
function draw(){
  if(width<1000){drawCompact(networkScene(scrollY));return;}
  cards.forEach(card=>window.portfolioLoading?.hydrate(card.querySelector('img')));
  const mobile=width<760,scene=networkScene(scrollY),{phase,current,pose}=scene;
  if(current>=0){
    const image=cards[current].querySelector('img');
    if(image&&!image.dataset.upgraded){
      const variants=window.PORTFOLIO_MEDIA?.[projects[current].hero.src];
      if(variants){image.sizes=imageSizes.reading;image.srcset=variants.map(item=>`${item.src} ${item.width}w`).join(', ');}
      image.dataset.upgraded='true';
    }
  }
  const reading=phase==='reading',transition=phase==='transition',inProject=current>=0;
  document.body.classList.toggle('reading-project',reading);
  document.body.classList.toggle('network-transition',transition);
  document.body.classList.toggle('previewing-project',previewProject>=0);
  document.body.dataset.networkPhase=phase;
  const currentProtection=(reading||phase==='about'||phase==='overview')?protection.map(rect=>({...rect,top:rect.top-scrollY,bottom:rect.bottom-scrollY})).filter(rect=>rect.bottom>0&&rect.top<height):[];
  const headerBottom=$('header').getBoundingClientRect().bottom;
  const footerTop=$('footer').getBoundingClientRect().top;
  const portrait=phase==='about'&&width>=1000;
  const avatarFrame=portrait&&aboutFrame?{x:aboutFrame.x,y:(headerBottom+footerTop)/2,w:Math.max(aboutFrame.w,(footerTop-headerBottom-32)*.85),h:Math.max(180,footerTop-headerBottom-32)}:aboutFrame&&{...aboutFrame,y:aboutFrame.y-scrollY};
  const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  const imageSize=mobile?1:.7;
  cards.forEach(card=>card.style.setProperty('--image-scale',imageSize));
  photoCards.forEach(card=>card.style.setProperty('--image-scale',imageSize));
  const items=anchors.map((anchor,i)=>{
    const point=screenPoint(anchor,pose),card=cards[i],size=cardSize(card);
    let scale=clamp(point.s,mobile?.8:.55,mobile?1:1.1);
    if(i===current){
      const entry=projectEntries[i],ratio=projects[i].hero.width/projects[i].hero.height;
      const visualWidth=Math.min(entry.w,entry.h*ratio);
      const fullScale=visualWidth/Math.max(1,size.imageW);
      scale=transition&&!still?mix(scale,fullScale,smooth(clamp((scene.progress-.45)/.55))):fullScale;
    }
    // Nodes are centred on their image; their caption sits below that anchor.
    const x=point.x+(size.w-size.imageW)/2*scale,y=point.y+(size.h-size.imageH)/2*scale;
    return {card,x,y,w:size.w*scale,h:size.h*scale,scale,index:i,hero:true,anchor:point};
  });
  networkMedia.forEach(({projectIndex,photoIndex},k)=>{
    if(projectIndex!==previewProject||projectIndex===current&&inProject)return;
    const angle=projects[projectIndex].angle,anchor=anchors[projectIndex],orbit=(photoIndex+.5)/(projects[projectIndex].photos.length+1)*tau;
    const point=screenPoint({x:anchor.x-Math.sin(angle)*Math.sin(orbit)*140,y:anchor.y+Math.cos(orbit)*110,z:anchor.z+Math.cos(angle)*Math.sin(orbit)*140},pose);
    const card=photoCards[k],scale=clamp(point.s,.55,1.2);
    items.push({card,x:point.x,y:point.y,w:card.offsetWidth*scale,h:card.offsetHeight*scale,scale,index:projectIndex,hero:false,anchor:point});
  });
  const selected=items.find(item=>item.hero&&item.index===current);
  const context=items.filter(item=>item!==selected);
  const avatarProtection=phase==='about'&&avatarFrame?{left:avatarFrame.x-avatarFrame.w*.34,right:avatarFrame.x+avatarFrame.w*.34,top:avatarFrame.y-avatarFrame.h/2-12,bottom:avatarFrame.y+avatarFrame.h/2+12}:null;
  if(avatarProtection)currentProtection.push(avatarProtection);
  const placed=context;
  if(selected)placed.push(selected);
  networkPlacement=placed;
  const heroes=new Map(placed.filter(item=>item.hero).map(item=>[item.index,item]));
  ctx.clearRect(0,0,width,height);
  const projected=points.map(point=>screenPoint(point,pose));
  ctx.lineWidth=.65;
  const atmosphere=reading?.55:1;
  for(let i=0;i<edges.length;i++){
    if(mobile&&i%3)continue;
    const [a,b]=edges[i],p=projected[a],q=projected[b];
    ctx.strokeStyle=`rgba(164,173,177,${(.12+.1*clamp((p.z+390)/780))*atmosphere})`;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
  }
  for(let i=0;i<projected.length;i++){
    if(mobile&&i%2)continue;
    const point=projected[i];ctx.fillStyle=`rgba(187,193,194,${.35*atmosphere})`;
    ctx.beginPath();ctx.arc(point.x,point.y,.8,0,tau);ctx.fill();
  }
  const exposedCards=new Set();
  placed.forEach(item=>{
    const {card,x,y,scale}=item;
    const rect={left:x-item.w/2,right:x+item.w/2,top:y-item.h/2,bottom:y+item.h/2};
    const visible=!((reading||phase==='ending')&&item.hero&&item.index===current);
    const exposed=visible&&phase!=='ending'&&rect.right>0&&rect.left<width&&rect.bottom>headerBottom&&rect.top<footerTop;
    const covered=currentProtection.some(panel=>overlaps(rect,panel));
    card.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`;
    card.style.visibility=visible?'visible':'hidden';
    card.style.pointerEvents=exposed?'auto':'none';card.tabIndex=exposed?0:-1;card.setAttribute('aria-hidden',String(!exposed));
    card.classList.toggle('landing',transition&&item.hero&&item.index===current);
    card.style.opacity=String(item.index===current?1:covered?.18:selectedSkill&&!projects[item.index].skills.includes(selectedSkill)?.2:reading?(item.hero?.48:.35):phase==='about'?.65:1);
    card.style.zIndex=String(item.index===current?1900:item.index===previewProject?1800:500);
    exposedCards.add(card);
  });
  photoCards.forEach(card=>{
    if(!exposedCards.has(card)){card.style.visibility='hidden';card.style.pointerEvents='none';card.tabIndex=-1;card.setAttribute('aria-hidden','true');}
    const frame=card.querySelector('iframe');
    if(!frame)return;
    const play=exposedCards.has(card)&&card.style.pointerEvents==='auto'&&!window.portfolioLoading?.restricted();
    if(play)loadFrame(frame);
    else if(frame.getAttribute('src')){
      frame.dataset.src=frame.getAttribute('src');frame.removeAttribute('src');
    }
  });
  connections.forEach(edge=>{
    if(selectedSkill&&!edge.skills.includes(selectedSkill))return;
    const a=heroes.get(edge.a),b=heroes.get(edge.b);
    if(!a||!b)return;
    const activeEdge=edge.a===current||edge.b===current;
    const start=activeEdge&&edge.a===current?screenPoint(anchors[edge.a],pose):a;
    const end=activeEdge&&edge.b===current?screenPoint(anchors[edge.b],pose):b;
    ctx.strokeStyle=activeEdge?'rgba(61,115,255,.6)':reading?'rgba(61,115,255,.2)':'rgba(61,115,255,.3)';
    ctx.lineWidth=activeEdge?1.4:.8;
    ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.quadraticCurveTo((start.x+end.x)/2,(start.y+end.y)/2-35,end.x,end.y);ctx.stroke();
  });
  if(reading){
    const point=screenPoint(anchors[current],pose);
    ctx.strokeStyle='#83a5ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(point.x,point.y,5,0,tau);ctx.stroke();
  }
  const character=$('#about-node'),aboutPoint=screenPoint(about,pose),showingAbout=phase==='about';
  const characterPoint=showingAbout&&avatarFrame?avatarFrame:aboutPoint;
  const showAbout=!inProject&&(!showingAbout||characterPoint.y+(avatarFrame?.h||116)/2>headerBottom&&characterPoint.y-(avatarFrame?.h||116)/2<footerTop);
  character.style.setProperty('--about-width-growth','0px');character.style.setProperty('--about-height-growth','0px');
  character.classList.toggle('about-portrait',portrait);
  character.style.width=showingAbout&&avatarFrame?avatarFrame.w+'px':'';
  character.style.height=showingAbout&&avatarFrame?avatarFrame.h+'px':'';
  character.style.transform=`translate(${characterPoint.x}px,${characterPoint.y}px) translate(-50%,-50%)`;
  character.style.visibility='visible';character.style.opacity=showAbout?'1':'0';character.style.pointerEvents=showAbout?'auto':'none';character.tabIndex=showAbout?0:-1;character.setAttribute('aria-hidden',String(!showAbout));
  chapters.forEach((chapter,i)=>{
    chapter.classList.toggle('is-active',i===current);
    chapter.classList.toggle('is-arriving',transition&&i===current);
    const hero=chapter.querySelector('.reading-hero');
    if(hero)hero.inert=transition&&i===current;
  });
  aboutChapter.classList.toggle('is-active',showingAbout);
  window.aboutNetworkPose={yaw:pose.yaw,focused:showingAbout,portrait,hidden:!showAbout};
  window.projectNetworkPose={...pose,projectId:current>=0?projects[current].id:null,overview:phase==='overview',phase,progress:scene.progress};
  dispatchEvent(new Event('networkpose'));
  if(current!==active||showingAbout!==aboutActive){
    active=current;aboutActive=showingAbout;
    cards.forEach((card,i)=>card.classList.toggle('active',i===current));
    const activeLink=showingAbout?1:current<0?0:current+2;
    links.forEach((link,i)=>{link.classList.toggle('active',i===activeLink);if(i===activeLink)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    $('#view-number').textContent=showingAbout?'00':String(current+1).padStart(2,'0');
  }
  const viewTitle=phase==='ending'?'Contact':transition?'Connecting / '+projects[current].title:showingAbout?'About me':current<0?'Network overview':projects[current].title;
  $('#view-name').textContent=viewTitle;
  document.title=(current>=0&&phase!=='ending'?projects[current].title+' — ':phase==='about'?'About — ':phase==='ending'?'Contact — ':'')+'Julius Wenk: Portfolio';
  $('#progress-bar').style.width=`${clamp(scrollY/(document.documentElement.scrollHeight-height))*100}%`;
}
function resize(){
  layoutReading();width=innerWidth;height=innerHeight;
  chapterStops=chapterSections.map(chapter=>chapter.getBoundingClientRect().top+scrollY-height*.24);
  projectEntries=chapters.map(chapter=>{
    const section=chapter.getBoundingClientRect(),hero=chapter.querySelector('.reading-hero .image')?.getBoundingClientRect();
    const open=Math.round(section.top+scrollY-16);
    return {open,start:open-height*.82,x:hero?hero.left+hero.width/2:width*.28,y:hero?hero.top-section.top+16+hero.height/2:height*.45,w:hero?.width||width*.42,h:hero?.height||height*.6};
  });
  protection=[...document.querySelectorAll('.reading-text,.project-reading>.project-introduction,.project-reading>.project-section,.project-reading>.project-extras,.reading-figure,.project-onward,.about-copy,.ending .project-description,.intro-copy')].map(element=>{
    const rect=element.getBoundingClientRect();return {left:rect.left-16,right:rect.right+16,top:rect.top+scrollY-16,bottom:rect.bottom+scrollY+16};
  });
  const avatar=$('#about-avatar-space').getBoundingClientRect();
  aboutFrame={x:avatar.left+avatar.width/2,y:avatar.top+scrollY+avatar.height/2,w:avatar.width,h:avatar.height};
  if(width>=1000)desktopOverview=fitDesktopOverview();
  endingStart=$('#contact').getBoundingClientRect().top+scrollY-height*.3;
  settleNavigation();
  if(width>=1000){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  draw();
}
let scheduled=false;
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{draw();scheduled=false;});}},{passive:true});
addEventListener('resize',resize);
// Images and text can change section heights after the initial measurement.
if(typeof ResizeObserver!=='undefined'){const layoutObserver=new ResizeObserver(resize);chapterSections.forEach(chapter=>layoutObserver.observe(chapter));}
// Text protection changes even when the media column keeps the chapter height unchanged.
document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{cancelNavigation();resize();}));
setSkill('');setStill(still);
// Project sections are generated above, so resolve incoming project links after they exist.
if (/^#(?:overview|about-section|contact|project-\d+)$/.test(location.hash)&&$(location.hash)) requestAnimationFrame(() => goTo(location.hash));

// Image and model sizes can settle after the first camera frame.
document.querySelectorAll('#world img').forEach(image=>image.addEventListener('load',draw));
if(typeof ResizeObserver!=='undefined'){const cardObserver=new ResizeObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;draw();});}});[...cards,...photoCards,$('#about-node')].forEach(card=>cardObserver.observe(card));}

requestAnimationFrame(()=>window.portfolioLoading?.ready());
