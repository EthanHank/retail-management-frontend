<script setup lang="ts">
defineOptions({ name: 'AppSidebar' })
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { LogOut, X } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { computed } from 'vue'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const authStore = useAuthStore()
const router = useRouter()

interface AppRouteMeta {
  roles?: string[],
  sidebar?: boolean
  icon?: typeof import('lucide-vue-next').Icon
}

// Computed sidebar links from router
const navLinks = computed(() => {
  return router.getRoutes()
    .filter(r => r.name && r.meta?.sidebar) // only sidebar routes
    .filter(r => {
      const meta = r.meta as AppRouteMeta | undefined
      if (!meta) return true

      const roles = meta.roles
      return !roles || authStore.hasAnyRole(roles)
    })
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div
    class="fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'" :style="{ width: 'var(--sidebar-width)' }">
    <div class="flex h-16 items-center justify-between border-b px-4">
      <h1 class="text-xl font-bold">Retail App</h1>
      <Button variant="ghost" size="icon" class="md:hidden" @click="emit('close')">
        <X class="h-6 w-6" />
      </Button>
    </div>
    <nav class="flex-1 space-y-2 p-4">
      <RouterLink v-for="link in navLinks" :key="link.name" :to="link.path" custom v-slot="{ href, navigate, isActive }"
        @click="emit('close')">
        <a :href="href" @click="navigate"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          :class="{ 'bg-primary-foreground text-primary': isActive }">
          <component :is="link.meta?.icon" class="h-4 w-4" />
          {{ link.name }}
        </a>
      </RouterLink>
    </nav>
    <div class="mt-auto border-t p-4">
      <div v-if="authStore.isAuthenticated && authStore.user" class="flex items-center gap-4">
        <div>
          <p class="font-semibold">{{ authStore.user.username }}</p>
          <p class="text-xs text-muted-foreground">{{ authStore.user.role }}</p>
        </div>
        <Button variant="outline" size="icon" class="ml-auto" @click="handleLogout">
          <LogOut class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
