import { defineSchema, primitive } from '@/utils/persist';

export class Settings {
  constructor() {
    this.interpolate = 0;
    this.lineWidth = 1;
  }
}

defineSchema(Settings, {
  interpolate: primitive(),
  lineWidth: primitive(),
});
