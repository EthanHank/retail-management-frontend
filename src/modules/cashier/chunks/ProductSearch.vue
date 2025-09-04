<template>
  <div>
    <div class="flex gap-2">
      <Input v-model="searchQuery" placeholder="Search for products..." />
    </div>

    <!-- skeleton only when first load -->
    <div v-if="productStore.isSearchingProducts" class="space-y-4 mt-4">
      <Skeleton v-for="n in 5" :key="n" class="h-17 w-full" />
    </div>

    <!-- no products -->
    <div v-else-if="!productStore.searchedProducts.length" class="mt-4 text-red-500">
      <p>No Products Found</p>
    </div>

    <!-- scrollable product list -->
    <div v-else class="mt-4 h-[400px] overflow-auto" ref="scrollContainer">
      <ul>
        <li v-for="product in productStore.searchedProducts" :key="product.id"
          class="flex items-center justify-between p-2 border-b">
          <div class="flex items-center gap-2">
            <Avatar class="h-10 w-10">
              <AvatarImage :src="getProductImage(product)" :alt="product.productName" />
              <AvatarFallback>{{ product.productName.charAt(0).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div>
              <p class="font-semibold">{{ product.productName }}</p>
              <p class="text-sm text-muted-foreground">{{ product.sellingPrice }} Ks</p>
              <p class="text-sm text-muted-foreground">Qty: {{ product.stockQty }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Input type="number" v-model.number="quantities[product.id.toString()]" min="1" class="w-20" />
            <Button @click="addToCart(product)" :disabled="product.stockQty <= 0">Add to Cart</Button>
          </div>
        </li>
      </ul>

      <!-- bottom loader -->
      <div v-if="productStore.isSearchingProducts" class="flex justify-center p-4">
        <span class="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6"></span>
      </div>

      <!-- no more products -->
      <div v-if="noMoreProducts" class="text-center text-gray-500 p-2">No more products</div>

      <!-- sentinel observed by IntersectionObserver -->
      <div ref="infiniteSentinel" class="h-1 w-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductImage } from '@/lib/images'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'vue-sonner'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/api/products/types'
import { useDebounce } from '@vueuse/core'

const productStore = useProductStore()
const cartStore = useCartStore()

// search
const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 500)

// quantities keyed by string id
const quantities = reactive<Record<string, number>>({})

// scroll / observer refs
const scrollContainer = ref<HTMLElement | null>(null)
const infiniteSentinel = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const noMoreProducts = ref(false)

// INITIAL LOAD
onMounted(async () => {
  productStore.pageNumber = 1
  productStore.pageSize = 5
  noMoreProducts.value = false

  // initial fetch (non-append)
  const first = await productStore.searchProducts('')
  if (!first.length || first.length < productStore.pageSize) noMoreProducts.value = true

  // wait DOM painted then init observer
  await nextTick()
  initObserver()
})

// cleanup
onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
})

/** init IntersectionObserver watching the sentinel inside the scrollContainer */
function initObserver() {
  // disconnect any existing observer
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }

  if (!infiniteSentinel.value || !scrollContainer.value) {
    console.warn('Infinite scroll: sentinel or container not ready')
    return
  }

  observer.value = new IntersectionObserver(
    async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !productStore.isSearchingProducts && !noMoreProducts.value) {
          // load next page in append mode
          productStore.pageNumber += 1
          const fetched = await productStore.searchProducts(searchQuery.value, true)
          // stop when backend returns fewer items than pageSize
          if (!fetched.length || fetched.length < productStore.pageSize) {
            noMoreProducts.value = true
          }
        }
      }
    },
    {
      root: scrollContainer.value,
      rootMargin: '100px', // prefetch earlier
      threshold: 0.1,
    }
  )

  observer.value.observe(infiniteSentinel.value)
}

// WATCH: user types -> reset list and fetch
watch(debouncedSearchQuery, async (val) => {
  productStore.pageNumber = 1
  productStore.pageSize = 10
  noMoreProducts.value = false
  productStore.searchedProducts = []
  const fetched = await productStore.searchProducts(val, false)
  if (!fetched.length || fetched.length < productStore.pageSize) noMoreProducts.value = true
  // re-init observer in case sentinel changed
  await nextTick()
  initObserver()
})

/** Add to cart: update ProductStore stock and CartStore */
const addToCart = (product: Product) => {
  const key = product.id.toString()
  const qty = quantities[key] ?? 1

  if (qty <= 0) {
    toast.error('Quantity must be greater than 0')
    return
  }

  if (qty > product.stockQty) {
    toast.error(`Only ${product.stockQty} available for ${product.productName}`)
    return
  }

  // update the product in the store (find the same object and mutate)
  const prod = productStore.searchedProducts.find((p) => p.id === product.id)
  if (prod) prod.stockQty -= qty

  cartStore.addToCart(product, qty)
  toast.success(`${qty} of ${product.productName} added to cart`)

  // reset input
  quantities[key] = 1
}

defineExpose({
  products: productStore.searchedProducts,
  refetchProducts: productStore.searchProducts,
})
</script>
