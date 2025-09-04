<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-vue-next'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
    <header class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" class="md:hidden" @click="toggleSidebar">
        <Menu class="h-6 w-6" />
      </Button>
      <div class="flex w-full items-center justify-end gap-4">
        <ThemeToggle />
      </div>
    </header>
    <main class="p-6" :class="{ 'md:ml-[var(--sidebar-width)]': true }">
      <RouterView />
    </main>
  </div>
</template>
