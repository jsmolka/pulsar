<template>
  <div ref="container" class="size-full">
    <svg ref="chart"></svg>
  </div>
</template>

<script setup>
import pulsar from '@/assets/data/pulsar.csv?raw';
import { useResizeObserver } from '@vueuse/core';
import * as d3 from 'd3';
import { onMounted, useTemplateRef } from 'vue';

const container = useTemplateRef('container');
const chart = useTemplateRef('chart');

onMounted(() => {
  useResizeObserver(container, ([entry]) => {
    render(entry.contentRect.width, entry.contentRect.height);
  });
});

const render = (width, height) => {
  chart.value.innerHTML = '';

  const padding = Math.max(Math.round(0.1 * width), Math.round(0.1 * height));
  const amplitude = width / 500;
  const svg = d3
    .select(chart.value)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2 - width / 2},${10})`);

  const data = d3.csvParseRows(pulsar, (row) => row.map(Number));

  const x = d3
    .scaleLinear()
    .domain([0, data[0].length - 1])
    .range([padding, width - padding]);
  const y = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([padding, height - padding]);

  const line = d3
    .line()
    .x((_, i) => x(i))
    .y((d) => -d * amplitude);

  svg
    .append('g')
    .selectAll('.wave')
    .data(data)
    .enter()
    .append('path')
    .attr('transform', (_, i) => `translate(0,${y(i)})`)
    .attr('class', 'wave')
    .attr('d', line);
};
</script>

<style>
.wave {
  fill: rgb(18, 18, 18);
  stroke: white;
  stroke-width: 4;
}
</style>
