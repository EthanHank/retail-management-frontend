import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/vue-query"
import axios from "axios";
import type { User, AddUser, UpdateUser } from "./types";


interface GetUsersProps {
  PageNumber: number;
  PageSize: number;
}

export const getUsers = {
  useQuery: ({ PageNumber, PageSize }: GetUsersProps, opt?: Partial<UseQueryOptions<Array<User>, Error>>) => {
    return useQuery<User[], Error>({
      queryKey: ['users', { PageNumber, PageSize }],
      queryFn: async () => {
        const request = await axios.get(`users/getAllUsers?PageNumber=${PageNumber}&PageSize=${PageSize}`);
        return request.data.data;
      },
      ...opt
    })
  }
}

export const createUser = {
  useMutation: (opt?: Partial<UseMutationOptions<User, Error, AddUser>>) => {
    return useMutation<User, Error, AddUser>({
      mutationFn: async (user) => {
        const request = await axios.post(`users/addUser`, user);
        return request.data;
      },
      ...opt
    })
  }
}

export const updateUser = {
  useMutation: (opt?: Partial<UseMutationOptions<User, Error, UpdateUser>>) => {
    return useMutation<User, Error, UpdateUser>({
      mutationFn: async (user) => {
        const request = await axios.put(`users/updateUser`, user);
        return request.data;
      },
      ...opt
    })
  }
}

export const deleteUser = {
  useMutation: (opt?: Partial<UseMutationOptions<{ success: boolean }, Error, string>>) => {
    return useMutation<{ success: boolean }, Error, string>({
      mutationFn: async (id) => {
        const request = await axios.delete(`users/deleteUser/${id}`);
        return request.data;
      },
      ...opt
    })
  }
}
