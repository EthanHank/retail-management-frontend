<template>
  <div>
    <ul>
      <li v-for="item in cart" :key="item.id" class="flex items-center justify-between p-2 border-b">
        <div>
          <p class="font-semibold">{{ item.productName }}</p>
          <p class="text-sm text-muted-foreground">{{ item.quantity }} x {{ item.sellingPrice }} Ks</p>
        </div>
        <div class="flex items-center gap-2">
          <p class="font-semibold">{{ item.quantity * item.sellingPrice }} Ks</p>
          <Button size="sm" @click="decrement(item.id)">-</Button>
          <span>{{ item.quantity }}</span>
          <Button size="sm" @click="increment(item.id)" :disabled="item.quantity >= item.stockQty">+</Button>
          <Button variant="destructive" size="sm" @click="remove(item.id)">Remove</Button>
        </div>
      </li>
    </ul>
    <div class="mt-4">
      <div class="flex justify-between font-semibold">
        <p>Total:</p>
        <p>{{ total }} Ks</p>
      </div>
      <Button @click="checkout" class="w-full mt-4" :disabled="!cart.length"
        v-if="authStore.isAdmin || authStore.hasRole('Cashier')">Checkout</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import { toast } from 'vue-sonner';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const cartStore = useCartStore();
const productStore = useProductStore();

const props = defineProps<{
  cart: typeof cartStore.cart;
}>();

const total = computed(() => {
  return props.cart.reduce((acc, item) => acc + item.quantity * item.sellingPrice, 0);
});

const emit = defineEmits<{
  (e: 'checkout'): void;
}>();

const checkout = () => {
  emit('checkout');
};

const remove = (productId: string) => {
  const item = cartStore.cart.find((item) => item.id === productId);
  if (!item) return;

  const prod = productStore.searchedProducts.find(p => p.id === item.id)
  if (prod) prod.stockQty += item.quantity

  cartStore.removeFromCart(productId);
  toast.success(`${prod?.productName} removed from cart`);
};

const increment = (productId: string) => {
  const item = cartStore.cart.find((item) => item.id === productId);
  if (!item) return;

  const prod = productStore.searchedProducts.find(p => p.id === item.id)
  if (!prod || prod.stockQty <= 0) return;

  cartStore.increment(productId);
  prod.stockQty -= 1
};

const decrement = (productId: string) => {
  const item = cartStore.cart.find((item) => item.id === productId);
  if (!item) return;

  const prod = productStore.searchedProducts.find(p => p.id === item.id)
  if (prod) prod.stockQty += 1
  cartStore.decrement(productId);
};

</script>
