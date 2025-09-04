export interface LoginDto {
  username: string
  password: string
}

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

export interface AuthResponse {
  token: string
  user: User
}
