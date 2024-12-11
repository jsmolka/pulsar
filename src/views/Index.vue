<template>
  <div ref="container" class="h-full" />
</template>

<script setup>
import pulsar from '@/assets/data/pulsar.json';
import { Graphic } from '@/graphic/graphic';
import * as THREE from '@/graphic/three';
import { degToRad } from '@/graphic/three';
import { colors } from '@/utils/colors';
import { useResizeObserver } from '@vueuse/core';
import { merge } from 'lodash-es';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

class PulsarGraphic extends Graphic {
  wave(data, options = {}) {
    options = merge({ color: colors.shade1.int, linewidth: 2 }, options);

    const shape = new THREE.Shape();
    for (const [x, z] of data.entries()) {
      if (x === 0) {
        shape.moveTo(x, z);
      } else {
        shape.lineTo(x, z);
      }
    }

    const group = new THREE.Group();
    {
      const positions = [];
      for (const point of shape.getPoints()) {
        positions.push(point.x, 0, point.y);
      }

      const geometry = new THREE.LineGeometry().setPositions(positions);
      const material = new THREE.LineMaterial(options);
      group.add(new THREE.Line2(geometry, material));
    }
    {
      shape.moveTo(data.length - 1, 0);
      shape.moveTo(0, 0);
      shape.closePath();

      const geometry = new THREE.ShapeGeometry(shape);
      geometry.rotateX(degToRad(90));
      const material = new THREE.MeshBasicMaterial({
        color: colors.shade8.int,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(geometry, material));
    }
    return group;
  }

  paint() {
    this.clear();

    for (const [y, data] of pulsar.entries()) {
      const wave = this.wave(data);
      wave.translateX(-data.length / 2);
      wave.translateY(-10 * (y - pulsar.length / 2));
      this.scene.add(wave);
    }
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
