// Approximate the Three.js subsurface example inside the existing PBR lighting.
export function applyCobaltScattering(root, chunks, strength = { value: 0.12 }) {
  const direct = 'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );';
  if (!chunks.lights_fragment_begin.includes(direct)) throw new Error('The lighting shader changed; cobalt scattering needs review.');
  root.traverse(object => {
    if (!object.isMesh) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (!material?.name.startsWith('cobalt_blue') || material.userData.cobaltScattering) continue;
      material.userData.cobaltScattering = true;
      const previous = material.onBeforeCompile;
      material.onBeforeCompile = function(shader, renderer) {
        previous.call(this, shader, renderer);
        shader.uniforms.cobaltScatterStrength = strength;
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float cobaltScatterStrength;');
        shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', chunks.lights_fragment_begin.replaceAll(direct, `${direct}
        {
          vec3 scatterHalf = normalize(directLight.direction + geometryNormal * 0.35);
          float backScatter = pow(saturate(dot(geometryViewDir, -scatterHalf)), 3.0);
          float softWrap = pow(saturate((dot(geometryNormal, directLight.direction) + 0.5) / 1.5), 2.0);
          vec3 pigment = sqrt(max(diffuseColor.rgb, vec3(0.0))) * vec3(0.18, 0.5, 1.0);
          reflectedLight.directDiffuse += pigment * directLight.color * cobaltScatterStrength * (backScatter * 1.4 + softWrap * 0.3);
        }
        `));
      };
      material.customProgramCacheKey = () => 'cobalt-subsurface-v1';
      material.needsUpdate = true;
    }
  });
  return strength;
}
