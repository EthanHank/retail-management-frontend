import { type UseQueryOptions, useQuery } from "@tanstack/vue-query";
import axios from "axios";
import type { Dashboard } from "./types.d";

export const getDashboard = {
  useQuery: (opt?: Partial<UseQueryOptions<Dashboard, Error>>) => {
    return useQuery<Dashboard, Error>({
      queryKey: ['dashboard'],
      queryFn: async () => {
        const request = await axios.get(`dashboard/getDashboardData`);
        return request.data.data;
      },
      ...opt
    })
  }
}
