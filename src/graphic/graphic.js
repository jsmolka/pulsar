import { CameraControls } from '@/graphic/cameraControls';
import { CameraViewBox } from '@/graphic/cameraViewBox';
import { Renderer } from '@/graphic/renderer.js';
import * as THREE from '@/graphic/three';
import { dispose, vec3 } from '@/graphic/three';
import { merge } from 'lodash-es';

export class Graphic {
  constructor(container, options = {}) {
    options = merge({ fitRatio: 1.05 }, options);

    this.fitRatio = options.fitRatio;
    this.renderRaf = null;
    this.cameraControlsRaf = null;

    this.initRenderer(container);
    this.initScene();
    this.initCamera();
    this.initCameraControls();
    this.initEffectComposer();
    this.initEffects();
  }

  get cameraFrustum() {
    return {
      fov: 45,
      aspect: this.renderer.width / this.renderer.height,
      near: 1,
      far: 20000,
    };
  }

  initRenderer(container) {
    this.renderer = new Renderer(container);
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera();
    Object.assign(this.camera, this.cameraFrustum);
    this.resetCamera();
  }

  initCameraControls() {
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.smoothTime = 0;
    this.controls.draggingSmoothTime = 0;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.mouseButtons.left = CameraControls.ACTION.OFFSET;
    this.controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
    this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;

    const clock = new THREE.Clock();
    const update = () => {
      const updated = this.controls.update(clock.getDelta());
      if (updated) {
        this.camera.updateMatrixWorld();
        this.render();
      }
      this.cameraControlsRaf = window.requestAnimationFrame(update);
    };
    update();
  }

  initEffectComposer() {
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
  }

  initEffects() {
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.composer.addPass(new THREE.OutputPass());
  }

  dispose() {
    window.cancelAnimationFrame(this.renderRaf);
    window.cancelAnimationFrame(this.cameraControlsRaf);
    this.composer.dispose();
    this.renderer.dispose();
    this.controls.dispose();
    this.clear();
  }

  clear() {
    dispose(this.scene);
  }

  render() {
    this.renderRaf ??= window.requestAnimationFrame(() => {
      this.renderRaf = null;
      this.forceRender();
    });
  }

  forceRender() {
    this.composer.render();
  }

  resize(rect = null) {
    const w = Math.floor(rect?.width ?? this.renderer.width);
    const h = Math.floor(rect?.height ?? this.renderer.height);
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);

    Object.assign(this.camera, this.cameraFrustum);
    this.camera.updateProjectionMatrix();
    this.controls.update();

    this.forceRender();
  }

  fitAndCenter() {
    const target = vec3();
    const viewBox = new CameraViewBox();
    viewBox.setViewFromCamera(this.camera);
    viewBox.setFitRatio(this.fitRatio);
    viewBox.setFromObject(this.scene);
    viewBox.getCameraPositionAndTarget(this.camera.position, target);

    this.controls.setLookAt(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
      target.x,
      target.y,
      target.z,
    );
    this.controls.setFocalOffset(0, 0, 0);
    this.controls.setOrbitPoint(0, 0, 0);

    this.render();
  }

  setCamera(position, up) {
    this.camera.position.copy(position);
    this.camera.up.copy(up);
    this.camera.lookAt(this.scene.position);

    if (!this.controls) {
      return;
    }

    this.controls.updateCameraUp();
    this.controls.reset();
    this.fitAndCenter();
  }

  resetCamera() {
    this.setCamera(vec3(0, -2000, 1000), vec3(0, 0, 1));
  }
}
