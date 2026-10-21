import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const button = document.querySelector('#about-node');
const canvas = document.querySelector('#about-model');

try {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(canvas.clientWidth || 96, canvas.clientHeight || 116, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(2, 3, 5);
  scene.add(light);
  const camera = new THREE.OrthographicCamera(-1, 1, 1.2, -1.2, 0.1, 20);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  const figure = new THREE.Group();
  scene.add(figure);
  let portraitBounds=null, bustBounds=null, cameraKey='', portraitMix=0;
  let head;
  let headPose;
  let mixer, wave;
  let focused = false, wavePlaying = false;
  let lastFrame = performance.now();
  let lookX = 0, lookY = 0, targetX = 0, targetY = 0;
  let animating = false;
  const yaw = new THREE.Quaternion();
  const pitch = new THREE.Quaternion();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const xAxis = new THREE.Vector3(1, 0, 0);

  new GLTFLoader().load('assets/avatar-web.glb?v=1', gltf => {
    const bounds = new THREE.Box3().setFromObject(gltf.scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    if (!Number.isFinite(size.length()) || size.length() === 0) throw new Error('Empty model');
    gltf.scene.position.copy(center).multiplyScalar(-1);
    figure.scale.setScalar(2.4/Math.max(size.x, size.y, size.z));
    figure.add(gltf.scene);
    gltf.scene.traverse(object => {if(object.isBone && /^(?:mixamorig:?)?Head$/i.test(object.name))head=object;});
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      wave = mixer.clipAction(gltf.animations[0]);
      wave.setLoop(THREE.LoopOnce, 1);
      wave.clampWhenFinished = true;
      wave.play();
      wave.paused = true;
      mixer.update(0);
      mixer.addEventListener('finished', () => {wavePlaying=false;});
    }
    const frameBones=[], knees=[], chest=[];
    gltf.scene.traverse(object => {
      if (!object.isBone) return;
      if (/HeadTop_End$|HandIndex4$/i.test(object.name)) frameBones.push(object);
      if (/(?:Left|Right)Leg$/i.test(object.name)) knees.push(object);
      if (/Spine2$/i.test(object.name)) chest.push(object);
    });
    if (frameBones.length && knees.length) {
      // Measure the full wave once so the portrait camera never crops the raised hand.
      const range=new THREE.Box3(), point=new THREE.Vector3();
      let kneeY=Infinity,chestY=Infinity;
      if (wave) wave.paused=false;
      for (let i=0;i<=36;i++) {
        if (mixer) mixer.setTime(gltf.animations[0].duration*i/36);
        scene.updateMatrixWorld(true);
        frameBones.forEach(bone=>range.expandByPoint(bone.getWorldPosition(point)));
        knees.forEach(bone=>{kneeY=Math.min(kneeY,bone.getWorldPosition(point).y);});
        chest.forEach(bone=>{chestY=Math.min(chestY,bone.getWorldPosition(point).y);});
      }
      portraitBounds={top:range.max.y+.08,bottom:kneeY-.08,left:range.min.x-.12,right:range.max.x+.12};
      bustBounds={...portraitBounds,bottom:Number.isFinite(chestY)?chestY-.22:portraitBounds.bottom};
      if (wave) {wave.reset().play();wave.paused=true;mixer.update(0);}
    }
    if (head) headPose = head.quaternion.clone();
    button.classList.add('model-ready');
    dispatchEvent(new Event('avatarready'));
    render();
  }, undefined, error => {console.warn('About model could not load:', error);dispatchEvent(new Event('avatarerror'));});

  function render() {
    if (!button.classList.contains('model-ready')) return;
    if (window.aboutNetworkPose?.hidden) {
      focused = wavePlaying = false;
      if (wave) wave.paused = true;
      return;
    }
    const now = performance.now();
    const delta = Math.min((now-lastFrame)/1000, .05);
    lastFrame = now;
    // Remove the previous pointer offset before the mixer writes the animated head pose.
    if (headPose) head.quaternion.copy(headPose);
    const moving = window.portfolioLoading.motionAllowed() && !document.hidden;
    const compact=!!window.aboutNetworkPose?.compact;
    if(compact)targetX=targetY=0;
    const portraitTarget=window.aboutNetworkPose?.portrait&&portraitBounds?1:0;
    portraitMix=moving&&!compact?portraitMix+(portraitTarget-portraitMix)*(1-Math.exp(-delta*9)):portraitTarget;
    if (Math.abs(portraitTarget-portraitMix)<.001) portraitMix=portraitTarget;
    const inFocus = !!window.aboutNetworkPose?.focused && moving && (!portraitTarget || portraitMix>.97);
    if (wave && inFocus !== focused) {
      wave.reset().play();
      wave.paused = !inFocus;
      wavePlaying = inFocus;
    }
    focused = inFocus;
    if (mixer) mixer.update(delta);
    if (headPose) headPose.copy(head.quaternion);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // Allocate for the destination once; CSS can ease the visible size without reallocating WebGL every frame.
    const bufferWidth=parseFloat(button.style.width)||width, bufferHeight=parseFloat(button.style.height)||height;
    if (canvas.width !== Math.round(bufferWidth * renderer.getPixelRatio()) || canvas.height !== Math.round(bufferHeight * renderer.getPixelRatio())) {
      renderer.setSize(bufferWidth, bufferHeight, false);
    }
    const nextCameraKey=`${width}:${height}:${portraitMix}:${compact}`;
    if (cameraKey!==nextCameraKey) {
      cameraKey=nextCameraKey;
      if (portraitBounds && portraitMix>0) {
        const frame=compact?bustBounds:portraitBounds, aspect=width/height;
        const viewHeight=Math.max(frame.top-frame.bottom,(frame.right-frame.left)/aspect);
        const halfWidth=viewHeight*aspect/2, centerX=(frame.left+frame.right)/2;
        camera.left=THREE.MathUtils.lerp(-1,centerX-halfWidth,portraitMix);
        camera.right=THREE.MathUtils.lerp(1,centerX+halfWidth,portraitMix);
        camera.bottom=THREE.MathUtils.lerp(-1.2,frame.bottom,portraitMix);
        camera.top=THREE.MathUtils.lerp(1.2,frame.bottom+viewHeight,portraitMix);
      } else {
        camera.left=-1;camera.right=1;camera.top=1.2;camera.bottom=-1.2;
      }
      camera.updateProjectionMatrix();
    }
    figure.rotation.y = (window.aboutNetworkPose?.yaw ?? .33) - .33;
    if (headPose) {
      const blend = 1-Math.exp(-delta*12);
      lookX = moving ? lookX + (targetX - lookX) * blend : 0;
      lookY = moving ? lookY + (targetY - lookY) * blend : 0;
      yaw.setFromAxisAngle(yAxis, lookX);
      pitch.setFromAxisAngle(xAxis, lookY);
      head.quaternion.copy(headPose).premultiply(pitch).premultiply(yaw);
    }
    renderer.render(scene, camera);
    if (moving && (portraitMix!==portraitTarget || wavePlaying || headPose && (Math.abs(targetX-lookX)>.001 || Math.abs(targetY-lookY)>.001)) && !animating) {
      animating = true;
      requestAnimationFrame(() => { animating = false; render(); });
    }
  }

  addEventListener('pointermove', event => {
    if(window.aboutNetworkPose?.compact)return;
    const box = button.getBoundingClientRect();
    targetX = THREE.MathUtils.clamp((event.clientX-box.left-box.width/2)/(innerWidth*.45), -1, 1) * .38;
    targetY = THREE.MathUtils.clamp((event.clientY-box.top-box.height/2)/(innerHeight*.45), -1, 1) * .22;
    render();
  }, {passive:true});
  document.addEventListener('pointerleave', () => {targetX=targetY=0;render();});
  document.addEventListener('visibilitychange', render);

  addEventListener('networkpose', render);
  addEventListener('resize', render);
} catch (error) {
  console.warn('About model could not render:', error);
  dispatchEvent(new Event('avatarerror'));
}
