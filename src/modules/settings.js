import pulsar from '@/assets/data/pulsar.json';
import { defineSchema, primitive } from '@/utils/persist';

export class Settings {
  constructor() {
    this.lines = pulsar.length;
    this.interpolate = 0;
    this.amplitude = 1;
    this.lineWidth = 1;
    this.gap = 10;
    this.sampleRate = 4;
    this.filmGrain = 0;
  }
}

defineSchema(Settings, {
  lines: primitive(),
  interpolate: primitive(),
  amplitude: primitive(),
  lineWidth: primitive(),
  sampleRate: primitive(),
  filmGrain: primitive(),
});
