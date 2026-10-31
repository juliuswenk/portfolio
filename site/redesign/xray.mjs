import * as THREE from 'three';

const vertexDeclarations = `
varying vec3 xrayNormal;
varying vec3 xrayViewPosition;
`;
const vertexBody = `
xrayNormal = normalMatrix * normal;
xrayViewPosition = -(modelViewMatrix * vec4(position, 1.0)).xyz;
`;
const fragmentDeclarations = `
uniform vec3 xrayColor;
uniform float xrayGain;
varying vec3 xrayNormal;
varying vec3 xrayViewPosition;
vec3 xrayLight() {
  float facing = clamp(abs(dot(normalize(xrayNormal), normalize(xrayViewPosition))), 0.0, 1.0);
  float rim = pow(1.0 - facing, 2.2);
  return xrayColor * (0.045 + 0.7 * rim) * xrayGain;
}
`;

// Premultiplied surface light fades into additive X-ray light without a blend-mode jump.
const blending = {
  transparent: true, depthWrite: false, depthTest: true,
  blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor
};

export function createXrayMaterial(gain = 1) {
  return new THREE.ShaderMaterial({
    name: 'Silver-blue X-ray',
    ...blending,
    side: THREE.FrontSide,
    uniforms: { xrayColor: { value: new THREE.Color('#b8d2ee') }, xrayGain: { value: gain } },
    vertexShader: `${vertexDeclarations}
      void main() {
        ${vertexBody}
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `${fragmentDeclarations}
      void main() {
        gl_FragColor = vec4(xrayLight(), 0.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  });
}

export function createXray(objects) {
  const meshes = objects.map(mesh => ({ mesh, original: mesh.material, castShadow: mesh.castShadow, receiveShadow: mesh.receiveShadow }));
  const strength = { value: 0 };
  const material = createXrayMaterial();
  const transitions = new Map();
  function transition(source) {
    if (transitions.has(source)) return transitions.get(source);
    const faded = source.clone();
    Object.assign(faded, blending);
    faded.premultipliedAlpha = false;
    faded.onBeforeCompile = function(shader, renderer) {
      source.onBeforeCompile.call(this, shader, renderer);
      shader.uniforms.xrayStrength = strength;
      shader.uniforms.xrayColor = material.uniforms.xrayColor;
      shader.uniforms.xrayGain = material.uniforms.xrayGain;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${vertexDeclarations}`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>\n${vertexBody}`);
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\nuniform float xrayStrength;\n${fragmentDeclarations}`)
        .replace('#include <opaque_fragment>', `#include <opaque_fragment>
          gl_FragColor.rgb = mix(gl_FragColor.rgb * gl_FragColor.a, xrayLight(), xrayStrength);
          gl_FragColor.a *= 1.0 - xrayStrength;
        `);
    };
    faded.customProgramCacheKey = () => `${source.customProgramCacheKey()}-xray-transition-v1`;
    transitions.set(source, faded);
    return faded;
  }
  let state = 'original';
  return {
    update(progress) {
      strength.value = progress;
      const next = progress === 0 ? 'original' : progress === 1 ? 'xray' : 'transition';
      if (next === state) return;
      state = next;
      for (const entry of meshes) {
        entry.mesh.material = next === 'original' ? entry.original : next === 'xray' ? material
          : Array.isArray(entry.original) ? entry.original.map(transition) : transition(entry.original);
        entry.mesh.castShadow = next === 'original' && entry.castShadow;
        entry.mesh.receiveShadow = next === 'original' && entry.receiveShadow;
      }
    },
    dispose() {
      this.update(0);
      material.dispose();
      for (const faded of transitions.values()) faded.dispose();
      transitions.clear();
    }
  };
}
