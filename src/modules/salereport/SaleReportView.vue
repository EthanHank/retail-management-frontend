<template>
  <div class="container" v-if="authStore.isAdmin">
    <div class="flex flex-col space-y-4">
      <div>
        <h1 class="text-3xl font-bold">Our Sale Reports</h1>
        <p class="text-muted-foreground">View our sales reports here.</p>
      </div>

      <RecentSales />
    </div>
  </div>
</template>

<script setup lang="ts">
import RecentSales from './chunks/RecentSales.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
