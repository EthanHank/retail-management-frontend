import '@/config/axios'
import { i18n } from '@/config/locale'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin)

// Wait until the router is ready before mounting the app.
// This ensures that async operations in navigation guards (like checking auth state)
// are complete before the app is rendered.
router.isReady().then(() => {
  app.mount('#app')
})
