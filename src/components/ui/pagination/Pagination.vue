<template>
  <nav role="navigation" aria-label="pagination" :class="cn('mx-auto flex w-full justify-center', props.class)">
    <ul class="flex flex-row items-center gap-1">
      <slot />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script>