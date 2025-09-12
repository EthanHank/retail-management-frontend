<template>
  <div class="container">
    <div class="flex items-center justify-between mt-3">
      <div>
        <h1 class="text-3xl font-bold">Our Products</h1>
        <p class="text-muted-foreground">Manage your products here.</p>
      </div>
      <div v-if="authStore.isAdmin || authStore.hasRole('StockClerk')">
        <Button @click="openAddDialog">
          <Plus class="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      <Skeleton v-for="n in 8" :key="n" class="h-40 w-full" />
    </div>
    <div v-else-if="isError" class="text-red-500 mt-6">
      An error occurred while fetching products data.
    </div>
    <ProductList v-else :products="products ?? []" @edit="openEditDialog" @delete="openDeleteConfirmation" />

    <div class="flex items-center justify-end space-x-2 py-4">
      <Pagination v-if="!isLoading">
        <PaginationLink @click="previousPage" :disabled="page === 1">
          <ChevronLeft class="w-4 h-4" />
        </PaginationLink>
        <PaginationLink @click="nextPage" :disabled="isLastPage">
          <ChevronRight class="w-4 h-4" />
        </PaginationLink>
      </Pagination>
    </div>

    <ProductAddDialog :open="isAddDialogOpen" :is-pending="isCreating" :errors="addErrors ?? {}"
      @update:open="isAddDialogOpen = false" @save="handleAdd" />
    <ProductEditDialog :open="isEditDialogOpen" :is-pending="isUpdating" :product="selectedProduct"
      :errors="editErrors ?? {}" @update:open="isEditDialogOpen = false" @save="handleUpdate" />

    <AlertDialog :open="isDeleteConfirmationOpen" @update:open="isDeleteConfirmationOpen = false">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="isDeleteConfirmationOpen = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDeleteConfirmation">{{ isDeleting ? 'Deleting...' : 'Delete' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  <Sonner />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { Pagination, PaginationLink } from '@/components/ui/pagination'
import ProductList from './chunks/ProductList.vue'
import ProductAddDialog from './chunks/ProductAddDialog.vue'
import ProductEditDialog from './chunks/ProductEditDialog.vue'
import type { Product, CreateProduct } from '@/api/products/types'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const page = ref(parseInt(route.query.page as string) || 1)
const pageSize = ref(8)

const { data, isLoading, isError, refetch } = api.products.getProducts.useQuery({
  PageNumber: page,
  PageSize: pageSize,
  productName: ''
})

const products = computed(() => data.value ?? []);

const isLastPage = computed(() => {
  return data.value ? data.value.length < pageSize.value : false;
});

watch(page, async (newPage) => {
  router.push({ query: { ...route.query, page: newPage } })
})

const { mutate: createProduct, isPending: isCreating } = api.products.createProduct.useMutation()
const { mutate: updateProduct, isPending: isUpdating } = api.products.updateProduct.useMutation()
const { mutate: deleteProduct, isPending: isDeleting } = api.products.deleteProduct.useMutation()

const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isDeleteConfirmationOpen = ref(false)
const selectedProduct = ref<Product | null>(null)
const addErrors = ref<Errors | null>(null)
const editErrors = ref<Errors | null>(null)

const openAddDialog = () => {
  addErrors.value = null
  isAddDialogOpen.value = true
}

interface Errors {
  ProductName?: string[]
  SellingPrice?: string[]
  StockQty?: string[]
  ProfitPerItem?: string[]
}

const openEditDialog = (product: Product) => {
  editErrors.value = null
  selectedProduct.value = product
  isEditDialogOpen.value = true
}

const openDeleteConfirmation = (product: Product) => {
  selectedProduct.value = product
  isDeleteConfirmationOpen.value = true
}

const handleAdd = (form: CreateProduct) => {
  addErrors.value = null // Clear previous errors
  createProduct(form, {
    onSuccess: () => {
      refetch()
      isAddDialogOpen.value = false
      toast.success('Product added successfully')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 400 && error.response?.data?.errors) {
        addErrors.value = error.response.data.errors
      } else {
        const errorMessage = error.message || 'Failed to add product'
        toast.error(errorMessage)
      }
    }
  })
}

const handleUpdate = (form: Partial<Product>) => {
  editErrors.value = null // Clear previous errors
  if (selectedProduct.value) {
    updateProduct(
      { ...selectedProduct.value, ...form },
      {
        onSuccess: () => {
          refetch()
          isEditDialogOpen.value = false
          toast.success('Product updated successfully')
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.status === 400 && error.response?.data?.errors) {
            editErrors.value = error.response.data.errors
          } else {
            const errorMessage = error.message || 'Failed to update product'
            toast.error(errorMessage)
          }
        }
      }
    )
  }
}

const handleDeleteConfirmation = () => {
  if (selectedProduct.value) {
    deleteProduct(selectedProduct.value.id, {
      onSuccess: () => {
        refetch()
        isDeleteConfirmationOpen.value = false
        toast.success('Product deleted successfully')
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 400 && error.response?.data?.errors) {
          const errorMessage = error.response?.data?.title || error.message || 'Failed to delete product'
          toast.error(errorMessage)
        }
      }
    })
  }
}

const previousPage = () => {
  if (page.value > 1) {
    page.value--
  }
}

const nextPage = () => {
  if (!isLastPage.value) {
    page.value++
  }
}

</script>
