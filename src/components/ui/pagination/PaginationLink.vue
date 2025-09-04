<template>
  <component :is="props.as" :class="cn(buttonVariants({ variant: 'ghost', size: 'icon' }), props.class)">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { buttonVariants } from '../button'

const props = withDefaults(defineProps<{
  as?: string
  class?: string
}>(), {
  as: 'button',
})
</script>