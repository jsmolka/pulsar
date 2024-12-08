<template>
  <div ref="container" class="h-full" />
</template>

<script setup>
import { Graphic } from '@/graphic/graphic';
import { useResizeObserver } from '@vueuse/core';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

class PulsarGraphic extends Graphic {
  constructor(container, options = {}) {
    super(container, options);
  }

  paint() {
    const mesh = new Mesh(
      new BoxGeometry(100, 100, 100),
      new MeshBasicMaterial({ color: 0xffffff }),
    );
    this.scene.add(mesh);
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
