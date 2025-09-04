import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage, StorageSerializers } from '@vueuse/core'
import router from '@/router'

/**
 * Shape of the User object from the backend response.
 */
export interface User {
  id: string
  username: string
  role: string
  createdDate: string
  updatedDate: string
  createdBy: string
  updatedBy: string
  activeFlag: boolean
}

/**
 * Shape of the entire authentication response from the backend.
 */
export interface AuthResponse {
  token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  // Persist state to localStorage using @vueuse/core for session persistence
  const user = useStorage<User | null>('user', null, undefined, {
    serializer: StorageSerializers.object
  })
  const token = useStorage<string | null>('token', null)

  // A computed property to easily check if the user is authenticated
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')

  // single role checking
  function hasRole(role: string) {
    return user.value?.role === role
  }

  // multiple role checking
  function hasAnyRole(roles: string[]) {
    return roles.includes(user.value?.role ?? '')
  }

  /**
   * Stores the authentication data after a successful login.
   * @param authResponse - The response object from the login API.
   */
  function setAuth(authResponse: AuthResponse) {
    user.value = authResponse.user
    token.value = authResponse.token
    // Redirect to the dashboard or home page after login
    router.push('/')
  }

  /**
   * Clears user data and token, effectively logging the user out.
   */
  function logout() {
    user.value = null
    token.value = null
    // Redirect to the login page after logout
    router.push('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    hasAnyRole,
    hasRole,
    setAuth,
    logout
  }
})
