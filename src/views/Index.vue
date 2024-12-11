<template>
  <div ref="container" class="h-full" />
  <Toolbar class="fixed top-2 left-2">
    <Button variant="ghost" size="icon" title="Reset view" @click="resetView">
      <PhCube class="size-4" />
    </Button>
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="ghost" size="icon" title="Settings">
          <PhList class="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription v-show="false">Graphic settings</DialogDescription>
        </DialogHeader>
        <Form>
          <FormItem>
            <Label>Dataset</Label>
            <InputNumber
              :model-value="100 * settings.dataset"
              @update:model-value="settings.dataset = $event / 100"
              :min="1"
              :max="100"
              suffix=" %"
            />
          </FormItem>
          <FormItem>
            <Label>Interpolate</Label>
            <InputNumber v-model="settings.interpolate" :min="0" />
          </FormItem>
          <FormItem>
            <Label>Line width</Label>
            <InputNumber v-model="settings.lineWidth" :min="1" />
          </FormItem>
          <FormItem>
            <Label>Gap</Label>
            <InputNumber v-model="settings.gap" :min="0" />
          </FormItem>
        </Form>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Toolbar>
</template>

<script setup>
import pulsar from '@/assets/data/pulsar.json';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormItem } from '@/components/ui/form';
import { InputNumber } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Graphic } from '@/graphic/graphic';
import * as THREE from '@/graphic/three';
import { degToRad, vec2, vec3 } from '@/graphic/three';
import { useSettingsStore } from '@/stores/settings';
import { colors } from '@/utils/colors';
import Toolbar from '@/views/Toolbar.vue';
import { PhCube, PhList } from '@phosphor-icons/vue';
import { useResizeObserver } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';

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

      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 1;
      group.add(mesh);
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

      const line = new THREE.Line2(geometry, material);
      line.renderOrder = 0;
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
