import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './styles/style.css'

loadFonts()

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount('#app')
