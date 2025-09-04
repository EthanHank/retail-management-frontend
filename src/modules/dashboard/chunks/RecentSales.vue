<script setup lang="ts">
import { getSales } from '@/api/sales'
import type { Sale } from '@/api/sales/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { computed } from 'vue'

const { data, isLoading, isError } = getSales.useQuery({ PageNumber: 1, PageSize: 5 })

const sales = computed(() => {
  if (!data.value) return []
  return data.value.map((sale: Sale) => {
    const totalItems = sale.productSales.reduce((acc: number, item) => acc + item.qtySold, 0)
    const totalRevenue = sale.productSales.reduce((acc: number, item) => acc + item.revenue, 0)
    return {
      ...sale,
      totalItems,
      totalRevenue
    }
  })
})
</script>

<template>
  <Card class="col-span-full">
    <CardHeader>
      <CardTitle>Recent Sales</CardTitle>
      <CardDescription>Here are the most recent sales from your store.</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="space-y-4">
        <Skeleton v-for="n in 5" :key="n" class="h-10 w-full" />
      </div>
      <div v-else-if="isError" class="text-red-500">
        An error occurred while fetching sales data.
      </div>
      <div v-else-if="sales && sales.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Items
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="sale in sales" :key="sale.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ sale.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ new Date(sale.saleDate).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ sale.totalItems }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-500">
                {{ sale.totalRevenue.toLocaleString() }} Ks
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No sales data available yet.</p>
      </div>
    </CardContent>
  </Card>
</template>
