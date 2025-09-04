import { useMutation, type UseMutationOptions } from '@tanstack/vue-query'
import axios from '@/config/axios'
import type { AuthResponse, LoginDto } from './types'

export const useLoginMutation = (
  opt?: Partial<UseMutationOptions<AuthResponse, Error, LoginDto>>
) => {
  return useMutation<AuthResponse, Error, LoginDto>({
    mutationKey: ['login'],
    mutationFn: async (credentials) => {
      const response = await axios.post<AuthResponse>('/auth/login', credentials)
      return response.data
    },
    ...opt
  })
}
