const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('site/loading.js','utf8').replace(/import\('\.\/about-model\.js\?v=[^']+'\)/,'loadAvatarModule()');
const flush=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};
function opening({direct=false,saveData=false,reduced=false,compact=false}={}){
 const events={},timers=[],idle=[];
 let still=reduced,imports=0,focusTarget=null;
 const element=()=>({hidden:true,dataset:{},events:{},textContent:'',addEventListener(name,fn){this.events[name]=fn;},focus(){focusTarget=this;}});
 const images=Array.from({length:7},()=>({...element(),complete:false}));
 const hero={...element(),complete:false,dataset:{src:'reading.webp',srcset:'reading.webp 960w',sizes:'50vw'}};
 const portrait={...element(),complete:false};
 const view={...element(),contains:()=>false},main=element(),continueButton=element(),delay=element(),avatarButton=element(),status=element(),overview=element();
 const body={children:[view,main],classList:{add(){},remove(){},contains:()=>still}};
 const selectors={'#site-loading':view,'#continue-browsing':continueButton,'#loading-delay':delay,'[data-load-avatar]':avatarButton,'#avatar-status':status,'#project-6 .reading-hero img':hero,'#overview':overview,'.avatar-still':portrait};
 const context=vm.createContext({innerWidth:compact?390:1440,window:{aboutNetworkPose:{focused:false,hidden:false},requestIdleCallback:true},document:{body,hidden:false,activeElement:null,querySelector:s=>selectors[s],querySelectorAll:()=>images,addEventListener(){}},navigator:{connection:{saveData,effectiveType:'4g',addEventListener(){}}},matchMedia:()=>({matches:reduced,addEventListener(){}}),location:{hash:direct?'#project-6':''},Event:class{},dispatchEvent(){},addEventListener(name,fn){events[name]=fn;},setTimeout(fn,ms){timers.push({fn,ms});},requestAnimationFrame:fn=>fn(),requestIdleCallback:fn=>idle.push(fn),loadAvatarModule(){imports++;return Promise.resolve();}});
 vm.runInContext(source,context);
 return {api:context.window.portfolioLoading,view,main,images,hero,portrait,continueButton,delay,avatarButton,status,timers,idle,events,context,imports:()=>imports,setStill:value=>{still=value;}};
}
module.exports=(async()=>{
 let test=opening();
 assert.equal(test.view.hidden,false);assert.equal(test.main.inert,true);
 test.api.ready();await flush();assert.equal(test.view.hidden,false,'Pending opening images keep feedback visible');
 test.timers.find(t=>t.ms===3000).fn();assert.equal(test.continueButton.hidden,false,'A slow opening offers an escape');
 test.continueButton.events.click();await test.api.usable;
 assert.equal(test.view.hidden,true);assert.equal(test.main.inert,false,'Continue restores browsing');
 assert.equal(test.imports(),0,'Renderer imports are deferred beyond readiness');
 test.idle[0]();test.context.window.aboutNetworkPose.focused=true;test.events.networkpose();
 assert.equal(test.imports(),1,'Idle and About share one initialization');
 test=opening();test.api.ready();
 test.images.forEach((image,i)=>image.events[i?'load':'error']());await flush();
 assert.equal(test.view.hidden,true,'A failed opening image counts as settled');
 test=opening({compact:true});test.api.ready();
 assert.ok(test.images.every(image=>!image.events.load),'Compact opening never waits for hidden network images');
 assert.equal(test.imports(),0,'The animated portrait does not block readiness');
 test.portrait.events.load();await flush();assert.equal(test.view.hidden,true,'The still portrait is enough to open the compact site');
 test=opening({direct:true});test.api.ready();
 assert.equal(test.hero.src,'reading.webp','A direct link prioritizes its reading hero');
 assert.ok(test.images.every(image=>!image.events.load),'A direct link does not wait for overview images');
 test.hero.events.load();await flush();assert.equal(test.view.hidden,true);
 for(const options of [{saveData:true},{reduced:true}]){
  test=opening(options);test.continueButton.events.click();
  assert.equal(test.api.restricted(),true);assert.equal(test.idle.length,0);
  assert.equal(test.avatarButton.hidden,false);test.avatarButton.events.click();assert.equal(test.imports(),1,'Restricted visitors can explicitly load the avatar');
 }
 test=opening();test.setStill(true);test.continueButton.events.click();
 assert.equal(test.api.motionAllowed(),false);assert.equal(test.idle.length,0,'Still view avoids automatic motion downloads');
 test=opening();test.timers.find(t=>t.ms===10000).fn();assert.equal(test.view.hidden,true,'Failed app initialization cannot leave an overlay');
 const image={dataset:{src:'small.webp',srcset:'small.webp 240w',sizes:'155px'}};
 test.api.hydrate(image);assert.equal(image.src,'small.webp');assert.equal(image.dataset.src,undefined);
 console.log('Loading: readiness, direct links, errors, escape, deferred initialization, data/motion preferences pass.');
})();
