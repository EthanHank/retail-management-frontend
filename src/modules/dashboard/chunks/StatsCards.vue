<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Products</CardTitle>
        <Package class="h-7 w-7 text-muted-foreground card-icon" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-medium">{{ dashboardData?.totalProducts }}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Users</CardTitle>
        <Users class="h-7 w-7 text-indigo-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-medium">{{ dashboardData?.totalUsers }}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Sales</CardTitle>
        <CreditCard class="h-7 w-7 text-red-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-medium">{{ dashboardData?.totalSales }}</div>
      </CardContent>
    </Card>
  </div>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Profit</CardTitle>
        <BanknoteArrowUp class="h-7 w-7 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-medium">{{ dashboardData?.totalProfit.toLocaleString() }} Ks</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
        <Banknote class="h-7 w-7 text-blue-300" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-medium">{{ dashboardData?.totalRevenue.toLocaleString() }} Ks</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Qty Sold</CardTitle>
        <PackageCheck class="h-7 w-7 text-cyan-600" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-medium">{{ dashboardData?.totalQtySold.toLocaleString() }}</div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, CreditCard, Banknote, BanknoteArrowUp, PackageCheck } from 'lucide-vue-next'

const { data: dashboardData } = api.dashboard.getDashboard.useQuery()
</script>

<style scoped>
.card-icon {
  color: var(--color-primary);
}
</style>
