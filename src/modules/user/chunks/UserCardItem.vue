<template>
  <Card>
    <CardHeader class="p-2">
      <Avatar class="h-20 w-20 mx-auto">
        <AvatarImage :src="getUserImage(user)" :alt="user.username" />
        <AvatarFallback>{{ user.username.charAt(0).toUpperCase() }}</AvatarFallback>
      </Avatar>
    </CardHeader>
    <CardContent class="p-2 text-center">
      <p class="text-lg font-bold">{{ user.username }}</p>
      <Badge variant="secondary" class="mt-2">{{ user.role }}</Badge>
    </CardContent>
    <CardFooter class="p-2 flex justify-center space-x-2" v-if="authStore.isAdmin">
      <Button size="sm" @click="$emit('edit', user)">
        <Pencil class="w-4 h-4" />
      </Button>
      <Button size="sm" variant="destructive" @click="$emit('delete', user)">
        <Trash2 class="w-4 h-4" />
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getUserImage } from '@/lib/images'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { User } from '@/api/users/types'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

defineProps<{ user: User }>()
defineEmits<{ (e: 'edit', user: User): void; (e: 'delete', user: User): void }>()
</script>
