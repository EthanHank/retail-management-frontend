<template>
  <Card>
    <CardHeader class="p-2">
      <Avatar class="h-20 w-20 mx-auto">
        <AvatarImage :src="getProductImage(product)" :alt="product.productName" />
        <AvatarFallback>{{ product.productName.charAt(0).toUpperCase() }}</AvatarFallback>
      </Avatar>
    </CardHeader>
    <CardContent class="p-2 text-center">
      <p class="text-lg font-bold">{{ product.productName }}</p>
      <p class="text-sm text-muted-foreground">Instock: {{ product.stockQty }}</p>
      <Badge variant="secondary" class="mt-2">{{ product.sellingPrice.toLocaleString() }} Ks</Badge>
    </CardContent>
    <CardFooter class="p-2 flex justify-center space-x-2" v-if="authStore.hasRole('StockClerk') || authStore.isAdmin">
      <Button size="sm" @click="$emit('edit', product)" v-if="authStore.hasRole('StockClerk') || authStore.isAdmin">
        <Pencil class="w-4 h-4" />
      </Button>
      <Button size="sm" variant="destructive" @click="$emit('delete', product)" v-if="authStore.isAdmin">
        <Trash2 class="w-4 h-4" />
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProductImage } from '@/lib/images'
import type { Product } from '@/api/products/types'
import { Pencil, Trash2 } from 'lucide-vue-next' // Import ShoppingCart
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

defineProps<{ product: Product }>()
defineEmits<{ (e: 'edit', product: Product): void; (e: 'delete', product: Product): void }>() // Add addToCart event
</script>
