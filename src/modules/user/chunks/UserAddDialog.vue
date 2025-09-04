<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add User</DialogTitle>
        <DialogDescription>Add a new user to your inventory.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="username">Username</Label>
          <Input id="username" v-model="form.username" :class="cn({ 'border-destructive': errors?.Username })" />
          <p v-for="message in errors?.Username" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="form.password" type="text"
            :class="cn({ 'border-destructive': errors?.Password })" />
          <p v-for="message in errors?.Password" :key="message" class="text-destructive text-sm">
            {{ message }}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="role">Role</Label>
          <Input id="role" v-model="form.role" type="text" :class="cn({ 'border-destructive': errors?.Role })" />
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
import { reactive } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Errors {
  Username?: string[]
  Password?: string[]
  Role?: string[]
}

defineProps<{ open: boolean, isPending: boolean, errors?: Errors }>()
defineEmits(['update:open', 'save'])

const form = reactive({
  username: '',
  password: '',
  role: ''
})
</script>
