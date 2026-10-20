// Run with node check.cjs: data/assets, skill routes, camera stops, and image viewer.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({window:{scrollBy(){}},innerWidth:1440,innerHeight:900,devicePixelRatio:1,scrollY:0,matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},dispatchEvent(){},Event:class{},requestAnimationFrame:fn=>fn(),location:{hash:''},history:{},setTimeout:()=>1,clearTimeout(){},getComputedStyle:card=>({width:String(card.offsetWidth),height:String(card.offsetHeight)})});
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
const element=()=>({offsetWidth:88,offsetHeight:105,dataset:{},getBoundingClientRect:()=>({left:0,right:0,top:0,bottom:0,width:0,height:0}),querySelector:()=>null,style:{setProperty(name,value){this[name]=value;}},children:[],after(){},classList:{values:new Set(),toggle(name,on){on?this.values.add(name):this.values.delete(name);},contains(name){return this.values.has(name);}},addEventListener(){},setAttribute(){},removeAttribute(){},showModal(){},getContext(){return new Proxy({},{get:()=>()=>{}});}});
const cards=data.map(()=>({...element(),offsetWidth:155,offsetHeight:220})),aboutChapter={...element(),offsetHeight:2500,getBoundingClientRect:()=>({top:1035-context.scrollY})},chapters=data.map((_,i)=>({...element(),offsetHeight:2500,getBoundingClientRect:()=>({top:3535+i*2500-context.scrollY})}));
const photoCards=data.flatMap(p=>[...p.photos.map(element),...(p.video?[element()]:[])]),selectors=new Map();
function query(s){if(!selectors.has(s))selectors.set(s,element());return selectors.get(s);}
selectors.set('#about-section',aboutChapter);
selectors.set('header',{...element(),getBoundingClientRect:()=>({bottom:110})});
selectors.set('footer',{...element(),getBoundingClientRect:()=>({top:context.innerHeight-65})});
query('#project-index').children=Array.from({length:data.length+2},element);
context.document={addEventListener(){},querySelector:query,querySelectorAll:s=>s==='.node'?cards:s==='#chapters .chapter'?chapters:s==='.satellite'?photoCards:[],body:element(),documentElement:{scrollHeight:20000}};
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
for(const width of [1440,1000,768,390,320]){
 context.innerWidth=width;context.scrollY=0;vm.runInContext('resize()',context);
 assert.ok(cards.every(card=>card.style.visibility==='visible'),'Overview heroes are visible');
 assert.ok(photoCards.every(card=>card.style.visibility==='hidden'&&card.tabIndex===-1),'Supporting previews remain secondary');
 vm.runInContext('preview(0)',context);
 photoCards.forEach((card,k)=>assert.equal(card.style.visibility,vm.runInContext(`networkMedia[${k}].projectIndex`,context)===0?'visible':'hidden'));
 vm.runInContext('preview(-1)',context);
 const entries=vm.runInContext('projectEntries',context);
 for(let i=0;i<data.length;i++){
  const entry=entries[i];context.scrollY=entry.open;vm.runInContext('draw()',context);
  assert.equal(query('#view-name').textContent,data[i].title);
  assert.equal(context.document.body.dataset.networkPhase,'reading');
  assert.equal(cards[i].style.visibility,'hidden','Only the duplicate selected image is hidden');
  assert.ok(cards.some((card,k)=>k!==i&&card.style.visibility==='visible'),'Other projects remain recognisable');
  assert.ok(cards.some((card,k)=>k!==i&&card.tabIndex===0),'Exposed network nodes remain keyboard-accessible');
  const point=vm.runInContext(`screenPoint(anchors[${i}],registeredPose(${i}))`,context);
  assert.ok(Math.abs(point.x-entry.x)<1e-8&&Math.abs(point.y-entry.y)<1e-8,'Camera registers the hero at the column opening');
  const pose={...context.window.projectNetworkPose},transforms=cards.map(card=>card.style.transform);
  context.scrollY+=600;vm.runInContext('draw()',context);
  for(const key of ['x','y','yaw','zoom'])assert.equal(context.window.projectNetworkPose[key],pose[key],'Reading camera stays fixed');
  assert.deepEqual(cards.map(card=>card.style.transform),transforms,'Network cards do not follow scrolling content');
  vm.runInContext("setSkill('Interaction design')",context);
  assert.equal(cards[i].style.visibility,'hidden','Skill selection cannot duplicate the selected hero');
  vm.runInContext(`protection=[{left:-1000,right:10000,top:0,bottom:100000}];draw()`,context);
  assert.ok([...cards,...photoCards].every(card=>card.tabIndex===-1&&card.style.pointerEvents==='none'),'Covered nodes cannot capture keyboard or pointer input');
  vm.runInContext("protection=[];setSkill('')",context);
  context.scrollY=(entry.start+entry.open)/2;vm.runInContext('draw()',context);
  assert.equal(context.document.body.dataset.networkPhase,'transition');
  assert.equal(context.window.projectNetworkPose.projectId,data[i].id);
  assert.equal(cards[i].style.visibility,'visible','The network hero is visible during arrival');
  if(i){
   const previous=vm.runInContext(`registeredPose(${i-1})`,context);
   const begin=vm.runInContext(`networkScene(projectEntries[${i}].start)`,context);
   for(const key of ['x','y','yaw','zoom'])assert.equal(begin.pose[key],previous[key],'Transition starts at the preceding reading pose');
  }
  const nearEnd=vm.runInContext(`networkScene(projectEntries[${i}].open-.001)`,context);
  const end=vm.runInContext(`registeredPose(${i})`,context);
  assert.ok(Math.abs(nearEnd.pose.x-end.x)<.01&&Math.abs(nearEnd.pose.y-end.y)<.01,'Arrival ends without a camera snap');
  vm.runInContext('setStill(true)',context);
  const still=vm.runInContext(`networkScene(${entry.start+1})`,context);
  for(const key of ['x','y','yaw','zoom'])assert.equal(still.pose[key],end[key],'Reduced motion uses the settled pose without animated travel');
  context.scrollY=entry.start+20;vm.runInContext('draw()',context);
  const stillTransforms=cards.map(card=>card.style.transform);
  context.scrollY=entry.open-20;vm.runInContext('draw()',context);
  assert.deepEqual(cards.map(card=>card.style.transform),stillTransforms,'Still view also freezes context card placement throughout a transition');
  vm.runInContext('setStill(false)',context);
 }
 for(const y of [0,...entries.flatMap(e=>[e.start+1,e.open+1]),...entries.flatMap(e=>[e.open+1,e.start+1]).reverse(),0]){
  context.scrollY=y;vm.runInContext('draw()',context);
  const scene=vm.runInContext(`networkScene(${y})`,context);
  assert.equal(chapters.findIndex(chapter=>chapter.classList.contains('is-active')),scene.current,'Reverse scrolling and active navigation agree');
  [...cards,...photoCards].forEach(card=>assert.ok(!/NaN|Infinity/.test(card.style.transform)));
 }
}
const carry=data.find(p=>p.id===7),matrix=data.find(p=>p.id===6);
assert.equal(carry.hero.src,'assets/carry-the-computation-setup.webp','The printer/controller setup is the Carry hero');
assert.ok(![carry.hero,...carry.photos,...carry.detailImages].some(image=>image.src==='assets/carry-the-computation-hero.webp'),'The pedestal image is no longer published');
assert.ok(!carry.detailImages.some(image=>image.src===carry.hero.src),'The new hero is not repeated in the gallery');
const matrixOrder=['matrix-lamp-06.webp','matrix-lamp-05.webp','matrix-lamp-network-led-detail.png','matrix-lamp-network-profile.png','matrix-lamp-studio-rear.webp','matrix-lamp-studio-front.webp'].map(name=>'assets/'+name);
assert.deepEqual(Array.from(matrix.detailImages,image=>image.src),matrixOrder,'The viewer follows development through to the finished lamp');
const renderedMatrix=vm.runInContext('projectChapter(projects[5])',context);
assert.deepEqual([...renderedMatrix.matchAll(/<img src="([^"]+)"/g)].map(match=>match[1]),[matrix.hero.src,...matrixOrder],'The reading gallery follows the same order without duplicate network views');
for(const p of data){
 const chapter=vm.runInContext(`projectChapter(projects[${p.id-1}])`,context);
 assert.equal((chapter.match(/class="reading-figure reading-hero"/g)||[]).length,1,'One reading hero per project');
 for(const [collection,placements] of Object.entries(p.mediaSections||{})){
  assert.equal(placements.length,p[collection].length);
  placements.forEach(index=>assert.ok(index>=0&&index<p.caseStudy.length));
 }
 for(const image of [p.hero,...p.photos,...p.detailImages])assert.equal(chapter.split(`src="${image.src}"`).length-1,1,'Every image appears once in the reading layout');
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
const videoButton={querySelector(){return this;},append(media){media.host=this;},dataset:{project:'5'},classList:{add(){},remove(){}},setAttribute(){},addEventListener(name,fn){buttonEvents[name]=fn;}};
const video={dataset:{frames:'360',fps:'25',webm:'movie.webm',hevc:'movie.mov'},readyState:4,duration:14.4,currentTime:0,seeking:false,paused:true,canPlayType:()=>'',closest:()=>videoButton,addEventListener(name,fn){videoEvents[name]=fn;},pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}};
const readingVideoButton={...videoButton};
let videoStill=false;
const videoDocument={hidden:false,querySelector:selector=>selector.startsWith('.turntable')?readingVideoButton:video,body:{classList:{contains:()=>videoStill}},addEventListener(name,fn){networkEvents[name]=fn;}};
const videoContext=vm.createContext({document:videoDocument,navigator:{userAgent:'Chrome'},window:{projectNetworkPose:{overview:true,projectId:null}},innerWidth:1000,console,requestAnimationFrame:fn=>fn(),addEventListener(name,fn){networkEvents[name]=fn;}});
vm.runInContext(fs.readFileSync('site/project-video.js','utf8').replace('export function','function'),videoContext);
assert.ok(!video.paused&&video.loop,'Overview loops');
videoContext.window.projectNetworkPose={phase:'reading',overview:false,projectId:5};networkEvents.networkpose();
assert.ok(!video.paused&&!video.loop&&video.currentTime===0,'Focus restarts one turn');
assert.equal(video.host,readingVideoButton,'The single player moves into the reading hero');
video.currentTime=video.duration;videoEvents.ended();
assert.ok(video.paused,'One turn ends in manual mode');
networkEvents.pointermove({pointerType:'mouse',clientX:100});networkEvents.pointermove({pointerType:'mouse',clientX:200});
const rightFrame=video.currentTime;assert.ok(rightFrame>0&&rightFrame<2,'Right crosses the loop seam');
networkEvents.pointermove({pointerType:'mouse',clientX:200});assert.equal(video.currentTime,rightFrame,'Stationary mouse does not advance');
networkEvents.pointermove({pointerType:'mouse',clientX:100});assert.ok(video.currentTime>14,'Left returns to the previous facing');
videoStill=true;networkEvents.networkpose();const frozen=video.currentTime;
networkEvents.pointermove({pointerType:'mouse',clientX:300});assert.equal(video.currentTime,frozen,'Still view freezes movement');
videoStill=false;videoContext.window.projectNetworkPose={phase:'reading',overview:false,projectId:3};networkEvents.networkpose();assert.ok(video.paused,'Other projects pause the video');
assert.equal(video.host,videoButton,'The player returns to the overview host');
videoContext.window.projectNetworkPose={phase:'reading',overview:false,projectId:5};networkEvents.networkpose();assert.ok(!video.paused&&video.currentTime===0,'Re-entering focus replays once');
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
context.scrollY=0;context.innerWidth=1440;vm.runInContext('resize()',context);
const beforeHeight=cards.map(card=>card.style.transform);
context.innerHeight=700;vm.runInContext('resize()',context);
assert.notDeepEqual(cards.map(card=>card.style.transform),beforeHeight,'Height-only resize updates the overview bounds');
const css=fs.readFileSync('site/style.css','utf8');
assert.ok(css.includes('#chapters .project-chapter{display:block;min-height:0;height:auto;'),'Reading sections have natural height');
assert.ok(css.includes('body.reading-project #network{opacity:1}'),'The network remains visible while reading');
assert.ok(css.includes('.network-passage{height:70svh;'),'Every project has a network transition interval');
console.log('Connected reading: registered hero poses, fixed reading geometry, every project transition, exposed-node navigation, media placement, viewer, and single-player turntable pass.');
