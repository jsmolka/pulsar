import { defineSchema, primitive } from '@/utils/persist';

export class Settings {
  constructor() {
    this.dataset = 1;
    this.lineWidth = 1;
    this.gap = 5;
    this.interpolate = 0;
    this.curveSteps = 300;
    this.curveSegments = 12;
  }
}

defineSchema(Settings, {
  dataset: primitive(),
  lineWidth: primitive(),
  curveSteps: primitive(),
  curveSegments: primitive(),
  gap: primitive(),
  interpolate: primitive(),
});
