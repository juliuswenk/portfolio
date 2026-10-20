// A lightweight 3D projection keeps this sketch dependency-free.
const $ = selector => document.querySelector(selector);
const tau = Math.PI * 2;
const projects = window.PORTFOLIO_PROJECTS.map((p,i,all)=>({...p,angle:i/all.length*tau}));
const count=projects.length;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const picture=(photo,loading='lazy')=>`<img src="${escapeHTML(photo.src)}" alt="${escapeHTML(photo.title)}" width="${photo.width}" height="${photo.height}" loading="${loading}" decoding="async">`;
const caption=photo=>escapeHTML(photo.title)+(photo.credit?` <span class="credit">${escapeHTML(photo.credit)}</span>`:'');
const sharedSkills=(a,b)=>a.skills.filter(skill=>b.skills.includes(skill));
const connections=projects.flatMap((p,i)=>projects.slice(i+1).map((q,k)=>({a:i,b:i+k+1,skills:sharedSkills(p,q)}))).filter(edge=>edge.skills.length);
const routeSkills=[...new Set(connections.flatMap(edge=>edge.skills))].sort();
let selectedSkill='',previewProject=-1,previewTimer;
$('#project-total').textContent=String(count).padStart(2,'0');
$('#nodes').innerHTML=projects.map(p=>`<button class="node" data-project="${p.id}" aria-label="View ${escapeHTML(p.title)}"><span class="image">${picture(p.hero,'eager')}${p.hero.motion?`<video class="project-video-hero" data-webm="${escapeHTML(p.hero.motion.webm)}" data-hevc="${escapeHTML(p.hero.motion.hevc)}" data-frames="${p.hero.motion.frames}" data-fps="${p.hero.motion.fps}" muted playsinline preload="auto" aria-hidden="true"></video>`:''}</span><span class="label"><small>${String(p.id).padStart(2,'0')}</small>${escapeHTML(p.title)}</span></button>`).join('');
const prose=text=>text.split(/\n\s*\n/).map(paragraph=>`<p>${escapeHTML(paragraph).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^\w])[_*]([^_*\n]+)[_*](?=\W|$)/g,'$1<em>$2</em>')}</p>`).join('');
const facts=p=>[['Format',p.discipline],['Context',p.context],['My role',p.role],['Collaborators',p.collaborators]].filter(([,value])=>value).map(([label,value])=>`<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`).join('');
const galleryImages=p=>[...p.detailImages.map((photo,index)=>({photo,index,collection:'detailImages'})),...p.photos.map((photo,index)=>({photo,index,collection:'photos'})).filter(({photo})=>!p.detailImages.some(detail=>detail.src===photo.src))];
function projectChapter(p) {
  const media=[], text=[];
  const figure=(photo,collection,index,order,hero=false)=>`<figure data-reading-order="${order}" class="reading-figure${hero?' reading-hero':''}"><button class="detail-image${photo.motion?' turntable':''}" ${photo.motion?`data-project="${p.id}"`:`data-detail-project="${p.id-1}" data-detail-image="${index}" data-detail-collection="${collection}"`} aria-label="${photo.motion?'Rotate':'Enlarge'} ${escapeHTML(photo.title)}"><span class="image">${picture(photo)}</span></button><figcaption>${caption(photo)}</figcaption>${photo.motion?'<p class="media-hint">After one turn, move your pointer, drag, or use ← → to rotate.</p>':''}</figure>`;
  media.push(figure(p.hero,'hero',0,0,true));
  text.push(`<div class="project-introduction" data-reading-order="1"><p class="eyebrow">Selected work / ${String(p.id).padStart(2,'0')}</p><h2 id="title-${p.id}">${escapeHTML(p.title)}</h2><section class="project-section"><h3>At a glance</h3>${prose(p.atAGlance)}</section>${p.description?`<div class="project-description">${prose(p.description)}</div>`:`<div class="summary">${prose(p.summary)}</div>`}</div>`);
  const narrative=p.caseStudy || [['Format & context',null],['Process',p.process]].filter(([,value],i)=>i===0||value).map(([title,value])=>({title,text:value}));
  narrative.forEach((section,i)=>text.push(`<section class="project-section" data-reading-order="${10+i*10}"><h3>${escapeHTML(section.title)}</h3>${section.text?prose(section.text):`<dl class="project-meta">${facts(p)}</dl>`}</section>`));
  galleryImages(p).forEach(({photo,index,collection},i)=>{
    const section=p.mediaSections?.[collection]?.[index] ?? Math.max(0,narrative.length-2);
    media.push(figure(photo,collection,index,15+section*10+i/100));
  });
  if(p.video)media.push(`<figure class="reading-figure" data-reading-order="66"><div class="project-video"><iframe src="https://player.vimeo.com/video/${escapeHTML(p.video)}?dnt=1" title="${escapeHTML(p.title)} project film" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><figcaption>${escapeHTML(p.title)} — project film</figcaption></figure>`);
  media.sort((a,b)=>Number(a.match(/data-reading-order="([^"]+)/)[1])-Number(b.match(/data-reading-order="([^"]+)/)[1]));
  text.push(`<div class="project-extras" data-reading-order="1000"><h3 class="section-title">Skills</h3><div class="project-skills" aria-label="Skills in ${escapeHTML(p.title)}">${p.skills.map(skill=>routeSkills.includes(skill)?`<button class="skill-chip" data-skill="${escapeHTML(skill)}" aria-pressed="false">${escapeHTML(skill)}</button>`:`<span class="skill-chip">${escapeHTML(skill)}</span>`).join('')||'<p class="placeholder-note">Skills pending project description.</p>'}</div>${p.skillEvidence?`<div class="project-description">${prose(p.skillEvidence)}</div>`:''}${p.documentation?`<a class="project-next" href="${escapeHTML(p.documentation)}">Project documentation</a>`:''}<div class="related-projects" id="related-${p.id}"></div><a class="project-next" href="${p.id===count?'#overview':'#project-'+(p.id+1)}">${p.id===count?'Return to overview':'Next project'}</a></div>`);
  return `<div class="network-passage" aria-hidden="true"></div><section class="chapter project-chapter" tabindex="-1" id="project-${p.id}" aria-labelledby="title-${p.id}"><article class="project-reading"><div class="reading-media">${media.join('')}</div><div class="reading-text">${text.join('')}</div></article></section>`;
}
$('#chapters').innerHTML=projects.map(projectChapter).join('');
// Move the same elements at the breakpoint so visual and assistive reading order agree.
const readingLayouts=[...document.querySelectorAll('.project-reading')].map(article=>{
  const media=article.querySelector('.reading-media'),text=article.querySelector('.reading-text');
  return {article,media,text,images:[...media.children],copy:[...text.children],stacked:false};
});
function layoutReading() {
  const stacked=innerWidth<1000;
  readingLayouts.forEach(layout=>{
    if(layout.stacked===stacked)return;
    if(stacked){
      [...layout.images,...layout.copy].sort((a,b)=>Number(a.dataset.readingOrder)-Number(b.dataset.readingOrder)).forEach(item=>layout.article.append(item));
      layout.media.remove();layout.text.remove();
    }else{
      layout.images.forEach(item=>layout.media.append(item));layout.copy.forEach(item=>layout.text.append(item));
      layout.article.append(layout.media,layout.text);
    }
    layout.stacked=stacked;
  });
}
$('#project-index').innerHTML='<a href="#overview" aria-label="Network overview">○</a><a href="#about-section" aria-label="About me">●</a>'+projects.map(p=>`<a href="#project-${p.id}" aria-label="View ${escapeHTML(p.title)}">${String(p.id).padStart(2,'0')}</a>`).join('');
const cards=[...document.querySelectorAll('.node')],chapters=[...document.querySelectorAll('#chapters .chapter')],aboutChapter=$('#about-section'),chapterSections=[aboutChapter,...chapters],links=[...$('#project-index').children];
history.scrollRestoration='manual';
function goTo(hash){
  const target=$(hash);if(!target)return;
  history.replaceState({portfolioScroll:scrollY},'');
  if(location.hash!==hash)history.pushState(null,'',hash);
  target.scrollIntoView({behavior:'instant',block:'start'});target.focus?.({preventScroll:true});
  history.replaceState({portfolioScroll:scrollY},'');draw();
}
addEventListener('popstate',event=>{
  if(Number.isFinite(event.state?.portfolioScroll))window.scrollTo({top:event.state.portfolioScroll,behavior:'instant'});
  else if(/^#(?:overview|about-section|project-\d+)$/.test(location.hash))$(location.hash)?.scrollIntoView({behavior:'instant'});
  draw();
});
cards.forEach((card,i)=>card.addEventListener('click',()=>goTo(`#project-${i+1}`)));
document.addEventListener('click',event=>{
  const hash=event.target.closest?.('a')?.getAttribute('href');
  if(!/^#(?:overview|about-section|project-\d+)$/.test(hash)||event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();goTo(hash);
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
$('#supporting-images').innerHTML=networkMedia.map(({photo,video,projectIndex})=>video?`<button class="satellite video-preview" aria-label="View ${escapeHTML(projects[projectIndex].title)} video"><img src="${escapeHTML(projects[projectIndex].hero.src)}" alt="" loading="lazy"><iframe src="https://player.vimeo.com/video/${escapeHTML(video)}?background=1&amp;autopause=0&amp;dnt=1" title="${escapeHTML(projects[projectIndex].title)} video preview" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" tabindex="-1" aria-hidden="true"></iframe></button>`:`<button class="satellite" aria-label="Open ${escapeHTML(projects[projectIndex].title)}, ${escapeHTML(photo.title)}">${picture(photo)}</button>`).join('');
const photoCards=[...document.querySelectorAll('.satellite')];
cards.forEach((card,i)=>{
  let previous=card;
  photoCards.forEach((photo,k)=>{if(networkMedia[k].projectIndex===i){previous.after(photo);previous=photo;}});
});
function preview(index){clearTimeout(previewTimer);previewProject=index;draw();}
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

let galleryProject=0,galleryPhoto=0,galleryPhotos=[];
function renderPhoto(){const photo=galleryPhotos[galleryPhoto];$('#photo-project').textContent=projects[galleryProject].title;$('#photo-title').textContent=photo.title;$('#photo-large').innerHTML=picture(photo,'eager');$('#photo-credit').textContent=photo.credit||'';$('#photo-count').textContent=`${galleryPhoto+1} / ${galleryPhotos.length}`;}
function openPhoto(projectIndex,collection,index){galleryProject=projectIndex;galleryPhotos=collection==='hero'?[projects[projectIndex].hero]:projects[projectIndex][collection];galleryPhoto=index;renderPhoto();$('#photo-viewer').showModal();}
photoCards.forEach((card,i)=>card.addEventListener('click',()=>{const item=networkMedia[i];if(item.video)document.querySelector(`#project-${projects[item.projectIndex].id} .project-video`).scrollIntoView({behavior:'smooth',block:'center'});else openPhoto(item.projectIndex,'photos',item.photoIndex);}));
document.querySelectorAll('[data-detail-project]').forEach(button=>button.addEventListener('click',()=>openPhoto(Number(button.dataset.detailProject),button.dataset.detailCollection,Number(button.dataset.detailImage))));
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
// Only network cards (including their labels) reserve space; the world may extend offscreen.
function placeNetwork(items, gap, bounds={},obstacles=[]){
  const {left=-Infinity,right=Infinity,top=-Infinity,bottom=Infinity}=bounds;
  const occupied=[...obstacles];
  const overlaps=(a,b)=>a.left<b.right+gap&&a.right+gap>b.left&&a.top<b.bottom+gap&&a.bottom+gap>b.top;
  return items.map(item=>{
    const halfW=item.w/2,halfH=item.h/2;
    const rect=(x,y)=>({left:x-halfW,right:x+halfW,top:y-halfH,bottom:y+halfH});
    const fit=(x,y)=>x-halfW>=left&&x+halfW<=right&&y-halfH>=top&&y+halfH<=bottom&&!occupied.some(o=>overlaps(rect(x,y),o));
    let x=Math.min(right-halfW,Math.max(item.x,left+halfW)),y=Math.min(bottom-halfH,Math.max(item.y,top+halfH));
    if(!fit(x,y)){
      const xs=[x,...[left+halfW,right-halfW].filter(Number.isFinite)],ys=[y,...[top+halfH,bottom-halfH].filter(Number.isFinite)];
      occupied.forEach(o=>{xs.push(o.left-gap-halfW,o.right+gap+halfW);ys.push(o.top-gap-halfH,o.bottom+gap+halfH);});
      let distance=Infinity;
      for(const candidateX of xs)for(const candidateY of ys){
        const d=(candidateX-item.x)**2+(candidateY-item.y)**2;
        if(d<distance&&fit(candidateX,candidateY)){x=candidateX;y=candidateY;distance=d;}
      }
    }
    occupied.push(rect(x,y));
    return {...item,x,y};
  });
}
let projectEntries=[],protection=[];
const networkLayouts=new Map();
let networkPlacement=[];
const mix=(a,b,t)=>a+(b-a)*t;
function screenPoint(point,pose){
  const q=rotate(point,pose.yaw),scale=1000/Math.max(300,1000+q.z)*pose.zoom;
  return {x:pose.x+q.x*scale,y:pose.y-q.y*scale,s:scale,z:q.z};
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
  const overview={x:width*.59,y:height*.46,yaw:.33,zoom:Math.min(width/1120,height/720)};
  const aboutPose={x:width*(width<1000?.5:.34),y:height*.63,yaw:.33,zoom:Math.min(width/1000,height/720)};
  let current=projectEntries.findLastIndex(entry=>y>=entry.open);
  const incoming=projectEntries.findIndex(entry=>y<entry.open);
  if(incoming>=0&&y>=projectEntries[incoming].start){
    const entry=projectEntries[incoming],progress=clamp((y-entry.start)/(entry.open-entry.start));
    const from=incoming?registeredPose(incoming-1):aboutPose,to=registeredPose(incoming);
    const middle={x:width*.5,y:height*.48,yaw:mix(from.yaw,to.yaw,.5),zoom:Math.min(width/1350,height/950)};
    const pose=still?to:progress<.5?blendPose(from,middle,smooth(progress*2)):blendPose(middle,to,smooth(progress*2-1));
    return {phase:'transition',current:incoming,progress,pose};
  }
  if(current>=0)return {phase:'reading',current,progress:1,pose:registeredPose(current)};
  const aboutStart=chapterStops[0],t=still?1:smooth(clamp((y-aboutStart)/(height*.5)));
  return {phase:y>=aboutStart?'about':'overview',current:-1,progress:t,pose:y>=aboutStart?blendPose(overview,aboutPose,t):overview};
}
function cardSize(card){
  const css=getComputedStyle(card),image=card.querySelector('.image'),imageCss=image&&getComputedStyle(image);
  return {w:parseFloat(css.width)||card.offsetWidth,h:parseFloat(css.height)||card.offsetHeight,imageW:parseFloat(imageCss?.width)||card.offsetWidth,imageH:parseFloat(imageCss?.height)||card.offsetHeight};
}
function contextLayout(index){
  const key=`${index}:${previewProject}`;
  if(networkLayouts.has(key))return networkLayouts.get(key);
  const entry=projectEntries[index],pose=registeredPose(index);
  const items=anchors.flatMap((anchor,i)=>{
    if(i===index)return [];
    const card=cards[i],size=cardSize(card),point=screenPoint(anchor,pose),scale=clamp(point.s,.55,width<760?1:1.1);
    return [{card,index:i,x:point.x+(size.w-size.imageW)/2*scale,y:point.y+(size.h-size.imageH)/2*scale,w:size.w*scale,h:size.h*scale,scale}];
  });
  const obstacles=[{left:entry.left-8,right:entry.left+entry.w+8,top:width>=1280?120:entry.y-entry.h/2-16,bottom:width>=1280?height:entry.y+entry.h/2+40}];
  if(width>=1000)obstacles.push({left:entry.textLeft-8,right:entry.textRight+8,top:120,bottom:height});
  const layout=placeNetwork(items,8,{left:16,right:width-16,top:width<760?145:130,bottom:Math.max(250,height-90)},obstacles);
  networkLayouts.set(key,new Map(layout.map(item=>[item.card,item])));
  return networkLayouts.get(key);
}
function draw(){
  const mobile=width<760,scene=networkScene(scrollY),{phase,current,pose}=scene;
  const reading=phase==='reading',transition=phase==='transition',inProject=current>=0;
  document.body.classList.toggle('reading-project',reading);
  document.body.classList.toggle('network-transition',transition);
  document.body.classList.toggle('previewing-project',previewProject>=0);
  document.body.dataset.networkPhase=phase;
  const currentProtection=reading?protection.map(rect=>({...rect,top:rect.top-scrollY,bottom:rect.bottom-scrollY})).filter(rect=>rect.bottom>0&&rect.top<height):[];
  const headerBottom=$('header').getBoundingClientRect().bottom;
  const footerTop=$('footer').getBoundingClientRect().top;
  const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  const imageSize=mobile?1:.7;
  cards.forEach(card=>card.style.setProperty('--image-scale',imageSize));
  photoCards.forEach(card=>card.style.setProperty('--image-scale',imageSize));
  const items=anchors.map((anchor,i)=>{
    const point=screenPoint(anchor,pose),card=cards[i],size=cardSize(card);
    let scale=clamp(point.s,.55,mobile?1:1.1);
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
  const bounds={left:16,right:width-16,top:mobile?145:130,bottom:Math.max(mobile?250:230,height-90)};
  // Only context cards use collision spacing; the selected image must land exactly.
  const placed=placeNetwork(context,mobile?8:16,bounds);
  if(inProject){
    const index=transition&&!still&&scene.progress<.5?current-1:current;
    const amount=reading||still?1:scene.progress<.5?1-smooth(scene.progress*2):smooth(scene.progress*2-1);
    if(index>=0){
      const destination=contextLayout(index);
      placed.forEach(item=>{
        const end=destination.get(item.card);if(!end)return;
        item.x=mix(item.x,end.x,amount);item.y=mix(item.y,end.y,amount);item.scale=mix(item.scale,end.scale,amount);
        const size=cardSize(item.card);item.w=size.w*item.scale;item.h=size.h*item.scale;
      });
    }
  }
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
    const visible=!(reading&&item.hero&&item.index===current);
    const exposed=visible&&rect.left>=0&&rect.right<=width&&rect.top>=headerBottom+8&&rect.bottom<=footerTop-8&&!currentProtection.some(panel=>overlaps(rect,panel));
    card.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`;
    card.style.visibility=visible?'visible':'hidden';
    card.style.pointerEvents=exposed?'auto':'none';card.tabIndex=exposed?0:-1;card.setAttribute('aria-hidden',String(!exposed));
    card.classList.toggle('landing',transition&&item.hero&&item.index===current);
    card.style.opacity=String(item.index===current?1:selectedSkill&&!projects[item.index].skills.includes(selectedSkill)?.2:reading?(item.hero?.48:.35):1);
    card.style.zIndex=String(item.index===current?1900:item.index===previewProject?1800:500);
    exposedCards.add(card);
  });
  photoCards.forEach(card=>{if(!exposedCards.has(card)){card.style.visibility='hidden';card.style.pointerEvents='none';card.tabIndex=-1;card.setAttribute('aria-hidden','true');}});
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
  const character=$('#about-node'),aboutPoint=screenPoint(about,pose),showAbout=!inProject;
  const characterScale=phase==='about'&&!still?2.4:1;
  character.style.setProperty('--about-width-growth',phase==='about'?'100px':'0px');
  character.style.setProperty('--about-height-growth',phase==='about'?'140px':'0px');
  character.style.transform=`translate(${aboutPoint.x}px,${aboutPoint.y}px) translate(-50%,-50%) scale(${characterScale})`;
  character.style.visibility=showAbout?'visible':'hidden';character.style.pointerEvents=showAbout?'auto':'none';character.tabIndex=showAbout?0:-1;character.setAttribute('aria-hidden',String(!showAbout));
  chapters.forEach((chapter,i)=>{
    chapter.classList.toggle('is-active',i===current);
    chapter.classList.toggle('is-arriving',transition&&i===current);
    const hero=chapter.querySelector('.reading-hero');
    if(hero)hero.inert=transition&&i===current;
  });
  const showingAbout=phase==='about';
  aboutChapter.classList.toggle('is-active',showingAbout);
  window.aboutNetworkPose={yaw:pose.yaw,focused:showingAbout,hidden:!showAbout};
  window.projectNetworkPose={...pose,projectId:current>=0?projects[current].id:null,overview:phase==='overview',phase,progress:scene.progress};
  dispatchEvent(new Event('networkpose'));
  if(current!==active||showingAbout!==aboutActive){
    active=current;aboutActive=showingAbout;
    cards.forEach((card,i)=>card.classList.toggle('active',i===current));
    const activeLink=showingAbout?1:current<0?0:current+2;
    links.forEach((link,i)=>{link.classList.toggle('active',i===activeLink);if(i===activeLink)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    $('#view-number').textContent=showingAbout?'00':String(current+1).padStart(2,'0');
  }
  $('#view-name').textContent=transition?'Connecting / '+projects[current].title:showingAbout?'About me':current<0?'Network overview':projects[current].title;
  $('#progress-bar').style.width=`${clamp(scrollY/(document.documentElement.scrollHeight-height))*100}%`;
}
function resize(){
  layoutReading();width=innerWidth;height=innerHeight;networkLayouts.clear();
  chapterStops=chapterSections.map(chapter=>chapter.getBoundingClientRect().top+scrollY-height*.24);
  projectEntries=chapters.map(chapter=>{
    const section=chapter.getBoundingClientRect(),hero=chapter.querySelector('.reading-hero .image')?.getBoundingClientRect(),text=chapter.querySelector('.reading-text')?.getBoundingClientRect();
    const open=Math.round(section.top+scrollY-16);
    return {left:hero?.left||width*.06,textLeft:text?.left||width*.56,textRight:text?.right||width*.94,open,start:open-height*.82,x:hero?hero.left+hero.width/2:width*.28,y:hero?hero.top-section.top+16+hero.height/2:height*.45,w:hero?.width||width*.42,h:hero?.height||height*.6};
  });
  protection=[...document.querySelectorAll('.reading-text,.project-reading>.project-introduction,.project-reading>.project-section,.project-reading>.project-extras,.reading-figure,.about-copy,.ending .project-description')].map(element=>{
    const rect=element.getBoundingClientRect();return {left:rect.left-16,right:rect.right+16,top:rect.top+scrollY-16,bottom:rect.bottom+scrollY+16};
  });
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();
}
let scheduled=false;
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{draw();scheduled=false;});}},{passive:true});
addEventListener('resize',resize);
// Images and text can change section heights after the initial measurement.
if(typeof ResizeObserver!=='undefined'){const layoutObserver=new ResizeObserver(resize);chapterSections.forEach(chapter=>layoutObserver.observe(chapter));}
setSkill('');setStill(still);
// Project sections are generated above, so resolve incoming project links after they exist.
if (/^#(?:overview|about-section|project-\d+)$/.test(location.hash)&&$(location.hash)) requestAnimationFrame(() => $(location.hash).scrollIntoView({behavior:'instant'}));

// Image and model sizes can settle after the first camera frame.
document.querySelectorAll('#world img').forEach(image=>image.addEventListener('load',draw));
if(typeof ResizeObserver!=='undefined'){const cardObserver=new ResizeObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;draw();});}});[...cards,...photoCards,$('#about-node')].forEach(card=>cardObserver.observe(card));}
