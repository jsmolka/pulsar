import { Vector2, Vector3 } from 'three';

export * from 'three';
export { Line2 } from 'three/examples/jsm/lines/Line2';
export { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
export { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
export { degToRad, radToDeg } from 'three/src/math/MathUtils';

export { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
export { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
export { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
export { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
export { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';

export function vec2(x = 0, y = 0) {
  return new Vector2(x, y);
}

export function vec3(x = 0, y = 0, z = 0) {
  return new Vector3(x, y, z);
}

export function dispose(object) {
  for (const child of object.children) {
    dispose(child);
  }
  object.geometry?.dispose();
  object.material?.dispose();
  object.texture?.dispose();
  object.dispose?.();
  object.clear?.();
}
