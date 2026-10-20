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
let selectedSkill='';
$('#project-total').textContent=String(count).padStart(2,'0');
$('#nodes').innerHTML=projects.map(p=>`<button class="node" data-project="${p.id}" aria-label="View ${escapeHTML(p.title)}"><span class="image">${picture(p.hero,'eager')}${p.hero.motion?`<video class="project-video-hero" data-webm="${escapeHTML(p.hero.motion.webm)}" data-hevc="${escapeHTML(p.hero.motion.hevc)}" data-frames="${p.hero.motion.frames}" data-fps="${p.hero.motion.fps}" muted playsinline preload="auto" aria-hidden="true"></video>`:''}</span><span class="label"><small>${String(p.id).padStart(2,'0')}</small>${escapeHTML(p.title)}</span></button>`).join('');
const prose=text=>text.split(/\n\s*\n/).map(paragraph=>`<p>${escapeHTML(paragraph).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^\w])[_*]([^_*\n]+)[_*](?=\W|$)/g,'$1<em>$2</em>')}</p>`).join('');
const facts=p=>[['Format',p.discipline],['Context',p.context],['My role',p.role],['Collaborators',p.collaborators]].filter(([,value])=>value).map(([label,value])=>`<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`).join('');
const sections=p=>[['Question',p.question],['Process',p.process],['Implementation',p.implementation],['Outcome',p.outcome],['Learning',p.learning]].filter(([,value])=>value).map(([label,value])=>`<section class="project-section"><h3>${label}</h3><p>${escapeHTML(value)}</p></section>`).join('');
const galleryImages=p=>[...p.detailImages.map((photo,index)=>({photo,index,collection:'detailImages'})),...p.photos.map((photo,index)=>({photo,index,collection:'photos'})).filter(({photo})=>!p.detailImages.some(detail=>detail.src===photo.src))];
$('#chapters').innerHTML=projects.map(p=>`<section class="chapter" id="project-${p.id}" aria-labelledby="title-${p.id}"><article class="project-copy"><p class="eyebrow">Selected work / ${String(p.id).padStart(2,'0')}</p><h2 id="title-${p.id}">${escapeHTML(p.title)}</h2><section class="project-section"><h3>At a glance</h3>${prose(p.atAGlance)}</section>${p.description?`<div class="project-description">${prose(p.description)}</div>`:`<div class="summary">${prose(p.summary)}</div>`}${p.video?`<div class="project-video"><iframe src="https://player.vimeo.com/video/${escapeHTML(p.video)}?dnt=1" title="${escapeHTML(p.title)} project film" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`:''}${p.caseStudy?p.caseStudy.map(section=>`<section class="project-section"><h3>${escapeHTML(section.title)}</h3>${prose(section.text)}</section>`).join(''):`<dl class="project-meta">${facts(p)}</dl>${p.description?'':sections(p)}`}<h3 class="section-title">Skills</h3><div class="project-skills" aria-label="Skills in ${escapeHTML(p.title)}">${p.skills.map(skill=>routeSkills.includes(skill)?`<button class="skill-chip" data-skill="${escapeHTML(skill)}" aria-pressed="false">${escapeHTML(skill)}</button>`:`<span class="skill-chip">${escapeHTML(skill)}</span>`).join('')||'<p class="placeholder-note">Skills pending project description.</p>'}</div>${p.skillEvidence?`<div class="project-description">${prose(p.skillEvidence)}</div>`:''}${p.documentation?`<a class="project-next" href="${escapeHTML(p.documentation)}">Project documentation</a>`:''}<div class="detail-gallery" aria-label="More views of ${escapeHTML(p.title)}">${galleryImages(p).map(({photo,index:j,collection})=>`<figure><button class="detail-image" data-detail-project="${p.id-1}" data-detail-image="${j}" data-detail-collection="${collection}" aria-label="Enlarge ${escapeHTML(photo.title)}">${picture(photo)}</button><figcaption>${caption(photo)}</figcaption></figure>`).join('')}</div>${p.hero.credit?`<p class="placeholder-note">Photography ${escapeHTML(p.hero.credit)}</p>`:''}<div class="related-projects" id="related-${p.id}"></div><a class="project-next" href="${p.id===count?'#overview':'#project-'+(p.id+1)}">${p.id===count?'Return to overview':'Next project'}</a></article></section>`).join('');
$('#project-index').innerHTML='<a href="#overview" aria-label="Network overview">○</a><a href="#about-section" aria-label="About me">●</a>'+projects.map(p=>`<a href="#project-${p.id}" aria-label="View ${escapeHTML(p.title)}">${String(p.id).padStart(2,'0')}</a>`).join('');
const cards=[...document.querySelectorAll('.node')],chapters=[...document.querySelectorAll('#chapters .chapter')],aboutChapter=$('#about-section'),chapterSections=[aboutChapter,...chapters],links=[...$('#project-index').children];
cards.forEach((card,i)=>card.addEventListener('click',()=>{location.hash=`project-${i+1}`;}));
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
let galleryProject=0,galleryPhoto=0,galleryPhotos=[];
function renderPhoto(){const photo=galleryPhotos[galleryPhoto];$('#photo-project').textContent=projects[galleryProject].title;$('#photo-title').textContent=photo.title;$('#photo-large').innerHTML=picture(photo,'eager');$('#photo-credit').textContent=photo.credit||'';$('#photo-count').textContent=`${galleryPhoto+1} / ${galleryPhotos.length}`;}
function openPhoto(projectIndex,collection,index){galleryProject=projectIndex;galleryPhotos=projects[projectIndex][collection];galleryPhoto=index;renderPhoto();$('#photo-viewer').showModal();}
photoCards.forEach((card,i)=>card.addEventListener('click',()=>{const item=networkMedia[i];if(item.video)document.querySelector(`#project-${projects[item.projectIndex].id} .project-video`).scrollIntoView({behavior:'smooth',block:'center'});else openPhoto(item.projectIndex,'photos',item.photoIndex);}));
document.querySelectorAll('[data-detail-project]').forEach(button=>button.addEventListener('click',()=>openPhoto(Number(button.dataset.detailProject),button.dataset.detailCollection,Number(button.dataset.detailImage))));
$('#photo-prev').addEventListener('click',()=>{galleryPhoto=(galleryPhoto-1+galleryPhotos.length)%galleryPhotos.length;renderPhoto();});
$('#photo-next').addEventListener('click',()=>{galleryPhoto=(galleryPhoto+1)%galleryPhotos.length;renderPhoto();});
document.querySelectorAll('.about-trigger').forEach(button=>button.addEventListener('click',()=>{location.hash='about-section';aboutChapter.scrollIntoView({behavior:'smooth'});}));
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
function placeNetwork(items, gap){
  const occupied=[];
  const overlaps=(a,b)=>a.left<b.right+gap&&a.right+gap>b.left&&a.top<b.bottom+gap&&a.bottom+gap>b.top;
  return items.map(item=>{
    const halfW=item.w/2,halfH=item.h/2;
    const rect=(x,y)=>({left:x-halfW,right:x+halfW,top:y-halfH,bottom:y+halfH});
    const fit=(x,y)=>!occupied.some(o=>overlaps(rect(x,y),o));
    let x=item.x,y=item.y;
    if(!fit(x,y)){
      const xs=[x],ys=[y];
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
let layoutWidth=0,layoutHeight=0;
const networkLayouts=new Map();
let networkPlacement=[];
function draw(){
  const mobile=width<760;
  const overviewImageSize=1-.5*smooth(clamp((width-760)/440));
  const imageSizeFor=(i,state,supporting=false)=>i===state-1?(mobile?(supporting?2.2:2):(supporting?1.8:1.6)):overviewImageSize;
  const stopIndex=Math.max(0,chapterStops.findLastIndex(stop=>scrollY>=stop));
  const start=chapterStops[stopIndex],span=(chapterStops[stopIndex+1]??(start+chapterSections[stopIndex].offsetHeight))-start;
  const stage=scrollY<chapterStops[0]?(scrollY-chapterStops[0])/(height*1.55):stopIndex+(scrollY-start)/span;
  const raw=stage-1;
  // The section boundary selects both the description and the nearest camera target.
  const sectionIndex=chapterStops.findLastIndex(stop=>scrollY>=stop);
  const travel=height*.75;
  const boundary=chapterStops.findIndex(stop=>scrollY<stop+travel);
  const to=boundary<0?chapterSections.length-1:boundary;
  const from=Math.max(-1,to-1);
  const t=boundary<0?1:smooth(clamp((scrollY-chapterStops[to]+travel)/(travel*2)));
  const pose=i=>i<0?{target:{x:0,y:0,z:0},yaw:.33}:i===0?{target:about,yaw:.33}:{target:anchors[i-1],yaw:-Math.PI/2-(i-1)/count*tau};
  const a=pose(from),b=pose(to);
  let focus=from<0?t:1-Math.sin(t*Math.PI)*.65;
  let yaw=a.yaw+(b.yaw-a.yaw)*t;
  let target={x:a.target.x+(b.target.x-a.target.x)*t,y:a.target.y+(b.target.y-a.target.y)*t,z:a.target.z+(b.target.z-a.target.z)*t};
  const current=Math.max(-1,sectionIndex-1);
  let aboutFocus=(from===0?1-t:0)+(to===0?t:0);
  if(still){focus=0;aboutFocus=0;yaw=.33;target={x:0,y:0,z:0};}
  const rtarget=rotate(target,yaw), expansion=still?1.12:1+.12*clamp(raw+.65);
  if(layoutWidth!==width){layoutWidth=width;layoutHeight=height;networkLayouts.clear();}
  const centerX=width*(mobile?.5:.59-.25*focus),centerY=height*(mobile?.33:.46);
  const base=mobile?Math.min(width/820,.65):Math.min(width/1120,height/720);
  function project(p){const q=rotate(p,yaw),distance=1050-250*focus,depth=distance+q.z-rtarget.z*focus*.7,scale=distance/Math.max(200,depth)*base*(1+.53*focus);return {x:centerX+(q.x-rtarget.x*focus)*scale*expansion,y:centerY-(q.y-rtarget.y*focus)*scale*expansion,s:scale,z:q.z};}
  ctx.clearRect(0,0,width,height);
  const projected=points.map(project);
  ctx.lineWidth=.65;
  for(let i=0;i<edges.length;i++){if(mobile&&i%3)continue;const [a,b]=edges[i],p=projected[a],q=projected[b];ctx.strokeStyle=`rgba(164,173,177,${.12+.13*clamp((p.z+390)/780)})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
  for(let i=0;i<projected.length;i++){if(mobile&&i%2)continue;const p=projected[i];ctx.fillStyle='rgba(187,193,194,.5)';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.6,p.s*.85),0,tau);ctx.fill();}
  const center=project(about);
  function layoutFor(state){
    const cardPose=pose(still?-1:state),cardFocus=still||state<0?0:1;
    const cardTarget=rotate(cardPose.target,cardPose.yaw);
    const cardBase=mobile?Math.min(width/820,.65):Math.min(width/1120,layoutHeight/720);
    const imageSize=(i,supporting=false)=>imageSizeFor(i,state,supporting);
    function projectCard(p){
      const q=rotate(p,cardPose.yaw),distance=1050-250*cardFocus;
      const scale=distance/Math.max(200,distance+q.z-cardTarget.z*cardFocus*.7)*cardBase*(1+.53*cardFocus);
      return {x:width*(mobile?.5:.59-.25*cardFocus)+(q.x-cardTarget.x*cardFocus)*scale*1.12,y:layoutHeight*(mobile?.33:.46)-(q.y-cardTarget.y*cardFocus)*scale*1.12,s:scale,z:q.z};
    }
    const layout=[];
    anchors.forEach((p,i)=>{
      const a=projectCard(p),card=cards[i],scale=clamp(a.s*(i===state-1?1+.3*cardFocus:1),.4,mobile?1.65:2.1);
      card.style.setProperty('--image-scale',imageSize(i));
      layout.push({card,x:a.x,y:a.y,w:(card.offsetWidth+1)*scale,h:(card.offsetHeight+1)*scale,scale,hero:true,focused:i===state-1,index:i,z:a.z,anchor:a});
    });
    networkMedia.forEach(({projectIndex:i,photoIndex:j},k)=>{
      const anchor=anchors[i],angle=projects[i].angle,spread=imageSize(i)*(i===state-1?1+.18*cardFocus:1);
      const mediaCount=projects[i].photos.length+(projects[i].video?1:0);
      const orbit=networkMedia[k].video?4.05:(j+.5)/mediaCount*tau,radius=Math.max(1,Math.sqrt(mediaCount/3));
      const tangent=Math.sin(orbit)*145*spread*radius,vertical=Math.cos(orbit)*125*spread*radius;
      const p=projectCard({x:anchor.x-Math.sin(angle)*tangent+Math.cos(angle)*35,y:anchor.y+vertical,z:anchor.z+Math.cos(angle)*tangent+Math.sin(angle)*35}),a=projectCard(anchor),card=photoCards[k];
      if(i===state-1){p.x=a.x+Math.sin(orbit)*(mobile?125:300);p.y=a.y-Math.cos(orbit)*(mobile?105:220);if(networkMedia[k].video)p.x-=mobile?80:70;}
      card.style.setProperty('--image-scale',imageSize(i,true));
      const scale=clamp(p.s,.48,1.65);
      layout.push({card,x:p.x,y:p.y,w:(card.offsetWidth+1)*scale,h:(card.offsetHeight+1)*scale,scale,hero:false,focused:false,index:i,mediaIndex:k,z:p.z,anchor:a});
    });
    const a=projectCard(about),characterFocus=!still&&state===0?1:0;
    const scale=clamp(a.s*1.2,1,1.35)*(1+characterFocus);
    const characterHeight=(mobile?106:116)+(mobile?110:180)*characterFocus;
    const y=a.y+characterHeight*scale/(1+characterFocus)*(mobile?.4:.65)*characterFocus;
    layout.push({card:$('#about-node'),x:a.x,y,w:((mobile?88:96)+(mobile?90:150)*characterFocus+1)*scale,h:(characterHeight+1)*scale,scale,hero:true,focused:state===0,index:-1,z:1400,anchor:a});
    const hero=layout.find(item=>item.hero&&item.index===state-1);
    if(hero){
      const media=layout.filter(item=>!item.hero&&item.index===hero.index);
      const gap=mobile?18:28;
      const cellWidth=Math.max(0,...media.map(item=>item.w)),cellHeight=Math.max(0,...media.map(item=>item.h));
      const columns=mobile||width*.65>hero.w+cellWidth*2+gap*3?2:1;
      const rows=Math.ceil(media.length/columns);
      const totalHeight=columns===1?media.reduce((sum,item)=>sum+item.h,0)+Math.max(0,media.length-1)*gap:rows*cellHeight+Math.max(0,rows-1)*gap;
      let nextY=hero.y-totalHeight/2;
      if(!mobile)hero.x-=width*.12;
      media.forEach((item,j)=>{
        item.x=mobile?hero.x-(Math.min(columns,media.length)-1)*(cellWidth+gap)/2+(j%columns)*(cellWidth+gap):hero.x+hero.w/2+gap+cellWidth/2+(j%columns)*(cellWidth+gap);
        item.y=mobile?hero.y+hero.h/2+gap+cellHeight/2+Math.floor(j/columns)*(cellHeight+gap):columns===1?nextY+item.h/2:hero.y-totalHeight/2+cellHeight/2+Math.floor(j/columns)*(cellHeight+gap);
        nextY+=item.h+gap;
      });
    }
    // Reserve the focused gallery first, so background cards cannot break its rows.
    const priority=item=>item.focused?0:!item.hero&&item.index===state-1?1:item.hero?2:3;
    layout.sort((a,b)=>priority(a)-priority(b)||a.index-b.index||(a.mediaIndex??0)-(b.mediaIndex??0));
    const key=`${still}:${state}:${layout.map(item=>`${item.w},${item.h}`).join(';')}`;
    if(!networkLayouts.has(key))networkLayouts.set(key,placeNetwork(layout,mobile?10:16));
    return networkLayouts.get(key);
  }
  const source=layoutFor(still?sectionIndex:from),destination=layoutFor(still?sectionIndex:to);
  const sourceCards=new Map(source.map(item=>[item.card,item]));
  const mix=(a,b)=>a+(b-a)*t;
  // Spacing offsets live relative to project anchors and travel through the same camera.
  const placed=destination.map(end=>{
    const start=sourceCards.get(end.card),a=project(end.index<0?about:anchors[end.index]);
    return {...end,x:a.x+mix((start.x-start.anchor.x)/start.anchor.s,(end.x-end.anchor.x)/end.anchor.s)*a.s,
      y:a.y+mix((start.y-start.anchor.y)/start.anchor.s,(end.y-end.anchor.y)/end.anchor.s)*a.s,
      scale:mix(start.scale/start.anchor.s,end.scale/end.anchor.s)*a.s};
  });
  networkPlacement=destination;
  const stateImageSize=imageSizeFor;
  cards.forEach((card,i)=>card.style.setProperty('--image-scale',still?stateImageSize(i,current+1):mix(stateImageSize(i,from),stateImageSize(i,to))));
  photoCards.forEach((card,k)=>{const i=networkMedia[k].projectIndex;card.style.setProperty('--image-scale',still?stateImageSize(i,current+1,true):mix(stateImageSize(i,from,true),stateImageSize(i,to,true)));card.classList.toggle('active',i===current);});
  const characterFocus=still?0:aboutFocus;
  $('#about-node').style.setProperty('--about-width-growth',`${(mobile?90:150)*characterFocus}px`);
  $('#about-node').style.setProperty('--about-height-growth',`${(mobile?110:180)*characterFocus}px`);
  const heroes=new Map(placed.filter(item=>item.hero).map(item=>[item.index,item]));
  placed.forEach(item=>{
    const {card,x,y,scale}=item;
    card.style.visibility='visible';card.style.pointerEvents='auto';card.tabIndex=0;
    card.setAttribute('aria-hidden','false');
    card.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`;
    card.style.opacity=String(item.index<0?1-Math.max(0,focus-aboutFocus)*.55:selectedSkill?(projects[item.index].skills.includes(selectedSkill)?(item.hero?1:.75):(item.hero?.08:.05)):item.hero?(item.index===current?1:clamp(.64+item.z/1400,.36,.85)*(current<0?1-aboutFocus*.82:still?.3:1-focus*.72)):(item.index===current?.95:current<0?.5*(1-aboutFocus*.85):still?.15:.5*(1-focus*.8)));card.style.zIndex=String(item.hero?Math.round(item.z)+500:item.index===current?1800:Math.round(item.z)+450);
    if(item.index===-1)return;
    const origin=item.hero?center:heroes.get(item.index);
    if(!origin)return;
    ctx.strokeStyle=item.index===current?'rgba(61,115,255,.48)':'rgba(179,187,190,.17)';ctx.lineWidth=.7;
    ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(x,y);ctx.stroke();
  });
  connections.forEach(edge=>{
    if(selectedSkill&&!edge.skills.includes(selectedSkill))return;
    const highlighted=selectedSkill||edge.a===current||edge.b===current;
    if(current>=0&&!highlighted)return;
    const a=heroes.get(edge.a),b=heroes.get(edge.b);
    if(!a||!b)return;
    ctx.strokeStyle=highlighted?'rgba(61,115,255,.68)':'rgba(61,115,255,.16)';ctx.lineWidth=highlighted?1.6:.8;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x+center.x)/3,(a.y+b.y+center.y)/3,b.x,b.y);ctx.stroke();
  });
  window.aboutNetworkPose={yaw,focused:sectionIndex===0};
  window.projectNetworkPose={yaw,projectId:current>=0?projects[current].id:null,overview:sectionIndex<0};
  dispatchEvent(new Event('networkpose'));
  const showingAbout=sectionIndex===0;
  if(current!==active||showingAbout!==aboutActive){active=current;aboutActive=showingAbout;cards.forEach((c,i)=>c.classList.toggle('active',i===active));chapters.forEach((c,i)=>c.classList.toggle('is-active',i===active));aboutChapter.classList.toggle('is-active',showingAbout);const activeLink=showingAbout?1:active<0?0:active+2;links.forEach((c,i)=>{c.classList.toggle('active',i===activeLink);if(i===activeLink)c.setAttribute('aria-current','location');else c.removeAttribute('aria-current');});$('#view-number').textContent=showingAbout?'00':String(active+1).padStart(2,'0');$('#view-name').textContent=showingAbout?'About me':active<0?'Network overview':projects[active].title;}
  $('#progress-bar').style.width=`${clamp(scrollY/(document.documentElement.scrollHeight-height))*100}%`;
}
function resize(){width=innerWidth;height=innerHeight;chapterStops=chapterSections.map(chapter=>chapter.getBoundingClientRect().top+scrollY-height*.24);const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
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
