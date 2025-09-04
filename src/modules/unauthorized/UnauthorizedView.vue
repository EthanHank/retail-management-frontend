<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-4xl font-bold text-red-500 mb-4">Unauthorized</h1>
    <p class="text-muted-foreground mb-6">You don’t have permission to access this page.</p>
    <Button @click="goBack" class="cursor-pointer">Go to Dashboard</Button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'Dashboard' })
}
</script>

<style scoped></style>
