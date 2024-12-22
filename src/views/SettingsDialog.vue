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
          <InputNumber v-model="settings.interpolate" />
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
          <Label>Curve steps</Label>
          <InputNumber v-model="settings.curveSteps" :min="1" />
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
