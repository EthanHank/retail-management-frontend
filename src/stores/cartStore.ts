import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { CartItem, Product } from '../api/products/types'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartItem[]>([])

  // ✅ Load from localStorage on init
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cart.value = JSON.parse(savedCart)
  }

  function addToCart(product: Product, quantity: number = 1) {
    const existing = cart.value.find((item) => item.id === product.id)

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.value.push({ ...product, quantity })
    }
  }

  function removeFromCart(productId: string) {
    cart.value = cart.value.filter((item) => item.id !== productId)
  }

  function increment(productId: string) {
    const item = cart.value.find((item) => item.id === productId)
    if (item) item.quantity++
  }

  function decrement(productId: string) {
    const item = cart.value.find((item) => item.id === productId)
    if (item) {
      item.quantity--
      if (item.quantity <= 0) removeFromCart(productId)
    }
  }

  function clearCart() {
    cart.value = []
  }

  const total = () =>
    cart.value.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)

  const totalItems = () =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)

  // ✅ Sync to localStorage whenever cart changes
  watch(
    cart,
    (newCart) => {
      localStorage.setItem('cart', JSON.stringify(newCart))
    },
    { deep: true }
  )

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    increment,
    decrement,
    totalItems,
    total,
  }
})
