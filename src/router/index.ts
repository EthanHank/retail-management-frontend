import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import DashboardView from '@/modules/dashboard/DashboardView.vue'
import LoginView from '@/modules/auth/LoginView.vue'
import ProductView from '@/modules/product/ProductView.vue'
import UserView from '@/modules/user/UserView.vue'
import SaleReportView from '@/modules/salereport/SaleReportView.vue'
import CashierView from '@/modules/cashier/CashierView.vue'
import UnauthorizedView from '@/modules/unauthorized/UnauthorizedView.vue'
import { LayoutDashboard, Box, User, Receipt, ShoppingCart } from "lucide-vue-next";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true }, // This meta field protects all children
      children: [
        {
          path: '',
          name: 'home',
          redirect: '/dashboard' // Redirect root to dashboard
        },
        {
          name: 'Dashboard',
          path: '/dashboard',
          component: DashboardView,
          meta: { icon: LayoutDashboard, sidebar: true }
        },
        {
          name: 'Products',
          path: '/products',
          component: ProductView,
          meta: { roles: ['Admin', 'StockClerk'], icon: Box, sidebar: true }
        },
        {
          name: 'Users',
          path: '/users',
          component: UserView,
          meta: { roles: ['Admin'], icon: User, sidebar: true }
        },
        {
          name: 'Sale Reports',
          path: '/sale-reports',
          component: SaleReportView,
          meta: { roles: ['Admin'], icon: Receipt, sidebar: true }
        },
        {
          name: 'Cashier',
          path: '/cashier',
          component: CashierView,
          meta: { roles: ['Cashier', 'Admin'], icon: ShoppingCart, sidebar: true }
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView
    }
  ]
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Ensure Pinia store is initialized, which it should be if main.ts is correct
  const authStore = useAuthStore()

  const isLoggedIn = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
  }

  if (to.name === 'login' && isLoggedIn) {
    next({ name: 'dashboard' })
  }

  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && !authStore.hasAnyRole(requiredRoles)) {
    next({ name: 'unauthorized' })
  }

  next()
})

export default router
