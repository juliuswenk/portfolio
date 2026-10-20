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

  new GLTFLoader().load('assets/waving-textured.glb?v=1', gltf => {
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
    if (head) headPose = head.quaternion.clone();
    button.classList.add('model-ready');
    render();
  }, undefined, error => console.warn('About model could not load:', error));

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
    const inFocus = !!window.aboutNetworkPose?.focused && !document.body.classList.contains('still') && !document.hidden;
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
    if (canvas.width !== Math.round(width * renderer.getPixelRatio()) || canvas.height !== Math.round(height * renderer.getPixelRatio())) {
      renderer.setSize(width, height, false);
    }
    figure.rotation.y = (window.aboutNetworkPose?.yaw ?? .33) - .33;
    if (headPose) {
      const blend = 1-Math.exp(-delta*12);
      lookX += (targetX - lookX) * blend;
      lookY += (targetY - lookY) * blend;
      yaw.setFromAxisAngle(yAxis, lookX);
      pitch.setFromAxisAngle(xAxis, lookY);
      head.quaternion.copy(headPose).premultiply(pitch).premultiply(yaw);
    }
    renderer.render(scene, camera);
    if ((wavePlaying || headPose && (Math.abs(targetX-lookX)>.001 || Math.abs(targetY-lookY)>.001)) && !animating) {
      animating = true;
      requestAnimationFrame(() => { animating = false; render(); });
    }
  }

  addEventListener('pointermove', event => {
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
}
