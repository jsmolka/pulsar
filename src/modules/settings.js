import pulsar from '@/assets/data/pulsar.json';
import { defineSchema, primitive } from '@/utils/persist';

export class Settings {
  constructor() {
    this.lines = pulsar.length;
    this.interpolate = 0;
    this.amplitude = 1;
    this.lineWidth = 1;
    this.gap = 10;
  }
}

defineSchema(Settings, {
  lines: primitive(),
  interpolate: primitive(),
  amplitude: primitive(),
  lineWidth: primitive(),
  gap: primitive(),
});
