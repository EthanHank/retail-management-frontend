import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/vue-query"
import axios from "axios";
import type { Product, CreateProduct, UpdateProduct } from "./types";
import { unref, type MaybeRef } from "vue";


interface GetProductsProps {
  PageNumber: MaybeRef<number>;
  PageSize: MaybeRef<number>;
  productName: MaybeRef<string | undefined>;
}

export const getProducts = {
  useQuery: ({ PageNumber, PageSize, productName }: GetProductsProps, opt?: Partial<UseQueryOptions<Array<Product>, Error>>) => {
    return useQuery<Product[], Error>({
      queryKey: ['products', { PageNumber, PageSize, productName }],
      queryFn: async () => {
        let url = `products/getAllProducts?PageNumber=${unref(PageNumber)}&PageSize=${unref(PageSize)}`;
        if (productName) {
          url += `&productName=${unref(productName)}`;
        }
        const request = await axios.get(url);
        return request.data.data;
      },
      ...opt
    })
  }
}

export const createProduct = {
  useMutation: (opt?: Partial<UseMutationOptions<Product, Error, CreateProduct>>) => {
    return useMutation<Product, Error, CreateProduct>({
      mutationFn: async (product) => {
        const request = await axios.post(`products/addProduct`, product);
        return request.data;
      },
      ...opt
    })
  }
}

export const updateProduct = {
  useMutation: (opt?: Partial<UseMutationOptions<Product, Error, UpdateProduct>>) => {
    return useMutation<Product, Error, UpdateProduct>({
      mutationFn: async (product) => {
        const request = await axios.put(`products/updateProduct`, product);
        return request.data;
      },
      ...opt
    })
  }
}

export const deleteProduct = {
  useMutation: (opt?: Partial<UseMutationOptions<{ success: boolean }, Error, string>>) => {
    return useMutation<{ success: boolean }, Error, string>({
      mutationFn: async (id) => {
        const request = await axios.delete(`products/deleteProduct/${id}`);
        return request.data;
      },
      ...opt
    })
  }
}
