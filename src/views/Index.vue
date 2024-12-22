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
import { degToRad, vec3 } from '@/graphic/three';
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
  wave(data) {
    const group = new THREE.Group();

    let points = data.map((y, x) => vec3(x, y, 0));
    if (settings.value.interpolate > 0) {
      const curve = new THREE.CatmullRomCurve3(points);
      points = curve.getPoints(settings.value.interpolate * points.length);
    } else if (settings.value.interpolate < 0) {
      const mod = Math.abs(settings.value.interpolate);
      points = points.filter((_, index) => index % mod === 0);
    }

    // Background
    {
      const geometry = new THREE.ShapeGeometry(new THREE.Shape(points));
      geometry.rotateX(degToRad(90));

      group.add(
        new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            color: colors.shade8.int,
            side: THREE.DoubleSide,
          }),
        ),
      );
    }

    // Curve
    {
      const geometry = new THREE.LineGeometry().setFromPoints(points);
      geometry.rotateX(degToRad(90));

      group.add(
        new THREE.Line2(
          geometry,
          new THREE.LineMaterial({
            color: colors.shade1.int,
            linewidth: settings.value.lineWidth,
            worldUnits: true,
          }),
        ),
      );
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
