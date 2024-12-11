<template>
  <div ref="container" class="h-full" />
</template>

<script setup>
import pulsar from '@/assets/data/pulsar.json';
import { Graphic } from '@/graphic/graphic';
import * as THREE from '@/graphic/three';
import { degToRad, vec2, vec3 } from '@/graphic/three';
import { useSettingsStore } from '@/stores/settings';
import { colors } from '@/utils/colors';
import { useResizeObserver } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

const { settings } = storeToRefs(useSettingsStore());

class PulsarGraphic extends Graphic {
  wave(data) {
    const group = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3(data.map((z, x) => vec3(x, 0, z)));
    const curvePoints = curve.getPoints((settings.value.interpolate + 1) * curve.points.length);

    // Background
    {
      const geometry = new THREE.ShapeGeometry(
        new THREE.Shape(curvePoints.map((point) => vec2(point.x, point.z))),
      );
      geometry.rotateX(degToRad(90));
      const material = new THREE.MeshBasicMaterial({
        color: colors.shade8.int,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(geometry, material));
    }

    // Curve
    {
      const positions = [];
      for (const point of curvePoints) {
        positions.push(point.x, point.y, point.z);
      }

      const geometry = new THREE.LineGeometry().setPositions(positions);
      const material = new THREE.LineMaterial({
        color: colors.shade1.int,
        linewidth: settings.value.lineWidth,
      });
      group.add(new THREE.Line2(geometry, material));
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
