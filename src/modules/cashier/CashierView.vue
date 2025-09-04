<template>
  <div class="container mx-auto p-4" v-if="authStore.isAdmin || authStore.hasRole('Cashier')">
    <h1 class="text-2xl font-bold mb-4">Cashier View</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <ProductSearch />
      </div>
      <div>
        <h3 class="text-md font-semibold mb-2">Shopping Cart ({{ cartStore.totalItems() }})</h3>
        <ShoppingCart :cart="cartStore.cart" @checkout="checkout"
          v-if="authStore.isAdmin || authStore.hasRole('Cashier')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductSearch from './chunks/ProductSearch.vue';
import ShoppingCart from './chunks/ShoppingCart.vue';
import api from '@/api';
import { toast } from 'vue-sonner';
import { useCartStore } from '@/stores/cartStore';
import jsPDF from 'jspdf';
import { useAuthStore } from '@/stores/authStore';

const cartStore = useCartStore();
const authStore = useAuthStore();

const { mutateAsync: createSale } = api.sales.createSale.useMutation();

const checkout = async () => {
  if (!cartStore.cart.length) {
    toast.error('Cart is empty')
    return
  }

  const productSales = cartStore.cart.map((item) => ({
    productId: item.id,
    qtySold: item.quantity,
  }));

  try {
    await createSale({ productSales });

    generatePDFReceipt()

    cartStore.clearCart();
    toast.success('Sale created successfully');
  } catch (error) {
    console.error(error);
    toast.error('Failed to create sale');
  }
};

// PDF generation function
const generatePDFReceipt = () => {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Receipt', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.text(`Date: ${new Date().toLocaleString()}`, 10, 30)

  let y = 40
  doc.text('Product', 10, y)
  doc.text('Qty', 80, y)
  doc.text('Price', 110, y)
  doc.text('Total', 150, y)
  y += 10

  cartStore.cart.forEach((item) => {
    doc.text(item.productName, 10, y)
    doc.text(String(item.quantity), 80, y)
    doc.text(String(item.sellingPrice), 110, y)
    doc.text(String(item.quantity * item.sellingPrice), 150, y)
    y += 10
  })

  doc.text(`Total: ${cartStore.total()} Ks`, 110, y + 10)
  doc.save(`receipt-${Date.now()}.pdf`)
}

</script>
