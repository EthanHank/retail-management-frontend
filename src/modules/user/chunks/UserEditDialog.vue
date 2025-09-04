<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>Update the details of your user.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="name">Username</Label>
          <Input id="name" v-model="form.username" :class="cn({ 'border-destructive': errors?.Username })" />
          <p v-for="message in errors?.Username" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="price">Role</Label>
          <Input id="price" v-model="form.role" type="text" :class="cn({ 'border-destructive': errors?.Role })" />
          <p v-for="message in errors?.Role" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button @click="$emit('save', form)">{{ isPending ? 'Saving...' : 'Save' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { User } from '@/api/users/types'
import { cn } from '@/lib/utils'

interface Errors {
  Username?: string[]
  Role?: string[]
}

const props = defineProps<{ user: User | null, open: boolean, isPending: boolean, errors?: Errors }>()
defineEmits(['update:open', 'save'])

const form = reactive<Partial<User>>({
  username: '',
  role: '',
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.id = newUser.id
    form.username = newUser.username
    form.role = newUser.role
  }
})
</script>
