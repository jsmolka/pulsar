<template>
  <div ref="container" class="h-full" />
  <Toolbar v-show="toolbar" class="fixed top-2 left-2">
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
import { useMagicKeys, useResizeObserver, whenever } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

const toolbar = ref(true);
const { h } = useMagicKeys();
whenever(h, () => {
  toolbar.value = !toolbar.value;
});

const { settings } = storeToRefs(useSettingsStore());

class PulsarGraphic extends Graphic {
  initScene() {
    super.initScene();

    this.scene.background = new THREE.Color(colors.shade8.int);
  }

  initEffects() {
    this.ssaaPass = new THREE.SSAARenderPass(this.scene, this.camera);
    this.ssaaPass.sampleLevel = 0;

    this.filmPass = new THREE.FilmPass();
    this.filmPass.uniforms.intensity.value = 0;

    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.composer.addPass(this.ssaaPass);
    this.composer.addPass(this.filmPass);
    this.composer.addPass(new THREE.OutputPass());
  }

  wave(data) {
    const group = new THREE.Group();

    let points = data.map((y, x) => vec3(x, settings.value.amplitude * y, 0));
    if (settings.value.interpolate > 0) {
      const curve = new THREE.CatmullRomCurve3(points);
      points = curve.getPoints(settings.value.interpolate * points.length);
    } else if (settings.value.interpolate < 0) {
      const mod = Math.abs(settings.value.interpolate);
      points = points.filter((_, index) => index % mod === 0);
    }

    // Background
    {
      const min = Math.min(...data);
      const geometry = new THREE.ShapeGeometry(
        new THREE.Shape([vec3(0, min, 0), ...points, vec3(data.length, min, 0)]),
      );
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

    this.ssaaPass.sampleLevel = settings.value.samples;
    this.filmPass.uniforms.intensity.value = settings.value.filmGrain;

    const dataset = pulsar.slice(-settings.value.lines);
    for (const [y, data] of dataset.entries()) {
      const wave = this.wave(data);
      wave.translateX(-data.length / 2);
      wave.translateY(-settings.value.lineGap * (y - dataset.length / 2));
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
