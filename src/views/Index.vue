<template>
  <div ref="container" class="h-full" />
</template>

<script setup>
import pulsar from '@/assets/data/pulsar.json';
import { Graphic } from '@/graphic/graphic';
import { useResizeObserver } from '@vueuse/core';
import { merge } from 'lodash-es';
import { BufferGeometry, Group, Line, LineBasicMaterial, Vector3 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

class PulsarGraphic extends Graphic {
  constructor(container, options = {}) {
    super(container, options);
  }

  line(points, options = {}) {
    options = merge({ color: 0xffffff }, options);

    const group = new Group();
    {
      const positions = [];
      for (const point of points) {
        positions.push(point.x, point.y, point.z);
      }

      const geometry = new LineGeometry().setPositions(positions);
      const material = new LineMaterial(options);
      group.add(new Line2(geometry, material));
    }
    {
      // Without this `fitAndCenter` doesn't work because `Line2` is implemented as a shader
      const geometry = new BufferGeometry().setFromPoints(points);
      const material = new LineBasicMaterial({ opacity: 0, transparent: true });
      group.add(new Line(geometry, material));
    }
    return group;
  }

  paint() {
    this.clear();

    for (const [i, data] of pulsar.entries()) {
      const points = [];
      for (const [j, value] of data.entries()) {
        points.push(new Vector3(j - data.length / 2, 10 * (i - pulsar.length / 2), value));
      }

      const line = this.line(points, { linewidth: 2 });
      this.scene.add(line);
    }
  }

  resetCamera() {
    this.setCamera(new Vector3(0, -2000, 1000), new Vector3(0, 0, 1));
  }
}

let graphic = null;

const container = useTemplateRef('container');

onMounted(() => {
  graphic = new PulsarGraphic(container.value);
  graphic.paint();
  graphic.fitAndCenter();

  useResizeObserver(container, ([entry]) => {
    graphic.resize(entry.contentRect);
  });
});

onBeforeUnmount(() => {
  graphic.dispose();
  graphic = null;
});
</script>
