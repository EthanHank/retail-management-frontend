<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
    <ProductCardItem v-for="product in products" :key="product.id" :product="product" @edit="$emit('edit', product)"
      @delete="$emit('delete', product)" />
  </div>
</template>

<script setup lang="ts">
import ProductCardItem from './ProductCardItem.vue'
import type { Product } from '@/api/products/types'

defineProps<{
  products: Product[]
}>()

defineEmits<{
  (e: 'edit', product: Product): void;
  (e: 'delete', product: Product): void
}>()
</script>
