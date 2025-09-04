// /stores/product.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Product } from '../api/products/types'

export const useProductStore = defineStore('product', () => {
  const isSearchingProducts = ref(false)
  const searchedProducts = ref<Product[]>([])

  // Pagination state
  const pageNumber = ref(1)
  const pageSize = ref(10)
  const totalCount = ref(0) // if backend sends it

  /**
   * Fetch products (supports append mode for infinite scroll)
   */
  async function searchProducts(query: string = '', append = false) {
    isSearchingProducts.value = true
    try {
      const url = `products/getAllProducts?PageNumber=${pageNumber.value}&PageSize=${pageSize.value}&productName=${query}`
      const response = await axios.get(url)

      const fetched = response.data.data.map((p: Product) => ({
        ...p,
        quantity: 1,
      }))

      if (append) {
        // ✅ Append for infinite scroll
        searchedProducts.value.push(...fetched)
      } else {
        // ✅ Reset for fresh search or page change
        searchedProducts.value = fetched
      }

      // ✅ handle total count if API sends it
      if (response.data.totalCount) {
        totalCount.value = response.data.totalCount
      }

      return fetched
    } catch (error) {
      console.error('Error searching products:', error)
      if (!append) searchedProducts.value = []
      return []
    } finally {
      isSearchingProducts.value = false
    }
  }

  // Pagination helpers
  function nextPage(query: string = '', append = false) {
    pageNumber.value++
    return searchProducts(query, append)
  }

  function prevPage(query: string = '', append = false) {
    if (pageNumber.value > 1) {
      pageNumber.value--
      return searchProducts(query, append)
    }
  }

  return {
    // state
    isSearchingProducts,
    searchedProducts,
    pageNumber,
    pageSize,
    totalCount,

    // actions
    searchProducts,
    nextPage,
    prevPage,
  }
})
