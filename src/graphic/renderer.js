import * as THREE from '@/graphic/three';
import { merge } from 'lodash-es';

export class Renderer extends THREE.WebGLRenderer {
  constructor(container, options = {}) {
    options = merge(
      {
        alpha: false,
        antialias: false,
        logarithmicDepthBuffer: true,
        preserveDrawingBuffer: false,
        stencil: false,
      },
      options,
    );
    super(options);

    container.appendChild(this.domElement);
    this.domElement.style.outline = 'none';
    this.domElement.tabIndex = 0;

    this.setSize(this.width, this.height);
    this.setPixelRatio(window.devicePixelRatio);
    this.setClearColor(0xffffff, 0);
  }

  get container() {
    return this.domElement.parentNode;
  }

  get width() {
    return this.container.clientWidth;
  }

  get height() {
    return this.container.clientHeight;
  }
}
