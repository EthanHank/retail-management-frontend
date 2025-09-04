export interface Product {
  id: string
  productName: string
  stockQty: number
  sellingPrice: number
  profitPerItem: number
  createdDate: string
  updatedDate: string
  createdBy: string
  updatedBy: string
  activeFlag: boolean
  quantity?: number
}

export type CreateProduct = {
  productName: string
  stockQty: number
  sellingPrice: number
  profitPerItem: number
}

export type UpdateProduct = {
  id: string
  productName: string
  stockQty: number
  sellingPrice: number
  profitPerItem: number
}

export interface CartItem extends Product {
  quantity: number;
}

