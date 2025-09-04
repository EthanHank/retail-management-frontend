<template>
  <Card class="col-span-4">
    <CardHeader>
      <CardTitle>Recent Products</CardTitle>
      <CardDescription>You have {{ sortedProducts?.length || 0 }} products in total.</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="space-y-2">
        <Skeleton v-for="n in 5" :key="n" class="h-10 w-full" />
      </div>
      <div v-else-if="isError" class="text-red-500">
        An error occurred while fetching products data.
      </div>
      <div v-else class="space-y-4">
        <div v-for="product in sortedProducts.slice(0, 5)" :key="product.id" class="flex items-center">
          <Avatar class="h-12 w-12">
            <AvatarImage :src="getProductImage(product)" :alt="product.productName" />
            <AvatarFallback>{{ product.productName.charAt(0).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="ml-4 space-y-1">
            <p class="text-sm font-bold leading-none">{{ product.productName }}</p>
            <p class="text-sm text-muted-foreground">Instock: {{ product.stockQty }}</p>
            <p class="text-sm text-muted-foreground">
              Created:
              {{ new Date(product.createdDate).toLocaleDateString() }}
            </p>
          </div>
          <div class="ml-auto font-medium">
            <Badge variant="secondary">{{ product.sellingPrice.toLocaleString() }} Ks</Badge>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import api from '@/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductImage } from '@/lib/images'
import { computed } from 'vue'

const { data, isLoading, isError } = api.products.getProducts.useQuery({ PageNumber: 1, PageSize: 5, productName: '' })

const sortedProducts = computed(() => {
  if (!data.value) {
    return []
  }
  return [...data.value].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
})
</script>
