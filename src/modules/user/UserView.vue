<template>
  <div class="container" v-if="authStore.isAdmin">
    <div class="flex items-center justify-between mt-3">
      <div>
        <h1 class="text-3xl font-bold">Our Users</h1>
        <p class="text-muted-foreground">Manage your users here.</p>
      </div>
      <div>
        <Button @click="openAddDialog" v-if="authStore.isAdmin">
          <Plus class="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      <Skeleton v-for="n in 8" :key="n" class="h-40 w-full" />
    </div>
    <div v-else-if="isError" class="text-red-500 mt-6">
      An error occurred while fetching users data.
    </div>
    <UserList v-else :users="users ?? []" @edit="openEditDialog" @delete="openDeleteConfirmation" />

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

    <UserAddDialog :open="isAddDialogOpen" :is-pending="isCreating" :errors="addErrors ?? {}"
      @update:open="isAddDialogOpen = false" @save="handleAdd" />
    <UserEditDialog :open="isEditDialogOpen" :is-pending="isUpdating" :user="selectedUser" :errors="editErrors ?? {}"
      @update:open="isEditDialogOpen = false" @save="handleUpdate" />

    <AlertDialog :open="isDeleteConfirmationOpen" @update:open="isDeleteConfirmationOpen = false">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user.
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
import UserList from './chunks/UserList.vue'
import UserAddDialog from './chunks/UserAddDialog.vue'
import UserEditDialog from './chunks/UserEditDialog.vue'
import type { User, AddUser } from '@/api/users/types'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const page = ref(parseInt(route.query.page as string) || 1)
const pageSize = ref(8)

const { data, isLoading, isError, refetch } = api.users.getUsers.useQuery({
  PageNumber: page.value,
  PageSize: pageSize.value
})

const users = computed(() => data.value ?? []);

const isLastPage = computed(() => {
  return data.value ? data.value.length < pageSize.value : false;
});

watch(page, async (newPage) => {
  router.push({ query: { ...route.query, page: newPage } })
  await refetch()
})

const { mutate: createUser, isPending: isCreating } = api.users.createUser.useMutation()
const { mutate: updateUser, isPending: isUpdating } = api.users.updateUser.useMutation()
const { mutate: deleteUser, isPending: isDeleting } = api.users.deleteUser.useMutation()

const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const isDeleteConfirmationOpen = ref(false)
const selectedUser = ref<User | null>(null)
const addErrors = ref<Errors | null>(null)
const editErrors = ref<Errors | null>(null)

const openAddDialog = () => {
  addErrors.value = null
  isAddDialogOpen.value = true
}

interface Errors {
  Username?: string[]
  Password?: string[]
  Role?: string[]
}

const openEditDialog = (user: User) => {
  editErrors.value = null
  selectedUser.value = user
  isEditDialogOpen.value = true
}

const openDeleteConfirmation = (user: User) => {
  selectedUser.value = user
  isDeleteConfirmationOpen.value = true
}

const handleAdd = (form: AddUser) => {
  addErrors.value = null // Clear previous errors
  createUser(form, {
    onSuccess: () => {
      refetch()
      isAddDialogOpen.value = false
      toast.success('User added successfully')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 400 && error.response?.data?.errors) {
        addErrors.value = error.response.data.errors
      } else {
        const errorMessage = error.message || 'Failed to add user'
        toast.error(errorMessage)
      }
    }
  })
}

const handleUpdate = (form: Partial<User>) => {
  editErrors.value = null // Clear previous errors
  if (selectedUser.value) {
    updateUser(
      { ...selectedUser.value, ...form },
      {
        onSuccess: () => {
          refetch()
          isEditDialogOpen.value = false
          toast.success('User updated successfully')
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.status === 400 && error.response?.data?.errors) {
            editErrors.value = error.response.data.errors
          } else {
            const errorMessage = error.message || 'Failed to update user'
            toast.error(errorMessage)
          }
        }
      }
    )
  }
}

const handleDeleteConfirmation = () => {
  if (selectedUser.value) {
    deleteUser(selectedUser.value.id, {
      onSuccess: () => {
        refetch()
        isDeleteConfirmationOpen.value = false
        toast.success('User deleted successfully')
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
