<template>
  <div class="container">
    <div class="flex flex-col space-y-4">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground">Welcome to your dashboard overview</p>
      </div>

      <StatsCards />
      <RecentProducts />

      <RecentSales v-if="authStore.isAdmin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatsCards from './chunks/StatsCards.vue'
import RecentProducts from './chunks/RecentProducts.vue'
import RecentSales from './chunks/RecentSales.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
