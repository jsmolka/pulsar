<template>
  <Dialog>
    <template v-if="$slots.trigger">
      <DialogTrigger as-child>
        <slot name="trigger" />
      </DialogTrigger>
    </template>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription v-show="false">Settings</DialogDescription>
      </DialogHeader>
      <Form>
        <FormItem>
          <Label>Lines</Label>
          <InputNumber v-model="settings.lines" :min="1" :max="pulsar.length" />
        </FormItem>
        <FormItem>
          <Label>Interpolate</Label>
          <InputNumber v-model="settings.interpolate" />
        </FormItem>
        <FormItem>
          <Label>Amplitude</Label>
          <InputNumber v-model="settings.amplitude" :min="0.1" :precision="2" />
        </FormItem>
        <FormItem>
          <Label>Line width</Label>
          <InputNumber v-model="settings.lineWidth" :min="0.1" :precision="2" />
        </FormItem>
        <FormItem>
          <Label>Gap</Label>
          <InputNumber v-model="settings.gap" :min="0" />
        </FormItem>
        <FormItem>
          <Label>Sample rate</Label>
          <InputNumber v-model="settings.sampleRate" :min="0" />
        </FormItem>
        <FormItem>
          <Label>Film grain</Label>
          <InputNumber v-model="settings.filmGrain" :min="0" :precision="2" />
        </FormItem>
      </Form>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
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
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';

const { settings } = storeToRefs(useSettingsStore());
</script>
