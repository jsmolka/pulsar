<template>
  <Form class="max-w-sm mx-auto p-4">
    <RouterLink class="self-center" to="/">
      <Logo class="size-8 text-shade-1" />
    </RouterLink>

    <FormItem>
      <h1>Button</h1>
      <FormItem class="grid grid-cols-2">
        <template v-for="variant in ['default', 'secondary', 'outline', 'ghost']">
          <Button v-for="disabled in [false, true]" :variant="variant" :disabled="disabled">
            Button
          </Button>
        </template>
        <FormItem v-for="disabled in [false, true]" class="grid grid-flow-col">
          <Button
            v-for="variant in ['default', 'secondary', 'outline', 'ghost']"
            :variant="variant"
            size="icon"
            :disabled="disabled"
          >
            <Logo class="size-4" />
          </Button>
        </FormItem>
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Checkbox</h1>
      <FormItem class="grid grid-flow-col">
        <Checkbox :model-value="true" />
        <Checkbox :model-value="true" disabled />
        <Checkbox />
        <Checkbox disabled />
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Command</h1>
      <Button variant="secondary" @click="commandOpen = true">Open</Button>
      <CommandDialog v-model:open="commandOpen">
        <CommandInput placeholder="Command input" />
        <CommandList>
          <CommandEmpty>Empty</CommandEmpty>
          <CommandGroup heading="Group">
            <CommandItem value="Value 1">
              Value 1
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem value="Value 2" disabled>
              Value 2
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Group">
            <CommandItem value="Value 3">
              Value 3
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem value="Value 4" disabled>
              Value 4
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </FormItem>

    <FormItem>
      <h1>Dialog</h1>
      <FormItem class="grid grid-flow-col">
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="secondary">Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>Description</DialogDescription>
            </DialogHeader>
            <p>Content</p>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="default">Button</Button>
              </DialogClose>
              <DialogClose as-child>
                <Button variant="secondary">Button</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant="secondary"
          @click="
            dialog({
              title: 'Title',
              description: 'Description',
              content: 'Content',
              buttons: [
                { text: 'Button', variant: 'default' },
                { text: 'Button', variant: 'secondary' },
              ],
            })
          "
        >
          Open
        </Button>
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Dropdown Menu</h1>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="secondary">Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Item</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span>Item</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <span>Item</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <span>Item</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Checkbox</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem model-value>Value</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Value</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem disabled>Value</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Radio Group</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuRadioGroup model-value="1">
              <DropdownMenuRadioItem value="1">Value 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2">Value 2</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3" disabled>Value 3</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </FormItem>

    <FormItem>
      <h1>Input</h1>
      <FormItem class="grid grid-cols-2">
        <Input placeholder="Input" />
        <Input placeholder="Input" disabled />
        <InputNumber
          v-for="disabled in [false, true]"
          placeholder="Input number"
          :min="-1000"
          :max="+1000"
          :precision="2"
          suffix=" unit"
          :disabled="disabled"
        />
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Label</h1>
      <Label>Label</Label>
      <Input placeholder="Input" />
    </FormItem>

    <FormItem>
      <h1>Popover</h1>
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="secondary">Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    </FormItem>

    <FormItem>
      <h1>Select</h1>
      <FormItem class="grid grid-cols-2">
        <Select
          v-for="disabled in [false, true]"
          :items="[1, 2, 3]"
          placeholder="Select"
          :disabled="disabled"
        >
          <template #item="{ item }">
            <SelectItemText>Value {{ item }}</SelectItemText>
          </template>
        </Select>
        <SelectRoot v-for="disabled in [false, true]" :disabled="disabled">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <template
              v-for="(items, index) in [
                [1, 2, 3],
                [4, 5, 6],
              ]"
            >
              <SelectSeparator v-if="index > 0" />
              <SelectGroup>
                <SelectLabel>Label</SelectLabel>
                <SelectItem v-for="item in items" :value="item.toString()">
                  <div class="flex items-center gap-2">
                    <Logo class="size-4" />
                    <SelectItemText>Value {{ item }}</SelectItemText>
                  </div>
                </SelectItem>
              </SelectGroup>
            </template>
          </SelectContent>
        </SelectRoot>
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Switch</h1>
      <FormItem class="grid grid-flow-col">
        <Switch :model-value="true" />
        <Switch :model-value="true" disabled />
        <Switch />
        <Switch disabled />
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Table</h1>
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead v-for="value in [1, 2, 3]">Head {{ value }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="_ in [1, 2, 3]">
              <TableCell v-for="value in [1, 2, 3]">Value {{ value }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableWrapper>
    </FormItem>

    <FormItem>
      <h1>Tabs</h1>
      <Tabs :default-value="1">
        <TabsList class="grid grid-flow-col auto-cols-fr">
          <TabsTrigger :value="1">Tab 1</TabsTrigger>
          <TabsTrigger :value="2">Tab 2</TabsTrigger>
          <TabsTrigger :value="3" disabled>Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent
          v-for="value in [1, 2, 3]"
          class="px-2 py-1.5 border rounded-sm"
          :value="value"
        >
          Content {{ value }}
        </TabsContent>
      </Tabs>
    </FormItem>

    <FormItem>
      <h1>Textarea</h1>
      <FormItem class="grid grid-cols-2">
        <Textarea placeholder="Textarea" />
        <Textarea placeholder="Textarea" disabled />
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Toast</h1>
      <FormItem class="grid grid-cols-4">
        <Button variant="secondary" @click="toast('Message', { type: 'info' })">Info</Button>
        <Button variant="secondary" @click="toast('Message', { type: 'success' })">Success</Button>
        <Button variant="secondary" @click="toast('Message', { type: 'warning' })">Warning</Button>
        <Button variant="secondary" @click="toast('Message', { type: 'error' })">Error</Button>
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Toggle</h1>
      <FormItem class="grid grid-cols-4">
        <template v-for="value in [true, false]">
          <template v-for="disabled in [false, true]">
            <FormItem class="flex-col">
              <Toggle
                v-for="variant in ['default', 'outline', 'ghost']"
                :model-value="value"
                :variant="variant"
                :disabled="disabled"
              >
                Toggle
              </Toggle>
            </FormItem>
          </template>
        </template>
      </FormItem>
    </FormItem>

    <FormItem>
      <h1>Tooltip</h1>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="secondary">Hover</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </FormItem>
  </Form>
</template>

<script setup>
import Logo from '@/components/Logo.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormItem } from '@/components/ui/form';
import { Input, InputNumber } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { dialog } from '@/utils/dialog';
import { toast } from '@/utils/toast';
import { ref } from 'vue';

const commandOpen = ref(false);
</script>

<style scoped>
h1 {
  @apply text-base;
  @apply text-shade-1;
  @apply font-semibold;
}
</style>
