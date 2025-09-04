import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/vue-query"
import axios from "axios";
import { type MaybeRef, unref } from "vue";
import type { Sale, CreateSale, ProductSaleInfo } from "./types.d";

interface GetSalesProps {
  PageNumber: MaybeRef<number>;
  PageSize: MaybeRef<number>;
  startDate?: MaybeRef<string | undefined>;
  endDate?: MaybeRef<string | undefined>;
}

export const getSales = {
  useQuery: (props: GetSalesProps, opt?: Partial<UseQueryOptions<Sale[], Error>>) => {
    return useQuery<Sale[], Error>({
      queryKey: ['sales', props],
      queryFn: async ({ queryKey }) => {
        const [, { PageNumber, PageSize, startDate, endDate }] = queryKey as [string, GetSalesProps];
        let url = `sales/getAllSaleReport?PageNumber=${unref(PageNumber)}&PageSize=${unref(PageSize)}`;
        if (unref(startDate)) url += `&startDate=${unref(startDate)}`;
        if (unref(endDate)) url += `&endDate=${unref(endDate)}`;
        const request = await axios.get(url);
        return request.data.data;
      },
      ...opt
    })
  }
}

export const createSale = {
  useMutation: (opt?: Partial<UseMutationOptions<ProductSaleInfo[], Error, CreateSale>>) => {
    return useMutation<ProductSaleInfo[], Error, CreateSale>({
      mutationFn: async (sale) => {
        const request = await axios.post(`sales/addSale`, sale);
        return request.data;
      },
      ...opt
    })
  }
}


