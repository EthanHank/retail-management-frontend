<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useLoginMutation } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'

const username = ref('')
const password = ref('')

const authStore = useAuthStore()

// Use the mutation hook
const mutation = useLoginMutation({
  // On success, store the auth data
  onSuccess: (data) => {
    authStore.setAuth(data)
    toast.success('Logged in successfully')
  }
})

const handleLogin = () => {
  mutation.mutate({
    username: username.value,
    password: password.value
  })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Login</CardTitle>
        <CardDescription>Enter your username and password to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <label for="username">Username</label>
              <Input id="username" type="text" placeholder="Your username" v-model="username" required />
            </div>
            <div class="grid gap-2">
              <label for="password">Password</label>
              <Input id="password" type="password" v-model="password" placeholder="Your password" required />
            </div>
            <!-- Display error message from the mutation hook -->
            <div v-if="mutation.isError.value" class="text-red-500 text-sm">
              Failed to login. Please check your credentials.
            </div>
            <!-- Disable button based on mutation pending state -->
            <Button type="submit" class="w-full" :disabled="mutation.isPending.value">
              {{ mutation.isPending.value ? 'Logging in...' : 'Login' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
