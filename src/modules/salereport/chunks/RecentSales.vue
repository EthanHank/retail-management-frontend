<script setup lang="ts">
import { getSales } from '@/api/sales'
import type { Sale } from '@/api/sales/types'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone
} from '@internationalized/date'
import { Pagination, PaginationLink } from '@/components/ui/pagination'
import type { DateRange } from 'reka-ui'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const page = ref(parseInt(route.query.page as string) || 1)
const pageSize = ref(10)

const df = new DateFormatter('en-US', {
  dateStyle: 'long'
})

const date = ref<DateRange>()

const filters = reactive({
  PageNumber: page,
  PageSize: pageSize,
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined
})

const { data, isLoading, isError, refetch } = getSales.useQuery(filters)

const sales = computed(() => {
  if (!data.value) return []
  return data.value.map((sale: Sale) => {
    const totalItems = sale.productSales.reduce((acc: number, item) => acc + item.qtySold, 0)
    const totalRevenue = sale.productSales.reduce((acc: number, item) => acc + item.revenue, 0)
    const totalProfit = sale.productSales.reduce((acc: number, item) => acc + item.profit, 0)
    return {
      ...sale,
      totalItems,
      totalRevenue,
      totalProfit
    }
  })
})

const isLastPage = computed(() => {
  return data.value ? data.value.length < pageSize.value : false;
});

watch(page, async (newPage) => {
  router.push({ query: { ...route.query, page: newPage } })
})

const formatDate = (dateValue: DateValue) => {
  const year = dateValue.year
  const month = String(dateValue.month).padStart(2, '0')
  const day = String(dateValue.day).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const applyFilter = () => {
  if (date.value?.start) {
    filters.startDate = formatDate(date.value.start as never)
  }
  if (date.value?.end) {
    filters.endDate = formatDate(date.value.end as never)
  }
  refetch()
}

const expandedSaleId = ref<string | null>(null)

const toggleExpand = (saleId: string) => {
  if (expandedSaleId.value === saleId) {
    expandedSaleId.value = null
  } else {
    expandedSaleId.value = saleId
  }
}

const previousPage = () => {
  if (page.value > 1) {
    page.value--
  }
}

const nextPage = () => {
  if (!isLastPage.value) {
    page.value++
  }
}

</script>

<template>
  <Card class="col-span-full" v-if="authStore.isAdmin">
    <CardHeader>
      <div class="flex flex-col md:flex-row items-center gap-4 overflow-x-hidden">
        <Popover>
          <PopoverTrigger class="w-full" as-child>
            <Button variant="outline" :class="cn(
              'w-full md:w-[350px] justify-center text-center font-normal',
              !date?.start && 'text-muted-foreground'
            )
              ">
              <CalendarIcon class="mr-2 h-4 w-4" />
              <template v-if="date?.start">
                <template v-if="date.end">
                  {{ df.format(date.start.toDate(getLocalTimeZone())) }} -
                  {{ df.format(date.end.toDate(getLocalTimeZone())) }}
                </template>

                <template v-else>
                  {{ df.format(date.start.toDate(getLocalTimeZone())) }}
                </template>
              </template>
              <template v-else> Pick a date </template>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <RangeCalendar :model-value="date" @update:model-value="newDate => date = newDate" />
          </PopoverContent>
        </Popover>
        <Button class="w-full md:w-auto" @click="applyFilter" :disabled="!date?.start"> Filter </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="space-y-4">
        <Skeleton v-for="n in 10" :key="n" class="h-15 w-full" />
      </div>
      <div v-else-if="isError" class="text-red-500">
        An error occurred while fetching sales data.
      </div>
      <div v-else-if="sales && sales.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              </th>
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
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Profit
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <template v-for="sale in sales" :key="sale.id">
              <tr class="cursor-pointer" @click="toggleExpand(sale.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <ChevronDown class="h-4 w-4 transition-transform"
                    :class="expandedSaleId === sale.id && 'rotate-180'" />
                </td>
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
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-500">
                  {{ sale.totalProfit.toLocaleString() }} Ks
                </td>
              </tr>
              <tr v-if="expandedSaleId === sale.id">
                <td colspan="6" class="p-0">
                  <div class="p-4 bg-muted/50">
                    <h5 class="font-semibold mb-2">Sold Products</h5>
                    <div class="flex font-semibold text-sm text-muted-foreground">
                      <div class="w-1/4">Product</div>
                      <div class="w-1/5 text-right">Quantity</div>
                      <div class="w-1/5 text-right">Price Per Item</div>
                      <div class="w-1/5 text-right">Profit Per Item</div>
                      <div class="w-1/5 text-right">Total Revenue</div>
                      <div class="w-1/5 text-right">Total Profit</div>
                    </div>
                    <div v-for="item in sale.productSales" :key="item.products.id" class="flex text-sm mt-2">
                      <div class="w-1/4">{{ item.products.productName }}</div>
                      <div class="w-1/5 text-right">{{ item.qtySold }}</div>
                      <div class="w-1/5 text-right">
                        {{ item.products.sellingPrice.toLocaleString() }} Ks
                      </div>
                      <div class="w-1/5 text-right">
                        {{ item.products.profitPerItem.toLocaleString() }} Ks
                      </div>
                      <div class="w-1/5 text-right">{{ item.revenue.toLocaleString() }} Ks</div>
                      <div class="w-1/5 text-right">
                        {{ item.profit.toLocaleString() }} Ks
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No sales data found.</p>
      </div>
      <div class="flex items-center justify-end space-x-2 py-4">
        <Pagination v-if="!isLoading">
          <PaginationLink @click="previousPage" :disabled="page === 1">
            <ChevronLeft class="w-4 h-4" />
          </PaginationLink>
          <PaginationLink @click="nextPage" :disabled="isLastPage">
            <ChevronRight class="w-4 h-4" />
          </PaginationLink>
        </Pagination>
      </div>
    </CardContent>
  </Card>
</template>
