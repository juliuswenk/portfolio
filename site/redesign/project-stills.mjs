import * as THREE from 'three';

// Settled models scroll with the document instead of chasing compositor scrolling in WebGL.
export function createProjectStills(camera) {
  let entries = [];
  return {
    get visible() { return entries.length > 0; },
    clear() {
      entries.forEach(({ canvas }) => { canvas.remove(); canvas.width = canvas.height = 0; });
      entries = [];
    },
    show(renderer, model, groups, stages) {
      if (stages.some(stage => !stage.isConnected)) return false;
      const rects = stages.map(stage => stage.getBoundingClientRect());
      const sizes = rects.map(rect => Math.min(350, rect.width, rect.height));
      if (sizes.some(size => size <= 0)) return false;
      if (entries.length === stages.length && entries.every((entry, index) => entry.stage === stages[index] && entry.width === rects[index].width && entry.height === rects[index].height)) return true;
      const canvases = stages.map(() => document.createElement('canvas'));
      const contexts = canvases.map(canvas => canvas.getContext('2d'));
      if (contexts.some(context => !context)) return false;
      const rendererSize = renderer.getSize(new THREE.Vector2());
      const pixelRatio = renderer.getPixelRatio();
      const target = renderer.getRenderTarget();
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#000000');
      const view = camera.clone();
      view.position.set(0, 0, camera.position.z);
      view.quaternion.identity();
      model.updateMatrixWorld(true);
      try {
        renderer.setRenderTarget(null);
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
        groups.forEach((group, index) => {
          const size = sizes[index];
          const preview = group.clone(true);
          preview.position.set(0, 0, 0);
          group.getWorldQuaternion(preview.quaternion);
          group.getWorldScale(preview.scale);
          scene.add(preview);
          view.setViewOffset(innerWidth, innerHeight, (innerWidth - size) / 2, (innerHeight - size) / 2, size, size);
          renderer.setSize(size, size, false);
          renderer.render(scene, view);
          const canvas = canvases[index];
          canvas.width = renderer.domElement.width;
          canvas.height = renderer.domElement.height;
          canvas.className = 'part-still';
          canvas.setAttribute('aria-hidden', 'true');
          contexts[index].drawImage(renderer.domElement, 0, 0);
          scene.remove(preview);
        });
      } finally {
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(rendererSize.x, rendererSize.y, false);
        renderer.setRenderTarget(target);
      }
      this.clear();
      entries = canvases.map((canvas, index) => {
        stages[index].append(canvas);
        return { canvas, stage: stages[index], width: rects[index].width, height: rects[index].height };
      });
      return true;
    }
  };
}
