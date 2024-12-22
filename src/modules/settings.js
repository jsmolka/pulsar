import { defineSchema, primitive } from '@/utils/persist';

export class Settings {
  constructor() {
    this.dataset = 1;
    this.lineWidth = 1;
    this.gap = 5;
    this.interpolate = 0;
  }
}

defineSchema(Settings, {
  dataset: primitive(),
  lineWidth: primitive(),
  gap: primitive(),
  interpolate: primitive(),
});
