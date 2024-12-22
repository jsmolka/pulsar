<template>
  <div ref="container" class="h-full" />
  <Toolbar class="fixed top-2 left-2">
    <Button variant="ghost" size="icon" title="Reset view" @click="resetView">
      <PhCube class="size-4" />
    </Button>
    <SettingsDialog>
      <template #trigger>
        <Button variant="ghost" size="icon" title="Settings">
          <PhGear class="size-4" />
        </Button>
      </template>
    </SettingsDialog>
  </Toolbar>
</template>

<script setup>
import pulsar from '@/assets/data/pulsar.json';
import { Button } from '@/components/ui/button';
import { Graphic } from '@/graphic/graphic';
import * as THREE from '@/graphic/three';
import { degToRad, vec2, vec3 } from '@/graphic/three';
import { useSettingsStore } from '@/stores/settings';
import { colors } from '@/utils/colors';
import SettingsDialog from '@/views/SettingsDialog.vue';
import Toolbar from '@/views/Toolbar.vue';
import { PhCube, PhGear } from '@phosphor-icons/vue';
import { useResizeObserver } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';

const { settings } = storeToRefs(useSettingsStore());

class PulsarGraphic extends Graphic {
  curve(data) {
    if (settings.value.interpolate === 0) {
      const points = data.map((y, x) => vec2(x, y));
      return new THREE.Path3d(points);
    }
    if (settings.value.interpolate > 0) {
      const points = data.map((y, x) => vec3(x, y, 0));
      return new THREE.CatmullRomCurve3(points);
    }
    if (settings.value.interpolate < 0) {
      let points = data.map((y, x) => vec2(x, y));
      points = points.filter((_, index) => index % Math.abs(settings.value.interpolate) === 0);
      return new THREE.Path3d(points);
    }
    return new THREE.Path3d();
  }

  wave(data) {
    const group = new THREE.Group();
    const curve = this.curve(data);

    // Background
    {
      const geometry = new THREE.ShapeGeometry(
        new THREE.Shape(curve.getPoints(settings.value.curveSteps)),
      );
      geometry.rotateX(degToRad(90));
      const material = new THREE.MeshBasicMaterial({
        color: colors.shade8.int,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
    }

    // Curve
    {
      const circle = new THREE.Shape();
      circle.moveTo(settings.value.lineWidth / 2, 0);
      circle.absarc(0, 0, settings.value.lineWidth / 2, 0, degToRad(360), false);

      const geometry = new THREE.ExtrudeGeometry(circle, {
        steps: settings.value.curveSteps,
        extrudePath: curve,
        curveSegments: settings.value.curveSegments,
        bevelEnabled: false,
      });
      geometry.rotateX(degToRad(90));
      const material = new THREE.MeshBasicMaterial({
        color: colors.shade1.int,
      });

      const line = new THREE.Mesh(geometry, material);
      group.add(line);
    }
    return group;
  }

  paint() {
    this.clear();

    const dataset = pulsar.slice(0, Math.round(pulsar.length * settings.value.dataset));

    for (const [y, data] of dataset.entries()) {
      const wave = this.wave(data);
      wave.translateX(-data.length / 2);
      wave.translateY(-settings.value.gap * (y - dataset.length / 2));
      this.scene.add(wave);
    }
    this.render();
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

  watch(
    settings,
    () => {
      graphic.paint();
    },
    { deep: true },
  );
});

onBeforeUnmount(() => {
  graphic.dispose();
  graphic = null;
});

const resetView = () => {
  graphic.resetCamera();
  graphic.fitAndCenter();
};
</script>
