<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
    <UserCardItem v-for="user in users" :key="user.id" :user="user" @edit="$emit('edit', user)"
      @delete="$emit('delete', user)" />
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/api/users/types';
import UserCardItem from './UserCardItem.vue'

defineProps<{
  users: User[]
}>()

defineEmits<{
  (e: 'edit', user: User): void;
  (e: 'delete', user: User): void
}>()
</script>
