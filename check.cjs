// Run with node check.cjs: data/assets, skill routes, camera stops, and image viewer.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({window:{scrollBy(){}},innerWidth:1440,innerHeight:900,devicePixelRatio:1,scrollY:0,matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},dispatchEvent(){},Event:class{},requestAnimationFrame:fn=>fn(),location:{hash:''}});
vm.runInContext(fs.readFileSync('site/projects.js','utf8'),context);
const data=context.window.PORTFOLIO_PROJECTS;
assert.equal(new Set(data.map(p=>p.id)).size,data.length);
const revisedSources={
 'improving-futurium':'Projekte/Improving Futurium/project-description-improving-futurium.md',
 'doxa':'Projekte/DOXA/project-description-doxa-revised.md',
 'visio-technologica':'Projekte/VISIO TECHNOLOGICA/project-description-visio-technologica-revised.md',
 'veiled-panopticon':'Projekte/VEILED PANOPTICON/project-description-veiled-panopticon.md',
 'matrix-lamp':'Projekte/Matrix Lamp/project-description-matrix-lamp.md',
 'carry-the-computation':'Projekte/Carry the computation/project-description-carry-the-computation.md'
};
for(const [slug,path] of Object.entries(revisedSources)){
 const source=fs.readFileSync(path,'utf8');
 const parts=source.split(/^## (.+)\n/m);
 const sections=new Map();for(let i=1;i<parts.length;i+=2)sections.set(parts[i],parts[i+1].trim());
 const project=data.find(p=>p.slug===slug);
 assert.equal(project.summary,sections.get('Short summary'));
 assert.equal(project.atAGlance,sections.get('At a glance'));
 for(const section of project.caseStudy)assert.ok(sections.get(section.title).startsWith(section.text),'Revised copy retains supplied wording');
 assert.equal(project.skillEvidence,sections.get('Skills & network connections').split('### Connections through shared skills')[0].split('\n').filter(line=>line.startsWith('- ')).map(line=>line.slice(2)).join('\n\n'));
 for(const heading of sections.keys())if(!['At a glance','Short summary','Skills & network connections','Media & credits','Image selection','Studio edits','Selected portfolio images'].includes(heading))assert.ok(project.caseStudy.some(section=>section.title===heading),'Every narrative section is published');
}
for(const p of data){assert.ok(p.title&&p.summary);for(const image of [p.hero,...p.photos,...p.detailImages]){assert.ok(fs.existsSync('site/'+image.src),image.src);assert.ok(image.width>0&&image.height>0,'Images reserve their natural aspect ratio');}}
assert.ok(fs.existsSync('site/assets/waving-textured.glb'));
const model=fs.readFileSync('site/assets/waving-textured.glb');
const gltf=JSON.parse(model.subarray(20,20+model.readUInt32LE(12)).toString());
const headIndex=gltf.nodes.findIndex(node=>/^(?:mixamorig:?)?Head$/i.test(node.name));
assert.equal(gltf.animations.length,1,'The character needs the wave animation');
assert.ok(headIndex>=0&&gltf.skins.some(skin=>skin.joints.includes(headIndex)),'The character needs a skinned Head bone');
const element=()=>({offsetWidth:88,offsetHeight:105,getBoundingClientRect:()=>({left:0,right:0,top:0,bottom:0,width:0,height:0}),querySelector:()=>null,style:{setProperty(name,value){this[name]=value;}},children:[],classList:{values:new Set(),toggle(name,on){on?this.values.add(name):this.values.delete(name);},contains(name){return this.values.has(name);}},addEventListener(){},setAttribute(){},removeAttribute(){},showModal(){},getContext(){return new Proxy({},{get:()=>()=>{}});}});
const cards=data.map(()=>({...element(),offsetWidth:155,offsetHeight:220})),aboutChapter={...element(),offsetHeight:2500,getBoundingClientRect:()=>({top:1035-context.scrollY})},chapters=data.map((_,i)=>({...element(),offsetHeight:2500,getBoundingClientRect:()=>({top:3535+i*2500-context.scrollY})}));
const photoCards=data.flatMap(p=>[...p.photos.map(element),...(p.video?[element()]:[])]),selectors=new Map();
function query(s){if(!selectors.has(s))selectors.set(s,element());return selectors.get(s);}
selectors.set('#about-section',aboutChapter);
query('#project-index').children=Array.from({length:data.length+2},element);
context.document={querySelector:query,querySelectorAll:s=>s==='.node'?cards:s==='#chapters .chapter'?chapters:s==='.satellite'?photoCards:[],body:element(),documentElement:{scrollHeight:20000}};
vm.runInContext(fs.readFileSync('site/app.js','utf8'),context);
for(const project of data){
 assert.ok(project.atAGlance&&project.atAGlance.split(/\s+/).length<=110,'Every project has a short overview');
 const chapter=query('#chapters').innerHTML.split(`id="project-${project.id}"`)[1].split('</article>')[0];
 assert.ok(chapter.includes('<h3>At a glance</h3>'+vm.runInContext(`prose(${JSON.stringify(project.atAGlance)})`,context)),'Each description displays its overview');
}
assert.ok(fs.readFileSync('Projekte/Hyperreal Ravelord Kette 3D/project-description-hyperreal.md','utf8').includes(data.find(p=>p.slug==='hyperreal').atAGlance));
assert.ok(query('#chapters').innerHTML.includes('Andreas Ingerl supported the installation design.'));
assert.ok(query('#chapters').innerHTML.includes('The prototype used RSSI; channel state information'));
assert.equal(data.find(p=>p.slug==='veiled-panopticon').video,'1191205459');
assert.ok(query('#chapters').innerHTML.includes('https://player.vimeo.com/video/1191205459?dnt=1'));
assert.ok(!query('#nodes').innerHTML.includes('player.vimeo.com'));
assert.ok(query('#supporting-images').innerHTML.includes('https://player.vimeo.com/video/1191205459?background=1'));
assert.equal(data.length,7);
assert.deepEqual(Array.from(data,p=>p.id),[1,2,3,4,5,6,7]);
for(const selector of ['#nodes','#chapters','#project-index','#related-1','#related-4'])assert.ok(!/poetics|encryption/i.test(query(selector).innerHTML),'Removed project must not appear in the site');
assert.ok(query('#chapters').innerHTML.includes('href="#project-5"'));
assert.ok(query('#chapters').innerHTML.includes('href="#project-6"'));
assert.ok(query('#chapters').innerHTML.includes('#project-7'));
assert.ok(query('#chapters').innerHTML.includes('<strong>Qwen3:8B</strong>'));
assert.ok(query('#chapters').innerHTML.includes('<em>Matrix Lamp</em>'));
assert.ok(!query('#chapters').innerHTML.includes('Project description coming soon.'));
assert.ok(query('#chapters').innerHTML.includes('https://juliuswenk.github.io/veiled-panopticon/'));
assert.equal(vm.runInContext("prose('<script> & **safe**')",context),'<p>&lt;script&gt; &amp; <strong>safe</strong></p>');
for(const width of [1440,768,390]){
 context.innerWidth=width;context.scrollY=0;vm.runInContext('resize()',context);
 const overviewSize=1-.5*(Math.min(1,Math.max(0,(width-760)/440))**2)*(3-2*Math.min(1,Math.max(0,(width-760)/440)));
 [...cards,...photoCards].forEach(card=>assert.equal(card.style['--image-scale'],overviewSize));
 context.scrollY=1035-context.innerHeight*.24+.1;vm.runInContext('draw()',context);
 assert.equal(query('#view-name').textContent,'About me');
 assert.ok(parseFloat(query('#about-node').style['--about-width-growth'])>0);
 context.scrollY=1035-context.innerHeight*.24+context.innerHeight*.75+1;vm.runInContext('draw()',context);
 const characterTransform=query('#about-node').style.transform;
 const characterScale=Number(characterTransform.match(/scale\(([^)]+)\)/)[1]);
 assert.ok(characterScale>=2&&characterScale<=2.7,'Focused character doubles its bounded scale');
 assert.ok(Number(characterTransform.match(/translate\([^,]+,([^p]+)px\)/)[1])>context.innerHeight*(width>=760?.46:.33),'Enlargement shifts the body downward to keep the face visible');
 for(let i=0;i<data.length;i++){
  context.scrollY=3535+i*2500-context.innerHeight*.24+context.innerHeight*.75+1;vm.runInContext('draw()',context);
  assert.equal(query('#view-name').textContent,data[i].title);
  assert.equal(cards[i].style['--image-scale'],width<760?2:1.6);
  const focusedMedia=photoCards.filter((_,k)=>vm.runInContext(`networkMedia[${k}].projectIndex`,context)===i);
  focusedMedia.forEach(card=>assert.equal(card.style['--image-scale'],width<760?2.2:1.8));
  const focusLayout=vm.runInContext(`[...networkLayouts.entries()].find(([key])=>key.startsWith('false:${i+1}:'))[1]`,context);
  const focusHero=focusLayout.find(item=>item.hero&&item.index===i);
  const supporting=focusLayout.filter(item=>!item.hero&&item.index===i);
  for(const item of supporting)assert.ok(width<760?item.y-item.h/2>focusHero.y+focusHero.h/2:item.x-item.w/2>focusHero.x+focusHero.w/2,'Focused supporting images form rows below or beside the hero');

  assert.equal(cards[(i+1)%data.length].style['--image-scale'],overviewSize);
  assert.ok(Number.isFinite(context.window.aboutNetworkPose.yaw));
  [...cards,...photoCards].forEach(card=>assert.ok(!/NaN|Infinity/.test(card.style.transform)));
 }
 for(const direction of [1,-1]){
  const positions=Array.from({length:180},(_,i)=>i*100);
  if(direction<0)positions.reverse();
  for(const y of positions){
   context.scrollY=y;vm.runInContext('draw()',context);
   const focused=cards.findIndex(card=>card.classList.contains('active'));
   const visible=chapters.findIndex(chapter=>chapter.classList.contains('is-active'));
   assert.equal(focused,visible,`Focus and description diverged at ${width}px / scroll ${y}`);
   assert.ok(!aboutChapter.classList.contains('is-active')||focused===-1);
   const expected=y<1035-context.innerHeight*.24?-1:y<3535-context.innerHeight*.24?-1:Math.min(data.length-1,Math.floor((y-3535+context.innerHeight*.24)/2500));
   assert.equal(focused,expected);
  }
 }
 vm.runInContext("setSkill('AI systems')",context);
 assert.equal(cards[0].style.opacity,'1');assert.equal(Number(cards[3].style.opacity),.08);assert.equal(Number(cards[2].style.opacity),.08);
 vm.runInContext("setSkill('');setStill(true);setStill(false)",context);
}
vm.runInContext("openPhoto(0,'detailImages',1)",context);
assert.ok(query('#photo-large').innerHTML.includes(data[0].detailImages[1].src));
assert.ok(query('#photo-credit').textContent.includes('Melissa'));
assert.equal(data[4].skills.length,0);
for(const source of [data[4].hero.motion.webm,data[4].hero.motion.hevc])assert.ok(fs.statSync('site/'+source).size>0);
const spinContext=vm.createContext({document:{querySelector:()=>null}});
vm.runInContext(fs.readFileSync('site/project-video.js','utf8').replace('export function','function'),spinContext);
const scrub=(f,dx,w=1000)=>vm.runInContext(`scrubFrame(${f},${dx},${w},360)`,spinContext);
assert.equal(scrub(180,100),216,'Right moves forward');
assert.equal(scrub(180,-100),144,'Left moves backward');
assert.equal(scrub(180,0),180,'No movement holds the frame');
assert.ok(Math.abs(scrub(359,10)-2.6)<1e-10,'Wrap across the end of the turn');
assert.ok(scrub(0,-10)>350,'Wrap backwards across the start');
assert.equal(scrub(180,100,2000),198,'Scale sensitivity with viewport width');
const videoEvents={},networkEvents={},buttonEvents={};
const videoButton={dataset:{project:'5'},classList:{add(){},remove(){}},setAttribute(){},addEventListener(name,fn){buttonEvents[name]=fn;}};
const video={dataset:{frames:'360',fps:'25',webm:'movie.webm',hevc:'movie.mov'},readyState:4,duration:14.4,currentTime:0,seeking:false,paused:true,canPlayType:()=>'',closest:()=>videoButton,addEventListener(name,fn){videoEvents[name]=fn;},pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}};
let videoStill=false;
const videoDocument={hidden:false,querySelector:()=>video,body:{classList:{contains:()=>videoStill}},addEventListener(name,fn){networkEvents[name]=fn;}};
const videoContext=vm.createContext({document:videoDocument,navigator:{userAgent:'Chrome'},window:{projectNetworkPose:{overview:true,projectId:null}},innerWidth:1000,console,requestAnimationFrame:fn=>fn(),addEventListener(name,fn){networkEvents[name]=fn;}});
vm.runInContext(fs.readFileSync('site/project-video.js','utf8').replace('export function','function'),videoContext);
assert.ok(!video.paused&&video.loop,'Overview loops');
videoContext.window.projectNetworkPose={overview:false,projectId:5};networkEvents.networkpose();
assert.ok(!video.paused&&!video.loop&&video.currentTime===0,'Focus restarts one turn');
video.currentTime=video.duration;videoEvents.ended();
assert.ok(video.paused,'One turn ends in manual mode');
networkEvents.pointermove({pointerType:'mouse',clientX:100});networkEvents.pointermove({pointerType:'mouse',clientX:200});
const rightFrame=video.currentTime;assert.ok(rightFrame>0&&rightFrame<2,'Right crosses the loop seam');
networkEvents.pointermove({pointerType:'mouse',clientX:200});assert.equal(video.currentTime,rightFrame,'Stationary mouse does not advance');
networkEvents.pointermove({pointerType:'mouse',clientX:100});assert.ok(video.currentTime>14,'Left returns to the previous facing');
videoStill=true;networkEvents.networkpose();const frozen=video.currentTime;
networkEvents.pointermove({pointerType:'mouse',clientX:300});assert.equal(video.currentTime,frozen,'Still view freezes movement');
videoStill=false;videoContext.window.projectNetworkPose={overview:false,projectId:3};networkEvents.networkpose();assert.ok(video.paused,'Other projects pause the video');
videoContext.window.projectNetworkPose={overview:false,projectId:5};networkEvents.networkpose();assert.ok(!video.paused&&video.currentTime===0,'Re-entering focus replays once');
console.log(`${data.length} projects: assets, shared-skill highlighting, image viewer, and all desktop/mobile camera stops pass.`);

const placement=vm.runInContext('placeNetwork',context);
const inputs=[{x:200,y:200,w:120,h:160,hero:true,focused:true,index:0},{x:200,y:200,w:100,h:120,hero:true,index:1},{x:200,y:200,w:80,h:90,hero:false,index:0}];
const placed=placement(inputs,16);
assert.deepEqual(placed,placement(inputs,16),'Placement is deterministic');
assert.equal(placed[0].x,200);assert.equal(placed[0].y,200);
const rectangles=placed.map(p=>({left:p.x-p.w/2,right:p.x+p.w/2,top:p.y-p.h/2,bottom:p.y+p.h/2}));
for(let i=0;i<rectangles.length;i++){
 const a=rectangles[i];
 for(const b of rectangles.slice(i+1))assert.ok(a.right+16<=b.left||b.right+16<=a.left||a.bottom+16<=b.top||b.bottom+16<=a.top);
}
const offscreen=placement([{x:-100,y:100,w:900,h:900,hero:false}],10)[0];
assert.equal(offscreen.x,-100,'Viewport edges do not relocate or hide images');
assert.equal(offscreen.y,100);
for(const width of [1440,768,390]){
 context.innerWidth=width;context.scrollY=0;vm.runInContext('resize()',context);
 for(let section=-1;section<data.length;section++){
  const start=section<0?0:3535+section*2500-context.innerHeight*.24;
  context.scrollY=start+(section<0?10:context.innerHeight*.75+1);vm.runInContext('draw()',context);
  const placementBefore=vm.runInContext('networkPlacement',context);
  const gap=width<760?10:16;
  for(let i=0;i<placementBefore.length;i++)for(const b of placementBefore.slice(i+1)){
   const a=placementBefore[i];
   assert.ok(Math.abs(a.x-b.x)>=(a.w+b.w)/2+gap-1e-8||Math.abs(a.y-b.y)>=(a.h+b.h)/2+gap-1e-8,'Every card and label clears its neighbors');
  }
  for(const offset of (section<0?[10]:[800,900,1100,800])){
   context.scrollY=start+offset;vm.runInContext('draw()',context);
   [...cards,...photoCards].forEach(card=>assert.ok(!/NaN|Infinity/.test(card.style.transform),'Camera-relative positions stay finite'));
   assert.equal(vm.runInContext('networkPlacement',context),placementBefore,'Do not rerun spacing during scrolling');
  }
 }
 const before=[...cards,...photoCards].map(card=>card.style.transform);
 context.innerWidth=width+30;vm.runInContext('resize()',context);
 assert.notDeepEqual([...cards,...photoCards].map(card=>card.style.transform),before,'Width changes update placement');
}
// Every section boundary must interpolate continuously instead of snapping cards.
for(const width of [1440,768,390]){
 context.innerWidth=width;vm.runInContext('resize();setStill(false)',context);
 for(let section=0;section<=data.length;section++){
  const boundary=(section===0?1035:3535+(section-1)*2500)-context.innerHeight*.24;
  context.scrollY=boundary-.01;vm.runInContext('draw()',context);
  const before=[...cards,...photoCards].map(card=>card.style.transform.match(/-?[\d.]+/g).map(Number));
  context.scrollY=boundary+.01;vm.runInContext('draw()',context);
  [...cards,...photoCards].forEach((card,i)=>{
   const after=card.style.transform.match(/-?[\d.]+/g).map(Number);
   assert.ok(Math.hypot(after[0]-before[i][0],after[1]-before[i][1])<1,'Cards must not snap at a focus boundary');
   assert.ok(Math.abs(after.at(-1)-before[i].at(-1))<.01,'Scale must not snap at a focus boundary');
  });
  context.scrollY=boundary-context.innerHeight*.75;vm.runInContext('draw()',context);
  const sourcePositions=[...cards,...photoCards].map(card=>card.style.transform);
  context.scrollY=boundary+context.innerHeight*.75;vm.runInContext('draw()',context);
  assert.ok([...cards,...photoCards].some((card,i)=>card.style.transform!==sourcePositions[i]),'Images travel with the camera instead of staying fixed on screen');
  context.scrollY=boundary;vm.runInContext('draw()',context);
  const cachedLayouts=vm.runInContext('networkLayouts.size',context);
  for(const delta of [-20,-10,10,20]){context.scrollY=boundary+delta;vm.runInContext('draw()',context);}
  assert.equal(vm.runInContext('networkLayouts.size',context),cachedLayouts,'Camera movement reuses spacing layouts');
 }
}
console.log('Network movement: stable spacing, continuous camera transitions, offscreen placement, width updates pass.');

for(const project of data)for(const photo of project.photos)assert.ok(query('#chapters').innerHTML.includes(photo.src),'Every supporting image remains available in the gallery');

vm.runInContext("setSkill('AI systems');setStill(true)",context);
const stillPositions=[...cards,...photoCards].map(card=>card.style.transform);
context.scrollY+=100;vm.runInContext('draw()',context);
assert.deepEqual([...cards,...photoCards].map(card=>card.style.transform),stillPositions,'Still view and skill filters do not cause scroll drift');

const css=fs.readFileSync('site/style.css','utf8');
assert.ok(!/visibility:hidden/.test(css),'Panels enter naturally instead of being revealed at a focus threshold');
assert.ok(css.includes('min-height:220vh;padding-bottom:90vh'),'Short projects also have room for longer camera transitions');
for(const project of data)for(const photo of [project.hero,...project.photos,...project.detailImages])assert.ok(query('#chapters').innerHTML.includes(`width="${photo.width}" height="${photo.height}"`)||query('#nodes').innerHTML.includes(`width="${photo.width}" height="${photo.height}"`));
console.log('Natural scrolling: visible panels, reserved image space, longer transitions pass.');

context.innerWidth=1440;vm.runInContext('resize();setStill(false)',context);
const matrixStop=3535+5*2500-context.innerHeight*.24;
const cameraAt=offset=>{context.scrollY=matrixStop+offset*context.innerHeight;vm.runInContext('draw()',context);return context.window.projectNetworkPose.yaw;};
const startYaw=cameraAt(-.75),earlyYaw=cameraAt(-.25),lateYaw=cameraAt(.25),endYaw=cameraAt(.75);
assert.ok(startYaw>earlyYaw&&earlyYaw>lateYaw&&lateYaw>endYaw,'The camera is still transitioning on both sides of the old short transition window');
