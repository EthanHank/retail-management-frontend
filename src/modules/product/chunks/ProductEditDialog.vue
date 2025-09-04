<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>Update the details of your product.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input id="name" v-model="form.productName" :class="cn({ 'border-destructive': errors?.ProductName })" />
          <p v-for="message in errors?.ProductName" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="price">Price</Label>
          <Input id="price" v-model="form.sellingPrice" type="text"
            :class="cn({ 'border-destructive': errors?.SellingPrice })" />
          <p v-for="message in errors?.SellingPrice" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="stock">Stock</Label>
          <Input id="stock" v-model="form.stockQty" type="text"
            :class="cn({ 'border-destructive': errors?.StockQty })" />
          <p v-for="message in errors?.StockQty" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="profit">Profit</Label>
          <Input id="profit" v-model="form.profitPerItem" type="text"
            :class="cn({ 'border-destructive': errors?.ProfitPerItem })" />
          <p v-for="message in errors?.ProfitPerItem" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button @click="$emit('save', form)">{{ isPending ? 'Saving...' : 'Save' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Product } from '@/api/products/types'
import { cn } from '@/lib/utils'

interface Errors {
  ProductName?: string[];
  SellingPrice?: string[];
  StockQty?: string[];
  ProfitPerItem?: string[];
}

const props = defineProps<{ product: Product | null, open: boolean, isPending: boolean, errors?: Errors }>()
defineEmits(['update:open', 'save'])

const form = reactive<Partial<Product>>({
  productName: '',
  sellingPrice: 0,
  stockQty: 0,
  profitPerItem: 0
})

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.id = newProduct.id
    form.productName = newProduct.productName
    form.sellingPrice = newProduct.sellingPrice
    form.stockQty = newProduct.stockQty
    form.profitPerItem = newProduct.profitPerItem
  }
})
</script>
