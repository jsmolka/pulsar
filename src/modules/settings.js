import pulsar from '@/assets/data/pulsar.json';
import { defineSchema, primitive } from '@/utils/persist';

export class Settings {
  constructor() {
    this.lines = pulsar.length;
    this.interpolate = 0;
    this.amplitude = 1;
    this.lineWidth = 0.5;
    this.lineGap = 8;
    this.samples = 8;
    this.filmGrain = 1;
  }
}

defineSchema(Settings, {
  lines: primitive(),
  interpolate: primitive(),
  amplitude: primitive(),
  lineWidth: primitive(),
  lineGap: primitive(),
  samples: primitive(),
  filmGrain: primitive(),
});
