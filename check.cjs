// Run with node check.cjs: data/assets, skill routes, camera stops, and image viewer.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const uiEvents={};
let layoutShift=0;
const context=vm.createContext({window:{scrollBy(){},scrollTo({top}){context.scrollY=top;}},innerWidth:1440,innerHeight:900,devicePixelRatio:1,scrollY:0,matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(name,fn){(uiEvents[name]??=[]).push(fn);},dispatchEvent(){},Event:class{},requestAnimationFrame:fn=>fn(),location:{hash:''},history:{replaceState(state){this.state=state;},pushState(state,title,hash){context.location.hash=hash;this.state=state;}},setTimeout:()=>1,clearTimeout(){},getComputedStyle:card=>({width:String(card.offsetWidth),height:String(card.offsetHeight)})});
vm.runInContext(fs.readFileSync('site/projects.js','utf8'),context);
vm.runInContext(fs.readFileSync('site/media.js','utf8'),context);
const data=context.window.PORTFOLIO_PROJECTS;
assert.equal(new Set(data.map(p=>p.id)).size,data.length);
for(const project of data){
 const source=fs.readFileSync(project.editorialSource,'utf8');
 const parts=source.split(/^## (.+)\n/m);
 const sections=new Map();for(let i=1;i<parts.length;i+=2)sections.set(parts[i],parts[i+1].trim());
 assert.equal(project.atAGlance,sections.get('At a glance'));
 assert.equal(project.context,sections.get('Context'));
 assert.equal(project.skills.join(' · '),sections.get('Skills'));
 assert.equal(project.credits,sections.get('Credits'));
 assert.deepEqual(Array.from(project.caseStudy,section=>section.title),[...sections.keys()].filter(title=>!['At a glance','Context','Skills','Credits'].includes(title)));
 for(const section of project.caseStudy)assert.equal(section.text,sections.get(section.title),'Published copy matches the separate editorial source');
 assert.match(project.caseStudy[0].title,/^(Experience & intention|Intention & design)$/);
 assert.match(project.caseStudy[1].title,/^My role & /);
 assert.match(project.caseStudy[2].title,/^Outcome & (learning|reflection)$/);
 assert.ok(!('summary' in project)&&!('description' in project)&&!('skillEvidence' in project),'Do not send duplicate introductions or repeated skill prose');
 for(const image of [project.hero,...project.photos,...project.detailImages]){
  assert.ok(fs.existsSync('site/'+image.src),image.src);
  assert.ok(image.width>0&&image.height>0,'Images reserve their natural aspect ratio');
 }
}
assert.ok(fs.existsSync('site/assets/waving-textured.glb'));
const model=fs.readFileSync('site/assets/waving-textured.glb');
const gltf=JSON.parse(model.subarray(20,20+model.readUInt32LE(12)).toString());
const headIndex=gltf.nodes.findIndex(node=>/^(?:mixamorig:?)?Head$/i.test(node.name));
assert.equal(gltf.animations.length,1,'The character needs the wave animation');
assert.ok(headIndex>=0&&gltf.skins.some(skin=>skin.joints.includes(headIndex)),'The character needs a skinned Head bone');
const element=()=>({offsetWidth:88,offsetHeight:105,dataset:{},getBoundingClientRect:()=>({left:0,right:0,top:0,bottom:0,width:0,height:0}),querySelector:()=>null,style:{setProperty(name,value){this[name]=value;}},children:[],after(){},focus(){},getAttribute(){return null;},classList:{values:new Set(),toggle(name,on){on?this.values.add(name):this.values.delete(name);},contains(name){return this.values.has(name);}},addEventListener(){},setAttribute(){},removeAttribute(){},showModal(){},getContext(){return new Proxy({},{get:()=>()=>{}});}});
const disclosureEvents={};
const disclosure={...element(),addEventListener(name,fn){disclosureEvents[name]=fn;}};
const cards=data.map(()=>({...element(),offsetWidth:155,offsetHeight:220})),aboutChapter={...element(),offsetHeight:2500,getBoundingClientRect:()=>({top:1035-context.scrollY})},chapters=data.map((_,i)=>({...element(),offsetHeight:2500,getBoundingClientRect:()=>({top:3535+i*2500+layoutShift-context.scrollY})}));
const photoCards=data.flatMap(p=>[...p.photos.map(element),...(p.video?[element()]:[])]),selectors=new Map();
function query(s){if(!selectors.has(s))selectors.set(s,element());return selectors.get(s);}
selectors.set('#about-section',aboutChapter);
chapters.forEach((chapter,i)=>selectors.set('#project-'+(i+1),chapter));
selectors.set('#contact',{...element(),getBoundingClientRect:()=>({top:30000-context.scrollY})});
selectors.set('#network-stage',{...element(),getBoundingClientRect:()=>({top:350-context.scrollY,height:430})});
selectors.set('#about-avatar-space',{...element(),getBoundingClientRect:()=>({left:200,top:1200-context.scrollY,width:100,height:140})});
selectors.set('header',{...element(),getBoundingClientRect:()=>({bottom:110})});
selectors.set('footer',{...element(),getBoundingClientRect:()=>({top:context.innerHeight-65})});
query('#project-index').children=Array.from({length:data.length+2},element);
context.document={addEventListener(){},querySelector:query,querySelectorAll:s=>s==='details'?[disclosure]:s==='.node'?cards:s==='#chapters .chapter'?chapters:s==='.satellite'?photoCards:[],body:element(),documentElement:{scrollHeight:20000}};
vm.runInContext(fs.readFileSync('site/app.js','utf8'),context);
for(const project of data){
 assert.ok(project.atAGlance&&project.atAGlance.split(/\s+/).length<=110,'Every project has a short overview');
 const chapter=query('#chapters').innerHTML.split(`id="project-${project.id}"`)[1].split('</article>')[0];
 assert.ok(chapter.includes('<h3>At a glance</h3>'+vm.runInContext(`prose(${JSON.stringify(project.atAGlance)})`,context)),'Each description displays its overview');
}
context.innerWidth=1200;disclosureEvents.toggle();
assert.equal(vm.runInContext('width',context),1200,'Disclosure toggles remeasure layout even if the outer chapter height is unchanged');
context.innerWidth=1440;disclosureEvents.toggle();
const published=query('#chapters').innerHTML;
assert.ok(!/description pending|to confirm|working title|skills pending|description coming soon/i.test(published));
assert.equal((published.match(/<h3>At a glance<\/h3>/g)||[]).length,7,'Exactly one overview per project');
assert.equal((published.match(/<details>/g)||[]).length,5,'Only the longer technical stories have disclosures');
assert.ok(!/<details[^>]* open/.test(published),'Implementation details start closed');
assert.equal((published.match(/<summary>Implementation details<\/summary>/g)||[]).length,5);
const page=fs.readFileSync('site/index.html','utf8');
for(const href of ['mailto:wenk.julius@gmail.com','https://www.instagram.com/juliuswenk/','https://github.com/juliuswenk'])assert.equal(page.split(`href="${href}"`).length-1,href.startsWith('mailto:')?3:2,'Contact links appear in About and the ending, with email also in Impressum');
assert.equal(data[4].title,'Hyperreal Ravelord');
assert.match(published,/BEASTBOY/);
assert.match(data[4].caseStudy[2].text,/would improve the animation/);
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
assert.ok(query('#chapters').innerHTML.includes('<em>Hyperreal Ravelord</em>'));
assert.ok(!query('#chapters').innerHTML.includes('Project description coming soon.'));
assert.ok(query('#chapters').innerHTML.includes('https://juliuswenk.github.io/veiled-panopticon/'));
assert.equal(vm.runInContext("prose('<script> & **safe**')",context),'<p>&lt;script&gt; &amp; <strong>safe</strong></p>');
for(const width of [1440,1000,768,390,320]){
 context.innerWidth=width;context.scrollY=0;vm.runInContext('resize()',context);
 assert.ok(cards.every(card=>card.style.visibility==='visible'),'Overview heroes are visible');
 assert.ok(photoCards.every(card=>card.style.visibility==='hidden'&&card.tabIndex===-1),'Supporting previews remain secondary');
 vm.runInContext('preview(0)',context);
 photoCards.forEach((card,k)=>assert.equal(card.style.visibility,width>=1000&&vm.runInContext(`networkMedia[${k}].projectIndex`,context)===0?'visible':'hidden'));
 vm.runInContext('preview(-1)',context);
 context.scrollY=1035;vm.runInContext('draw()',context);
 assert.equal(context.window.aboutNetworkPose.portrait,width>=1000,'Only desktop About uses the large portrait');
 const avatar=query('#about-node'),portraitTransform=avatar.style.transform;
 if(width>=1000){
  assert.ok(parseFloat(avatar.style.width)>=vm.runInContext('aboutFrame.w',context),'The character fills the shared media column');
  assert.ok(avatar.style.transform.startsWith('translate('+vm.runInContext('aboutFrame.x',context)+'px,'),'The portrait is anchored to the shared media column');
  assert.ok(parseFloat(avatar.style.height)>context.innerHeight*.7,'The portrait fills the usable viewport');
  context.scrollY+=300;vm.runInContext('draw()',context);
  assert.equal(avatar.style.transform,portraitTransform,'The portrait holds its framing beside the scrolling biography');
 }else assert.equal(avatar.style.height,'140px','Phone About retains its stacked composition');
 const entries=vm.runInContext('projectEntries',context);
 for(let i=0;i<data.length;i++){
  const entry=entries[i];context.scrollY=entry.open;vm.runInContext('draw()',context);
  assert.equal(query('#view-name').textContent,data[i].title);
  assert.equal(context.document.body.dataset.networkPhase,'reading');
  context.scrollY=entry.open-.5;vm.runInContext('draw()',context);
  assert.equal(context.document.body.dataset.networkPhase,'reading','Fractional anchor settling cannot disable the reading hero');
  context.scrollY=entry.open;vm.runInContext('draw()',context);
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
const navigationFrames=[];context.requestAnimationFrame=fn=>navigationFrames.push(fn);
context.innerWidth=1440;context.scrollY=0;vm.runInContext('cancelNavigation();goTo("#project-1")',context);
assert.equal(chapters[0].getBoundingClientRect().top,16,'Project navigation explicitly settles at its reading position');
layoutShift=84;vm.runInContext('resize()',context);
assert.equal(chapters[0].getBoundingClientRect().top,16,'Late layout changes preserve the intended navigation destination');
assert.equal(context.document.body.dataset.networkPhase,'reading','Reflow cannot leave explicit navigation in Connecting');
uiEvents.wheel.forEach(fn=>fn());const userScroll=context.scrollY;layoutShift+=50;vm.runInContext('resize()',context);
assert.equal(context.scrollY,userScroll,'User input cancels automatic destination correction');
while(navigationFrames.length)navigationFrames.shift()();
vm.runInContext('goTo("#project-1")',context);
while(navigationFrames.length)navigationFrames.shift()();
assert.equal(vm.runInContext('pendingNavigation',context),null,'Arrival correction releases after the destination has settled');
context.requestAnimationFrame=fn=>fn();
layoutShift=0;context.scrollY=0;context.location.hash='';vm.runInContext('cancelNavigation();resize()',context);
assert.equal((query('#project-names').innerHTML.match(/href="#project-/g)||[]).length,7,'Every project has a named route');
assert.ok(page.includes('<details class="about-cv"><summary>CV'));
assert.ok(!page.includes('<details class="about-cv" open'));
assert.ok(published.includes('project-onward'),'Onward actions follow both columns');
assert.ok(page.includes('id="project-menu"')&&page.includes('id="project-names"'));
assert.ok(page.includes('id="network-stage"')&&page.includes('Connected through shared skills'));
assert.ok(!/rel="canonical"|property="og:image"/.test(page),'No fabricated public URL is published before hosting is chosen');
const missingPage=fs.readFileSync('site/404.html','utf8');
assert.ok(missingPage.includes('href="/#overview"')&&!missingPage.includes('<script'),'404 navigation works independently from a nested missing path');
const preview=fs.readFileSync('site/assets/social-preview.jpg');
assert.ok(preview.length>10000&&preview.length<300000,'The social image is prepared as a lightweight real asset');
assert.ok(fs.statSync('site/assets/hyperreal-spin-web.webm').size<9000000);
assert.ok(fs.statSync('site/assets/hyperreal-spin-web.webm').size<fs.statSync('site/assets/hyperreal-spin.webm').size,'The current all-keyframe video is smaller than its preserved predecessor');

const carry=data.find(p=>p.id===7),matrix=data.find(p=>p.id===6);
assert.equal(carry.hero.src,'assets/carry-the-computation-setup.webp','The printer/controller setup is the Carry hero');
assert.ok(![carry.hero,...carry.photos,...carry.detailImages].some(image=>image.src==='assets/carry-the-computation-hero.webp'),'The pedestal image is no longer published');
assert.ok(!carry.detailImages.some(image=>image.src===carry.hero.src),'The new hero is not repeated in the gallery');
const matrixOrder=['matrix-lamp-studio-rear.webp','matrix-lamp-studio-front.webp','matrix-lamp-06.webp'].map(name=>'assets/'+name);
assert.deepEqual(Array.from(matrix.detailImages,image=>image.src),matrixOrder,'The viewer presents the finished lamp before development');
const renderedMatrix=vm.runInContext('projectChapter(projects[5])',context);
assert.deepEqual([...renderedMatrix.matchAll(/data-original="([^"]+)"/g)].map(match=>match[1]),[matrix.hero.src,...matrixOrder],'The reading gallery follows the same order without duplicate network views');
const readingImageOrder=[
 [
  "assets/doxa-installation-melissa.webp",
  "assets/doxa-04.webp",
  "assets/doxa-03.webp",
  "assets/doxa-05.webp",
  "assets/doxa-diagram.png",
  "assets/doxa-02.webp"
 ],
 [
  "assets/visio-technologica-city-hero.png",
  "assets/visio-technologica-vr-participant.png",
  "assets/visio-technologica-04.webp",
  "assets/visio-technologica-05.webp"
 ],
 [
  "assets/veiled-panopticon-01.webp",
  "assets/veiled-panopticon-05.webp",
  "assets/veiled-panopticon-03.webp",
  "assets/veiled-panopticon-02.webp",
  "assets/veiled-panopticon-04.webp",
  "assets/veiled-panopticon-06.webp"
 ],
 [
  "assets/improving-futurium-01.webp",
  "assets/improving-futurium-04.webp",
  "assets/improving-futurium-06.webp",
  "assets/improving-futurium-02.webp",
  "assets/improving-futurium-05.webp",
  "assets/improving-futurium-03.webp"
 ],
 [
  "assets/hyperreal-spin-poster.png"
 ],
 [
  "assets/matrix-lamp-hero.png",
  "assets/matrix-lamp-studio-rear.webp",
  "assets/matrix-lamp-studio-front.webp",
  "assets/matrix-lamp-06.webp"
 ],
 [
  "assets/carry-the-computation-setup.webp",
  "assets/carry-the-computation-printer.webp",
  "assets/carry-the-computation-controller.webp",
  "assets/carry-the-computation-receipts.webp"
 ]
];
for(const p of data){
 const chapter=vm.runInContext(`projectChapter(projects[${p.id-1}])`,context);
 assert.equal((chapter.match(/class="reading-figure reading-hero"/g)||[]).length,1,'One reading hero per project');
 assert.deepEqual([...chapter.matchAll(/data-original="([^"]+)"/g)].map(match=>match[1]),readingImageOrder[p.id-1],'Editorial changes preserve the selected image sequence');
 const paired=[...chapter.matchAll(/class="reading-figure reading-paired"[\s\S]*?data-original="([^"]+)"/g)].map(match=>readingImageOrder[p.id-1].indexOf(match[1]));
 assert.equal(paired.length,(p.pairedMedia||[]).length);
 assert.equal(paired.length%2,0);
 for(let i=0;i<paired.length;i+=2)assert.equal(paired[i+1],paired[i]+1,'Paired figures stay adjacent and preserve the phone sequence');

 for(const [collection,placements] of Object.entries(p.mediaSections||{})){
  assert.equal(placements.length,p[collection].length);
  placements.forEach(index=>assert.ok(index>=0&&index<p.caseStudy.length));
 }
 for(const image of [p.hero,...p.photos,...p.detailImages])assert.equal(chapter.split(`data-original="${image.src}"`).length-1,1,'Every image appears once in the reading layout');
}
vm.runInContext("openPhoto(0,'detailImages',1)",context);
assert.ok(query('#photo-large').innerHTML.includes(data[0].detailImages[1].src));
assert.ok(query('#photo-credit').textContent.includes('Melissa'));
assert.ok(data[4].skills.includes('3D modeling'));
assert.ok(data[3].skills.includes('3D visualization')&&data[4].skills.includes('3D visualization'),'The personal study has an evidenced connection to the avatar workflow');
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
let enableVideo;
const videoEvents={},networkEvents={},buttonEvents={};
const videoButton={querySelector(){return this;},append(media){media.host=this;},dataset:{project:'5'},classList:{add(){},remove(){}},setAttribute(){},addEventListener(name,fn){buttonEvents[name]=fn;}};
const video={dataset:{frames:'360',fps:'25',webm:'movie.webm',hevc:'movie.mov'},loads:0,readyState:4,duration:14.4,currentTime:0,seeking:false,paused:true,canPlayType:()=>'',closest:()=>videoButton,addEventListener(name,fn){videoEvents[name]=fn;},load(){this.loads++;},pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();}};
const readingVideoButton={...videoButton};
let videoStill=false;
const loadTurntable={hidden:true,addEventListener(name,fn){buttonEvents.load=fn;}},turntableStatus={};
const videoDocument={hidden:false,querySelector:selector=>selector==='[data-load-turntable]'?loadTurntable:selector==='#turntable-status'?turntableStatus:selector.startsWith('.turntable')?readingVideoButton:video,body:{classList:{contains:()=>videoStill}},addEventListener(name,fn){networkEvents[name]=fn;}};
const videoContext=vm.createContext({document:videoDocument,navigator:{userAgent:'Chrome'},window:{projectNetworkPose:{overview:true,projectId:null},portfolioLoading:{usable:{then(fn){enableVideo=fn;}},restricted:()=>videoStill,motionAllowed:()=>!videoStill}},innerWidth:1000,console,requestAnimationFrame:fn=>fn(),addEventListener(name,fn){networkEvents[name]=fn;}});
vm.runInContext(fs.readFileSync('site/project-video.js','utf8').replace('export function','function'),videoContext);
assert.equal(video.src,undefined,'No turntable request at startup');
enableVideo();assert.equal(video.src,undefined,'Opening readiness does not request the turntable');
buttonEvents.focus();assert.equal(video.src,'movie.webm','Keyboard intent attaches the supported source');videoEvents.loadeddata();buttonEvents.focus();assert.equal(video.loads,1,'Repeated intent cannot request a second player');
assert.ok(!video.paused&&video.loop,'Overview loops after intent');
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
videoEvents.error();assert.ok(video.paused&&turntableStatus.textContent.includes('unavailable'),'Failed motion keeps a useful poster fallback');
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
const layered=[{x:200,y:200,w:100,h:100,labelW:30,labelH:20,hero:true},{x:120,y:130,w:100,h:100,labelW:30,labelH:20,hero:true}];
const gentleOverlap=placement(layered,8);
assert.equal(gentleOverlap[1].x,120);assert.equal(gentleOverlap[1].y,130,'Small image-edge overlaps do not rearrange otherwise clear captions');
const blockedCaption=placement([layered[0],{...layered[1],x:200,y:260}],8);
assert.ok(blockedCaption[1].x!==200||blockedCaption[1].y!==260,'A caption covered by another image still needs clearance');
const blockedText=placement([layered[0]],8,{},[{left:150,right:250,top:150,bottom:250}]);
assert.ok(blockedText[0].x!==200||blockedText[0].y!==200,'Reading obstacles remain strict even though image bodies may overlap');
const offscreen=placement([{x:-100,y:100,w:900,h:900,hero:false}],10)[0];
assert.equal(offscreen.x,-100,'Viewport edges do not relocate or hide images');
assert.equal(offscreen.y,100);
for(const [viewWidth,viewHeight] of [[1000,700],[1440,600],[1440,900],[1920,1080],[2048,1228]]){
 context.scrollY=0;context.innerWidth=viewWidth;context.innerHeight=viewHeight;vm.runInContext('resize()',context);
 const extent=vm.runInContext('[...points,...anchors,about].map(point=>screenPoint(point,networkScene(0).pose))',context);
 for(const point of extent){
  assert.ok(point.x>=0&&point.x<=viewWidth,'The complete overview fits horizontally');
  assert.ok(point.y>=134&&point.y<=viewHeight-89,'The complete overview stays clear of header and footer');
 }
}
context.scrollY=0;context.innerWidth=1440;context.innerHeight=900;vm.runInContext('resize()',context);
const beforeHeight=cards.map(card=>card.style.transform);
context.innerHeight=700;vm.runInContext('resize()',context);
assert.notDeepEqual(cards.map(card=>card.style.transform),beforeHeight,'Height-only resize updates the overview bounds');
const css=fs.readFileSync('site/style.css','utf8');
assert.ok(css.includes('#chapters .project-chapter{display:block;min-height:0;height:auto;'),'Reading sections have natural height');
assert.ok(css.includes('body.reading-project #network{opacity:1}'),'The network remains visible while reading');
assert.ok(css.includes('.network-passage{height:70svh;'),'Every project has a network transition interval');
console.log('Connected reading: registered hero poses, fixed reading geometry, every project transition, exposed-node navigation, media placement, viewer, and single-player turntable pass.');

const manifest=context.window.PORTFOLIO_MEDIA;
let overviewBytes=0;
for(const p of data){
 for(const image of [p.hero,...p.photos,...p.detailImages]){
  const variants=manifest[image.src];assert.ok(variants?.length,'Every published image has variants');
  for(const variant of variants)assert.ok(fs.statSync('site/'+variant.src).size>0);
 }
 overviewBytes+=fs.statSync('site/'+manifest[p.hero.src][0].src).size;
}
assert.ok(overviewBytes<150000,'Small overview hero files stay under 150 KB combined');
assert.equal(data[0].hero.source,'2 DOXA © Melissa Papafio-Roberts.png');
assert.equal(data[0].hero.credit,'© Melissa Papafio-Roberts');
const compactModel=fs.readFileSync('site/assets/avatar-web.glb');
const compactGltf=JSON.parse(compactModel.subarray(20,20+compactModel.readUInt32LE(12)).toString());
const compactHead=compactGltf.nodes.findIndex(node=>/^(?:mixamorig:?)?Head$/i.test(node.name));
assert.ok(compactModel.length<3000000,'Avatar stays below 3 MB');
assert.equal(compactGltf.animations.length,1);
for(const name of ['HeadTop_End','LeftHandIndex4','RightHandIndex4','LeftLeg','RightLeg'])assert.ok(compactGltf.nodes.some(node=>node.name.endsWith(name)),'The portrait framing needs wave and knee landmarks');
assert.ok(compactHead>=0&&compactGltf.skins.some(skin=>skin.joints.includes(compactHead)));
assert.ok(fs.statSync('site/assets/avatar-still.webp').size<30000);
assert.ok(!fs.readFileSync('site/index.html','utf8').includes('src="about-model.js'),'The renderer is not an opening module');
assert.ok(!query('#supporting-images').innerHTML.match(/<iframe src=/),'Hidden preview players have no source');
assert.ok(!query('#chapters').innerHTML.match(/<img src=/),'Reading sources wait for approach');
assert.ok(query('#nodes').innerHTML.includes('preload="none"'));
require('./site/tools/check-loading.cjs').catch(error=>{console.error(error);process.exitCode=1;});
